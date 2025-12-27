
import { NativeQueueAdapter, NativeJob } from './queue';
import { NativeToolBridge } from './tool-bridge';

interface WorkflowDefinition {
  nodes: any[];
  edges: any[];
}

export class NativeExecutor {
  constructor(
    private adapter: NativeQueueAdapter,
    private definition: WorkflowDefinition,
    private userId: string
  ) { }

  /**
   * Processes a single job
   */
  async processJob(job: NativeJob): Promise<void> {
    const node = this.definition.nodes.find(n => n.id === job.node_id);

    if (!node) {
      await this.adapter.failJob(job.id, `Node ${job.node_id} not found in definition`);
      return;
    }

    try {
      console.log(`[NativeEngine] Executing Node: ${node.id} (${node.type})`);

      // 1. EXECUTE THE LOGIC
      const result = await NativeToolBridge.executeNode(
        node.type || 'action',
        node.data,
        job.payload,
        this.userId
      );

      if (!result.success) {
        throw new Error(result.error || 'Unknown execution failure');
      }

      const outputData = result.data;

      // 2. FIND NEXT STEPS
      const outgoingEdges = this.definition.edges.filter(e => e.source === node.id);

      // 3. ENQUEUE NEXT JOBS
      if (outgoingEdges.length > 0) {
        for (const edge of outgoingEdges) {
          const nextNodeId = edge.target;

          await this.adapter.enqueueJob({
            run_id: job.run_id,
            workflow_id: job.workflow_id,
            node_id: nextNodeId,
            payload: outputData
          });
        }
      } else {
        console.log(`[NativeEngine] Workflow Run ${job.run_id} reached end at ${node.id}`);
      }

      // 4. COMPLETE CURRENT JOB
      await this.adapter.completeJob(job.id, outputData);

    } catch (error: any) {
      console.error(`[NativeEngine] Node Execution Failed`, error);
      await this.adapter.failJob(job.id, error.message);
    }
  }
}
