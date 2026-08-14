import { Patient, MicroSegment, ClinicalRule } from '@/types/clinical';

export const mockPatients: Patient[] = [
  {
    id: "MRN-88421",
    name: "Ayşe Yılmaz",
    initials: "A.Y.",
    age: 54,
    gender: "Female",
    bloodType: "A RH+",
    bmi: 28.4,
    bmiStatus: "Overweight",
    lastVisit: "2024-11-10",
    lastVisitMonths: 9,
    crmScore: 88,
    recommendedAction: "Kardiyoloji Takipli EKO Verilmeli",
    recommendedActionIcon: "HeartPulse",
    recommendedCategory: "Cardiology",
    priority: "URGENT",
    status: "Active",
    phone: "+90 532 555 0192",
    email: "ayse.yilmaz@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    vitals: {
      systolic: 156,
      diastolic: 98,
      heartRate: 114,
      oxygenSaturation: 97,
      temperature: 36.8
    },
    riskFactors: {
      smoking: "Former (10 yrs)",
      familyHistory: "Premature CAD in father",
      controlGap: "14 Months overdue for Echo"
    },
    history: [
      { id: "h1", date: "2024-11-10", type: "lab", title: "Kardiyoloji Muayenesi", detail: "Hipertansiyon tanısı, sistolik 156 mmHg ölçüldü.", badgeColor: "bg-rose-100 text-rose-800" },
      { id: "h2", date: "2024-05-14", type: "imaging", title: "EKG / EKO Raporu", detail: "Hafif sol ventrikül hipertrofisi izlendi.", badgeColor: "bg-amber-100 text-amber-800" }
    ],
    aiConfidence: 94,
    aiReasoning: "Sistolik kan basıncı ve nabız kritik seviyede. Kardiyak kriz riskini önlemek için acil triyaj randevusu önerilir.",
    aiRuleCode: "RULE-CARDIO-01",
    treatmentFollowUp: "Kardiyoloji kontrolü bekleniyor",
    recommendedFollowUpMonths: 3,
    microSegments: ["SEG-CARDIO-HYPER"]
  },
  {
    id: "MRN-92104",
    name: "Mehmet Kaya",
    initials: "M.K.",
    age: 62,
    gender: "Male",
    bloodType: "0 RH+",
    bmi: 31.2,
    bmiStatus: "Obese",
    lastVisit: "2024-08-05",
    lastVisitMonths: 12,
    crmScore: 75,
    recommendedAction: "HbA1c & Endokrin Kontrolü",
    recommendedActionIcon: "FlaskConical",
    recommendedCategory: "Diabetes",
    priority: "MEDIUM",
    status: "Active",
    phone: "+90 533 444 0211",
    email: "mehmet.kaya@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    vitals: {
      systolic: 138,
      diastolic: 86,
      heartRate: 82,
      oxygenSaturation: 98,
      temperature: 36.5
    },
    riskFactors: {
      smoking: "Active (1 pack/day)",
      familyHistory: "Diabetes Type 2",
      controlGap: "Overdue for HbA1c lab test"
    },
    history: [
      { id: "h3", date: "2024-08-05", type: "lab", title: "HbA1c Laboratuvar Testi", detail: "HbA1c değeri %8.2 yüksek saptandı.", badgeColor: "bg-amber-100 text-amber-800" }
    ],
    aiConfidence: 89,
    aiReasoning: "Hastanın 12 aydır diyabet kontrolü yapılmamıştır. Diyet ve insülin dozajı güncellemesi gerekiyor.",
    aiRuleCode: "RULE-DIABETES-02",
    treatmentFollowUp: "Endokrin randevusu verilecek",
    recommendedFollowUpMonths: 6,
    microSegments: ["SEG-DIABETES-GAP"]
  },
  {
    id: "MRN-73419",
    name: "Zeynep Demir",
    initials: "Z.D.",
    age: 48,
    gender: "Female",
    bloodType: "B RH-",
    bmi: 23.5,
    bmiStatus: "Normal",
    lastVisit: "2025-01-20",
    lastVisitMonths: 7,
    crmScore: 42,
    recommendedAction: "Mamografi & Onkoloji Taraması",
    recommendedActionIcon: "Sparkles",
    recommendedCategory: "Oncology",
    priority: "ROUTINE",
    status: "Active",
    phone: "+90 535 333 0988",
    email: "zeynep.demir@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    vitals: {
      systolic: 122,
      diastolic: 78,
      heartRate: 74,
      oxygenSaturation: 99,
      temperature: 36.6
    },
    riskFactors: {
      smoking: "None",
      familyHistory: "Maternal breast cancer",
      controlGap: "Annual screening due"
    },
    history: [
      { id: "h4", date: "2025-01-20", type: "general", title: "Rutin Sağlık Taraması", detail: "Genel sağlık durumu stabil, yıllık mamografi önerildi.", badgeColor: "bg-emerald-100 text-emerald-800" }
    ],
    aiConfidence: 91,
    aiReasoning: "Ailede meme kanseri öyküsü bulunuyor. Koruyucu onkolojik mamografi takvimi başlatılmalıdır.",
    aiRuleCode: "RULE-ONCO-03",
    treatmentFollowUp: "Rutin takip",
    recommendedFollowUpMonths: 12,
    microSegments: ["SEG-ONCO-PREV"]
  }
];

export const mockMicroSegments: MicroSegment[] = [
  {
    id: "SEG-CARDIO-HYPER",
    titleTr: "Hipertansif Kardiyo Riski Grubu",
    titleEn: "Hypertensive Cardio Risk Group",
    descriptionTr: "50 yaş üzeri, tansiyonu yüksek ve 6 aydır EKO kontrolü yaptırmamış hastalar.",
    descriptionEn: "Patients over 50 with high BP and overdue for Echo.",
    category: "Cardiology",
    criteriaDescriptionTr: "Yaş >= 50, Sistolik >= 135 mmHg, Muayene > 6 ay",
    criteriaDescriptionEn: "Age >= 50, Systolic >= 135 mmHg, Last Visit > 6m",
    matchedPatientsCount: 1,
    patientIds: ["MRN-88421"],
    recommendedCampaignNameTr: "Ücretsiz Kardiyak EKO & Check-up Kampanyası",
    recommendedCampaignNameEn: "Free Cardiac Echo Check-up Campaign",
    recommendedChannel: "WhatsApp",
    estRevenuePerPatient: 2500,
    urgencyLevel: "HIGH",
    defaultMessageTemplateTr: "Sayın {name}, yaşamsal sağlık göstergelerinize istinaden kardiyoloji uzmanımızla EKO randevusu oluşturmanız önerilmektedir.",
    defaultMessageTemplateEn: "Dear {name}, based on your vitals, a cardiac Echo appointment is recommended.",
    iconName: "HeartPulse"
  },
  {
    id: "SEG-DIABETES-GAP",
    titleTr: "Diyabet Takip Açığı Bulunan Hastalar",
    titleEn: "Diabetes Care Control Gap Group",
    descriptionTr: "Diyabet tanısı olan ve 9 aydır HbA1c testi yaptırmamış kronik hastalar.",
    descriptionEn: "Diabetic patients overdue for HbA1c lab tests.",
    category: "Diabetes",
    criteriaDescriptionTr: "Diyabet geçmişi var, Son lab > 9 ay önce",
    criteriaDescriptionEn: "Diabetic history, Lab test > 9m ago",
    matchedPatientsCount: 1,
    patientIds: ["MRN-92104"],
    recommendedCampaignNameTr: "Gelişmiş Diyabet Kontrol Paketi",
    recommendedCampaignNameEn: "Advanced Diabetes Care Package",
    recommendedChannel: "SMS",
    estRevenuePerPatient: 1800,
    urgencyLevel: "MEDIUM",
    defaultMessageTemplateTr: "Sayın {name}, diyabet kan şekeri takibinizin güncellenmesi için HbA1c testiniz hazırlandı. Randevu için iletişime geçebilirsiniz.",
    defaultMessageTemplateEn: "Dear {name}, your HbA1c diabetes follow-up test is recommended.",
    iconName: "FlaskConical"
  },
  {
    id: "SEG-ONCO-PREV",
    titleTr: "Koruyucu Onkoloji & Mamografi Taraması",
    titleEn: "Preventative Oncology Screening",
    descriptionTr: "Aile öyküsünde kanser olan ve yıllık taraması geciken kadın hastalar.",
    descriptionEn: "Female patients with family history overdue for annual screening.",
    category: "Oncology",
    criteriaDescriptionTr: "Kanser aile öyküsü var, Yıllık tarama zamanı",
    criteriaDescriptionEn: "Family history of cancer, Annual check due",
    matchedPatientsCount: 1,
    patientIds: ["MRN-73419"],
    recommendedCampaignNameTr: "Erken Teşhis Hayat Kurtarır Tarama Programı",
    recommendedCampaignNameEn: "Early Detection Screening Program",
    recommendedChannel: "Email",
    estRevenuePerPatient: 3200,
    urgencyLevel: "ROUTINE",
    defaultMessageTemplateTr: "Sayın {name}, yıllık meme sağlığı ve koruyucu onkoloji taramanızı hatırlatmak isteriz.",
    defaultMessageTemplateEn: "Dear {name}, this is a reminder for your annual oncology screening.",
    iconName: "Sparkles"
  }
];

export const mockClinicalRules: ClinicalRule[] = [
  {
    id: "RULE-CARDIO-01",
    title: "Akut Hipertansiyon & Kardiyak Kriz Riski Kuralı",
    condition: "Sistolik BP >= 150 OR Diyastolik BP >= 95 OR Nabız >= 110",
    icon: "AlertTriangle",
    status: "URGENT",
    matchedCount: 1,
    conversionRate: 84.5,
    lastUpdated: "2026-08-14",
    description: "Kritik vital değerleri saptanan hastaları acil triyaj kanalına yönlendirir.",
    estImpact: "High"
  },
  {
    id: "RULE-DIABETES-02",
    title: "Diyabet Takip & HbA1c Kontrol Kuralı",
    condition: "Diyabet Tanısı == True AND Son HbA1c > 6 Ay",
    icon: "FlaskConical",
    status: "ACTIVE",
    matchedCount: 1,
    conversionRate: 68.0,
    lastUpdated: "2026-08-10",
    description: "Kronik diyabet hastalarının kan şekeri regülasyonunu takip eder.",
    estImpact: "Medium"
  },
  {
    id: "RULE-ONCO-03",
    title: "Koruyucu Onkolojik Taramalar Kuralı",
    condition: "Aile Kanser Öyküsü == True AND Yaş >= 40",
    icon: "Sparkles",
    status: "ACTIVE",
    matchedCount: 1,
    conversionRate: 52.3,
    lastUpdated: "2026-08-01",
    description: "Yıllık koruyucu mamografi ve biyomarker kontrollerini hatırlatır.",
    estImpact: "High"
  }
];
