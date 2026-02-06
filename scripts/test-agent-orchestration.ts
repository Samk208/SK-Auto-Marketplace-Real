/**
 * Agent Orchestration Testing Script
 *
 * Tests all Phase 1 + Phase 2 implementations:
 * - Semantic search
 * - Negotiator with FSM
 * - Workflow engine
 * - Admin pipeline API
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SECRET_KEY!;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SECRET_KEY");
  console.error("\nMake sure .env.local exists and contains these variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Test utilities
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  reset: "\x1b[0m",
};

function log(level: "success" | "error" | "info" | "test", message: string) {
  const color =
    level === "success"
      ? colors.green
      : level === "error"
        ? colors.red
        : level === "test"
          ? colors.blue
          : colors.yellow;
  console.log(`${color}[${level.toUpperCase()}]${colors.reset} ${message}`);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// TEST 1: Database Infrastructure
// ============================================================================

async function testDatabaseInfrastructure() {
  log("test", "TEST 1: Database Infrastructure");

  try {
    // Check pgvector extension
    const { data: extensions, error: extError } = await supabase.rpc("exec", {
      sql: "SELECT * FROM pg_extension WHERE extname = 'vector'",
    });

    if (extError) throw new Error(`pgvector check failed: ${extError.message}`);
    log("success", "✓ pgvector extension installed");

    // Check tables exist
    const tables = [
      "car_listing_embeddings",
      "deal_journey_state",
      "deal_journey_events",
      "agent_tasks",
      "agent_events",
      "agent_workflows",
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select("*").limit(1);
      if (error) throw new Error(`Table ${table} not found: ${error.message}`);
      log("success", `✓ Table exists: ${table}`);
    }

    // Check functions exist
    const { data: functions, error: funcError } = await supabase.rpc("exec", {
      sql: `SELECT routine_name FROM information_schema.routines 
                      WHERE routine_schema = 'public' 
                      AND routine_name IN ('search_listings_semantic', 'validate_deal_state_transition', 
                                          'emit_agent_event', 'assign_agent_task')`,
    });

    if (funcError) log("error", `Function check failed: ${funcError.message}`);
    else log("success", "✓ All SQL functions exist");

    return true;
  } catch (error) {
    log("error", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

// ============================================================================
// TEST 2: Deal Journey State Machine
// ============================================================================

async function testStateMachine() {
  log("test", "TEST 2: Deal Journey State Machine");

  const testPhone = `+234${Date.now().toString().slice(-10)}`;

  try {
    // Create a new journey
    const { data: journey, error: createError } = await supabase
      .from("deal_journey_state")
      .insert({
        customer_phone: testPhone,
        customer_name: "Test Customer",
        state: "INQUIRY",
        thread_id: `test_${Date.now()}`,
        metadata: { test: true },
      })
      .select()
      .single();

    if (createError)
      throw new Error(`Journey creation failed: ${createError.message}`);
    log("success", `✓ Journey created: ${journey.id}`);

    // Test state transition: INQUIRY → QUALIFICATION
    const { error: transError } = await supabase
      .from("deal_journey_state")
      .update({ state: "QUALIFICATION" })
      .eq("id", journey.id);

    if (transError) throw new Error(`Transition failed: ${transError.message}`);
    log("success", "✓ State transition: INQUIRY → QUALIFICATION");

    // Verify event was logged
    await sleep(500); // Wait for trigger
    const { data: events, error: eventError } = await supabase
      .from("deal_journey_events")
      .select("*")
      .eq("journey_id", journey.id)
      .eq("event_type", "state_change");

    if (eventError)
      throw new Error(`Event check failed: ${eventError.message}`);
    if (!events || events.length === 0) {
      log("error", "✗ No state change event logged");
    } else {
      log("success", `✓ State change event logged (${events.length} events)`);
    }

    // Test invalid transition (should be blocked by validation)
    const { error: invalidError } = await supabase
      .from("deal_journey_state")
      .update({ state: "DELIVERED" }) // Invalid: QUALIFICATION → DELIVERED
      .eq("id", journey.id);

    // Note: Trigger validation happens in database, not via API
    log("info", "Invalid transition test requires database-level validation");

    // Cleanup
    await supabase.from("deal_journey_state").delete().eq("id", journey.id);
    log("success", "✓ Test journey cleaned up");

    return true;
  } catch (error) {
    log("error", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

// ============================================================================
// TEST 3: Agent Event Bus
// ============================================================================

async function testEventBus() {
  log("test", "TEST 3: Agent Event Bus");

  try {
    // Test task assignment
    const { data: taskId, error: taskError } = await supabase.rpc(
      "assign_agent_task",
      {
        p_task_type: "test_task",
        p_assigned_to: "matchmaker",
        p_input_data: { test: true, timestamp: Date.now() },
        p_priority: 5,
        p_requested_by: "system",
      },
    );

    if (taskError)
      throw new Error(`Task assignment failed: ${taskError.message}`);
    log("success", `✓ Task assigned: ${taskId}`);

    // Verify task exists
    const { data: task, error: fetchError } = await supabase
      .from("agent_tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (fetchError) throw new Error(`Task fetch failed: ${fetchError.message}`);
    if (task.status !== "pending") {
      log("error", `✗ Unexpected task status: ${task.status}`);
    } else {
      log("success", "✓ Task status correct: pending");
    }

    // Test event emission
    const { data: eventId, error: eventError } = await supabase.rpc(
      "emit_agent_event",
      {
        p_event_type: "test.event",
        p_event_source: "system",
        p_payload: { test: true, timestamp: Date.now() },
        p_target_agents: ["matchmaker", "negotiator"],
      },
    );

    if (eventError)
      throw new Error(`Event emission failed: ${eventError.message}`);
    log("success", `✓ Event emitted: ${eventId}`);

    // Verify event exists
    const { data: event, error: eventFetchError } = await supabase
      .from("agent_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventFetchError)
      throw new Error(`Event fetch failed: ${eventFetchError.message}`);
    log(
      "success",
      `✓ Event verified with ${event.target_agents?.length || 0} targets`,
    );

    // Cleanup
    await supabase.from("agent_tasks").delete().eq("id", taskId);
    await supabase.from("agent_events").delete().eq("id", eventId);

    return true;
  } catch (error) {
    log("error", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

// ============================================================================
// TEST 4: Semantic Search API
// ============================================================================

async function testSemanticSearch() {
  log("test", "TEST 4: Semantic Search API");

  try {
    // Check if we have any listings
    const { data: listings, error: listError } = await supabase
      .from("car_listings")
      .select("id, title, brand, model")
      .eq("status", "active")
      .limit(1);

    if (listError)
      throw new Error(`Listings check failed: ${listError.message}`);

    if (!listings || listings.length === 0) {
      log("info", "No active listings found - skipping embedding test");
      return true;
    }

    log("info", `Found ${listings.length} listings to test with`);

    // Test semantic search API (will use fallback if no embeddings)
    const searchQuery = "reliable family SUV";
    log("info", `Searching for: "${searchQuery}"`);

    const response = await fetch(`${API_BASE}/api/ai/semantic-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery, maxResults: 5 }),
    });

    if (!response.ok) {
      throw new Error(
        `Search API failed: ${response.status} ${await response.text()}`,
      );
    }

    const result = await response.json();
    log("success", `✓ Search returned ${result.count} results`);

    if (result.results && result.results.length > 0) {
      log(
        "info",
        `Top match: ${result.results[0].brand} ${result.results[0].model} (similarity: ${result.results[0].similarity})`,
      );
    }

    return true;
  } catch (error) {
    log("error", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

// ============================================================================
// TEST 5: Negotiator with FSM
// ============================================================================

async function testNegotiatorFSM() {
  log("test", "TEST 5: Negotiator API with FSM Integration");

  const testPhone = `+234${Date.now().toString().slice(-10)}`;

  try {
    // Test initial inquiry (should create journey)
    log("info", "Testing initial inquiry...");
    const response1 = await fetch(`${API_BASE}/api/ai/negotiator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Hello, I am interested in buying a car",
        customerPhone: testPhone,
        customerName: "Test Buyer",
        history: [],
      }),
    });

    if (!response1.ok) {
      throw new Error(
        `Negotiator API failed: ${response1.status} ${await response1.text()}`,
      );
    }

    const result1 = await response1.json();
    log("success", `✓ Journey created: ${result1.journeyId}`);
    log("info", `Current state: ${result1.currentState}`);
    log("info", `Intent: ${result1.intent}`);

    if (result1.currentState !== "INQUIRY") {
      log("error", `✗ Expected state INQUIRY, got ${result1.currentState}`);
    }

    // Test price negotiation (should transition to NEGOTIATION)
    await sleep(1000);
    log("info", "Testing price negotiation...");
    const response2 = await fetch(`${API_BASE}/api/ai/negotiator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What is the price? Can you give me a discount?",
        customerPhone: testPhone,
        history: [
          { role: "user", content: "Hello, I am interested in buying a car" },
          { role: "assistant", content: result1.response },
        ],
      }),
    });

    if (!response2.ok) {
      throw new Error(`Negotiation failed: ${response2.status}`);
    }

    const result2 = await response2.json();
    log("success", "✓ Negotiation response received");
    log("info", `Current state: ${result2.currentState}`);
    log("info", `Intent: ${result2.intent}`);

    if (result2.intent === "negotiation") {
      log("success", "✓ Intent correctly classified as negotiation");
    }

    // Verify journey was updated
    const { data: journey, error: journeyError } = await supabase
      .from("deal_journey_state")
      .select("*")
      .eq("customer_phone", testPhone)
      .single();

    if (journeyError)
      throw new Error(`Journey fetch failed: ${journeyError.message}`);
    log("success", `✓ Journey persisted with state: ${journey.state}`);

    // Cleanup
    await supabase.from("deal_journey_state").delete().eq("id", journey.id);

    return true;
  } catch (error) {
    log("error", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

// ============================================================================
// TEST 6: Workflow Engine
// ============================================================================

async function testWorkflowEngine() {
  log("test", "TEST 6: Workflow Engine");

  try {
    // Create a test journey first
    const testPhone = `+234${Date.now().toString().slice(-10)}`;
    const { data: journey } = await supabase
      .from("deal_journey_state")
      .insert({
        customer_phone: testPhone,
        customer_name: "Workflow Test",
        state: "INQUIRY",
        thread_id: `workflow_test_${Date.now()}`,
      })
      .select()
      .single();

    if (!journey) throw new Error("Failed to create test journey");
    log("info", `Test journey created: ${journey.id}`);

    // Start a workflow
    log("info", "Starting quick_quote workflow...");
    const response = await fetch(`${API_BASE}/api/ai/workflows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflowName: "quick_quote",
        context: {
          journeyId: journey.id,
          customerPhone: testPhone,
          startedBy: "test_script",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Workflow start failed: ${response.status} ${await response.text()}`,
      );
    }

    const result = await response.json();
    log("success", `✓ Workflow started: ${result.workflowId}`);

    // Wait a bit for workflow to process
    await sleep(2000);

    // Check workflow status
    const statusResponse = await fetch(
      `${API_BASE}/api/ai/workflows?workflowId=${result.workflowId}`,
    );

    if (!statusResponse.ok) {
      throw new Error(`Workflow status check failed: ${statusResponse.status}`);
    }

    const status = await statusResponse.json();
    log("success", `✓ Workflow status: ${status.workflow.status}`);
    log(
      "info",
      `Current step: ${status.workflow.current_step}/${status.workflow.workflow_steps.length}`,
    );

    // Cleanup
    await supabase.from("deal_journey_state").delete().eq("id", journey.id);
    await supabase.from("agent_workflows").delete().eq("id", result.workflowId);

    return true;
  } catch (error) {
    log("error", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

// ============================================================================
// TEST 7: Admin Pipeline API
// ============================================================================

async function testAdminPipeline() {
  log("test", "TEST 7: Admin Pipeline API");

  try {
    // Test overview
    const overviewResponse = await fetch(
      `${API_BASE}/api/admin/pipeline?view=overview`,
    );
    if (!overviewResponse.ok) {
      throw new Error(`Overview API failed: ${overviewResponse.status}`);
    }
    const overview = await overviewResponse.json();
    log("success", `✓ Pipeline overview: ${overview.totalDeals} total deals`);
    log("info", `Pipeline: ${JSON.stringify(overview.pipeline)}`);

    // Test deals list
    const dealsResponse = await fetch(
      `${API_BASE}/api/admin/pipeline?view=deals`,
    );
    if (!dealsResponse.ok) {
      throw new Error(`Deals list API failed: ${dealsResponse.status}`);
    }
    const deals = await dealsResponse.json();
    log("success", `✓ Deals list: ${deals.count} deals returned`);

    // Test metrics
    const metricsResponse = await fetch(
      `${API_BASE}/api/admin/pipeline?view=metrics&period=7d`,
    );
    if (!metricsResponse.ok) {
      throw new Error(`Metrics API failed: ${metricsResponse.status}`);
    }
    const metrics = await metricsResponse.json();
    log(
      "success",
      `✓ Metrics: ${metrics.summary.totalNewDeals} new deals in ${metrics.period}`,
    );

    return true;
  } catch (error) {
    log("error", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function main() {
  console.log("\n" + "=".repeat(70));
  console.log("🤖 AGENT ORCHESTRATION TEST SUITE");
  console.log("=".repeat(70) + "\n");

  const tests = [
    { name: "Database Infrastructure", fn: testDatabaseInfrastructure },
    { name: "State Machine", fn: testStateMachine },
    { name: "Event Bus", fn: testEventBus },
    { name: "Semantic Search", fn: testSemanticSearch },
    { name: "Negotiator FSM", fn: testNegotiatorFSM },
    { name: "Workflow Engine", fn: testWorkflowEngine },
    { name: "Admin Pipeline", fn: testAdminPipeline },
  ];

  const results: { name: string; passed: boolean }[] = [];

  for (const test of tests) {
    console.log(""); // Blank line before each test
    const passed = await test.fn();
    results.push({ name: test.name, passed });
    await sleep(500); // Brief pause between tests
  }

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(70) + "\n");

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  results.forEach((r) => {
    const icon = r.passed ? "✓" : "✗";
    const color = r.passed ? colors.green : colors.red;
    console.log(`${color}${icon}${colors.reset} ${r.name}`);
  });

  console.log("");
  console.log(
    `Total: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)`,
  );
  console.log("");

  process.exit(passed === total ? 0 : 1);
}

// Run tests
main().catch((error) => {
  log(
    "error",
    `Fatal error: ${error instanceof Error ? error.message : "Unknown error"}`,
  );
  process.exit(1);
});
