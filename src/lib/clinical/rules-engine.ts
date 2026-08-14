import { Patient, MicroSegment, PatientVitals } from '@/types/clinical';

export function getRiskScore(patient: Patient): {
  score: number;
  level: 'High' | 'Medium' | 'Low';
  color: string;
  bg: string;
} {
  let score = 15;

  if (patient.age > 70) score += 40;
  else if (patient.age > 50) score += 25;
  else if (patient.age > 30) score += 10;
  else if (patient.age < 18) score += 5;

  const historyCount = patient.history?.length || 0;
  score += historyCount * 8;

  const historyText = JSON.stringify(patient.history || []).toLowerCase();
  if (
    historyText.includes('cancer') ||
    historyText.includes('oncology') ||
    historyText.includes('surgery') ||
    historyText.includes('bypass') ||
    historyText.includes('stroke') ||
    historyText.includes('infarct')
  ) {
    score += 25;
  } else if (
    historyText.includes('cardiology') ||
    historyText.includes('hypertension') ||
    historyText.includes('diabetes') ||
    historyText.includes('coronary')
  ) {
    score += 15;
  }

  if (patient.bmi > 30) score += 15;
  else if (patient.bmi > 25) score += 5;

  const finalScore = Math.min(99, Math.max(5, score));

  if (finalScore >= 70) {
    return { score: finalScore, level: 'High', color: 'text-red-700 dark:text-red-400 border-red-200 dark:border-red-950', bg: 'bg-red-50 dark:bg-red-950/40' };
  } else if (finalScore >= 40) {
    return { score: finalScore, level: 'Medium', color: 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-950', bg: 'bg-amber-50 dark:bg-amber-950/40' };
  } else {
    return { score: finalScore, level: 'Low', color: 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-950', bg: 'bg-emerald-50 dark:bg-emerald-950/40' };
  }
}

export function getAIUrgencyTag(vitals?: PatientVitals): {
  category: 'Immediate Intervention' | 'Follow-up Needed' | 'Stable';
  priority: 'URGENT' | 'MEDIUM' | 'ROUTINE';
  vitalsStr: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  confidence: number;
  reasoningTr: string;
  reasoningEn: string;
  color: string;
  bg: string;
  textColor: string;
  dotColor: string;
} {
  const latest = vitals || { systolic: 120, diastolic: 80, heartRate: 72 };
  const { systolic: sys, diastolic: dia, heartRate: hr } = latest;
  const vitalsStr = `${sys}/${dia} mmHg, ${hr} bpm`;

  if (sys >= 152 || dia >= 96 || hr >= 112 || hr <= 48) {
    return {
      category: 'Immediate Intervention',
      priority: 'URGENT',
      vitalsStr,
      systolic: sys,
      diastolic: dia,
      heartRate: hr,
      confidence: 97,
      reasoningTr: `Kritik yaşam değerleri saptandı: Kan Basıncı ${sys}/${dia} mmHg ve/veya Nabız ${hr} bpm fizyolojik stabilite limitlerini aşıyor. Hipertansif kriz veya ritim bozukluğu şüphesi. Acil triyaj önerilir.`,
      reasoningEn: `Critical vital metrics detected: Blood Pressure ${sys}/${dia} mmHg and/or Heart Rate ${hr} bpm exceed stability limits. Immediate clinical triage advised.`,
      color: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      textColor: 'text-rose-700 dark:text-rose-300',
      dotColor: 'bg-rose-600'
    };
  } else if (sys >= 134 || sys < 95 || dia >= 84 || dia < 60 || hr >= 88 || hr < 58) {
    return {
      category: 'Follow-up Needed',
      priority: 'MEDIUM',
      vitalsStr,
      systolic: sys,
      diastolic: dia,
      heartRate: hr,
      confidence: 93,
      reasoningTr: `Hafif-orta düzeyde yaşamsal dalgalanmalar: ${sys}/${dia} mmHg kan basıncı ve ${hr} bpm nabız yakın izlem gerektiriyor. 10-14 gün içinde kontrol önerilir.`,
      reasoningEn: `Mild-to-moderate vital fluctuations: ${sys}/${dia} mmHg blood pressure and ${hr} bpm heart rate show mild elevation. Recommend follow-up in 10-14 days.`,
      color: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-950 dark:bg-amber-950/40 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      textColor: 'text-amber-700 dark:text-amber-300',
      dotColor: 'bg-amber-500'
    };
  } else {
    return {
      category: 'Stable',
      priority: 'ROUTINE',
      vitalsStr,
      systolic: sys,
      diastolic: dia,
      heartRate: hr,
      confidence: 96,
      reasoningTr: `Yaşamsal bulgular stabil (${sys}/${dia} mmHg, ${hr} bpm). Akut risk saptanmadı. Rutin takip yeterlidir.`,
      reasoningEn: `Vital signs are stable (${sys}/${dia} mmHg, ${hr} bpm). No acute stress markers. Standard care recommended.`,
      color: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      dotColor: 'bg-emerald-500'
    };
  }
}

export function matchPatientToMicroSegments(patient: Patient, microSegments: MicroSegment[]): string[] {
  const matchedSegmentIds: string[] = [];
  const sys = patient.vitals?.systolic || 120;
  const historyStr = JSON.stringify(patient.history || []).toLowerCase();

  for (const seg of microSegments) {
    if (seg.id === 'SEG-CARDIO-HYPER') {
      if (patient.age >= 50 && (sys >= 135 || historyStr.includes('cardiology')) && patient.lastVisitMonths >= 6) {
        matchedSegmentIds.push(seg.id);
      }
    } else if (seg.id === 'SEG-DIABETES-GAP') {
      if ((historyStr.includes('diabetes') || historyStr.includes('hba1c')) && patient.lastVisitMonths >= 9) {
        matchedSegmentIds.push(seg.id);
      }
    } else if (seg.id === 'SEG-ONCO-PREV') {
      if (patient.age >= 45 && patient.riskFactors?.familyHistory?.toLowerCase().includes('cancer')) {
        matchedSegmentIds.push(seg.id);
      }
    } else if (seg.id === 'SEG-SENIOR-PREV') {
      if (patient.age >= 65 && patient.lastVisitMonths >= 12) {
        matchedSegmentIds.push(seg.id);
      }
    }
  }

  return matchedSegmentIds;
}
