
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://neondb_owner:npg_U2Mxk5pPeyrg@ep-silent-wave-a5vjpsv9-pooler.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

async function inspect() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('CONNECTED TO NEON');

    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.rows.map(r => r.table_name));

    // Check columns of foundry_nodes
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'foundry_nodes'
    `);
    console.log('Columns of foundry_nodes:', columns.rows);

  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await client.end();
  }
}

inspect();
