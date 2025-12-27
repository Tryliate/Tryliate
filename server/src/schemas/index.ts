import { z } from 'zod';

export const ProvisionSchema = z.object({
  accessToken: z.string().optional(),
  userId: z.string().uuid()
});

export const SyncSchema = z.object({
  projectId: z.string().min(5),
  accessToken: z.string().min(10),
  dbPass: z.string().min(8)
});

export const ResetSchema = z.object({
  userId: z.string().uuid()
});

export const SyncDatabaseSchema = z.object({
  userId: z.string().uuid()
});

export const IngestSchema = z.object({
  type: z.string().optional()
});

export const ProxySchema = z.object({
  type: z.string().optional()
}).catchall(z.any());

export const DiscoverySchema = z.object({
  url: z.string().url(),
  name: z.string().optional(),
  detectedBy: z.string()
});

export const AuthorizeSchema = z.object({
  userId: z.string().uuid(),
  provider: z.string(),
  scopes: z.array(z.string())
});

export const RecallSchema = z.object({
  agentId: z.string(),
  query: z.string(),
  limit: z.number().optional().default(5)
});

export const SaveMemorySchema = z.object({
  agentId: z.string(),
  userId: z.string().uuid(),
  content: z.string().min(1),
  memoryType: z.string().optional().default('short_term'),
  metadata: z.any().optional()
});

export const ToolCallSchema = z.object({
  userId: z.string().uuid(),
  provider: z.string(),
  tool: z.string(),
  arguments: z.any()
});
