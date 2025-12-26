
import fetch from 'node-fetch';

const BASE = 'https://frontend-374665986758.us-central1.run.app';

async function verify() {
  const paths = [
    '/auth/callback/neural',
    '//auth/callback/neural',
  ];

  for (const p of paths) {
    const url = `${BASE}${p}?error=probe`;
    console.log(`\nTesting: ${url}`);
    try {
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Content Preview: ${text.substring(0, 100)}...`);
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

verify();
