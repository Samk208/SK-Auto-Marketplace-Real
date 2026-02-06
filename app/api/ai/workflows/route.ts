/**
 * Workflow Management API
 * Trigger, monitor, and control multi-agent workflows
 */

import { WorkflowEngine } from "@/lib/agents/orchestration/workflow-engine";
import { NextRequest, NextResponse } from "next/server";

const workflowEngine = new WorkflowEngine();

/**
 * POST - Start a new workflow
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowName, context } = body;

    if (!workflowName) {
      return NextResponse.json(
        { error: "workflowName is required" },
        { status: 400 },
      );
    }

    const workflowId = await workflowEngine.startWorkflow(
      workflowName,
      context || {},
    );

    return NextResponse.json({
      success: true,
      workflowId,
      message: `Workflow ${workflowName} started`,
    });
  } catch (error) {
    console.error("[Workflow API] Start error:", error);
    return NextResponse.json(
      {
        error: "Failed to start workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET - Get workflow status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId");
    const journeyId = searchParams.get("journeyId");

    if (workflowId) {
      const status = await workflowEngine.getWorkflowStatus(workflowId);
      if (!status) {
        return NextResponse.json(
          { error: "Workflow not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, workflow: status });
    }

    if (journeyId) {
      const workflows = await workflowEngine.getJourneyWorkflows(journeyId);
      return NextResponse.json({
        success: true,
        workflows,
        count: workflows.length,
      });
    }

    return NextResponse.json(
      { error: "workflowId or journeyId is required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("[Workflow API] Get error:", error);
    return NextResponse.json(
      {
        error: "Failed to get workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH - Pause/Resume workflow
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, action } = body;

    if (!workflowId || !action) {
      return NextResponse.json(
        { error: "workflowId and action are required" },
        { status: 400 },
      );
    }

    if (action === "pause") {
      await workflowEngine.pauseWorkflow(workflowId);
      return NextResponse.json({
        success: true,
        message: "Workflow paused",
      });
    }

    if (action === "resume") {
      await workflowEngine.resumeWorkflow(workflowId);
      return NextResponse.json({
        success: true,
        message: "Workflow resumed",
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "pause" or "resume"' },
      { status: 400 },
    );
  } catch (error) {
    console.error("[Workflow API] Patch error:", error);
    return NextResponse.json(
      {
        error: "Failed to update workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
