/**
 * Agentforce Autonomous SDR (Sales Development Representative) Agent
 * 
 * 7/24 Gelen hasta taleplerini (lead) anında analiz eden,
 * bütçe ve tedavi ihtiyacına göre niteliklendirip (qualification) doğru klinik branşa yönlendiren ajan.
 */

import { GuardrailEngine } from '../guardrails';

export interface LeadQualificationRequest {
  leadId: string;
  patientName: string;
  inboundMessage: string;
  sourceChannel?: string; // WhatsApp, Web Form, Instagram, Phone
  country?: string;
}

export interface SDRQualificationResult {
  agentId: string;
  qualificationScore: number; // 0-100
  qualificationTier: 'HOT' | 'WARM' | 'COLD';
  detectedTreatmentCategory: 'Hair Transplant' | 'Dental Surgery' | 'Aesthetics & Plastic' | 'Cardiology' | 'General';
  estimatedPackageValueEur: number;
  recommendedDepartment: string;
  suggestedSalesAction: string;
  autoReplyMessageTr: string;
  autoReplyMessageEn: string;
}

export class AutonomousSDRAgent {
  static async qualifyLead(req: LeadQualificationRequest): Promise<SDRQualificationResult> {
    const guard = GuardrailEngine.evaluateSession('sdr-agent', 1, 600);
    if (!guard.allowed) {
      throw new Error(guard.reason);
    }

    const text = req.inboundMessage.toLowerCase();
    let category: 'Hair Transplant' | 'Dental Surgery' | 'Aesthetics & Plastic' | 'Cardiology' | 'General' = 'General';
    let valueEur = 1500;
    let score = 75;

    if (text.includes('saç') || text.includes('hair') || text.includes('fue') || text.includes('dhi')) {
      category = 'Hair Transplant';
      valueEur = 2800;
      score = 92;
    } else if (text.includes('diş') || text.includes('dental') || text.includes('zirkonyum') || text.includes('implant')) {
      category = 'Dental Surgery';
      valueEur = 3500;
      score = 88;
    } else if (text.includes('estetik') || text.includes('rinoplasti') || text.includes('botoks') || text.includes('plastic')) {
      category = 'Aesthetics & Plastic';
      valueEur = 4200;
      score = 90;
    } else if (text.includes('kalp') || text.includes('kardiyo') || text.includes('tansiyon') || text.includes('heart')) {
      category = 'Cardiology';
      valueEur = 2000;
      score = 85;
    }

    let tier: 'HOT' | 'WARM' | 'COLD' = 'WARM';
    if (score >= 88) tier = 'HOT';
    else if (score < 60) tier = 'COLD';

    const replyTr = `Merhaba ${req.patientName}, ${category} alanındaki talebiniz alınmıştır. Uzman sağlık danışmanımız size özel tedavi paketi ve fiyatlandırma detaylarıyla 5 dakika içinde iletişime geçecektir.`;
    const replyEn = `Hello ${req.patientName}, thank you for inquiring about ${category}. Our specialist will contact you with a customized treatment plan within 5 minutes.`;

    return {
      agentId: 'sdr-agent',
      qualificationScore: score,
      qualificationTier: tier,
      detectedTreatmentCategory: category,
      estimatedPackageValueEur: valueEur,
      recommendedDepartment: category,
      suggestedSalesAction: `Hasta talebi ${tier} seviyesinde niteliklendirildi. ${category} hasta temsilcisine yönlendirildi. Tahmini Paket: ${valueEur} EUR.`,
      autoReplyMessageTr: replyTr,
      autoReplyMessageEn: replyEn
    };
  }
}
