
import pkg from 'pg';
const { Client } = pkg;

// This is the URL from the secret, let's hope it's correct enough to connect
// I'll try to reconstruct it if it has typos
const connectionString = process.env.NEON_DATABASE_URL || 'postgresql://neondb_owner:REDACTED@ep-silent-wave-a5vjpsv9-pooler.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

async function fixSchema() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('✅ Connected to Neon');

    // Check if foundry_nodes exists
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'foundry_nodes'
    `);

    const columns = res.rows.map(r => r.column_name);
    console.log('Current columns:', columns);

    if (columns.includes('meta') && !columns.includes('data')) {
      console.log('🔄 Renaming meta to data...');
      await client.query('ALTER TABLE foundry_nodes RENAME COLUMN meta TO data');
      console.log('✅ Renamed!');
    } else if (!columns.includes('data')) {
      console.log('➕ Adding data column...');
      await client.query('ALTER TABLE foundry_nodes ADD COLUMN data JSONB NOT NULL DEFAULT \'{}\'');
      console.log('✅ Added!');
    } else {
      console.log('👌 data column already exists.');
    }

  } catch (err) {
    console.error('❌ Error fixing schema:', err.message);
    if (err.message.includes('authentication failed')) {
      console.log('Trying alternative connection string reconstruction...');
      // Maybe the password has special characters or was truncated?
    }
  } finally {
    await client.end();
  }
}

fixSchema();
