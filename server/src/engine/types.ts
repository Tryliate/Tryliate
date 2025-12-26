
/**
 * Universal Workflow Engine Interface
 * This ensures the application logic is decoupled from the execution provider.
 */

export interface WorkflowEngine {
  /**
   * Starts a new execution of a workflow
   */
  startWorkflow(
    workflowId: string,
    userId: string,
    inputData: Record<string, any>
  ): Promise<string>; // Returns runId

  /**
   * Resumes a paused workflow (e.g. after human approval)
   */
  resumeWorkflow(
    runId: string,
    stepId: string,
    data: any
  ): Promise<void>;

  /**
   * Cancels a running workflow
   */
  cancelWorkflow(runId: string): Promise<void>;

  /**
   * Gets the current status of a run
   */
  getRunStatus(runId: string): Promise<WorkflowRunStatus>;
}

export type WorkflowRunStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'WAITING_FOR_APPROVAL';

export interface WorkflowRun {
  id: string;
  workflowId: string;
  userId: string;
  status: WorkflowRunStatus;
  startedAt: Date;
  completedAt?: Date;
  input: any;
  output?: any;
  error?: any;
}

export interface WorkflowStep {
  id: string; // The Node ID
  runId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startedAt?: Date;
  completedAt?: Date;
  input?: any;
  output?: any;
  error?: string;
}
