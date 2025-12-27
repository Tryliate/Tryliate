/**
 * TRYLIATE NEURAL BUS - DIAGNOSTIC v1.2.0
 * This script verifies the connection between the frontend terminal logic
 * and the backbone provisioning engine.
 */

import fetch from 'node-fetch';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BACKEND_URL = 'http://localhost:8080'; // Change to production URL if testing remote

async function runDiagnostic() {
  console.log('\n\x1b[1m\x1b[35m🔱 TRYLIATE NEURAL BUS - DIAGNOSTIC V1.2.0\x1b[0m');
  console.log('------------------------------------------');

  rl.question('\x1b[36mEnter User ID to test (from Tryliate Dashboard): \x1b[0m', async (userId) => {
    if (!userId) {
      console.error('\x1b[31m❌ Error: User ID is required to probe the vault.\x1b[0m');
      rl.close();
      return;
    }

    console.log(`\n📡 Initializing Handshake with ${BACKEND_URL}...`);

    try {
      const response = await fetch(`${BACKEND_URL}/api/infrastructure/provision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`\n\x1b[31m❌ Request Failed (${response.status}):\x1b[0m ${err}`);
        rl.close();
        return;
      }

      console.log('\x1b[32m✅ Connection Established. Monitoring Neural Bus Streams...\x1b[0m\n');

      response.body.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            let icon = 'ℹ️';
            let color = '\x1b[37m'; // White

            if (data.type === 'error') { icon = '❌'; color = '\x1b[31m'; }
            else if (data.type === 'success') { icon = '✅'; color = '\x1b[32m'; }
            else if (data.message.includes('🚀') || data.message.includes('🏗️')) { icon = '⚙️'; color = '\x1b[36m'; }

            const timestamp = new Date().toLocaleTimeString();
            console.log(`${color}[${timestamp}] ${icon} ${data.message}\x1b[0m`);

            if (data.type === 'success' && data.message.includes('Ready')) {
              console.log('\n\x1b[1m\x1b[32m🎉 DIAGNOSTIC PASSED: Infrastructure synchronized successfully.\x1b[0m');
            }
          } catch (e) {
            // Ignore padding/streaming artifacts
          }
        }
      });

      response.body.on('end', () => {
        console.log('\n🏁 Diagnostic Stream Closed.');
        rl.close();
      });

    } catch (err) {
      console.error(`\n\x1b[31m❌ Connection Error:\x1b[0m ${err.message}`);
      console.log('\x1b[33m💡 Tip: Ensure the backend is running at http://localhost:8080\x1b[0m');
      rl.close();
    }
  });
}

runDiagnostic();
