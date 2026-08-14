/**
 * Agentforce Autonomous Appointment & Triage Agent
 * 
 * 7/24 kesintisiz klinik triyaj, hasta randevu planlama ve önceliklendirme ajanı.
 */

import { Patient, CareObservation, PayerCoverage } from '@/types/clinical';
import { ReasoningEngine, ReasoningResult } from '../reasoning-engine';

export interface AppointmentSlotRequest {
  patient: Patient;
  observations?: CareObservation[];
  payerCoverage?: PayerCoverage;
  preferredDepartment?: string;
  preferredDate?: string;
}

export interface AppointmentAgentResponse {
  agentId: string;
  success: boolean;
  reasoningResult: ReasoningResult;
  suggestedAppointmentSlot: {
    doctorName: string;
    department: string;
    date: string;
    time: string;
  };
  whatsappNotificationMessageTr: string;
  whatsappNotificationMessageEn: string;
}

export class AutonomousAppointmentAgent {
  static async processRequest(req: AppointmentSlotRequest): Promise<AppointmentAgentResponse> {
    // Execute Reasoning Engine
    const reasoning = ReasoningEngine.evaluatePatient(
      req.patient,
      req.observations || [],
      [],
      req.payerCoverage,
      'appointment-agent'
    );

    const department = req.preferredDepartment || reasoning.recommendedCategory;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const suggestedSlot = {
      doctorName: department === 'Cardiology' ? 'Prof. Dr. Ahmet Yılmaz' : department === 'Diabetes' ? 'Doç. Dr. Ayşe Kaya' : 'Uzman Dr. Mehmet Öz',
      department,
      date: req.preferredDate || dateStr,
      time: '10:30'
    };

    const msgTr = `Sayın ${req.patient.name}, ${department} bölümü için randevunuz ${suggestedSlot.date} saat ${suggestedSlot.time} olarak planlanmıştır. Doktorunuz: ${suggestedSlot.doctorName}. Herhangi bir sorunuz varsa bu mesaj üzerinden yanıtlayabilirsiniz.`;
    const msgEn = `Dear ${req.patient.name}, your appointment for ${department} is scheduled for ${suggestedSlot.date} at ${suggestedSlot.time} with ${suggestedSlot.doctorName}.`;

    return {
      agentId: 'appointment-agent',
      success: true,
      reasoningResult: reasoning,
      suggestedAppointmentSlot: suggestedSlot,
      whatsappNotificationMessageTr: msgTr,
      whatsappNotificationMessageEn: msgEn
    };
  }
}
