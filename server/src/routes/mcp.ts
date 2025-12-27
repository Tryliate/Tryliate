import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/index';
import { mcpRegistry, foundryNodes, neuralDiscoveryQueue } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { DiscoverySchema } from '../schemas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router: Router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/official', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://registry.modelcontextprotocol.io/v0/servers');
    if (!response.ok) throw new Error('Official registry unreachable');
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: 'Failed to fetch official registry' });
  }
});

router.get('/seed', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/modelcontextprotocol/registry/main/data/seed.json');
    if (!response.ok) throw new Error('Seed data unreachable');
    const data = await response.json();
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: 'Failed to fetch seed data' });
  }
});

router.post('/discover', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, name, detectedBy } = DiscoverySchema.parse(req.body);
    await db.insert(neuralDiscoveryQueue).values({
      sourceUrl: url,
      mcpName: name || 'Unknown MCP',
      detectedBy,
      status: 'pending'
    });
    res.json({ success: true, message: 'Neural Discovery queued for installation.' });
  } catch (err: any) {
    next(err);
  }
});

router.get('/awesome', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/wong2/awesome-mcp-servers/main/README.md');
    if (!response.ok) throw new Error('Awesome list unreachable');
    const text = await response.text();
    res.send(text);
  } catch (err: any) {
    res.status(502).json({ error: 'Failed to fetch awesome list' });
  }
});

router.get('/official-refs', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/modelcontextprotocol/servers/main/README.md');
    if (!response.ok) throw new Error('Official reference list unreachable');
    const text = await response.text();
    res.send(text);
  } catch (err: any) {
    res.status(502).json({ error: 'Failed to fetch official references' });
  }
});

router.get('/foundry-nodes', async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(foundryNodes);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch foundry nodes', details: err.message });
  }
});

router.get('/ingest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🤖 Trymate AI: Starting Verified High-Quality Scraping...');
    await db.delete(mcpRegistry).execute();

    let candidates: any[] = [];
    let seenSlugs = new Set();
    const OFFICIAL_ORG_allowlist = [
      'modelcontextprotocol', 'microsoft', 'google', 'anthropic', 'stripe', 'vercel', 'supabase',
      'cloudflare', 'aws', 'amazon', 'meta', 'facebook', 'openai', 'github', 'linear', 'slack',
      'notion', 'discord', 'postgres', 'mysql', 'redis', 'mongodb', 'sentry', 'twilio', 'replit'
    ];

    try {
      let registryData: any[] = [];
      const possiblePaths = [
        path.join(process.cwd(), 'data', 'github_mcp_data.json'),
        path.join(process.cwd(), 'github_mcp_data.json'),
        path.join(__dirname, '../../data/github_mcp_data.json')
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          registryData = JSON.parse(fs.readFileSync(p, 'utf8'));
          break;
        }
      }

      const registryServers = registryData.map((s: any) => {
        let slug = (s.link || '').split('github.com/mcp/')[1] || s.name.toLowerCase();
        seenSlugs.add(slug);
        const isVeryOfficial = OFFICIAL_ORG_allowlist.includes((s.author || '').toLowerCase()) || s.author === 'github';
        return {
          name: s.name,
          slug: slug,
          description: s.description,
          homepage: s.link,
          url: s.link,
          isOfficial: true,
          source: 'github-registry',
          tags: ['official', 'verified', 'github-registry', s.author],
          downloadCount: isVeryOfficial ? 50000 : 10000
        };
      });
      candidates = [...candidates, ...registryServers];
    } catch (e: any) {
      console.error('Failed to process GitHub Registry logic:', e.message);
    }

    try {
      const ghResponse = await fetch('https://api.github.com/repos/modelcontextprotocol/servers/contents/src', {
        headers: { 'User-Agent': 'Tryliate-Hub' }
      });
      if (ghResponse.ok) {
        const files: any[] = await ghResponse.json() as any[];
        const officialServers = (files || [])
          .filter((f: any) => f.type === 'dir')
          .map((f: any) => {
            const nameClean = f.name.charAt(0).toUpperCase() + f.name.slice(1);
            const slug = `modelcontextprotocol/${f.name}`;
            seenSlugs.add(slug);
            return {
              name: nameClean,
              slug: slug,
              description: `Official ${nameClean} MCP server from the Model Context Protocol organization.`,
              homepage: f.html_url,
              url: f.html_url,
              isOfficial: true,
              source: 'anthropic-mcp',
              tags: ['official', 'verified', 'anthropic'],
              downloadCount: 100000
            };
          });
        candidates = [...candidates, ...officialServers];
      }
    } catch (e: any) {
      console.warn('Anthropic Fetch Fail:', e.message);
    }

    let count = 0;
    for (const entry of candidates) {
      try {
        await db.insert(mcpRegistry).values({
          id: entry.slug,
          name: entry.name,
          url: entry.url,
          type: 'server',
          data: entry,
          updatedAt: new Date()
        }).onConflictDoUpdate({
          target: mcpRegistry.id,
          set: { name: entry.name, url: entry.url, data: entry, updatedAt: new Date() }
        }).execute();
        count++;
      } catch (e: any) {
        console.error(`Failed to ingest ${entry.slug}:`, e.message);
      }
    }
    res.json({ success: true, count, message: `Trymate Ingested ${count} items.` });
  } catch (err: any) {
    next(err);
  }
});

router.get('/glama', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = (req.query.type as string) || 'server';
    const result = await db.select({ data: mcpRegistry.data })
      .from(mcpRegistry)
      .where(eq(mcpRegistry.type, type))
      .orderBy(desc(mcpRegistry.updatedAt))
      .limit(500);

    if (result && result.length > 0) {
      res.json({ servers: result.map(r => r.data) });
      return;
    }

    const queryParams = new URLSearchParams(req.query as any).toString();
    const proxyResponse = await fetch(`https://glama.ai/api/mcp/v1/servers?${queryParams}`);
    if (!proxyResponse.ok) throw new Error('Glama API unreachable');
    const proxyResult = await proxyResponse.json();
    res.json(proxyResult);
  } catch (err: any) {
    next(err);
  }
});

export default router;
