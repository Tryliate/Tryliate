
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

const NEON_DB_URL = "postgresql://neondb_owner:npg_U2Mxk5pPeyrg@ep-sweet-dawn-a4cj3s5d-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

async function ingest() {
  let rawData = fs.readFileSync('data/mcp_data_utf8.json', 'utf8');
  // Strip BOM if present
  if (rawData.charCodeAt(0) === 0xFEFF) {
    rawData = rawData.slice(1);
  }
  const data = JSON.parse(rawData);
  const servers = data.servers || [];

  const client = new Client({
    connectionString: NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to Neon.');

  // Clear existing
  await client.query('DELETE FROM mcp_registry');
  console.log('Cleared existing registry.');

  let count = 0;
  for (const s of servers) {
    const entry = {
      id: s.slug || s.id,
      name: s.name,
      url: s.homepage || s.url || s.link,
      type: s.type || 'server',
      data: s,
      updated_at: new Date().toISOString()
    };

    try {
      await client.query(
        `INSERT INTO mcp_registry (id, name, url, type, data, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (id) DO UPDATE SET 
         name = EXCLUDED.name, 
         url = EXCLUDED.url, 
         data = EXCLUDED.data, 
         updated_at = EXCLUDED.updated_at`,
        [entry.id, entry.name, entry.url, entry.type, JSON.stringify(entry.data), entry.updated_at]
      );
      count++;
    } catch (e) {
      console.error(`Failed to ingest ${entry.id}:`, e.message);
    }
  }

  await client.end();
  console.log(`Successfully ingested ${count} servers into Neon.`);
}

ingest().catch(console.error);
