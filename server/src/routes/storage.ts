
import { Router, Request, Response } from 'express';
import { db } from '../db/index';
import { storageBuckets, storageFiles } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router: Router = Router();

// 📦 Create Storage Bucket
router.post('/buckets', async (req: Request, res: Response) => {
  try {
    const { name, userId } = z.object({
      name: z.string(),
      userId: z.string().uuid().optional()
    }).parse(req.body);

    const [bucket] = await db.insert(storageBuckets).values({
      name,
      userId
    }).returning();

    res.json({ success: true, bucket });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 Save File to Bucket
router.post('/files', async (req: Request, res: Response) => {
  try {
    const { bucketId, fileName, content, metadata } = z.object({
      bucketId: z.string().uuid(),
      fileName: z.string(),
      content: z.any(),
      metadata: z.record(z.string(), z.any()).optional()
    }).parse(req.body);

    const [file] = await db.insert(storageFiles).values({
      bucketId,
      fileName,
      contentType: 'application/json',
      size: JSON.stringify(content).length,
      metadata: { ...metadata, content }
    }).returning();

    res.json({ success: true, file });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
