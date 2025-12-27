import { createClient } from '@supabase/supabase-js';
import { PostgresQueueAdapter } from '../engine/native/adapters/postgres';
import { NativeExecutor } from '../engine/native/executor';

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const SUPABASE_SECRET_KEY = (process.env.SUPABASE_SECRET_KEY || '').trim();

export async function startNeuralPollers() {
  console.log('📡 Initializing Neural Pollers across infrastructure...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

  setInterval(async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('tryliate_initialized', true);

      if (error || !users) return;

      for (const user of users) {
        if (!user.supabase_url || !user.supabase_db_pass) continue;

        try {
          const host = user.supabase_url.replace('https://', '').replace('.supabase.co', '');
          const connectionString = `postgresql://postgres:${user.supabase_db_pass}@db.${host}.supabase.co:5432/postgres`;

          const adapter = new PostgresQueueAdapter(connectionString);
          const job = await adapter.pollJob();

          if (job) {
            console.log(`[NeuralWorker] Picked up job ${job.id} for user ${user.id}`);
            const definition = await adapter.getWorkflow(job.workflow_id);
            if (definition) {
              const executor = new NativeExecutor(adapter, definition, user.id);
              executor.processJob(job).finally(() => adapter.close());
            } else {
              await adapter.failJob(job.id, 'Workflow definition lost.');
              await adapter.close();
            }
          } else {
            await adapter.close();
          }
        } catch (poolErr) {
          // Silent fail for single user connection
        }
      }
    } catch (err) {
      console.error('[Poller] Global cycle failed:', err);
    }
  }, 5000);
}
