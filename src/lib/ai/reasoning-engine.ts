/**
 * clinicaCRM Reasoning Engine (Akıl Yürütme Motoru)
 * 
 * Veriler üzerinde anlık ve şeffaf muhakeme yapan otonom karar motoru.
 * Kararlarının adımlarını Reasoning Trace olarak kaydeder.
 */

import { Patient, CareObservation, SDoHRecord, PayerCoverage, ReasoningTraceStep } from '@/types/clinical';
import { PHITrustLayer } from './trust-layer';
import { GuardrailEngine } from './guardrails';

export interface ReasoningResult {
  patientId: string;
  recommendedCategory: 'Cardiology' | 'Oncology' | 'Preventative' | 'Diabetes' | 'Pediatrics' | 'General';
  priority: 'URGENT' | 'MEDIUM' | 'ROUTINE';
  confidence: number;
  recommendedAction: string;
  reasoningSummary: string;
  traceSteps: ReasoningTraceStep[];
  preAuthNeeded: boolean;
  preAuthProbability: number;
  phiMasked: boolean;
}

export class ReasoningEngine {
  static evaluatePatient(
    patient: Patient,
    observations: CareObservation[] = [],
    sdohRecords: SDoHRecord[] = [],
    payerCoverage?: PayerCoverage,
    agentId = 'appointment-agent'
  ): ReasoningResult {
    // 1. Guardrail Check
    const guardrailCheck = GuardrailEngine.evaluateSession(agentId, 1, 500);
    if (!guardrailCheck.allowed) {
      throw new Error(guardrailCheck.reason || 'Guardrail restriction');
    }

    // 2. PHI Masking
    const { sanitizedPatient } = PHITrustLayer.sanitizePatientObject(patient);

    const traceSteps: ReasoningTraceStep[] = [];
    let now = new Date().toISOString();

    // STEP 1: Demographics & Baseline Vitals Assessment
    traceSteps.push({
      stepIndex: 1,
      title: 'Demografik ve Temel Vital Bulguların Değerlendirilmesi',
      description: `Hasta Yaşı: ${sanitizedPatient.age}, BMI: ${sanitizedPatient.bmi} (${sanitizedPatient.bmiStatus}). Risk Faktörleri incelendi.`,
      ruleCode: 'DEMO-01',
      status: sanitizedPatient.age > 65 || sanitizedPatient.bmi >= 30 ? 'WARNING' : 'PASSED',
      timestamp: now,
      evaluatedData: { age: sanitizedPatient.age, bmi: sanitizedPatient.bmi }
    });

    // STEP 2: FHIR Care Observations Deep Dive (HbA1c, Blood Glucose, Blood Pressure)
    let hasHighGlucose = false;
    let hasHighBP = false;
    let criticalObservations: string[] = [];

    const sys = patient.vitals?.systolic || 120;
    const dia = patient.vitals?.diastolic || 80;

    // Check specific Care Observations if present
    const hba1cObs = observations.find(o => o.observationType === 'HbA1c' || o.loincCode === '4548-4');
    const glucoseObs = observations.find(o => o.observationType === 'Blood Glucose' || o.loincCode === '2339-0');

    if (hba1cObs && (hba1cObs.valueNumber || 0) >= 8.0) {
      hasHighGlucose = true;
      criticalObservations.push(`HbA1c: ${hba1cObs.valueNumber}% (Kritik Yüksek)`);
    } else if (glucoseObs && (glucoseObs.valueNumber || 0) >= 180) {
      hasHighGlucose = true;
      criticalObservations.push(`Kan Glukozu: ${glucoseObs.valueNumber} mg/dL (Yüksek)`);
    }

    if (sys >= 150 || dia >= 95) {
      hasHighBP = true;
      criticalObservations.push(`Kan Basıncı: ${sys}/${dia} mmHg (Hipertansif Risk)`);
    }

    traceSteps.push({
      stepIndex: 2,
      title: 'FHIR Care Observations Klinik Analizi',
      description: criticalObservations.length > 0 
        ? `Kritik vital bulgular saptandı: ${criticalObservations.join(', ')}`
        : 'FHIR Care Observations verileri fizyolojik sınırlar dahilinde.',
      ruleCode: 'FHIR-OBS-02',
      status: criticalObservations.length > 0 ? 'FAILED' : 'PASSED',
      timestamp: new Date().toISOString(),
      evaluatedData: { observationsCount: observations.length, criticalObs: criticalObservations }
    });

    // STEP 3: SDoH (Social Determinants of Health) Integration
    const highImpactSdoh = sdohRecords.filter(s => s.impactLevel === 'High');
    traceSteps.push({
      stepIndex: 3,
      title: 'SDoH (Sosyal Belirleyiciler) ve Yaşam Tarzı Değerlendirmesi',
      description: highImpactSdoh.length > 0
        ? `Yüksek etkili sosyal engel tespit edildi: ${highImpactSdoh.map(s => s.category).join(', ')}. Müdahale planına eklendi.`
        : 'Hasta sosyal destek ve erişim açısından stabil durumda.',
      ruleCode: 'SDOH-03',
      status: highImpactSdoh.length > 0 ? 'WARNING' : 'PASSED',
      timestamp: new Date().toISOString(),
      evaluatedData: { highImpactCount: highImpactSdoh.length }
    });

    // STEP 4: Payer Eligibility & Prior Authorization Check
    let preAuthNeeded = false;
    let preAuthProb = 90;
    if (hasHighGlucose || hasHighBP || patient.priority === 'URGENT') {
      preAuthNeeded = true;
      preAuthProb = payerCoverage ? 88 : 65;
    }

    traceSteps.push({
      stepIndex: 4,
      title: 'Payer / Sigorta Kapsamı ve Ön Yetkilendirme (Prior Auth) Kontrolü',
      description: payerCoverage
        ? `Sigorta: ${payerCoverage.payerName} (Poliçe: ${payerCoverage.policyNumber}). Katkı payı oranı: %${payerCoverage.copayRate}. Ön yetkilendirme tahmini onay olasılığı: %${preAuthProb}.`
        : 'Özel sigorta kaydı bulunamadı. Genel Sağlık Sigortası kapsamı geçerli.',
      ruleCode: 'PAYER-04',
      status: payerCoverage ? 'PASSED' : 'INFO',
      timestamp: new Date().toISOString(),
      evaluatedData: { hasCoverage: !!payerCoverage, preAuthProb }
    });

    // STEP 5: Final Reasoning Synthesis & Action Recommendation
    let category: 'Cardiology' | 'Oncology' | 'Preventative' | 'Diabetes' | 'Pediatrics' | 'General' = 'General';
    let priority: 'URGENT' | 'MEDIUM' | 'ROUTINE' = 'ROUTINE';
    let recommendedAction = 'Rutin Kontrol ve Yıllık Tarama Randevusu';
    let confidence = 92;

    if (hasHighBP) {
      category = 'Cardiology';
      priority = 'URGENT';
      recommendedAction = 'Acil Kardiyoloji Konsültasyonu ve EKG / Holter Randevusu';
      confidence = 96;
    } else if (hasHighGlucose) {
      category = 'Diabetes';
      priority = 'URGENT';
      recommendedAction = 'Endokrinoloji & Diyabet Kontrolü Randevusu ve HbA1c Takip Protokolü';
      confidence = 95;
    } else if (patient.age >= 50) {
      category = 'Preventative';
      priority = 'MEDIUM';
      recommendedAction = 'Kapsamlı Onkolojik Tarama ve Check-up Randevusu';
      confidence = 90;
    }

    traceSteps.push({
      stepIndex: 5,
      title: 'Sonuç & Aksiyon Kararı (Reasoning Synthesis)',
      description: `Tavsiye Edilen Branş: ${category}, Öncelik: ${priority}, Güven Skoru: %${confidence}. Aksiyon: "${recommendedAction}"`,
      ruleCode: 'FINAL-DECISION',
      status: 'PASSED',
      timestamp: new Date().toISOString(),
      evaluatedData: { category, priority, confidence, recommendedAction }
    });

    const reasoningSummary = `Reasoning Engine ${traceSteps.length} aşamada verileri değerlendirdi. ${criticalObservations.length > 0 ? 'Kritik vital verileri (' + criticalObservations.join(', ') + ') nedeniyle ' : ''}${priority} seviyesinde ${category} yönlendirmesi kararlaştırıldı.`;

    return {
      patientId: patient.id,
      recommendedCategory: category,
      priority,
      confidence,
      recommendedAction,
      reasoningSummary,
      traceSteps,
      preAuthNeeded,
      preAuthProbability: preAuthProb,
      phiMasked: true
    };
  }
}
