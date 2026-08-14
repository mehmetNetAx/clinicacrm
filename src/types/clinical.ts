export interface RiskFactors {
  smoking: string;
  familyHistory: string;
  controlGap: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  type: 'lab' | 'medication' | 'imaging' | 'surgery' | 'general';
  title: string;
  detail: string;
  badgeColor?: string;
  icon?: string;
}

export interface PatientVitals {
  systolic: number;
  diastolic: number;
  heartRate: number;
  oxygenSaturation?: number;
  temperature?: number;
  bloodGlucose?: number;
  hbA1c?: number;
}

export interface CareObservation {
  id: string;
  patientId: string;
  observationType: string; // Blood Glucose, HbA1c, Blood Pressure, Heart Rate, BMI
  loincCode?: string; // e.g., '4548-4'
  valueNumber?: number;
  valueString?: string;
  unit?: string; // '%', 'mg/dL', 'mmHg', 'bpm'
  effectiveDate: string;
  status: 'preliminary' | 'final' | 'amended';
  interpretation: 'Normal' | 'High' | 'Critical' | 'Low';
  fhirJson?: Record<string, any>;
  createdAt?: string;
}

export interface SDoHRecord {
  id: string;
  patientId: string;
  category: 'Housing' | 'Food Security' | 'Transportation' | 'Lifestyle & Diet' | 'Language' | 'Social Support';
  code?: string;
  assessmentFinding: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  interventionsRecommended?: string;
  createdAt?: string;
}

export interface PayerCoverage {
  id: string;
  patientId: string;
  payerName: string;
  policyNumber: string;
  coverageStatus: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  eligibleServices: string[];
  copayRate: number;
  createdAt?: string;
}

export interface PriorAuthorization {
  id: string;
  patientId: string;
  patientName?: string;
  coverageId?: string;
  serviceName: string;
  requestedAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_INFO_NEEDED';
  aiApprovalProbability: number;
  reasoningLog?: ReasoningTraceStep[];
  createdAt?: string;
}

export interface ReasoningTraceStep {
  stepIndex: number;
  title: string;
  description: string;
  ruleCode?: string;
  status: 'PASSED' | 'WARNING' | 'FAILED' | 'INFO';
  timestamp: string;
  evaluatedData?: Record<string, any>;
}

export interface AgentGuardrail {
  agentId: string;
  agentName: string;
  maxTurnsPerSession: number;
  maxTokensPerTurn: number;
  monthlyBudgetLimitUsd: number;
  usedBudgetUsd: number;
  strictModeEnabled: boolean;
  phiMaskingEnabled: boolean;
}

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  bmi: number;
  bmiStatus: 'Normal' | 'Overweight' | 'Obese' | 'Underweight';
  lastVisit: string;
  lastVisitMonths: number;
  crmScore: number;
  recommendedAction: string;
  recommendedActionIcon: string;
  recommendedCategory: 'Cardiology' | 'Oncology' | 'Preventative' | 'Diabetes' | 'Pediatrics' | 'General';
  priority: 'URGENT' | 'MEDIUM' | 'ROUTINE';
  status: 'Active' | 'Inactive' | 'Pending';
  phone: string;
  email: string;
  avatarUrl: string;
  riskFactors: RiskFactors;
  history: HistoryItem[];
  vitals?: PatientVitals;
  aiConfidence: number;
  aiReasoning: string;
  aiRuleCode: string;
  treatmentFollowUp: string;
  recommendedFollowUpMonths?: number;
  lastVisitDate?: string;
  microSegments?: string[];
  careObservations?: CareObservation[];
  sdohRecords?: SDoHRecord[];
  payerCoverage?: PayerCoverage;
}

export interface MicroSegment {
  id: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  category: string;
  criteriaDescriptionTr: string;
  criteriaDescriptionEn: string;
  matchedPatientsCount: number;
  patientIds: string[];
  recommendedCampaignNameTr: string;
  recommendedCampaignNameEn: string;
  recommendedChannel: 'WhatsApp' | 'SMS' | 'Email' | 'Multi-Channel';
  estRevenuePerPatient: number;
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'ROUTINE';
  defaultMessageTemplateTr: string;
  defaultMessageTemplateEn: string;
  iconName: string;
}

export interface ClinicalRule {
  id: string;
  title: string;
  condition: string;
  icon: string;
  status: 'ACTIVE' | 'URGENT' | 'DRAFT';
  matchedCount: number;
  conversionRate: number;
  lastUpdated: string;
  description: string;
  estImpact?: 'High' | 'Medium' | 'Low';
  simulationCount?: number;
}
