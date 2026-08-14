'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BrainCircuit,
  Plus,
  Coins
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriorAuthorization } from '@/types/clinical';
import { ReasoningLogDrawer } from '@/components/agents/reasoning-log-drawer';
import { ReasoningResult } from '@/lib/ai/reasoning-engine';

const MOCK_PRIOR_AUTHS: PriorAuthorization[] = [
  {
    id: 'AUTH-2026-001',
    patientId: 'PAT-101',
    patientName: 'Ahmet Yılmaz',
    serviceName: 'Kardiyolojik Koroner Anjiyografi & Holter',
    requestedAmount: 18500,
    status: 'APPROVED',
    aiApprovalProbability: 96,
    createdAt: '2026-08-14'
  },
  {
    id: 'AUTH-2026-002',
    patientId: 'PAT-102',
    patientName: 'Ayşe Kaya',
    serviceName: 'Diyabet Sürekli Glukoz Sensör Takibi',
    requestedAmount: 7200,
    status: 'APPROVED',
    aiApprovalProbability: 92,
    createdAt: '2026-08-13'
  },
  {
    id: 'AUTH-2026-003',
    patientId: 'PAT-104',
    patientName: 'Mehmet Öz',
    serviceName: 'Safir FUE Saç Ekimi Operasyonu',
    requestedAmount: 45000,
    status: 'ADDITIONAL_INFO_NEEDED',
    aiApprovalProbability: 74,
    createdAt: '2026-08-12'
  }
];

export function PriorAuthorizationPanel() {
  const [selectedAuth, setSelectedAuth] = useState<PriorAuthorization | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleInspectReasoning = (auth: PriorAuthorization) => {
    setSelectedAuth(auth);
    setIsDrawerOpen(true);
  };

  const mockReasoningResult: ReasoningResult = {
    patientId: selectedAuth?.patientId || 'PAT-101',
    recommendedCategory: 'Cardiology',
    priority: 'URGENT',
    confidence: selectedAuth?.aiApprovalProbability || 95,
    recommendedAction: selectedAuth?.serviceName || 'Hizmet Onayı',
    reasoningSummary: `Payer Agent, ${selectedAuth?.patientName} isimli hastanın sigorta teminatını ve ICD-10 tanı uygunluğunu doğruladı. Ön Yetkilendirme %${selectedAuth?.aiApprovalProbability} olasılıkla onaylandı.`,
    traceSteps: [
      {
        stepIndex: 1,
        title: 'Sigorta Poliçesi & Üye Kapsamı Doğrulaması',
        description: 'Özel Sağlık Sigortası poliçesi aktif. Yıllık yatarak/ayakta tedavi limiti yeterli.',
        ruleCode: 'PAYER-COVERAGE-CHECK',
        status: 'PASSED',
        timestamp: new Date().toISOString()
      },
      {
        stepIndex: 2,
        title: 'Klinik Endikasyon & Hizmet Kodu Eşleşmesi',
        description: `İstenen hizmet (${selectedAuth?.serviceName}) tıbbi gereklilik kurallarına uygun.`,
        ruleCode: 'CLINICAL-NECESSITY-CHECK',
        status: 'PASSED',
        timestamp: new Date().toISOString()
      },
      {
        stepIndex: 3,
        title: 'Katkı Payı (Copay) & Ön Onay Kararı',
        description: `Hesaplanan Sigortalı Katkı Payı: %10. Otomatik Ön Yetkilendirme Onayı Üretildi.`,
        ruleCode: 'PAYER-DECISION-FINAL',
        status: 'PASSED',
        timestamp: new Date().toISOString()
      }
    ],
    preAuthNeeded: true,
    preAuthProbability: selectedAuth?.aiApprovalProbability || 95,
    phiMasked: true
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Payer & Member Coverage / Prior Authorization Management
          </CardTitle>
          <CardDescription>
            Sigorta ön yetkilendirme (Prior Auth) talepleri ve otonom Payer Ajan onay takip paneli
          </CardDescription>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Yeni Ön Yetkilendirme Talebi
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {MOCK_PRIOR_AUTHS.map((auth) => {
          let StatusBadge = (
            <Badge className="bg-emerald-600 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" /> ONAYLANDI
            </Badge>
          );

          if (auth.status === 'ADDITIONAL_INFO_NEEDED') {
            StatusBadge = (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 border-amber-300">
                <AlertCircle className="h-3 w-3 mr-1" /> Ek Bilgi Bekleniyor
              </Badge>
            );
          } else if (auth.status === 'REJECTED') {
            StatusBadge = (
              <Badge variant="destructive">
                REDDEDİLDİ
              </Badge>
            );
          }

          return (
            <div 
              key={auth.id}
              className="p-4 rounded-xl border bg-card hover:bg-accent/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span>{auth.id}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {auth.createdAt}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  {auth.patientName} — <span className="text-primary font-semibold">{auth.serviceName}</span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  Talep Edilen Tutar: <strong>₺{auth.requestedAmount.toLocaleString()}</strong> | Payer Ajan Onay İhtimali: <strong className="text-emerald-600 dark:text-emerald-400">%{auth.aiApprovalProbability}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                {StatusBadge}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1.5 text-xs"
                  onClick={() => handleInspectReasoning(auth)}
                >
                  <BrainCircuit className="h-3.5 w-3.5 text-primary" /> AI Reasoning Log
                </Button>
              </div>
            </div>
          );
        })}

        <ReasoningLogDrawer 
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          reasoningResult={mockReasoningResult}
          patientName={selectedAuth?.patientName}
        />
      </CardContent>
    </Card>
  );
}
