/**
 * Agent Event Bus
 *
 * Enables agent-to-agent communication via pub/sub pattern
 * Uses Supabase Realtime for low-latency event delivery
 *
 * Features:
 * - Task queue for work delegation
 * - Event pub/sub for notifications
 * - Multi-agent workflow coordination
 */

import { createClient, RealtimeChannel } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials for Agent Event Bus");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// TYPES
// ============================================================================

export type AgentName =
  | "matchmaker"
  | "pricing_oracle"
  | "document_intelligence"
  | "vision_inspector"
  | "negotiator"
  | "captain_cargo"
  | "parts_specialist";

export type TaskStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface AgentTask {
  id: string;
  task_type: string;
  priority: number;
  assigned_to_agent: AgentName;
  requested_by_agent?: AgentName;
  request_id: string;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  status: TaskStatus;
  attempts: number;
  max_attempts: number;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  expires_at: string;
  metadata: Record<string, any>;
}

export interface AgentEvent {
  id: string;
  event_type: string;
  event_source: AgentName;
  payload: Record<string, any>;
  target_agents?: AgentName[];
  processed_by: string[];
  created_at: string;
  expires_at: string;
}

export interface AgentWorkflow {
  id: string;
  workflow_name: string;
  workflow_steps: Array<{
    step: number;
    agent: AgentName;
    action: string;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
  }>;
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
// AGENT EVENT BUS CLASS
// ============================================================================

export class AgentEventBus {
  private eventChannel: RealtimeChannel | null = null;
  private taskChannel: RealtimeChannel | null = null;
  private eventHandlers: Map<string, Set<(event: AgentEvent) => void>> =
    new Map();
  private taskHandlers: Map<AgentName, Set<(task: AgentTask) => void>> =
    new Map();

  /**
   * Initialize realtime listeners for events and tasks
   */
  async initialize(agentName?: AgentName): Promise<void> {
    // Subscribe to agent events channel
    this.eventChannel = supabase
      .channel("agent_events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "agent_events",
        },
        (payload) => {
          const event = payload.new as AgentEvent;
          this.handleEventReceived(event);
        },
      )
      .subscribe();

    // Subscribe to agent tasks channel (filtered by agent if provided)
    const taskFilter = agentName
      ? {
          event: "INSERT",
          schema: "public",
          table: "agent_tasks",
          filter: `assigned_to_agent=eq.${agentName}`,
        }
      : { event: "INSERT", schema: "public", table: "agent_tasks" };

    this.taskChannel = supabase
      .channel("agent_tasks")
      .on("postgres_changes", taskFilter as any, (payload) => {
        const task = payload.new as AgentTask;
        this.handleTaskReceived(task);
      })
      .subscribe();

    console.log(`[AgentEventBus] Initialized for agent: ${agentName || "all"}`);
  }

  /**
   * Cleanup realtime subscriptions
   */
  async cleanup(): Promise<void> {
    if (this.eventChannel) {
      await supabase.removeChannel(this.eventChannel);
    }
    if (this.taskChannel) {
      await supabase.removeChannel(this.taskChannel);
    }
  }

  // ========================================================================
  // EVENT PUB/SUB
  // ========================================================================

  /**
   * Publish an event to the bus
   */
  async emitEvent(
    eventType: string,
    eventSource: AgentName,
    payload: Record<string, any>,
    targetAgents?: AgentName[],
  ): Promise<string> {
    const { data, error } = await supabase.rpc("emit_agent_event", {
      p_event_type: eventType,
      p_event_source: eventSource,
      p_payload: payload,
      p_target_agents: targetAgents || null,
    });

    if (error) throw new Error(`Failed to emit event: ${error.message}`);

    return data as string; // Returns event ID
  }

  /**
   * Subscribe to specific event types
   */
  onEvent(eventType: string, handler: (event: AgentEvent) => void): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Internal: Handle received events
   */
  private handleEventReceived(event: AgentEvent): void {
    const handlers = this.eventHandlers.get(event.event_type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`[AgentEventBus] Error in event handler:`, error);
        }
      });
    }
  }

  // ========================================================================
  // TASK QUEUE
  // ========================================================================

  /**
   * Assign a task to an agent
   */
  async assignTask(
    taskType: string,
    assignedTo: AgentName,
    inputData: Record<string, any>,
    options: {
      priority?: number;
      requestedBy?: AgentName;
      metadata?: Record<string, any>;
    } = {},
  ): Promise<string> {
    const { data, error } = await supabase.rpc("assign_agent_task", {
      p_task_type: taskType,
      p_assigned_to: assignedTo,
      p_input_data: inputData,
      p_priority: options.priority || 5,
      p_requested_by: options.requestedBy || null,
    });

    if (error) throw new Error(`Failed to assign task: ${error.message}`);

    return data as string; // Returns task ID
  }

  /**
   * Subscribe to tasks for a specific agent
   */
  onTask(agentName: AgentName, handler: (task: AgentTask) => void): () => void {
    if (!this.taskHandlers.has(agentName)) {
      this.taskHandlers.set(agentName, new Set());
    }
    this.taskHandlers.get(agentName)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.taskHandlers.get(agentName)?.delete(handler);
    };
  }

  /**
   * Internal: Handle received tasks
   */
  private handleTaskReceived(task: AgentTask): void {
    const handlers = this.taskHandlers.get(task.assigned_to_agent);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(task);
        } catch (error) {
          console.error(`[AgentEventBus] Error in task handler:`, error);
        }
      });
    }
  }

  /**
   * Get pending tasks for an agent
   */
  async getPendingTasks(agentName: AgentName): Promise<AgentTask[]> {
    const { data, error } = await supabase
      .from("agent_tasks")
      .select("*")
      .eq("assigned_to_agent", agentName)
      .eq("status", "pending")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw new Error(`Failed to get tasks: ${error.message}`);

    return data as AgentTask[];
  }

  /**
   * Start processing a task
   */
  async startTask(taskId: string, agentName: AgentName): Promise<void> {
    const { error } = await supabase
      .from("agent_tasks")
      .update({
        status: "processing",
        started_at: new Date().toISOString(),
        attempts: supabase.rpc("increment_task_attempts", { task_id: taskId }),
      })
      .eq("id", taskId)
      .eq("assigned_to_agent", agentName);

    if (error) throw new Error(`Failed to start task: ${error.message}`);
  }

  /**
   * Complete a task with output data
   */
  async completeTask(
    taskId: string,
    agentName: AgentName,
    outputData: Record<string, any>,
  ): Promise<void> {
    const { error } = await supabase.rpc("complete_agent_task", {
      p_task_id: taskId,
      p_output_data: outputData,
      p_agent_name: agentName,
    });

    if (error) throw new Error(`Failed to complete task: ${error.message}`);
  }

  /**
   * Fail a task with error message
   */
  async failTask(taskId: string, errorMessage: string): Promise<void> {
    const { error } = await supabase
      .from("agent_tasks")
      .update({
        status: "failed",
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error)
      throw new Error(`Failed to mark task as failed: ${error.message}`);
  }

  // ========================================================================
  // WORKFLOW ORCHESTRATION
  // ========================================================================

  /**
   * Create a multi-agent workflow
   */
  async createWorkflow(
    workflowName: string,
    steps: Array<{
      step: number;
      agent: AgentName;
      action: string;
      inputs?: Record<string, any>;
    }>,
    context: Record<string, any> = {},
  ): Promise<string> {
    const { data, error } = await supabase
      .from("agent_workflows")
      .insert({
        workflow_name: workflowName,
        workflow_steps: steps,
        context,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw new Error(`Failed to create workflow: ${error.message}`);

    return data.id;
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(workflowId: string): Promise<AgentWorkflow | null> {
    const { data, error } = await supabase
      .from("agent_workflows")
      .select("*")
      .eq("id", workflowId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to get workflow: ${error.message}`);
    }

    return data as AgentWorkflow;
  }

  /**
   * Advance workflow to next step
   */
  async advanceWorkflow(
    workflowId: string,
    stepOutput: Record<string, any>,
  ): Promise<void> {
    const workflow = await this.getWorkflow(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    const nextStep = workflow.current_step + 1;
    const isComplete = nextStep >= workflow.workflow_steps.length;

    const { error } = await supabase
      .from("agent_workflows")
      .update({
        current_step: nextStep,
        status: isComplete ? "completed" : "running",
        context: {
          ...workflow.context,
          [`step_${workflow.current_step}_output`]: stepOutput,
        },
        completed_at: isComplete ? new Date().toISOString() : undefined,
      })
      .eq("id", workflowId);

    if (error) throw new Error(`Failed to advance workflow: ${error.message}`);

    // If not complete, assign task for next step
    if (!isComplete) {
      const nextStepDef = workflow.workflow_steps[nextStep];
      await this.assignTask(
        nextStepDef.action,
        nextStepDef.agent,
        {
          ...nextStepDef.inputs,
          workflow_id: workflowId,
          previous_output: stepOutput,
        },
        { metadata: { workflow_id: workflowId, step: nextStep } },
      );
    }
  }
}

// Singleton instance
let eventBus: AgentEventBus | null = null;

export function getEventBus(): AgentEventBus {
  if (!eventBus) {
    eventBus = new AgentEventBus();
  }
  return eventBus;
}
