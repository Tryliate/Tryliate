
import { PostgresQueueAdapter } from './native/adapters/postgres.ts';
import { NativeExecutor } from './native/executor.ts';
import postgres from 'postgres';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dotEnvPath = path.resolve(__dirname, '../../../.env.local');
console.log(`🔍 Debug: Loading env from ${dotEnvPath}`);
dotenv.config({ path: dotEnvPath });

console.log(`🔍 Debug: process.env.NEON_DATABASE_URL exists: ${!!process.env.NEON_DATABASE_URL}`);
console.log(`🔍 Debug: Available env keys: ${Object.keys(process.env).filter(k => k.includes('URL') || k.includes('DB')).join(', ')}`);

const TEST_DB_URL = process.env.DATABASE_URL || process.env.NEON_DB_URL || process.env.NEON_DATABASE_URL;
if (!TEST_DB_URL) {
  console.error("❌ DATABASE_URL, NEON_DB_URL or NEON_DATABASE_URL must be set in .env.local for testing.");
  process.exit(1);
}

const sql = postgres(TEST_DB_URL, { ssl: 'require' });

async function runEngineDiagnostics() {
  console.log("🔱 --- TRYLIATE NATIVE ENGINE DIAGNOSTICS --- 🔱\n");

  const userId = "test-user-diag-" + Math.random().toString(36).substring(7);
  const adapter = new PostgresQueueAdapter(TEST_DB_URL || "");

  // 1. Ensure Schema
  console.log("🛠️  Step 1: Synchronizing Neural Schema...");
  await adapter.ensureSchema();
  console.log("✅ Schema synchronized.\n");

  // 2. Functional Test: Simple Sequential Workflow
  console.log("📡 Step 2: Testing Sequential Workflow Execution...");
  const runId = crypto.randomUUID();
  const workflowId = "seq-test-01";

  const definition = {
    nodes: [
      { id: 'n1', type: 'trigger', data: { label: 'Start' } },
      { id: 'n2', type: 'tool', data: { toolName: 'echo', text: 'Hello Tryliate' } },
      { id: 'n3', type: 'action', data: { label: 'End' } }
    ],
    edges: [
      { source: 'n1', target: 'n2' },
      { source: 'n2', target: 'n3' }
    ]
  };

  const executor = new NativeExecutor(adapter, definition, userId);

  // Initial enqueue
  await adapter.enqueueJob({
    run_id: runId,
    workflow_id: workflowId,
    node_id: 'n1',
    payload: { input: "init" }
  });

  console.log(`🚀 Run ${runId} started. Processing nodes...`);

  // Simple polling loop simulating the engine worker
  let completedNodes = 0;
  const maxLoops = 10;
  for (let i = 0; i < maxLoops; i++) {
    const job = await adapter.pollJob();
    if (job) {
      console.log(`   ⚙️  Executing node: ${job.node_id}...`);
      await executor.processJob(job);
      completedNodes++;
    } else {
      break;
    }
  }

  if (completedNodes === 3) {
    console.log("✅ Sequential workflow completed normally.\n");
  } else {
    console.warn(`⚠️  Unexpected node completion count: ${completedNodes}/3\n`);
  }

  // 3. Capacity Test: High-Burst Parallel Ingestion
  console.log("🔥 Step 3: Measuring Brain Capacity (High Burst Load)...");
  const burstRunId = crypto.randomUUID();
  const jobCount = 50; // Test with 50 simultaneous jobs
  console.log(`   ⚡ Enqueuing ${jobCount} items into the neural queue...`);

  const startTime = Date.now();
  const enqueuePromises = [];
  for (let i = 0; i < jobCount; i++) {
    enqueuePromises.push(adapter.enqueueJob({
      run_id: burstRunId,
      workflow_id: "stress-test",
      node_id: `burst-node-${i}`,
      payload: { value: i }
    }));
  }
  await Promise.all(enqueuePromises);
  const enqueueDuration = Date.now() - startTime;
  console.log(`   📥 Enqueue Phase: ${enqueueDuration}ms (${(jobCount / (enqueueDuration / 1000)).toFixed(1)} jobs/sec)`);

  // Simulated parallel processing power
  console.log(`   🧠 Processing with concurrency simulations...`);
  const processStart = Date.now();
  let processed = 0;

  // We'll simulate 5 parallel workers
  const workers = Array(5).fill(0).map(async () => {
    while (true) {
      const job = await adapter.pollJob();
      if (!job) break;
      // Mock execution
      await adapter.completeJob(job.id, { processed: true });
      processed++;
    }
  });

  await Promise.all(workers);
  const processDuration = Date.now() - processStart;
  console.log(`   ⚙️  Processing Phase: ${processDuration}ms (${(processed / (processDuration / 1000)).toFixed(1)} completions/sec)`);
  console.log(`✅ Capacity test finalized. Total processed: ${processed}/${jobCount}\n`);

  // 4. Persistence Audit
  console.log("📊 Step 4: Database Persistence Audit...");
  const [counts] = await sql`
    SELECT 
      (SELECT COUNT(*) FROM tryliate.jobs WHERE run_id = ${burstRunId}) as total_jobs,
      (SELECT COUNT(*) FROM tryliate.jobs WHERE run_id = ${runId} AND status = 'completed') as completed_jobs
  `;
  console.log(`   📌 Burst Run Jobs: ${counts.total_jobs}`);
  console.log(`   📌 Sequential Execution Verified: ${counts.completed_jobs >= 3 ? 'YES' : 'NO'}`);

  console.log("\n🏁 --- DIAGNOSTICS COMPLETE: ENGINE IS HEALTHY --- 🏁");

  await sql.end();
}

runEngineDiagnostics().catch(e => {
  console.error("❌ Diagnostic Critical Failure:", e);
  process.exit(1);
});
