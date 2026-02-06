# 🚀 DEALER DASHBOARD IMPLEMENTATION - QUICK START GUIDE

**Date:** December 9, 2025  
**Status:** Ready for Implementation  
**Estimated Time:** 4-5 weeks

---

## ✅ WHAT'S BEEN DONE

I've completed the **foundation phase** for the SK AutoSphere Dealer Dashboard & Onboarding system:

### 1. **Database Schema Created** ✅

- **File:** `supabase/migrations/20251209_016_dealer_onboarding_system.sql`
- **Tables:** 8 new tables for complete dealer system
- **Features:** Auto-generated IDs, RLS policies, triggers, functions
- **Status:** Ready to apply

### 2. **TypeScript Types Created** ✅

- **File:** `types/dealer.ts`
- **Interfaces:** 30+ type definitions
- **Coverage:** All database tables, forms, API responses
- **Status:** Ready to use

### 3. **Documentation Created** ✅

- **Implementation Plan:** `docs/DEALER_DASHBOARD_IMPLEMENTATION_PLAN.md`
- **Status Document:** `docs/DEALER_IMPLEMENTATION_STATUS.md`
- **Wireframes:** `docs/SK AUTOSPHERE DEALER DASHBOARD & ONBOA.ini`

---

## 🎯 NEXT STEPS (DO THIS NOW)

### Step 1: Apply Database Migration

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to: https://supabase.com/dashboard/project/ocunqerefbqkjxabase/sql/new
2. Open file: `supabase/migrations/20251209_016_dealer_onboarding_system.sql`
3. Copy the entire content
4. Paste into Supabase SQL Editor
5. Click "Run"
6. Verify success (should see "Success. No rows returned")

**Option B: Using Supabase CLI**

```bash
cd "C:\Users\Lenovo\Desktop\SK Now 3"
supabase db push
```

### Step 2: Create Storage Buckets

Go to Supabase Dashboard → Storage → Create new buckets:

1. **dealer-documents**
   - Public: No
   - File size limit: 10MB
   - Allowed MIME types: `image/*, application/pdf`

2. **dealer-lot-photos**
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

3. **listing-photos**
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

4. **listing-videos**
   - Public: Yes
   - File size limit: 50MB
   - Allowed MIME types: `video/*`

### Step 3: Set Up Storage Policies

For each bucket, add RLS policies in Supabase Dashboard:

```sql
-- dealer-documents (Private)
CREATE POLICY "Dealers can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dealer-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Dealers can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'dealer-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- listing-photos (Public)
CREATE POLICY "Anyone can view listing photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-photos');

CREATE POLICY "Dealers can upload listing photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'listing-photos');
```

### Step 4: Verify Database Setup

Run this query in Supabase SQL Editor to verify:

```sql
-- Check if all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'dealer_applications',
  'dealer_documents',
  'dealer_bank_accounts',
  'dealer_earnings',
  'dealer_withdrawals',
  'dealer_analytics',
  'listing_photos',
  'ai_damage_reports'
);

-- Should return 8 rows
```

---

## 🏗️ START BUILDING - PHASE 1

### Week 1: Dealer Onboarding Flow

#### Task 1.1: Create "Become a Dealer" Landing Page

**Create file:** `app/dealers/become-dealer/page.tsx`

```tsx
import { Metadata } from "next";
import BecomeDealerHero from "@/components/dealers/become-dealer-hero";
import BenefitsGrid from "@/components/dealers/benefits-grid";
import TrustSignals from "@/components/dealers/trust-signals";
import DealerCTA from "@/components/dealers/dealer-cta-section";

export const metadata: Metadata = {
  title: "Become a Dealer | SK AutoSphere",
  description:
    "Sell Korean cars to Africa. Reach 54 countries with one listing.",
};

export default function BecomeDealerPage() {
  return (
    <div className="min-h-screen">
      <BecomeDealerHero />
      <BenefitsGrid />
      <TrustSignals />
      <DealerCTA />
    </div>
  );
}
```

**Create components:**

1. `components/dealers/become-dealer-hero.tsx`
   - Hero section with Plus Grid pattern background
   - Main headline: "SELL KOREAN CARS TO AFRICA"
   - Subheadline: "Reach 54 countries with one listing"
   - CTA buttons: "Become a Dealer →" and "Learn More"

2. `components/dealers/benefits-grid.tsx`
   - 6 benefit cards in 3x2 grid
   - Cards: 10% Fee, Safe Escrow, 54 Markets, Logistics, AI Tools, WhatsApp
   - Use icons from `lucide-react`
   - Follow style guide: `rounded-xl`, `shadow-sm`

3. `components/dealers/trust-signals.tsx`
   - Display real statistics
   - "Current Dealers Earning"
   - Average and top dealer earnings
   - Use large, bold numbers

4. `components/dealers/dealer-cta-section.tsx`
   - Final CTA section
   - "Start Selling Now →" button
   - Links to resources

#### Task 1.2: Create Registration Flow

**Create file:** `app/dealers/register/page.tsx`

```tsx
"use client";

import { useState } from "react";
import RegistrationStepper from "@/components/dealers/registration/registration-stepper";
import Step1DealerType from "@/components/dealers/registration/step-1-dealer-type";
import Step2BusinessInfo from "@/components/dealers/registration/step-2-business-info";
import Step3Documents from "@/components/dealers/registration/step-3-documents";
import Step4BankAccount from "@/components/dealers/registration/step-4-bank-account";
import Step5DepositAgreement from "@/components/dealers/registration/step-5-deposit-agreement";
import Step6VerificationPending from "@/components/dealers/registration/step-6-verification-pending";

export default function DealerRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const steps = [
    { number: 1, title: "Dealer Type", component: Step1DealerType },
    { number: 2, title: "Business Info", component: Step2BusinessInfo },
    { number: 3, title: "Documents", component: Step3Documents },
    { number: 4, title: "Bank Account", component: Step4BankAccount },
    {
      number: 5,
      title: "Deposit & Agreement",
      component: Step5DepositAgreement,
    },
    { number: 6, title: "Verification", component: Step6VerificationPending },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <RegistrationStepper steps={steps} currentStep={currentStep} />

        <CurrentStepComponent
          formData={formData}
          setFormData={setFormData}
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
        />
      </div>
    </div>
  );
}
```

**Create components directory:**

```bash
mkdir -p components/dealers/registration
```

**Create each step component:**

1. `registration-stepper.tsx` - Progress indicator
2. `step-1-dealer-type.tsx` - Radio card selection
3. `step-2-business-info.tsx` - Form with auto-save
4. `step-3-documents.tsx` - File upload with drag & drop
5. `step-4-bank-account.tsx` - Bank details form
6. `step-5-deposit-agreement.tsx` - Deposit info & terms
7. `step-6-verification-pending.tsx` - Success screen

#### Task 1.3: Create API Routes

**Create file:** `app/api/dealers/register/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DealerApplicationFormData } from "@/types/dealer";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const formData: DealerApplicationFormData = await request.json();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Insert dealer application
    const { data, error } = await supabase
      .from("dealer_applications")
      .insert({
        user_id: user.id,
        dealer_type: formData.dealer_type,
        business_name: formData.business_name,
        business_registration_number: formData.business_registration_number,
        // ... rest of fields
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    // Send confirmation email
    // await sendDealerApplicationEmail(data)

    return NextResponse.json({
      success: true,
      data,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

## 📚 REFERENCE MATERIALS

### Design System

- **Primary Color:** `#2558fa` (Electric Blue)
- **Font:** Geist Sans
- **Plus Grid Pattern:** Available in style guide
- **Components:** Use shadcn/ui components from `components/ui/`

### Example Code Patterns

**Card Component:**

```tsx
<Card className="rounded-xl shadow-sm border-slate-200">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

**Button with Primary Color:**

```tsx
<Button className="bg-[#2558fa] hover:bg-[#1a3ec1]">Click Me</Button>
```

**Plus Grid Background:**

```tsx
<div
  className="bg-gradient-to-br from-[#2558fa] via-[#4f7aff] to-[#7c9dff]"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  }}
>
  Content
</div>
```

---

## 🔍 TESTING CHECKLIST

After implementing each component:

- [ ] Component renders without errors
- [ ] Follows style guide (colors, spacing, typography)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility: keyboard navigation works
- [ ] Form validation works correctly
- [ ] Loading states display properly
- [ ] Error states handled gracefully

---

## 📞 NEED HELP?

### Common Issues:

**Issue:** Migration fails
**Solution:** Copy SQL manually to Supabase Dashboard SQL Editor

**Issue:** Types not found
**Solution:** Restart TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

**Issue:** Supabase client errors
**Solution:** Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Resources:

- **Wireframes:** `docs/SK AUTOSPHERE DEALER DASHBOARD & ONBOA.ini`
- **Implementation Plan:** `docs/DEALER_DASHBOARD_IMPLEMENTATION_PLAN.md`
- **Types:** `types/dealer.ts`
- **Style Guide:** `docs/STYLE-GUIDE.md`

---

## 🎉 SUCCESS CRITERIA

You'll know you're on track when:

1. ✅ Database migration applied successfully
2. ✅ Storage buckets created
3. ✅ "Become a Dealer" page loads and looks great
4. ✅ Registration flow Step 1 works
5. ✅ Form data saves to database

---

**Ready to start?** Begin with **Step 1: Apply Database Migration** above! 🚀

**Questions?** Check the implementation plan or wireframes document.

**Last Updated:** December 9, 2025, 6:24 PM KST
