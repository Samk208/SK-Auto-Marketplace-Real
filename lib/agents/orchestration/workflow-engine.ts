/**
 * Multi-Agent Workflow Engine
 *
 * Orchestrates complex workflows involving multiple agents
 * Example: Customer Inquiry → Matchmaker → Negotiator → Pricing → Quote → Payment
 */

import { createClient } from "@supabase/supabase-js";
import { AgentEventBus, AgentName } from "./event-bus";
import { DealJourneyStateMachine } from "./state-machine";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// TYPES
// ============================================================================

export interface WorkflowStep {
  step: number;
  agent: AgentName;
  action: string;
  description?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  timeout?: number; // milliseconds
  retryOnFailure?: boolean;
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  trigger: {
    event: string;
    condition?: (payload: any) => boolean;
  };
  steps: WorkflowStep[];
  onComplete?: (context: Record<string, any>) => Promise<void>;
  onError?: (error: Error, context: Record<string, any>) => Promise<void>;
}

export interface WorkflowExecution {
  id: string;
  workflow_name: string;
  workflow_steps: WorkflowStep[];
  current_step: number;
  status: "pending" | "running" | "completed" | "failed" | "paused";
  context: Record<string, any>;
  journey_id?: string;
  listing_id?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  metadata: Record<string, any>;
}

// ============================================================================
// PREDEFINED WORKFLOWS
// ============================================================================

/**
 * Workflow: Complete Vehicle Purchase Journey
 * Inquiry → Match → Negotiate → Quote → Payment → Shipping
 */
export const COMPLETE_DEAL_WORKFLOW: WorkflowDefinition = {
  name: "complete_deal",
  description: "End-to-end vehicle purchase from inquiry to delivery",
  trigger: {
    event: "lead.created",
    condition: (payload) => !!payload.customerPhone && !!payload.listingId,
  },
  steps: [
    {
      step: 1,
      agent: "matchmaker",
      action: "verify_listing_match",
      description: "Verify the listing matches customer requirements",
      timeout: 30000,
    },
    {
      step: 2,
      agent: "negotiator",
      action: "initiate_conversation",
      description: "Start conversation and qualify the lead",
      timeout: 60000,
    },
    {
      step: 3,
      agent: "pricing_oracle",
      action: "generate_quote",
      description: "Generate formal price quote with breakdown",
      timeout: 45000,
    },
    {
      step: 4,
      agent: "document_intelligence",
      action: "prepare_export_docs",
      description: "Prepare export documentation checklist",
      timeout: 30000,
    },
    {
      step: 5,
      agent: "captain_cargo",
      action: "calculate_shipping",
      description: "Calculate shipping costs and timeline",
      timeout: 30000,
    },
  ],
};

/**
 * Workflow: Quick Quote Generation
 * For customers who know exactly what they want
 */
export const QUICK_QUOTE_WORKFLOW: WorkflowDefinition = {
  name: "quick_quote",
  description: "Fast track quote for qualified buyers",
  trigger: {
    event: "quote.requested",
  },
  steps: [
    {
      step: 1,
      agent: "pricing_oracle",
      action: "generate_quote",
      description: "Generate itemized quote",
      timeout: 30000,
    },
    {
      step: 2,
      agent: "captain_cargo",
      action: "add_shipping_details",
      description: "Add shipping and logistics info",
      timeout: 20000,
    },
    {
      step: 3,
      agent: "negotiator",
      action: "send_quote_to_customer",
      description: "Send formatted quote via WhatsApp/Email",
      timeout: 15000,
    },
  ],
};

/**
 * Workflow: Vehicle Inspection Request
 */
export const INSPECTION_WORKFLOW: WorkflowDefinition = {
  name: "vehicle_inspection",
  description: "Coordinate vehicle inspection for interested buyer",
  trigger: {
    event: "inspection.requested",
  },
  steps: [
    {
      step: 1,
      agent: "vision_inspector",
      action: "schedule_inspection",
      description: "Schedule inspection appointment",
      timeout: 30000,
    },
    {
      step: 2,
      agent: "vision_inspector",
      action: "perform_inspection",
      description: "AI-powered damage detection and report generation",
      timeout: 120000,
    },
    {
      step: 3,
      agent: "negotiator",
      action: "share_inspection_report",
      description: "Share report with customer and handle questions",
      timeout: 60000,
    },
  ],
};

// ============================================================================
// WORKFLOW ENGINE CLASS
// ============================================================================

export class WorkflowEngine {
  private eventBus: AgentEventBus;
  private stateMachine: DealJourneyStateMachine;
  private registeredWorkflows: Map<string, WorkflowDefinition> = new Map();

  constructor() {
    this.eventBus = new AgentEventBus();
    this.stateMachine = new DealJourneyStateMachine();

    // Register default workflows
    this.registerWorkflow(COMPLETE_DEAL_WORKFLOW);
    this.registerWorkflow(QUICK_QUOTE_WORKFLOW);
    this.registerWorkflow(INSPECTION_WORKFLOW);
  }

  /**
   * Register a workflow definition
   */
  registerWorkflow(workflow: WorkflowDefinition): void {
    this.registeredWorkflows.set(workflow.name, workflow);
    console.log(`[WorkflowEngine] Registered workflow: ${workflow.name}`);
  }

  /**
   * Start a workflow execution
   */
  async startWorkflow(
    workflowName: string,
    context: Record<string, any>,
  ): Promise<string> {
    const workflow = this.registeredWorkflows.get(workflowName);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }

    // Create workflow execution record
    const { data, error } = await supabase
      .from("agent_workflows")
      .insert({
        workflow_name: workflowName,
        workflow_steps: workflow.steps,
        current_step: 0,
        status: "pending",
        context: context,
        journey_id: context.journeyId,
        listing_id: context.listingId,
        metadata: {
          description: workflow.description,
          startedBy: context.startedBy || "system",
        },
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create workflow: ${error.message}`);

    const workflowId = data.id;

    // Emit workflow started event
    await this.eventBus.emitEvent("workflow.started", "system" as AgentName, {
      workflowId,
      workflowName,
      context,
    });

    // Execute first step
    await this.executeNextStep(workflowId);

    return workflowId;
  }

  /**
   * Execute the next step in a workflow
   */
  async executeNextStep(workflowId: string): Promise<void> {
    // Get workflow execution
    const { data: execution, error } = await supabase
      .from("agent_workflows")
      .select("*")
      .eq("id", workflowId)
      .single();

    if (error) throw new Error(`Workflow not found: ${error.message}`);

    const workflow = execution as WorkflowExecution;

    // Check if workflow is complete
    if (workflow.current_step >= workflow.workflow_steps.length) {
      await this.completeWorkflow(workflowId);
      return;
    }

    // Get current step
    const currentStep = workflow.workflow_steps[workflow.current_step];

    // Update workflow status to running
    await supabase
      .from("agent_workflows")
      .update({
        status: "running",
        started_at: workflow.started_at || new Date().toISOString(),
      })
      .eq("id", workflowId);

    // Assign task to agent
    try {
      const taskId = await this.eventBus.assignTask(
        currentStep.action,
        currentStep.agent,
        {
          workflowId,
          stepNumber: currentStep.step,
          ...workflow.context,
          ...currentStep.inputs,
        },
        {
          priority: 5,
          requestedBy: "system" as AgentName,
        },
      );

      console.log(
        `[WorkflowEngine] Step ${currentStep.step} assigned to ${currentStep.agent}: ${taskId}`,
      );

      // Wait for task completion with timeout
      await this.waitForTaskCompletion(taskId, currentStep.timeout || 60000);

      // Get task result
      const { data: task } = await supabase
        .from("agent_tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      if (task?.status === "completed") {
        // Store outputs in context
        const updatedContext = {
          ...workflow.context,
          [`step${currentStep.step}_output`]: task.output_data,
        };

        // Move to next step
        await supabase
          .from("agent_workflows")
          .update({
            current_step: workflow.current_step + 1,
            context: updatedContext,
          })
          .eq("id", workflowId);

        // Execute next step
        await this.executeNextStep(workflowId);
      } else if (task?.status === "failed") {
        await this.failWorkflow(
          workflowId,
          task.error_message || "Task failed",
        );
      }
    } catch (error) {
      console.error(`[WorkflowEngine] Step ${currentStep.step} failed:`, error);
      await this.failWorkflow(
        workflowId,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Wait for a task to complete
   */
  private async waitForTaskCompletion(
    taskId: string,
    timeout: number,
  ): Promise<void> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    while (Date.now() - startTime < timeout) {
      const { data: task } = await supabase
        .from("agent_tasks")
        .select("status")
        .eq("id", taskId)
        .single();

      if (!task) throw new Error("Task not found");

      if (task.status === "completed" || task.status === "failed") {
        return;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Task timeout after ${timeout}ms`);
  }

  /**
   * Complete a workflow
   */
  private async completeWorkflow(workflowId: string): Promise<void> {
    await supabase
      .from("agent_workflows")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", workflowId);

    // Emit completion event
    await this.eventBus.emitEvent("workflow.completed", "system" as AgentName, {
      workflowId,
    });

    console.log(`[WorkflowEngine] Workflow ${workflowId} completed`);
  }

  /**
   * Fail a workflow
   */
  private async failWorkflow(
    workflowId: string,
    reason: string,
  ): Promise<void> {
    await supabase
      .from("agent_workflows")
      .update({
        status: "failed",
        metadata: {
          error: reason,
          failedAt: new Date().toISOString(),
        },
      })
      .eq("id", workflowId);

    // Emit failure event
    await this.eventBus.emitEvent("workflow.failed", "system" as AgentName, {
      workflowId,
      reason,
    });

    console.error(`[WorkflowEngine] Workflow ${workflowId} failed: ${reason}`);
  }

  /**
   * Pause a workflow
   */
  async pauseWorkflow(workflowId: string): Promise<void> {
    await supabase
      .from("agent_workflows")
      .update({ status: "paused" })
      .eq("id", workflowId);

    console.log(`[WorkflowEngine] Workflow ${workflowId} paused`);
  }

  /**
   * Resume a paused workflow
   */
  async resumeWorkflow(workflowId: string): Promise<void> {
    await supabase
      .from("agent_workflows")
      .update({ status: "running" })
      .eq("id", workflowId);

    await this.executeNextStep(workflowId);
  }

  /**
   * Get workflow status
   */
  async getWorkflowStatus(
    workflowId: string,
  ): Promise<WorkflowExecution | null> {
    const { data, error } = await supabase
      .from("agent_workflows")
      .select("*")
      .eq("id", workflowId)
      .single();

    if (error) return null;
    return data as WorkflowExecution;
  }

  /**
   * List all workflows for a journey
   */
  async getJourneyWorkflows(journeyId: string): Promise<WorkflowExecution[]> {
    const { data, error } = await supabase
      .from("agent_workflows")
      .select("*")
      .eq("journey_id", journeyId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get workflows: ${error.message}`);
    return (data || []) as WorkflowExecution[];
  }
}
