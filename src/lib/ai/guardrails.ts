/**
 * Agentforce Guardrails & Flex Credit Token Budgeting
 * 
 * Strict session turn limits and budget monitoring for AI agents.
 */

import { AgentGuardrail } from '@/types/clinical';

export const DEFAULT_AGENT_GUARDRAILS: Record<string, AgentGuardrail> = {
  'appointment-agent': {
    agentId: 'appointment-agent',
    agentName: 'Otonom Randevu & Triyaj Ajanı',
    maxTurnsPerSession: 5,
    maxTokensPerTurn: 1000,
    monthlyBudgetLimitUsd: 150,
    usedBudgetUsd: 42.50,
    strictModeEnabled: true,
    phiMaskingEnabled: true,
  },
  'document-ai-agent': {
    agentId: 'document-ai-agent',
    agentName: 'Klinik Doküman AI Ajanı',
    maxTurnsPerSession: 3,
    maxTokensPerTurn: 2500,
    monthlyBudgetLimitUsd: 200,
    usedBudgetUsd: 88.10,
    strictModeEnabled: true,
    phiMaskingEnabled: true,
  },
  'payer-agent': {
    agentId: 'payer-agent',
    agentName: 'Payer & Claims Service Ajanı',
    maxTurnsPerSession: 6,
    maxTokensPerTurn: 1500,
    monthlyBudgetLimitUsd: 180,
    usedBudgetUsd: 65.30,
    strictModeEnabled: true,
    phiMaskingEnabled: true,
  },
  'sdr-agent': {
    agentId: 'sdr-agent',
    agentName: 'Autonomous SDR Lead Ajanı',
    maxTurnsPerSession: 8,
    maxTokensPerTurn: 1200,
    monthlyBudgetLimitUsd: 250,
    usedBudgetUsd: 112.00,
    strictModeEnabled: true,
    phiMaskingEnabled: true,
  },
};

export class GuardrailEngine {
  static evaluateSession(
    agentId: string,
    currentTurnCount: number,
    estimatedTokens: number
  ): { allowed: boolean; reason?: string; warning?: string } {
    const config = DEFAULT_AGENT_GUARDRAILS[agentId] || DEFAULT_AGENT_GUARDRAILS['appointment-agent'];

    if (config.strictModeEnabled && currentTurnCount >= config.maxTurnsPerSession) {
      return {
        allowed: false,
        reason: `Ajan oturum sınırı aşıldı! Maksimum izin verilen turn sayısı: ${config.maxTurnsPerSession}. Canlı temsilciye devrediliyor.`,
      };
    }

    if (config.usedBudgetUsd >= config.monthlyBudgetLimitUsd) {
      return {
        allowed: false,
        reason: `Aylık Flex Credit bütçesi (${config.monthlyBudgetLimitUsd} USD) doldu.`,
      };
    }

    let warning: string | undefined;
    if (config.usedBudgetUsd >= config.monthlyBudgetLimitUsd * 0.85) {
      warning = `Dikkat: Bütçenin %85'i kullanıldı (${config.usedBudgetUsd} / ${config.monthlyBudgetLimitUsd} USD).`;
    }

    return { allowed: true, warning };
  }
}
