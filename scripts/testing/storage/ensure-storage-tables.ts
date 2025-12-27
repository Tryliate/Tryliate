
import { db } from "../../../server/src/db/index";
import { sql } from "drizzle-orm";

async function ensureStorageTables() {
  console.log("🛠️ Ensuring Storage Tables exist in Neon/Supabase...");
  
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS storage_buckets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        user_id UUID,
        access_level TEXT DEFAULT 'private',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS storage_files (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bucket_id UUID REFERENCES storage_buckets(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        content_type TEXT,
        size INTEGER,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    console.log("✅ Storage Tables are ready.");
  } catch (e: any) {
    console.error("❌ Failed to create tables:", e.message);
  }
}

ensureStorageTables().catch(console.error);
