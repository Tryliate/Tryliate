
import pkg from 'pg';
const { Client } = pkg;

const connectionString = process.env.NEON_DATABASE_URL || 'postgresql://neondb_owner:REDACTED@ep-sweet-dawn-a4cj3s5d-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_REDACTED';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || 'sb_secret_REDACTED';
const USER_ID = '263b8f7b-8098-421f-aa4f-b813dbb46287';

async function injectNeon() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  console.log('🔌 Connecting to Neon Vault...');

  try {
    await client.connect();

    // 1. Check User Existence
    const userRes = await client.query('SELECT * FROM users WHERE id = $1', [USER_ID]);
    if (userRes.rows.length === 0) {
      console.log('⚠️ User not found. Creating placeholder user...');
      await client.query(`
        INSERT INTO users (id, email, created_at) 
        VALUES ($1, 'vinodisemvjce@gmail.com', NOW())
      `, [USER_ID]);
    } else {
      console.log('✅ User found:', userRes.rows[0].email);
    }

    // 2. Inject Keys
    console.log('💉 Injecting Keys into Neon Vault...');
    await client.query(`
      UPDATE users 
      SET supabase_publishable_key = $1, 
          supabase_secret_key = $2,
          supabase_connected = true
      WHERE id = $3
    `, [PUBLISHABLE_KEY, SECRET_KEY, USER_ID]);
    console.log('✅ Keys injected successfully into Neon!');

    // 4. Verify
    const verifyRes = await client.query('SELECT supabase_secret_key FROM users WHERE id = $1', [USER_ID]);
    console.log('🔍 Verification:', verifyRes.rows[0].supabase_secret_key === SECRET_KEY ? 'MATCH' : 'MISMATCH');

  } catch (err) {
    console.error('💥 Neon Injection Failed:', err.stack);
  } finally {
    await client.end();
  }
}

injectNeon();
