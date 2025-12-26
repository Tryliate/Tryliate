
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://edtfhsblomgamobizkbo.supabase.co';
const SUPABASE_SECRET_KEY = 'sb_secret_5aDb6y-u9k__Ogf2O6jyWA_5U52r9AW';

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function checkUsers() {
  console.log('🕵️‍♀️ Inspecting Master Vault (V2 Schema)...');

  // Select all columns to see what we have
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('❌ Error fetching users:', error.message);
    return;
  }

  console.log(`✅ Found ${data.length} users:`);
  data.forEach(u => {
    const hasPub = u.supabase_publishable_key ? '✅ YES' : '❌ NO';
    const hasSec = u.supabase_secret_key ? '✅ YES' : '❌ NO';

    console.log(`   - ID: ${u.id}`);
    console.log(`     Email: ${u.email}`);
    console.log(`     Connected: ${u.supabase_connected}`);
    console.log(`     Keys: [PB:${hasPub}] [SK:${hasSec}]`);

    // Check if old columns still exist (just in case)
    if (u.supabase_access_token !== undefined) console.log('     ⚠️  Old column "supabase_access_token" still exists.');
    if (u.supabase_project_id !== undefined) console.log('     ⚠️  Old column "supabase_project_id" still exists.');
  });
}

checkUsers();
