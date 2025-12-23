-- ============================================
-- MEMBERSHIP & NOTIFICATION SYSTEM MIGRATION
-- Applied: December 8, 2025
--
-- References:
-- - GitHub Sponsors: https://github.com/sponsors
-- - Stripe Subscriptions: https://stripe.com/docs/billing/subscriptions
-- - Novu: https://github.com/novuhq/novu
-- ============================================

-- ============================================
-- PART 1: MEMBERSHIP SYSTEM
-- ============================================

-- 1. Membership Tiers Table
CREATE TABLE IF NOT EXISTS public.membership_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    tier_level INTEGER NOT NULL DEFAULT 0,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_yearly DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    benefits JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '{}'::jsonb,
    stripe_price_id_monthly TEXT,
    stripe_price_id_yearly TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Memberships Table
CREATE TABLE IF NOT EXISTS public.user_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    tier_id UUID REFERENCES public.membership_tiers (id),
    tier TEXT NOT NULL DEFAULT 'BRONZE',
    tier_level INTEGER NOT NULL DEFAULT 0,
    billing_cycle TEXT CHECK (
        billing_cycle IN (
            'monthly',
            'yearly',
            'lifetime',
            'free'
        )
    ) DEFAULT 'free',
    status TEXT CHECK (
        status IN (
            'active',
            'expired',
            'cancelled',
            'past_due',
            'trialing'
        )
    ) DEFAULT 'active',
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    total_purchases DECIMAL(12, 2) DEFAULT 0,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id)
);

-- 3. Membership History Table
CREATE TABLE IF NOT EXISTS public.membership_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    previous_tier TEXT,
    new_tier TEXT NOT NULL,
    change_type TEXT CHECK (
        change_type IN (
            'upgrade',
            'downgrade',
            'renewal',
            'cancellation',
            'auto_upgrade',
            'initial'
        )
    ) NOT NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON public.user_memberships (user_id);

CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON public.user_memberships (status);

CREATE INDEX IF NOT EXISTS idx_user_memberships_tier ON public.user_memberships (tier);

CREATE INDEX IF NOT EXISTS idx_membership_history_user_id ON public.membership_history (user_id);

-- 5. RLS Policies
ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.membership_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view membership tiers" ON public.membership_tiers FOR
SELECT USING (is_active = true);

CREATE POLICY "Users can view own membership" ON public.user_memberships FOR
SELECT USING (
        user_id = (
            SELECT auth.uid ()
        )
    );

CREATE POLICY "System can manage memberships" ON public.user_memberships FOR ALL USING (
    (
        SELECT auth.uid ()
    ) IS NOT NULL
    AND (
        user_id = (
            SELECT auth.uid ()
        )
        OR (
            (
                SELECT auth.jwt ()
            ) ->> 'email'
        ) LIKE '%@skautosphere.com'
    )
);

CREATE POLICY "Users can view own membership history" ON public.membership_history FOR
SELECT USING (
        user_id = (
            SELECT auth.uid ()
        )
    );

-- 6. Seed default membership tiers
INSERT INTO
    public.membership_tiers (
        name,
        display_name,
        tier_level,
        price_monthly,
        price_yearly,
        benefits,
        features
    )
VALUES (
        'BRONZE',
        'Bronze',
        0,
        0,
        0,
        '["Browse all listings", "Standard pricing", "Basic support", "3 inquiries per month"]'::jsonb,
        '{"max_inquiries": 3, "discount_percent": 0, "early_access_hours": 0}'::jsonb
    ),
    (
        'SILVER',
        'Silver',
        1,
        9.99,
        99,
        '["5% discount on purchases", "24h early access to new listings", "Free condition report (1/month)", "Priority support", "Unlimited inquiries"]'::jsonb,
        '{"max_inquiries": -1, "discount_percent": 5, "early_access_hours": 24, "free_condition_reports": 1}'::jsonb
    ),
    (
        'GOLD',
        'Gold',
        2,
        29.99,
        299,
        '["10% discount on purchases", "48h early access", "Unlimited condition reports", "Free spare parts ($500 value)", "Dedicated account manager", "Access to auction-only vehicles"]'::jsonb,
        '{"max_inquiries": -1, "discount_percent": 10, "early_access_hours": 48, "free_condition_reports": -1, "auction_access": true}'::jsonb
    ),
    (
        'PLATINUM',
        'Platinum',
        3,
        99.99,
        999,
        '["15% bulk discount", "72h exclusive access", "Free inspections", "Market analytics dashboard", "Preferential shipping rates", "Trade-in program", "VIP support"]'::jsonb,
        '{"max_inquiries": -1, "discount_percent": 15, "early_access_hours": 72, "free_condition_reports": -1, "auction_access": true, "analytics_access": true, "trade_in": true}'::jsonb
    )
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- PART 2: NOTIFICATION TEMPLATES
-- ============================================

-- 1. Notification Templates Table
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    title_template TEXT NOT NULL,
    message_template TEXT NOT NULL,
    action_url_template TEXT,
    action_label TEXT,
    priority TEXT CHECK (
        priority IN (
            'low',
            'normal',
            'high',
            'urgent'
        )
    ) DEFAULT 'normal',
    channels JSONB DEFAULT '["in_app"]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    in_app_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    whatsapp_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, category)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_notification_templates_slug ON public.notification_templates (slug);

CREATE INDEX IF NOT EXISTS idx_notification_templates_category ON public.notification_templates (category);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences (user_id);

-- 4. RLS Policies
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates" ON public.notification_templates FOR
SELECT USING (is_active = true);

CREATE POLICY "Users can manage own preferences" ON public.notification_preferences FOR ALL USING (
    user_id = (
        SELECT auth.uid ()
    )
);

-- 5. Seed notification templates
INSERT INTO
    public.notification_templates (
        slug,
        name,
        category,
        title_template,
        message_template,
        action_url_template,
        action_label,
        priority,
        channels
    )
VALUES (
        'order_confirmed',
        'Order Confirmed',
        'order',
        'Order Confirmed: {{vehicle_name}}',
        'Your order #{{order_number}} has been confirmed. Payment is now held securely in escrow.',
        '/orders/{{order_id}}',
        'View Order',
        'high',
        '["in_app", "email", "push"]'::jsonb
    ),
    (
        'order_shipped',
        'Order Shipped',
        'order',
        'Your Vehicle is On Its Way!',
        'Great news! {{vehicle_name}} has been shipped. Estimated arrival: {{eta}}.',
        '/orders/{{order_id}}/tracking',
        'Track Shipment',
        'high',
        '["in_app", "email", "push", "whatsapp"]'::jsonb
    ),
    (
        'order_delivered',
        'Order Delivered',
        'order',
        'Vehicle Delivered Successfully',
        'Your {{vehicle_name}} has been delivered! Please confirm receipt to release payment.',
        '/orders/{{order_id}}',
        'Confirm Delivery',
        'urgent',
        '["in_app", "email", "push", "whatsapp"]'::jsonb
    ),
    (
        'listing_approved',
        'Listing Approved',
        'listing',
        'Your Listing is Now Live!',
        'Great news! Your listing "{{listing_title}}" has been approved and is now visible to buyers.',
        '/dealer/listings/{{listing_id}}',
        'View Listing',
        'normal',
        '["in_app", "email"]'::jsonb
    ),
    (
        'new_inquiry',
        'New Inquiry',
        'listing',
        'New Inquiry for {{vehicle_name}}',
        'You have a new inquiry from {{buyer_name}} about your {{vehicle_name}}.',
        '/dealer/inquiries/{{inquiry_id}}',
        'View Inquiry',
        'high',
        '["in_app", "email", "push"]'::jsonb
    ),
    (
        'payment_received',
        'Payment Received',
        'payment',
        'Payment Received: ${{amount}}',
        'Payment of ${{amount}} has been received and secured in escrow for order #{{order_number}}.',
        '/orders/{{order_id}}',
        'View Order',
        'high',
        '["in_app", "email"]'::jsonb
    ),
    (
        'membership_upgraded',
        'Membership Upgraded',
        'system',
        'Welcome to {{tier_name}} Membership!',
        'Congratulations! You have been upgraded to {{tier_name}} membership. Enjoy your new benefits!',
        '/membership',
        'View Benefits',
        'normal',
        '["in_app", "email"]'::jsonb
    )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PART 3: HELPER FUNCTIONS
-- ============================================

-- Function to get user's current membership
CREATE OR REPLACE FUNCTION public.get_user_membership(p_user_id UUID)
RETURNS TABLE (
  tier TEXT,
  tier_level INTEGER,
  status TEXT,
  discount_percent INTEGER,
  features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(um.tier, 'BRONZE'),
    COALESCE(um.tier_level, 0),
    COALESCE(um.status, 'active'),
    COALESCE((mt.features->>'discount_percent')::INTEGER, 0),
    COALESCE(mt.features, '{}'::jsonb)
  FROM public.user_memberships um
  LEFT JOIN public.membership_tiers mt ON um.tier = mt.name
  WHERE um.user_id = p_user_id
  AND um.status = 'active';
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 'BRONZE'::TEXT, 0, 'active'::TEXT, 0, '{}'::JSONB;
  END IF;
END;
$$;

-- Function to create notification from template
CREATE OR REPLACE FUNCTION public.create_notification_from_template(
  p_user_id UUID,
  p_template_slug TEXT,
  p_variables JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_template RECORD;
  v_title TEXT;
  v_message TEXT;
  v_action_url TEXT;
  v_notification_id UUID;
  v_key TEXT;
  v_value TEXT;
BEGIN
  SELECT * INTO v_template
  FROM public.notification_templates
  WHERE slug = p_template_slug AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found: %', p_template_slug;
  END IF;
  
  v_title := v_template.title_template;
  v_message := v_template.message_template;
  v_action_url := v_template.action_url_template;
  
  FOR v_key, v_value IN SELECT * FROM jsonb_each_text(p_variables)
  LOOP
    v_title := replace(v_title, '{{' || v_key || '}}', v_value);
    v_message := replace(v_message, '{{' || v_key || '}}', v_value);
    IF v_action_url IS NOT NULL THEN
      v_action_url := replace(v_action_url, '{{' || v_key || '}}', v_value);
    END IF;
  END LOOP;
  
  INSERT INTO public.notifications (user_id, type, title, message, action_url)
  VALUES (p_user_id, v_template.category, v_title, v_message, v_action_url)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;