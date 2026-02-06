# Command Center & Handover Implementation Plan

## Goal Description

Build the "AI Command Center" page (`/ai`) to showcase the 3 core "Production" agents (Document, Vision, Pricing) with interactive demos, and provide placeholders for Roadmap agents. Also, update the handover documentation to reflect the new "Deep Tech" strategy.

## User Review Required

- **Document AI Demo**: I will create a _mock_ "Auction sheet parser" demo since the actual OCR backend isn't ready/provided. It will simulate uploading a file and extracting fields.
- **Pricing AI**: I will hardcode sample vehicle logic for the demo unless a specific vehicle ID is provided.

## Proposed Changes

### 1. Command Center Page (`app/ai/page.tsx`)

- **Structure**: Replicate the 2x2 (or 3+2) layout from the homepage but with _functional_ demos.
- **Navigation**: Ensure hash links (`#document`, `#vision`, etc.) work.

#### [MODIFY] [page.tsx](file:///C:/Users/Lenovo/Desktop/SK%20Now%203/app/ai/page.tsx)

- Replace "NegotiatorChat", "AuctionTicker", etc. with:
  - `DocumentParserDemo` (New internal component)
  - `PublicVisionDemo` (Existing)
  - `PricingOracleDemo` (Wrapper around `DynamicPricingRecommendation`)
  - `LogisticsTracker` (Existing `CargoTracker`)
  - `BuyerMatcher` (Existing `BuyerMatchEngine` or placeholder)

### 2. New Components

#### [NEW] [components/ai/document-parser-demo.tsx](file:///C:/Users/Lenovo/Desktop/SK%20Now%203/components/ai/document-parser-demo.tsx)

- **Functionality**: Mock file upload UI -> Spinner -> Display extracted JSON/Table (VIN, Mileage, Score).

#### [NEW] [components/ai/pricing-oracle-demo.tsx](file:///C:/Users/Lenovo/Desktop/SK%20Now%203/components/ai/pricing-oracle-demo.tsx)

- **Functionality**: Wrapper for `DynamicPricingRecommendation` that passes sample data (e.g., 2020 Hyundai Sonata) so it renders immediately without user input.

### 3. Handover Documentation

#### [NEW] [AGENT_HANDOVER.md](file:///C:/Users/Lenovo/Desktop/SK%20Now%203/AGENT_HANDOVER.md)

- Replace `AGENT_HANDOVER.txt`.
- **Content**:
  - **Current Status**: Frontend Demos ready (Tier 1). Backend logic partially implemented.
  - **Tier 1 Agents**:
    - Document AI: Needs OCR backend (Google Vision/AWS Textract).
    - Vision AI: Needs Computer Vision model hosting.
    - Pricing AI: Needs real market data feeds (currently using internal algorithms).
  - **Legacy**: WhatsApp/Negotiator (moved to background/deprecated for MVP pitch).

## Verification Plan

- **Manual**:
  - Navigate to `/ai`.
  - Click "Launch Command Center" from Home.
  - Verify all 3 Production demos work (Vision scans, Document parses, Pricing calculates).
  - Verify Roadmap agents show "Coming Soon" state.
