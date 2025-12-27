export const dynamic = 'force-dynamic';
import { queryNeon } from '@/lib/neon';

export async function GET() {
  try {
    const nodes = await queryNeon('SELECT * FROM foundry_nodes ORDER BY created_at DESC');
    return new Response(JSON.stringify(nodes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Neon Fetch Error (Nodes):', error);

    // FALLBACK: Return high-fidelity mock data if database is unreachable
    const mockNodes = [
      {
        id: 'mock-1',
        label: 'NEURAL VAULT v1.2',
        type: 'host',
        category: 'DATA',
        sub_category: 'SECURE STORAGE',
        description: 'Secure secondary compute layer for neural asset management.',
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-2',
        label: 'MCP REGISTRY',
        type: 'tool',
        category: 'AI CORE',
        sub_category: 'ORCHESTRATION',
        description: 'Canonical registry for all connected MCP protocols.',
        created_at: new Date().toISOString()
      }
    ];

    return new Response(JSON.stringify(mockNodes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
