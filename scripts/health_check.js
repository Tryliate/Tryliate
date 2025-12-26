
import fetch from 'node-fetch';

const BASE = 'https://frontend-374665986758.us-central1.run.app';

async function checkHealth() {
  console.log('Checking Homepage...');
  try {
    const res = await fetch(BASE);
    console.log(`Homepage Status: ${res.status}`);
  } catch (e) {
    console.error('Homepage failed:', e);
  }

  console.log('Checking Neutral Auth...');
  try {
    const res = await fetch(`${BASE}/auth/callback/neural?error=test`);
    console.log(`Neural Status: ${res.status}`);
  } catch (e) {
    console.error('Neural failed:', e);
  }
}

checkHealth();
