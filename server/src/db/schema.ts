import { pgTable, text, timestamp, uuid, jsonb, boolean, integer, doublePrecision, unique, pgSchema, customType } from 'drizzle-orm/pg-core';

// 🔱 Custom Vector Type for Neural Memory
const vector = customType<{ data: number[] }>({
  dataType() {
    return 'vector(1536)';
  },
});



export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().default('Untitled Workflow'),
  description: text('description'),
  state: jsonb('state').default({ viewport: { x: 0, y: 0, zoom: 1 } }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const nodes = pgTable('nodes', {
  id: text('id').primaryKey(),
  workflowId: uuid('workflow_id').references(() => workflows.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  data: jsonb('data').notNull(),
  positionX: doublePrecision('position_x').notNull(),
  positionY: doublePrecision('position_y').notNull(),
  width: doublePrecision('width'),
  height: doublePrecision('height'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const edges = pgTable('edges', {
  id: text('id').primaryKey(),
  workflowId: uuid('workflow_id').references(() => workflows.id, { onDelete: 'cascade' }),
  source: text('source').notNull(),
  target: text('target').notNull(),
  sourceHandle: text('source_handle'),
  targetHandle: text('target_handle'),
  data: jsonb('data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const mcpRegistry = pgTable('mcp_registry', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url'),
  type: text('type').default('server'),
  data: jsonb('data'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});


export const mcpAuthorizations = pgTable('mcp_authorizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  provider: text('provider').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  scopes: jsonb('scopes').default([]), // Neural Guardian: Granular permissions
  metadata: jsonb('metadata').default({}),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  status: text('status').default('verified'),
  lastHandshakeAt: timestamp('last_handshake_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  userProviderUnique: unique().on(t.userId, t.provider),
}));

export const flowSpace = pgTable('flow_space', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  name: text('name').notNull().default('Untitled Flow'),
  messages: jsonb('messages').default([]),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const workspaceHistory = pgTable('workspace_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  action: text('action').notNull(),
  details: jsonb('details').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});



export const foundryNodes = pgTable('foundry_nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(),
  type: text('type').notNull(),
  category: text('category').notNull(),
  subCategory: text('sub_category'),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const agentMemory = pgTable('agent_memory', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: text('agent_id').notNull(),
  userId: uuid('user_id'),
  memoryType: text('memory_type').default('short_term'),
  content: text('content'),
  embedding: vector('embedding'), // Neural Memory: Semantic search
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const neuralDiscoveryQueue = pgTable('neural_discovery_queue', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceUrl: text('source_url').notNull(),
  mcpName: text('mcp_name'),
  status: text('status').default('pending'),
  detectedBy: text('detected_by'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const neuralLinks = pgTable('neural_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceNodeId: text('source_node_id'),
  targetNodeId: text('target_node_id'),
  correlationScore: doublePrecision('correlation_score'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const toolCatalog = pgTable('tool_catalog', {
  id: text('id').primaryKey(),
  mcpServerId: text('mcp_server_id'),
  name: text('name').notNull(),
  description: text('description'),
  inputSchema: jsonb('input_schema'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});


export const auditTrail = pgTable('audit_trail', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const userSettings = pgTable('user_settings', {
  userId: uuid('user_id').primaryKey(),
  theme: text('theme').default('dark'),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  aiModelPreference: text('ai_model_preference').default('gpt-4'),
  metadata: jsonb('metadata').default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});


export const storageBuckets = pgTable('storage_buckets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  userId: uuid('user_id'),
  accessLevel: text('access_level').default('private'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const storageFiles = pgTable('storage_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  bucketId: uuid('bucket_id').references(() => storageBuckets.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  contentType: text('content_type'),
  size: integer('size'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const flowFeed = pgTable('flow_feed', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  description: text('description'),
  category: text('category'),
  topology: text('topology'),
  nodes: jsonb('nodes').default([]),
  edges: jsonb('edges').default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
