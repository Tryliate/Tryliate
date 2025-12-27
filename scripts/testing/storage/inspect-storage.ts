
import { db } from "../../../server/src/db/index";
import { storageBuckets, storageFiles } from "../../../server/src/db/schema";
import { eq } from "../../../server/src/db/index";

async function inspectStorage() {
  console.log("📦 --- TRYLIATE NEURAL STORAGE INSPECTION ---");

  const buckets = await db.select().from(storageBuckets);
  console.log(`\n📂 Found ${buckets.length} Buckets:`);
  for (const b of buckets) {
      console.log(`- ${b.name} (ID: ${b.id}) [Access: ${b.accessLevel}]`);
      const files = await db.select().from(storageFiles).where(eq(storageFiles.bucketId, b.id));
      if (files.length > 0) {
          files.forEach(f => console.log(`  └─ 🗒️ ${f.fileName} (${f.contentType}, ${f.size} bytes)`));
      } else {
          console.log(`  └─ (Empty)`);
      }
  }

  console.log("\n----------------------------------------------");
}

inspectStorage().catch(console.error);
