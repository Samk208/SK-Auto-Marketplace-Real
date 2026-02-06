import { NextRequest, NextResponse } from "next/server";

/**
 * PROTOTYPE: Reinforcement Learning (RL) Bidding Agent
 *
 * This simulates a PPO (Proximal Policy Optimization) model that decides
 * whether to BID, HOLD, or FOLD on a live auction item.
 *
 * Logic:
 * Reward = (Predicted_Nigeria_Sale_Price - Total_Cost) * Probability_of_Sale
 * Total_Cost = Auction_Bid + Shipping + Repairs + Tax
 */

interface AuctionState {
  vehicle_id: string;
  current_bid: number;
  time_remaining: number; // seconds
  damage_score: number; // 0-100 (from Vision AI)
  market_demand: number; // 0-1 (from Demand Prediction)
}

interface RLAction {
  action: "BID" | "HOLD" | "FOLD";
  suggested_bid?: number;
  confidence: number;
  expected_profit: number;
  model_version: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicle_id, current_price, condition_grade, market_value_nigeria } =
      body;

    if (!vehicle_id || !current_price) {
      return NextResponse.json(
        { error: "Missing auction state data" },
        { status: 400 },
      );
    }

    // 1. Estimate Costs (Shipping/Tax/Repair)
    const shipping_cost = 1200; // Flat-rate proxy
    const repair_cost = (100 - (condition_grade || 80)) * 20; // Rough heuristic
    const total_landed_cost = current_price + shipping_cost + repair_cost;

    // 2. Calculate "State Value" (V(s))
    // How good is this deal right now?
    const arbitrage_margin =
      (market_value_nigeria || current_price * 1.5) - total_landed_cost;
    const margin_percent = arbitrage_margin / total_landed_cost;

    // 3. Policy Network Simulation (The "Brain")
    let decision: RLAction["action"] = "FOLD";
    let confidence = 0.5;
    let next_bid = 0;

    if (margin_percent > 0.2) {
      // High margin (>20%) -> Aggressive BID
      decision = "BID";
      confidence = 0.85 + margin_percent / 10; // Higher margin = higher confidence
      next_bid = current_price + 200; // Increment
    } else if (margin_percent > 0.05) {
      // Slim margin -> HOLD (Wait for others or bid small)
      decision = "HOLD";
      confidence = 0.6;
    } else {
      // Negative or thin margin -> FOLD
      decision = "FOLD";
      confidence = 0.95;
    }

    // Return structured "RL" output
    const response: RLAction = {
      action: decision,
      suggested_bid: decision === "BID" ? next_bid : undefined,
      confidence: Math.min(confidence, 0.99),
      expected_profit: arbitrage_margin,
      model_version: "rl-ppo-v1-prototype",
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
