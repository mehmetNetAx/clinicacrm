import { createClient } from '@/lib/supabase/client';
import { Patient, MicroSegment, ClinicalRule } from '@/types/clinical';
import { mockPatients, mockMicroSegments, mockClinicalRules } from './mock-data';

// --- Data Mappers (snake_case DB <-> camelCase TS) ---

export function mapDbToPatient(row: any): Patient {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials || row.name.split(' ').map((n: string) => n[0]).join('.').toUpperCase(),
    age: Number(row.age),
    gender: row.gender,
    bloodType: row.blood_type,
    bmi: Number(row.bmi || 24.0),
    bmiStatus: row.bmi_status || 'Normal',
    lastVisit: row.last_visit ? String(row.last_visit) : new Date().toISOString().split('T')[0],
    lastVisitMonths: Number(row.last_visit_months || 0),
    crmScore: Number(row.crm_score || 70),
    recommendedAction: row.recommended_action || '',
    recommendedActionIcon: row.recommended_action_icon || 'HeartPulse',
    recommendedCategory: row.recommended_category || 'General',
    priority: row.priority || 'ROUTINE',
    status: row.status || 'Active',
    phone: row.phone || '',
    email: row.email || '',
    avatarUrl: row.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    riskFactors: row.risk_factors || { smoking: 'None', familyHistory: 'None', controlGap: 'None' },
    history: Array.isArray(row.history) ? row.history : [],
    vitals: row.vitals || { systolic: 120, diastolic: 80, heartRate: 72 },
    aiConfidence: Number(row.ai_confidence || 90),
    aiReasoning: row.ai_reasoning || '',
    aiRuleCode: row.ai_rule_code || 'RULE-01',
    treatmentFollowUp: row.treatment_follow_up || '',
    recommendedFollowUpMonths: row.recommended_follow_up_months ? Number(row.recommended_follow_up_months) : undefined,
  };
}

export function mapPatientToDb(patient: Patient): any {
  return {
    id: patient.id,
    name: patient.name,
    initials: patient.initials,
    age: patient.age,
    gender: patient.gender,
    blood_type: patient.bloodType,
    bmi: patient.bmi,
    bmi_status: patient.bmiStatus,
    last_visit: patient.lastVisit,
    last_visit_months: patient.lastVisitMonths,
    crm_score: patient.crmScore,
    recommended_action: patient.recommendedAction,
    recommended_action_icon: patient.recommendedActionIcon,
    recommended_category: patient.recommendedCategory,
    priority: patient.priority,
    status: patient.status,
    phone: patient.phone,
    email: patient.email,
    avatar_url: patient.avatarUrl,
    risk_factors: patient.riskFactors,
    history: patient.history,
    vitals: patient.vitals,
    ai_confidence: patient.aiConfidence,
    ai_reasoning: patient.aiReasoning,
    ai_rule_code: patient.aiRuleCode,
    treatment_follow_up: patient.treatmentFollowUp,
    recommended_follow_up_months: patient.recommendedFollowUpMonths ?? null,
    updated_at: new Date().toISOString()
  };
}

export function mapDbToMicroSegment(row: any): MicroSegment {
  return {
    id: row.id,
    titleTr: row.title_tr,
    titleEn: row.title_en || '',
    descriptionTr: row.description_tr || '',
    descriptionEn: row.description_en || '',
    category: row.category || '',
    criteriaDescriptionTr: row.criteria_description_tr || '',
    criteriaDescriptionEn: row.criteria_description_en || '',
    matchedPatientsCount: Number(row.matched_patients_count || 0),
    patientIds: Array.isArray(row.patient_ids) ? row.patient_ids : [],
    recommendedCampaignNameTr: row.recommended_campaign_name_tr || '',
    recommendedCampaignNameEn: row.recommended_campaign_name_en || '',
    recommendedChannel: row.recommended_channel || 'WhatsApp',
    estRevenuePerPatient: Number(row.est_revenue_per_patient || 0),
    urgencyLevel: row.urgency_level || 'ROUTINE',
    defaultMessageTemplateTr: row.default_message_template_tr || '',
    defaultMessageTemplateEn: row.default_message_template_en || '',
    iconName: row.icon_name || 'Layers',
  };
}

export function mapMicroSegmentToDb(seg: MicroSegment): any {
  return {
    id: seg.id,
    title_tr: seg.titleTr,
    title_en: seg.titleEn,
    description_tr: seg.descriptionTr,
    description_en: seg.descriptionEn,
    category: seg.category,
    criteria_description_tr: seg.criteriaDescriptionTr,
    criteria_description_en: seg.criteriaDescriptionEn,
    matched_patients_count: seg.matchedPatientsCount,
    patient_ids: seg.patientIds,
    recommended_campaign_name_tr: seg.recommendedCampaignNameTr,
    recommended_campaign_name_en: seg.recommendedCampaignNameEn,
    recommended_channel: seg.recommendedChannel,
    est_revenue_per_patient: seg.estRevenuePerPatient,
    urgency_level: seg.urgencyLevel,
    default_message_template_tr: seg.defaultMessageTemplateTr,
    default_message_template_en: seg.defaultMessageTemplateEn,
    icon_name: seg.iconName,
  };
}

export function mapDbToClinicalRule(row: any): ClinicalRule {
  return {
    id: row.id,
    title: row.title,
    condition: row.condition,
    icon: row.icon || 'FlaskConical',
    status: row.status || 'ACTIVE',
    matchedCount: Number(row.matched_count || 0),
    conversionRate: Number(row.conversion_rate || 0),
    lastUpdated: row.last_updated ? String(row.last_updated) : new Date().toISOString().split('T')[0],
    description: row.description || '',
    estImpact: row.est_impact || 'Medium',
  };
}

export function mapClinicalRuleToDb(rule: ClinicalRule): any {
  return {
    id: rule.id,
    title: rule.title,
    condition: rule.condition,
    icon: rule.icon,
    status: rule.status,
    matched_count: rule.matchedCount,
    conversion_rate: rule.conversionRate,
    last_updated: rule.lastUpdated,
    description: rule.description,
    est_impact: rule.estImpact,
  };
}

// --- Service Methods ---

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Try to seed initial mock patients if table is empty
      if (!error && data && data.length === 0) {
        await seedInitialPatients();
        return mockPatients;
      }
      return mockPatients;
    }

    return data.map(mapDbToPatient);
  } catch (err) {
    console.warn('Supabase fetchPatients error, fallback to mockPatients:', err);
    return mockPatients;
  }
}

export async function createPatient(patient: Patient): Promise<Patient> {
  try {
    const supabase = createClient();
    const dbPayload = mapPatientToDb(patient);
    const { data, error } = await supabase
      .from('patients')
      .insert(dbPayload)
      .select('*')
      .single();

    if (error || !data) {
      console.warn('Supabase createPatient insert fallback:', error);
      return patient;
    }

    return mapDbToPatient(data);
  } catch (err) {
    console.warn('Supabase createPatient error:', err);
    return patient;
  }
}

export async function updatePatientTriage(
  patientId: string,
  triageNote: string,
  additionalHistory?: any
): Promise<Patient | null> {
  try {
    const supabase = createClient();
    
    // First fetch existing patient
    const { data: existing, error: fetchErr } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (fetchErr || !existing) {
      console.warn('Supabase updatePatientTriage fetch warning:', fetchErr);
      return null;
    }

    const currentHistory = Array.isArray(existing.history) ? existing.history : [];
    const newHistoryItem = additionalHistory || {
      id: `h-triage-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'general',
      title: 'Hekim Triyaj Kararı',
      detail: triageNote,
      badgeColor: 'bg-primary/10 text-primary'
    };

    const updatedHistory = [newHistoryItem, ...currentHistory];

    const { data: updated, error: updateErr } = await supabase
      .from('patients')
      .update({
        treatment_follow_up: triageNote,
        history: updatedHistory,
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId)
      .select('*')
      .single();

    if (updateErr || !updated) {
      console.warn('Supabase updatePatientTriage update error:', updateErr);
      return null;
    }

    return mapDbToPatient(updated);
  } catch (err) {
    console.warn('Supabase updatePatientTriage exception:', err);
    return null;
  }
}

export async function fetchMicroSegments(): Promise<MicroSegment[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('micro_segments')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      if (!error && data && data.length === 0) {
        await seedInitialMicroSegments();
        return mockMicroSegments;
      }
      return mockMicroSegments;
    }

    return data.map(mapDbToMicroSegment);
  } catch (err) {
    console.warn('Supabase fetchMicroSegments fallback to mock:', err);
    return mockMicroSegments;
  }
}

export async function fetchClinicalRules(): Promise<ClinicalRule[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clinical_rules')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      if (!error && data && data.length === 0) {
        await seedInitialClinicalRules();
        return mockClinicalRules;
      }
      return mockClinicalRules;
    }

    return data.map(mapDbToClinicalRule);
  } catch (err) {
    console.warn('Supabase fetchClinicalRules fallback to mock:', err);
    return mockClinicalRules;
  }
}

export async function createClinicalRule(rule: ClinicalRule): Promise<ClinicalRule> {
  try {
    const supabase = createClient();
    const dbPayload = mapClinicalRuleToDb(rule);
    const { data, error } = await supabase
      .from('clinical_rules')
      .insert(dbPayload)
      .select('*')
      .single();

    if (error || !data) {
      console.warn('Supabase createClinicalRule fallback:', error);
      return rule;
    }

    return mapDbToClinicalRule(data);
  } catch (err) {
    console.warn('Supabase createClinicalRule exception:', err);
    return rule;
  }
}

// --- Seeding Helpers ---

async function seedInitialPatients() {
  try {
    const supabase = createClient();
    const payload = mockPatients.map(mapPatientToDb);
    await supabase.from('patients').upsert(payload);
  } catch (e) {
    console.warn('Seeding patients skipped:', e);
  }
}

async function seedInitialMicroSegments() {
  try {
    const supabase = createClient();
    const payload = mockMicroSegments.map(mapMicroSegmentToDb);
    await supabase.from('micro_segments').upsert(payload);
  } catch (e) {
    console.warn('Seeding micro_segments skipped:', e);
  }
}

async function seedInitialClinicalRules() {
  try {
    const supabase = createClient();
    const payload = mockClinicalRules.map(mapClinicalRuleToDb);
    await supabase.from('clinical_rules').upsert(payload);
  } catch (e) {
    console.warn('Seeding clinical_rules skipped:', e);
  }
}
