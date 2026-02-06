export type SafetyViolationType =
  | "unauthorized_discount"
  | "false_condition"
  | "payment_scam"
  | "policy_violation";

export type SafetyAction = "block" | "flag" | "active_intervention";

export interface SafetyViolation {
  type: SafetyViolationType;
  severity: "HIGH" | "MEDIUM" | "LOW";
  excerpt: string;
  action: SafetyAction;
}

export interface SafetyCheckResult {
  safe: boolean;
  violations: SafetyViolation[];
  action: "send" | "block" | "human_review";
  modifiedResponse?: string;
}

export class FinancialSafetyLayer {
  private static DISCOUNT_LIMIT = 100; // Max $100 discount without auth

  // Regex Patterns
  private static PATTERNS = {
    payment_scam: [
      /western union/i,
      /moneygram/i,
      /bitcoin|crypto|usdt|eth/i,
      /personal account/i,
      /cash in hand/i,
      /whatsapp transfer/i,
    ],
    unauthorized_discount: [
      /(take|accept) \$[0-9]+/i,
      /discount of [0-9]+%/i,
      /(give|offer) you [0-9]+% off/i,
      /lower the price to/i,
      /best price is/i,
    ],
    false_condition: [
      /perfect condition/i,
      /like new/i,
      /never been in an accident/i,
      /guaranteed engine/i,
      /no scratches/i,
    ],
    policy: [/skip customs/i, /avoid tax/i, /undervalue the invoice/i],
  };

  static checkResponse(response: string): SafetyCheckResult {
    const violations: SafetyViolation[] = [];

    // 1. Payment Scams (High)
    for (const pattern of this.PATTERNS.payment_scam) {
      if (pattern.test(response)) {
        violations.push({
          type: "payment_scam",
          severity: "HIGH",
          excerpt: this.extractExcerpt(response, pattern),
          action: "block",
        });
      }
    }

    // 2. Unauthorized Discounts (Medium)
    for (const pattern of this.PATTERNS.unauthorized_discount) {
      if (pattern.test(response)) {
        // Exception: "I cannot give you 50% off"
        if (/(cannot|not|can't).*(discount|lower|offer)/i.test(response))
          continue;

        violations.push({
          type: "unauthorized_discount",
          severity: "MEDIUM",
          excerpt: this.extractExcerpt(response, pattern),
          action: "flag", // In a real app, this might trigger a 'Draft' state
        });
      }
    }

    // 3. Claims
    for (const pattern of this.PATTERNS.false_condition) {
      if (pattern.test(response)) {
        violations.push({
          type: "false_condition",
          severity: "HIGH",
          excerpt: this.extractExcerpt(response, pattern),
          action: "block",
        });
      }
    }

    // Determine Logic
    if (violations.some((v) => v.severity === "HIGH")) {
      return { safe: false, violations, action: "block" };
    }
    if (violations.some((v) => v.severity === "MEDIUM")) {
      // For prototype, we might block or flag. Let's flag.
      return { safe: true, violations, action: "human_review" };
    }

    return { safe: true, violations: [], action: "send" };
  }

  private static extractExcerpt(text: string, pattern: RegExp): string {
    const match = text.match(pattern);
    return match ? match[0] : "Pattern match";
  }
}
