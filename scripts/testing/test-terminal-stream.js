import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const BACKEND_URL = process.env.NEXT_PUBLIC_CLOUD_RUN_URL || 'http://localhost:8080';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000'; // Mock or real UUID

async function testTerminalStream() {
  console.log('📡 Starting Terminal Stream Integration Test...');
  console.log(`🔗 Target: ${BACKEND_URL}/api/infrastructure/provision`);

  try {
    const response = await fetch(`${BACKEND_URL}/api/infrastructure/provision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Provisioning Request Failed (${response.status}):`, errorText);
      return;
    }

    console.log('✅ Stream Connection Established. Reading Kernels...\n');

    let buffer = '';
    const reader = response.body;
    reader.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last partial line in the buffer

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          const timestamp = new Date().toLocaleTimeString();

          let statusColor = '\x1b[37m'; // White
          if (data.type === 'error') statusColor = '\x1b[31m'; // Red
          if (data.type === 'success') statusColor = '\x1b[32m'; // Green

          console.log(`${statusColor}[${timestamp}] [${data.type.toUpperCase()}] ${data.message}\x1b[0m`);
        } catch (e) {
          if (line.trim().length > 10) { // Ignore padding
            console.log(`[PARSING ERROR]: ${line.trim().substring(0, 50)}...`);
          }
        }
      }
    });

    reader.on('end', () => {
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          console.log(`[FINAL] [${data.type.toUpperCase()}] ${data.message}`);
        } catch (e) {
          // console.log(`[BUFFER REMNANT]: ${buffer.trim()}`);
        }
      }
      console.log('\n🏁 Stream Completed Successfully.');
    });

    reader.on('error', (err) => {
      console.error('\n❌ Stream Aborted:', err.message);
    });

  } catch (err) {
    console.error('❌ Critical Test Failure:', err.message);
  }
}

testTerminalStream();
