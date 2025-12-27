import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

async function testSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

  try {
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) throw error;

    console.log('SUPABASE_USERS_START');
    console.log(JSON.stringify(users, null, 2));
    console.log('SUPABASE_USERS_END');
  } catch (err) {
    console.error('SUPABASE_ERROR:', err.message);
    process.exit(1);
  }
}

testSupabase();
