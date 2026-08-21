export interface ScoringRule {
  id: string;
  rule_name: string;
  category: "LOCATION" | "BUDGET" | "TREATMENT" | "ENGAGEMENT" | "ACUITY";
  condition_key: string;
  operator: "EQUALS" | "CONTAINS" | "GREATER_THAN" | "LESS_THAN";
  condition_value: string;
  score_points: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface PatientLeadData {
  country?: string;
  budget_eur?: number;
  treatment_category?: string;
  priority?: string;
  whatsapp_replied?: boolean;
  last_visit_months?: number;
}

export interface ScoreResult {
  totalScore: number;
  tier: "VIP / HIGH INTENT" | "WARM LEAD" | "STANDARD" | "LOW PRIORITY";
  matchedRules: { ruleName: string; points: number }[];
}

export const DEFAULT_SCORING_RULES: ScoringRule[] = [
  {
    id: "rule-1",
    rule_name: "Hedef Ülke (İngiltere / Almanya / ABD)",
    category: "LOCATION",
    condition_key: "country",
    operator: "CONTAINS",
    condition_value: "UK,Germany,United Kingdom,Almanya,USA,US",
    score_points: 30,
    status: "ACTIVE",
  },
  {
    id: "rule-2",
    rule_name: "Yüksek Tedavi Bütçesi (> 4.000 €)",
    category: "BUDGET",
    condition_key: "budget_eur",
    operator: "GREATER_THAN",
    condition_value: "4000",
    score_points: 25,
    status: "ACTIVE",
  },
  {
    id: "rule-3",
    rule_name: "Geniş Kapsamlı Tedavi (Ağız Diş / Saç / Obezite)",
    category: "TREATMENT",
    condition_key: "treatment_category",
    operator: "CONTAINS",
    condition_value: "Dental,Implants,Hair,Bariatric,Ağız,Saç,Cerrahi",
    score_points: 20,
    status: "ACTIVE",
  },
  {
    id: "rule-4",
    rule_name: "WhatsApp Hızlı Etkileşim Yanıtı",
    category: "ENGAGEMENT",
    condition_key: "whatsapp_replied",
    operator: "EQUALS",
    condition_value: "true",
    score_points: 15,
    status: "ACTIVE",
  },
  {
    id: "rule-5",
    rule_name: "Acil Klinik Öncelik Kaydı",
    category: "ACUITY",
    condition_key: "priority",
    operator: "EQUALS",
    condition_value: "URGENT",
    score_points: 10,
    status: "ACTIVE",
  },
];

export function calculatePatientScore(
  patient: PatientLeadData,
  rules: ScoringRule[] = DEFAULT_SCORING_RULES
): ScoreResult {
  let totalScore = 0;
  const matchedRules: { ruleName: string; points: number }[] = [];

  for (const rule of rules) {
    if (rule.status !== "ACTIVE") continue;

    let matched = false;
    const value = patient[rule.condition_key as keyof PatientLeadData];

    if (value === undefined || value === null) continue;

    if (rule.operator === "EQUALS") {
      matched = String(value).toLowerCase() === rule.condition_value.toLowerCase();
    } else if (rule.operator === "CONTAINS") {
      const allowed = rule.condition_value.split(",").map((s) => s.trim().toLowerCase());
      matched = allowed.some((item) => String(value).toLowerCase().includes(item));
    } else if (rule.operator === "GREATER_THAN") {
      matched = Number(value) > Number(rule.condition_value);
    } else if (rule.operator === "LESS_THAN") {
      matched = Number(value) < Number(rule.condition_value);
    }

    if (matched) {
      totalScore += rule.score_points;
      matchedRules.push({
        ruleName: rule.rule_name,
        points: rule.score_points,
      });
    }
  }

  let tier: ScoreResult["tier"] = "STANDARD";
  if (totalScore >= 70) tier = "VIP / HIGH INTENT";
  else if (totalScore >= 45) tier = "WARM LEAD";
  else if (totalScore < 20) tier = "LOW PRIORITY";

  return { totalScore, tier, matchedRules };
}
