-- ============================================================================
-- MIGRATION: Agent Event Bus
-- Purpose: Enable agent-to-agent communication and task coordination
-- Pattern: Pub/Sub using Supabase Realtime + Event Store
-- Date: 2026-01-27
-- ============================================================================

-- Step 1: Create agent task queue
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

-- Task identification
task_type TEXT NOT NULL, -- 'semantic_search', 'price_estimate', 'document_parse', 'vision_analysis'
priority INTEGER DEFAULT 5, -- 1 (urgent) to 10 (low)

-- Agent assignment
assigned_to_agent TEXT NOT NULL, -- 'matchmaker', 'pricing_oracle', 'document_intelligence', 'vision_inspector'
requested_by_agent TEXT, -- Which agent requested this task
request_id TEXT, -- For correlating requests/responses

-- Task data
input_data JSONB NOT NULL, output_data JSONB,

-- Status tracking
status TEXT DEFAULT 'pending' CHECK (
    status IN (
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled'
    )
),
attempts INTEGER DEFAULT 0,
max_attempts INTEGER DEFAULT 3,
error_message TEXT,

-- Timing
created_at TIMESTAMP
WITH
    TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP
WITH
    TIME ZONE,
    completed_at TIMESTAMP
WITH
    TIME ZONE,
    expires_at TIMESTAMP
WITH
    TIME ZONE DEFAULT(NOW() + INTERVAL '1 hour'),

-- Metadata
metadata JSONB DEFAULT '{}' );

-- Step 2: Create agent events log (for pub/sub pattern)
CREATE TABLE IF NOT EXISTS agent_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

-- Event identification
event_type TEXT NOT NULL, -- 'task.created', 'task.completed', 'lead.qualified', 'document.parsed'
event_source TEXT NOT NULL, -- Which agent emitted this event

-- Event data
payload JSONB NOT NULL,

-- Subscribers (which agents need to be notified)
target_agents TEXT[], -- NULL means broadcast to all

-- Processing tracking
processed_by TEXT[] DEFAULT '{}', -- Track which agents have consumed this event

-- Timing
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Step 3: Create agent coordination table (for multi-agent workflows)
CREATE TABLE IF NOT EXISTS agent_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

-- Workflow definition
workflow_name TEXT NOT NULL, -- 'complete_deal', 'vehicle_acquisition', 'export_preparation'
workflow_steps JSONB NOT NULL, -- Array of steps with agent assignments

-- Current state
current_step INTEGER DEFAULT 0,
status TEXT DEFAULT 'pending' CHECK (
    status IN (
        'pending',
        'running',
        'completed',
        'failed',
        'paused'
    )
),

-- Context
context JSONB DEFAULT '{}', -- Shared data between agents

-- Related entities
journey_id UUID REFERENCES deal_journey_state (id) ON DELETE CASCADE,
listing_id UUID REFERENCES car_listings (id) ON DELETE SET NULL,

-- Timing
created_at TIMESTAMP
WITH
    TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP
WITH
    TIME ZONE,
    completed_at TIMESTAMP
WITH
    TIME ZONE,

-- Metadata
metadata JSONB DEFAULT '{}' );

-- Step 4: Create function to emit agent events (pub/sub)
CREATE OR REPLACE FUNCTION emit_agent_event(
    p_event_type TEXT,
    p_event_source TEXT,
    p_payload JSONB,
    p_target_agents TEXT[] DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO agent_events (
        event_type,
        event_source,
        payload,
        target_agents
    ) VALUES (
        p_event_type,
        p_event_source,
        p_payload,
        p_target_agents
    ) RETURNING id INTO v_event_id;
    
    -- Trigger realtime notification
    PERFORM pg_notify(
        'agent_events',
        json_build_object(
            'event_id', v_event_id,
            'event_type', p_event_type,
            'source', p_event_source
        )::text
    );
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Function to assign task to agent
CREATE OR REPLACE FUNCTION assign_agent_task(
    p_task_type TEXT,
    p_assigned_to TEXT,
    p_input_data JSONB,
    p_priority INTEGER DEFAULT 5,
    p_requested_by TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
BEGIN
    INSERT INTO agent_tasks (
        task_type,
        assigned_to_agent,
        requested_by_agent,
        input_data,
        priority,
        request_id
    ) VALUES (
        p_task_type,
        p_assigned_to,
        p_requested_by,
        p_input_data,
        p_priority,
        gen_random_uuid()::TEXT
    ) RETURNING id INTO v_task_id;
    
    -- Emit event for task creation
    PERFORM emit_agent_event(
        'task.created',
        COALESCE(p_requested_by, 'system'),
        jsonb_build_object(
            'task_id', v_task_id,
            'task_type', p_task_type,
            'assigned_to', p_assigned_to,
            'priority', p_priority
        ),
        ARRAY[p_assigned_to]
    );
    
    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Function to complete agent task
CREATE OR REPLACE FUNCTION complete_agent_task(
    p_task_id UUID,
    p_output_data JSONB,
    p_agent_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_requested_by TEXT;
BEGIN
    UPDATE agent_tasks
    SET 
        status = 'completed',
        output_data = p_output_data,
        completed_at = NOW()
    WHERE id = p_task_id
    AND assigned_to_agent = p_agent_name
    RETURNING requested_by_agent INTO v_requested_by;
    
    IF FOUND THEN
        -- Emit completion event
        PERFORM emit_agent_event(
            'task.completed',
            p_agent_name,
            jsonb_build_object(
                'task_id', p_task_id,
                'output', p_output_data
            ),
            CASE 
                WHEN v_requested_by IS NOT NULL THEN ARRAY[v_requested_by]
                ELSE NULL
            END
        );
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Auto-cleanup expired tasks and events
CREATE OR REPLACE FUNCTION cleanup_expired_agent_data() RETURNS void AS $$
BEGIN
    -- Archive or delete expired tasks
    DELETE FROM agent_tasks
    WHERE expires_at < NOW()
    AND status IN ('completed', 'failed', 'cancelled');
    
    -- Delete expired events
    DELETE FROM agent_events
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create indexes
CREATE INDEX IF NOT EXISTS agent_tasks_status_priority_idx ON agent_tasks (
    status,
    priority DESC,
    created_at
);

CREATE INDEX IF NOT EXISTS agent_tasks_assigned_idx ON agent_tasks (assigned_to_agent, status);

CREATE INDEX IF NOT EXISTS agent_tasks_expires_idx ON agent_tasks (expires_at)
WHERE
    status NOT IN('completed', 'failed');

CREATE INDEX IF NOT EXISTS agent_events_type_idx ON agent_events (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS agent_events_source_idx ON agent_events (event_source);

CREATE INDEX IF NOT EXISTS agent_events_expires_idx ON agent_events (expires_at);

CREATE INDEX IF NOT EXISTS agent_workflows_status_idx ON agent_workflows (status, created_at DESC);

CREATE INDEX IF NOT EXISTS agent_workflows_journey_idx ON agent_workflows (journey_id);

-- Step 9: RLS Policies
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;

ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE agent_workflows ENABLE ROW LEVEL SECURITY;

-- Service role has full access (agents use service role)
CREATE POLICY "Service role full access to agent tasks" ON agent_tasks FOR ALL USING (true);

CREATE POLICY "Service role full access to agent events" ON agent_events FOR ALL USING (true);

CREATE POLICY "Service role full access to workflows" ON agent_workflows FOR ALL USING (true);

-- Step 10: Enable Realtime for agent_events (for pub/sub)
ALTER PUBLICATION supabase_realtime ADD TABLE agent_events;

ALTER PUBLICATION supabase_realtime ADD TABLE agent_tasks;

COMMENT ON
TABLE agent_tasks IS 'Task queue for agent-to-agent work delegation';

COMMENT ON
TABLE agent_events IS 'Event bus for agent pub/sub communication';

COMMENT ON
TABLE agent_workflows IS 'Multi-agent workflow orchestration';

COMMENT ON FUNCTION emit_agent_event IS 'Publish event to agent event bus with realtime notification';

COMMENT ON FUNCTION assign_agent_task IS 'Create new task and notify target agent';

COMMENT ON FUNCTION complete_agent_task IS 'Mark task complete and notify requester';