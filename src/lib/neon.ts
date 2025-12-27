import pkg from 'pg';
const { Pool } = pkg;



// Prevent multiple pools in development
let pool: any;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  if (!(global as any).postgresPool) {
    (global as any).postgresPool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  pool = (global as any).postgresPool;
}

export const queryNeon = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
};
