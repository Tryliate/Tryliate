import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { pool } from './db/index';

// Routes
import infraRouter from './routes/infra';
import engineRouter from './routes/engine';
import mcpRouter from './routes/mcp';
import neuralRouter from './routes/neural';
import debugRouter from './routes/debug';

// Services
import { startNeuralPollers } from './services/poller';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config();

console.log('--- STARTUP DEBUG ---');
console.log('SUPABASE_URL present:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_SECRET_KEY present:', !!process.env.SUPABASE_SECRET_KEY);
console.log('--- END STARTUP DEBUG ---');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.PORT || '8080');

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    engine: 'Tryliate Neural Engine v1.2.0',
    runtime: 'Bun'
  });
});

// Mounting Routes
app.use('/health', debugRouter); // Health is under debug for now or just at /health
app.use('/api/debug', debugRouter);
app.use('/api/infrastructure', infraRouter);
app.use('/api/infrastructure', engineRouter); // Shared prefix
app.use('/api/engine', engineRouter);
app.use('/api/mcp', mcpRouter);
app.use('/api/neural', neuralRouter);

// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ARK ERROR] ${req.method} ${req.url}:`, err);

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation Failed',
      details: err.issues.map((e: z.ZodIssue) => ({ path: e.path, message: e.message }))
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'UNKNOWN_ERROR'
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Neural Engine active on port ${PORT}`);
  startNeuralPollers().catch(err => console.error('Failed to start neural pollers:', err));
});

// --- GRACEFUL SHUTDOWN ---
const shutdown = async (signal: string) => {
  console.log(`\n[${signal}] Shutting down neural engine...`);
  server.close(async () => {
    console.log('📡 Server closed.');
    try {
      await pool.end();
      console.log('🐘 Database connections closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
