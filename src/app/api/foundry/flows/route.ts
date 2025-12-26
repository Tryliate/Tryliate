import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neon';

export async function GET() {
  try {
    const flows = await queryNeon('SELECT * FROM flow_feed ORDER BY created_at DESC');
    return NextResponse.json(flows);
  } catch (error: any) {
    console.error('Neon Fetch Error (Flows):', error);

    // FALLBACK: Return high-fidelity mock data if database is unreachable
    const mockFlows = [
      {
        id: 'flow-1',
        name: 'SEQUENTIAL BUS ARCHITECTURE',
        topology: 'SINGLE NODE',
        category: 'SINGLE NODE',
        description: 'Linear data pipeline connecting tools in a sequential chain. Ideal for data processing.',
        nodes: Array(8).fill({}),
        edges: Array(7).fill({}),
        created_at: new Date().toISOString()
      },
      {
        id: 'flow-2',
        name: 'CENTRALIZED STAR HUB',
        topology: 'MULTI NODE',
        category: 'MULTI NODE',
        description: 'Hub-and-spoke configuration with a master controller orchestrating 6 secondary nodes.',
        nodes: Array(7).fill({}),
        edges: Array(6).fill({}),
        created_at: new Date().toISOString()
      },
      {
        id: 'flow-3',
        name: 'HIGH-AVAILABILITY MESH',
        topology: 'MULTI NODE',
        category: 'MULTI NODE',
        description: 'Interconnected web of nodes providing redundant paths and distributed fault tolerance.',
        nodes: Array(5).fill({}),
        edges: Array(10).fill({}),
        created_at: new Date().toISOString()
      },
      {
        id: 'flow-4',
        name: 'NEURAL HYBRID ENGINE',
        topology: 'MULTI NODE',
        category: 'MULTI NODE',
        description: 'Complex hybrid topology combining hierarchical bus and star clusters for scale.',
        nodes: Array(12).fill({}),
        edges: Array(15).fill({}),
        created_at: new Date().toISOString()
      }
    ];

    return NextResponse.json(mockFlows);
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, topology, category, nodes, edges } = body;

    // Basic validation
    if (!name || !nodes || !edges) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = `flow-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const sql = `
      INSERT INTO flow_feed (id, name, description, topology, category, nodes, edges, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [id, name, description || '', topology || 'Single', category || 'SINGLE NODE', JSON.stringify(nodes), JSON.stringify(edges), createdAt];

    // Execute insert
    const rows = await queryNeon(sql, values);

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Neon Save Error (Flows):', error);
    return NextResponse.json({ error: 'Failed to save flow to Neon DB' }, { status: 500 });
  }
}
