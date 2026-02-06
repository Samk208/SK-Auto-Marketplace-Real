/**
 * Deal Pipeline Dashboard API
 * Provides analytics and visualization data for admin dashboard
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET - Pipeline analytics and deal list
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view") || "overview";

    if (view === "overview") {
      return await getPipelineOverview();
    }

    if (view === "deals") {
      const state = searchParams.get("state");
      return await getDealsList(state);
    }

    if (view === "deal") {
      const journeyId = searchParams.get("journeyId");
      if (!journeyId) {
        return NextResponse.json(
          { error: "journeyId is required" },
          { status: 400 },
        );
      }
      return await getDealDetails(journeyId);
    }

    if (view === "metrics") {
      const period = searchParams.get("period") || "7d";
      return await getMetrics(period);
    }

    return NextResponse.json(
      { error: "Invalid view parameter" },
      { status: 400 },
    );
  } catch (error) {
    console.error("[Pipeline API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch pipeline data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * Get pipeline overview (funnel stats)
 */
async function getPipelineOverview() {
  // Get count by state
  const { data: stateCounts, error: stateError } = await supabase
    .from("deal_journey_state")
    .select("state");

  if (stateError) throw stateError;

  // Count by state
  const pipeline: Record<string, number> = {};
  stateCounts?.forEach((record) => {
    pipeline[record.state] = (pipeline[record.state] || 0) + 1;
  });

  // Get recent activity
  const { data: recentEvents, error: eventsError } = await supabase
    .from("deal_journey_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (eventsError) throw eventsError;

  // Calculate conversion rates
  const total = stateCounts?.length || 0;
  const conversions = {
    inquiryToQualified:
      total > 0 ? ((pipeline.QUALIFICATION || 0) / total) * 100 : 0,
    qualifiedToQuote:
      (pipeline.QUALIFICATION || 0) > 0
        ? ((pipeline.QUOTE || 0) / (pipeline.QUALIFICATION || 1)) * 100
        : 0,
    quoteToDeposit:
      (pipeline.QUOTE || 0) > 0
        ? ((pipeline.DEPOSIT || 0) / (pipeline.QUOTE || 1)) * 100
        : 0,
    depositToDelivered:
      (pipeline.DEPOSIT || 0) > 0
        ? ((pipeline.DELIVERED || 0) / (pipeline.DEPOSIT || 1)) * 100
        : 0,
  };

  return NextResponse.json({
    success: true,
    pipeline,
    recentEvents,
    conversions,
    totalDeals: total,
  });
}

/**
 * Get deals list filtered by state
 */
async function getDealsList(state: string | null) {
  let query = supabase
    .from("deal_journey_state")
    .select("*, car_listings(title, brand, model, year, price, images)")
    .order("last_updated_at", { ascending: false })
    .limit(50);

  if (state) {
    query = query.eq("state", state);
  }

  const { data, error } = await query;

  if (error) throw error;

  return NextResponse.json({
    success: true,
    deals: data || [],
    count: data?.length || 0,
  });
}

/**
 * Get detailed information about a specific deal
 */
async function getDealDetails(journeyId: string) {
  // Get journey state
  const { data: journey, error: journeyError } = await supabase
    .from("deal_journey_state")
    .select(
      "*, car_listings(title, brand, model, year, price, images, description)",
    )
    .eq("id", journeyId)
    .single();

  if (journeyError) throw journeyError;

  // Get journey events timeline
  const { data: events, error: eventsError } = await supabase
    .from("deal_journey_events")
    .select("*")
    .eq("journey_id", journeyId)
    .order("created_at", { ascending: true });

  if (eventsError) throw eventsError;

  // Get associated workflows
  const { data: workflows, error: workflowsError } = await supabase
    .from("agent_workflows")
    .select("*")
    .eq("journey_id", journeyId)
    .order("created_at", { ascending: false });

  if (workflowsError) throw workflowsError;

  // Get agent tasks for this deal
  const { data: tasks, error: tasksError } = await supabase
    .from("agent_tasks")
    .select("*")
    .contains("input_data", { journeyId })
    .order("created_at", { ascending: false })
    .limit(20);

  if (tasksError) throw tasksError;

  // Calculate deal metrics
  const stateHistory = events.filter((e) => e.event_type === "state_change");
  const durationInState = journey.state_entered_at
    ? Math.floor(
        (Date.now() - new Date(journey.state_entered_at).getTime()) / 1000 / 60,
      ) // minutes
    : 0;

  return NextResponse.json({
    success: true,
    journey,
    events,
    workflows,
    tasks,
    metrics: {
      stateChanges: stateHistory.length,
      durationInCurrentState: durationInState,
      totalDuration: Math.floor(
        (Date.now() - new Date(journey.created_at).getTime()) / 1000 / 60 / 60,
      ), // hours
    },
  });
}

/**
 * Get time-series metrics
 */
async function getMetrics(period: string) {
  // Calculate date range
  const now = new Date();
  const periodMap: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  const days = periodMap[period] || 7;
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Get new deals by day
  const { data: newDeals, error: newDealsError } = await supabase
    .from("deal_journey_state")
    .select("created_at, state")
    .gte("created_at", startDate.toISOString());

  if (newDealsError) throw newDealsError;

  // Get state changes
  const { data: stateChanges, error: stateChangesError } = await supabase
    .from("deal_journey_events")
    .select("created_at, from_state, to_state")
    .eq("event_type", "state_change")
    .gte("created_at", startDate.toISOString());

  if (stateChangesError) throw stateChangesError;

  // Group by day
  const dailyMetrics: Record<
    string,
    { date: string; newDeals: number; conversions: number }
  > = {};

  newDeals?.forEach((deal) => {
    const date = new Date(deal.created_at).toISOString().split("T")[0];
    if (!dailyMetrics[date]) {
      dailyMetrics[date] = { date, newDeals: 0, conversions: 0 };
    }
    dailyMetrics[date].newDeals++;
  });

  stateChanges?.forEach((change) => {
    const date = new Date(change.created_at).toISOString().split("T")[0];
    if (!dailyMetrics[date]) {
      dailyMetrics[date] = { date, newDeals: 0, conversions: 0 };
    }
    // Count significant conversions
    if (["DEPOSIT", "PAYMENT", "DELIVERED"].includes(change.to_state)) {
      dailyMetrics[date].conversions++;
    }
  });

  const metricsArray = Object.values(dailyMetrics).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  // Calculate agent activity
  const { data: agentTasks, error: tasksError } = await supabase
    .from("agent_tasks")
    .select("assigned_to_agent, status, created_at")
    .gte("created_at", startDate.toISOString());

  if (tasksError) throw tasksError;

  const agentActivity: Record<string, { total: number; completed: number }> =
    {};
  agentTasks?.forEach((task) => {
    if (!agentActivity[task.assigned_to_agent]) {
      agentActivity[task.assigned_to_agent] = { total: 0, completed: 0 };
    }
    agentActivity[task.assigned_to_agent].total++;
    if (task.status === "completed") {
      agentActivity[task.assigned_to_agent].completed++;
    }
  });

  return NextResponse.json({
    success: true,
    period,
    dailyMetrics: metricsArray,
    agentActivity,
    summary: {
      totalNewDeals: newDeals?.length || 0,
      totalConversions:
        stateChanges?.filter((c) =>
          ["DEPOSIT", "PAYMENT", "DELIVERED"].includes(c.to_state),
        ).length || 0,
      avgDealsPerDay:
        metricsArray.length > 0
          ? (newDeals?.length || 0) / metricsArray.length
          : 0,
    },
  });
}
