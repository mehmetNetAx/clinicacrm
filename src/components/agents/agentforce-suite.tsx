'use client';

import { useState } from 'react';
import { 
  BrainCircuit, 
  Bot, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Coins, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DEFAULT_AGENT_GUARDRAILS } from '@/lib/ai/guardrails';
import { AutonomousAppointmentAgent } from '@/lib/ai/agents/appointment-agent';
import { DocumentAIAgent } from '@/lib/ai/agents/document-ai-agent';
import { PayerClaimsAgent } from '@/lib/ai/agents/payer-agent';
import { AutonomousSDRAgent } from '@/lib/ai/agents/sdr-agent';
import { ReasoningLogDrawer } from './reasoning-log-drawer';
import { ReasoningResult } from '@/lib/ai/reasoning-engine';

export function AgentforceSuiteView() {
  const [activeTestAgent, setActiveTestAgent] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [reasoningResult, setReasoningResult] = useState<ReasoningResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const agents = [
    {
      id: 'appointment-agent',
      name: 'Otonom Randevu & Triyaj Ajanı',
      desc: '7/24 kesintisiz klinik triyaj, hasta randevu planlama ve önceliklendirme ajanı.',
      icon: Bot,
      color: 'text-primary bg-primary/10',
      badge: 'Reasoning Engine 2.0',
      guardrail: DEFAULT_AGENT_GUARDRAILS['appointment-agent']
    },
    {
      id: 'document-ai-agent',
      name: 'Klinik Doküman AI Ajanı (Document AI)',
      desc: 'Reçete, tahlil sonucu ve klinik formlardan OCR/LLM ile veri çıkarıp FHIR Care Observations modeline işler.',
      icon: FileText,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
      badge: 'Zero Copy OCR',
      guardrail: DEFAULT_AGENT_GUARDRAILS['document-ai-agent']
    },
    {
      id: 'payer-agent',
      name: 'Payer & Claims Service Ajanı',
      desc: 'Sigorta ön yetkilendirme (Prior Auth) ve üyelik teminatı sorularını otonom çözer.',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40',
      badge: 'Claims Assistant',
      guardrail: DEFAULT_AGENT_GUARDRAILS['payer-agent']
    },
    {
      id: 'sdr-agent',
      name: 'Autonomous SDR Lead Qualification Ajanı',
      desc: '7/24 gelen hasta taleplerini anında analiz eder, bütçe ve tedaviye göre niteliklendirip branşa yönlendirir.',
      icon: UserCheck,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
      badge: '24/7 SDR Coach',
      guardrail: DEFAULT_AGENT_GUARDRAILS['sdr-agent']
    }
  ];

  const handleRunAgentTest = async (agentId: string) => {
    setActiveTestAgent(agentId);
    setTestResult(null);

    const mockPatient = {
      id: 'PAT-101',
      name: 'Ahmet Yılmaz',
      initials: 'AY',
      age: 58,
      gender: 'Male' as const,
      bloodType: 'A+',
      bmi: 29.4,
      bmiStatus: 'Overweight' as const,
      lastVisit: '2026-02-10',
      lastVisitMonths: 6,
      crmScore: 88,
      recommendedAction: 'Diyabet & Kardiyoloji Kontrolü',
      recommendedActionIcon: 'Activity',
      recommendedCategory: 'Diabetes' as const,
      priority: 'URGENT' as const,
      status: 'Active' as const,
      phone: '+905321002030',
      email: 'ahmet@example.com',
      avatarUrl: '',
      riskFactors: { smoking: 'Ever', familyHistory: 'Diabetes', controlGap: 'HbA1c Gap' },
      history: [],
      vitals: { systolic: 154, diastolic: 96, heartRate: 88 },
      aiConfidence: 95,
      aiReasoning: '',
      aiRuleCode: 'RULE-CARDIO-01',
      treatmentFollowUp: 'HbA1c Sensörü Takibi'
    };

    if (agentId === 'appointment-agent') {
      const res = await AutonomousAppointmentAgent.processRequest({ patient: mockPatient });
      setReasoningResult(res.reasoningResult);
      setTestResult(`Ajan Çalıştırıldı: ${res.suggestedAppointmentSlot.department} için ${res.suggestedAppointmentSlot.doctorName} ile randevu önerildi. WhatsApp Bildirimi Hazırlandı.`);
      setIsDrawerOpen(true);
    } else if (agentId === 'document-ai-agent') {
      const res = await DocumentAIAgent.extractClinicalData(mockPatient.id, 'HbA1c: %8.4, Kan Glukozu: 195 mg/dL, Metformin 1000mg reçete edildi.');
      setTestResult(`Document AI Dokümanı İşledi: ${res.extractedObservations.length} adet FHIR Care Observation nesnesi oluşturuldu. Data Debt engellendi!`);
    } else if (agentId === 'payer-agent') {
      const res = await PayerClaimsAgent.evaluatePriorAuth({
        patientId: mockPatient.id,
        patientName: mockPatient.name,
        serviceName: 'Diyabet Sensörü & Koroner Holter',
        requestedAmount: 14500,
        clinicalDiagnosis: 'Hipertansiyon & Tip 2 Diyabet Mellitus'
      });
      setTestResult(`Payer Ajanı Talebi Değerlendirdi: Durum: ${res.approvalStatus}, AI Onay İhtimali: %${res.aiProbability}, Katkı Payı: ₺${res.copayEstimate}`);
    } else if (agentId === 'sdr-agent') {
      const res = await AutonomousSDRAgent.qualifyLead({
        leadId: 'LEAD-901',
        patientName: 'Ahmet Yılmaz',
        inboundMessage: 'Saç ekimi ve FUE paketi hakkında fiyat almak istiyorum.'
      });
      setTestResult(`SDR Ajanı Lead Niteliklendirdi: Skor: ${res.qualificationScore}/100 (${res.qualificationTier}), Kategori: ${res.detectedTreatmentCategory}, Tahmini Paket: €${res.estimatedPackageValueEur}`);
    }

    setActiveTestAgent(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Flex Credits & Agentforce Overview */}
      <Card className="bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                Agentforce Autonomous AI Suite & Flex Credits Tracking
              </CardTitle>
              <CardDescription>
                Reasoning Engine altyapısına sahip 4 otonom yapay zeka ajanı, PHI Trust Layer ve Strict Guardrail denetimi
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-card p-3 rounded-xl border">
              <Coins className="h-5 w-5 text-amber-500" />
              <div className="text-xs">
                <span className="text-muted-foreground block">Toplam Kullanılan Flex Credits</span>
                <span className="font-extrabold text-foreground text-sm">$307.90 / $780.00 USD</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const g = agent.guardrail;

          return (
            <Card key={agent.id} className="border shadow-sm hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${agent.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        {agent.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {agent.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  {agent.desc}
                </p>

                {/* Guardrails & Budget Metric */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Strict Guardrail Rules</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border-emerald-200">
                      PHI Scrubbing Enabled
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block">Max Turn / Session:</span>
                      <strong className="text-foreground">{g.maxTurnsPerSession} Turn</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Aylık Bütçe Kullanımı:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">${g.usedBudgetUsd} / ${g.monthlyBudgetLimitUsd} USD</strong>
                    </div>
                  </div>
                  <Progress value={(g.usedBudgetUsd / g.monthlyBudgetLimitUsd) * 100} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1.5 text-xs w-full"
                    onClick={() => handleRunAgentTest(agent.id)}
                    disabled={activeTestAgent === agent.id}
                  >
                    <Play className="h-3.5 w-3.5 text-primary" />
                    {activeTestAgent === agent.id ? 'Ajan Çalıştırılıyor...' : 'Otonom Simülasyon Çalıştır'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Simulation Output Banner */}
      {testResult && (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
          <CardContent className="p-4 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{testResult}</span>
            </div>
            {reasoningResult && (
              <Button size="xs" className="bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => setIsDrawerOpen(true)}>
                <BrainCircuit className="h-3.5 w-3.5 mr-1" /> Reasoning Log İncele
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <ReasoningLogDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        reasoningResult={reasoningResult}
        patientName="Ahmet Yılmaz"
      />
    </div>
  );
}
