
import { db } from "../../../server/src/db/index";
import { storageBuckets, storageFiles } from "../../../server/src/db/schema";
import crypto from "crypto";

async function provisionRealStorage() {
  console.log("🌊 PROVISIONING REAL NEURAL STORAGE ASSETS...");
  
  const userId = crypto.randomUUID();
  const bucketName = "production-report-vault";

  try {
    // 1. Create a real bucket
    console.log(`📡 Creating bucket: ${bucketName}...`);
    const [bucket] = await db.insert(storageBuckets).values({
      name: bucketName,
      userId: userId,
      accessLevel: 'public'
    }).returning();

    console.log(`✅ Bucket committed to DB. ID: ${bucket.id}`);

    // 2. Create a real file entry
    console.log(`📄 committing initial system manifest to ${bucketName}...`);
    const [file] = await db.insert(storageFiles).values({
      bucketId: bucket.id,
      fileName: "system-manifest-v1.json",
      contentType: "application/json",
      size: 1024,
      metadata: { 
        version: "2.1", 
        engine: "Native", 
        verifiedAt: new Date().toISOString() 
      }
    }).returning();

    console.log(`✅ File entry committed. ID: ${file.id}`);
    console.log("\n🚀 STORAGE STABILIZATION COMPLETE.");
  } catch (e: any) {
    console.error("❌ Provisioning Failed:", e.message);
  }
}

provisionRealStorage().catch(console.error);
