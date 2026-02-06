/**
 * Deal Journey State Machine
 *
 * Production-grade FSM for tracking car sales pipeline
 * Adapted from: Kmed PatientJourneyStateMachine
 *
 * Features:
 * - Type-safe state transitions
 * - Supabase persistence
 * - Event logging/audit trail
 * - Crash recovery
 * - Real-time notifications
 */

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with service role for backend operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials for State Machine");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================================
// TYPES
// ============================================================================

export enum DealJourneyState {
  INQUIRY = "INQUIRY",
  QUALIFICATION = "QUALIFICATION",
  NEGOTIATION = "NEGOTIATION",
  INSPECTION = "INSPECTION",
  QUOTE = "QUOTE",
  DEPOSIT = "DEPOSIT",
  DOCUMENTATION = "DOCUMENTATION",
  PAYMENT = "PAYMENT",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  LOST = "LOST",
}

export interface JourneyStateRecord {
  id: string;
  customer_phone: string;
  customer_name?: string;
  customer_email?: string;
  state: DealJourneyState;
  previous_state?: DealJourneyState;
  state_entered_at: string;
  listing_id?: string;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  thread_id: string;
  whatsapp_session_id?: string;
  metadata: Record<string, any>;
  tags: string[];
  created_at: string;
  last_updated_at: string;
  closed_at?: string;
}

export interface StateTransition {
  from_state?: DealJourneyState;
  to_state: DealJourneyState;
  triggered_by: "system" | "agent" | "customer" | "coordinator";
  agent_id?: string;
  agent_name?: string;
  event_data?: Record<string, any>;
  notes?: string;
  force?: boolean; // Bypass validation for admin overrides
}

export interface JourneyEvent {
  id: string;
  journey_id: string;
  event_type: string;
  from_state?: DealJourneyState;
  to_state?: DealJourneyState;
  triggered_by: string;
  agent_id?: string;
  agent_name?: string;
  event_data: Record<string, any>;
  notes?: string;
  error_message?: string;
  created_at: string;
}

// ============================================================================
// STATE TRANSITION RULES
// ============================================================================

const STATE_TRANSITIONS: Record<DealJourneyState, DealJourneyState[]> = {
  [DealJourneyState.INQUIRY]: [
    DealJourneyState.QUALIFICATION,
    DealJourneyState.NEGOTIATION,
    DealJourneyState.CANCELLED,
  ],
  [DealJourneyState.QUALIFICATION]: [
    DealJourneyState.NEGOTIATION,
    DealJourneyState.LOST,
    DealJourneyState.CANCELLED,
  ],
  [DealJourneyState.NEGOTIATION]: [
    DealJourneyState.INSPECTION,
    DealJourneyState.QUOTE,
    DealJourneyState.LOST,
    DealJourneyState.CANCELLED,
  ],
  [DealJourneyState.INSPECTION]: [
    DealJourneyState.QUOTE,
    DealJourneyState.NEGOTIATION,
    DealJourneyState.LOST,
    DealJourneyState.CANCELLED,
  ],
  [DealJourneyState.QUOTE]: [
    DealJourneyState.DEPOSIT,
    DealJourneyState.NEGOTIATION,
    DealJourneyState.LOST,
    DealJourneyState.CANCELLED,
  ],
  [DealJourneyState.DEPOSIT]: [
    DealJourneyState.DOCUMENTATION,
    DealJourneyState.CANCELLED,
  ],
  [DealJourneyState.DOCUMENTATION]: [
    DealJourneyState.PAYMENT,
    DealJourneyState.CANCELLED,
  ],
  [DealJourneyState.PAYMENT]: [
    DealJourneyState.SHIPPING,
    DealJourneyState.CANCELLED,
  ],
  [DealJourneyState.SHIPPING]: [DealJourneyState.DELIVERED],
  [DealJourneyState.DELIVERED]: [],
  [DealJourneyState.CANCELLED]: [],
  [DealJourneyState.LOST]: [],
};

// ============================================================================
// ERRORS
// ============================================================================

export class InvalidTransitionError extends Error {
  constructor(from: DealJourneyState | undefined, to: DealJourneyState) {
    const allowed = from ? STATE_TRANSITIONS[from] : [DealJourneyState.INQUIRY];
    super(
      `Invalid state transition from ${from || "NEW"} to ${to}. ` +
        `Allowed transitions: ${allowed.join(", ")}`,
    );
    this.name = "InvalidTransitionError";
  }
}

// ============================================================================
// STATE MACHINE CLASS
// ============================================================================

export class DealJourneyStateMachine {
  /**
   * Get current journey state for a customer
   */
  async getState(
    customerPhone: string,
    listingId?: string,
  ): Promise<JourneyStateRecord | null> {
    let query = supabase
      .from("deal_journey_state")
      .select("*")
      .eq("customer_phone", customerPhone);

    if (listingId) {
      query = query.eq("listing_id", listingId);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows found
      throw new Error(`Failed to get journey state: ${error.message}`);
    }

    return data as JourneyStateRecord;
  }

  /**
   * Validate if a state transition is allowed
   */
  validateTransition(
    currentState: DealJourneyState | undefined,
    newState: DealJourneyState,
    force: boolean = false,
  ): boolean {
    if (force) return true;

    if (!currentState) {
      // New journey - only INQUIRY is valid
      if (newState !== DealJourneyState.INQUIRY) {
        throw new InvalidTransitionError(currentState, newState);
      }
      return true;
    }

    const allowed = STATE_TRANSITIONS[currentState];
    if (!allowed.includes(newState)) {
      throw new InvalidTransitionError(currentState, newState);
    }

    return true;
  }

  /**
   * Transition a customer to a new journey state
   */
  async transition(
    customerPhone: string,
    transition: StateTransition,
  ): Promise<{ success: boolean; journey: JourneyStateRecord }> {
    // Get current state
    const currentRecord = await this.getState(customerPhone);
    const currentState = currentRecord?.state;

    // Validate transition
    this.validateTransition(
      currentState,
      transition.to_state,
      transition.force,
    );

    // Set triggered_by in Postgres session for trigger
    try {
      await supabase.rpc("exec", {
        sql: `SET LOCAL app.triggered_by = '${transition.triggered_by}'`,
      } as never);
    } catch {
      // Ignore if fails - exec function may not exist
    }

    if (!currentRecord) {
      // Create new journey
      const { data, error } = await supabase
        .from("deal_journey_state")
        .insert({
          customer_phone: customerPhone,
          customer_name: transition.event_data?.customer_name,
          state: transition.to_state,
          thread_id: `thread_${customerPhone}_${Date.now()}`,
          metadata: transition.event_data || {},
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create journey: ${error.message}`);

      return { success: true, journey: data as JourneyStateRecord };
    } else {
      // Update existing journey
      const { data, error } = await supabase
        .from("deal_journey_state")
        .update({
          state: transition.to_state,
          metadata: {
            ...currentRecord.metadata,
            ...(transition.event_data || {}),
          },
        })
        .eq("id", currentRecord.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update journey: ${error.message}`);

      return { success: true, journey: data as JourneyStateRecord };
    }
  }

  /**
   * Get journey timeline (all events)
   */
  async getTimeline(journeyId: string): Promise<JourneyEvent[]> {
    const { data, error } = await supabase
      .from("deal_journey_events")
      .select("*")
      .eq("journey_id", journeyId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(`Failed to get timeline: ${error.message}`);

    return data as JourneyEvent[];
  }

  /**
   * Log a custom event
   */
  async logEvent(
    journeyId: string,
    eventType: string,
    data: {
      triggered_by: string;
      agent_name?: string;
      notes?: string;
      event_data?: Record<string, any>;
    },
  ): Promise<void> {
    const { error } = await supabase.from("deal_journey_events").insert({
      journey_id: journeyId,
      event_type: eventType,
      triggered_by: data.triggered_by,
      agent_name: data.agent_name,
      notes: data.notes,
      event_data: data.event_data || {},
    });

    if (error) throw new Error(`Failed to log event: ${error.message}`);
  }

  /**
   * Assign an agent to a journey
   */
  async assignAgent(
    journeyId: string,
    agentId: string,
    agentName: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("deal_journey_state")
      .update({
        assigned_agent_id: agentId,
        assigned_agent_name: agentName,
      })
      .eq("id", journeyId);

    if (error) throw new Error(`Failed to assign agent: ${error.message}`);

    // Log assignment event
    await this.logEvent(journeyId, "assignment", {
      triggered_by: "system",
      agent_name: agentName,
      event_data: { agent_id: agentId },
    });
  }

  /**
   * Get all active journeys
   */
  async getActiveJourneys(
    state?: DealJourneyState,
  ): Promise<JourneyStateRecord[]> {
    let query = supabase
      .from("deal_journey_state")
      .select("*")
      .is("closed_at", null)
      .order("created_at", { ascending: false });

    if (state) {
      query = query.eq("state", state);
    }

    const { data, error } = await query;

    if (error)
      throw new Error(`Failed to get active journeys: ${error.message}`);

    return data as JourneyStateRecord[];
  }
}

// Singleton instance
let stateMachine: DealJourneyStateMachine | null = null;

export function getStateMachine(): DealJourneyStateMachine {
  if (!stateMachine) {
    stateMachine = new DealJourneyStateMachine();
  }
  return stateMachine;
}
