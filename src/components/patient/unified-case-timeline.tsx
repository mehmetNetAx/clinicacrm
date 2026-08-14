'use client';

import { useState } from 'react';
import { 
  Activity, 
  BrainCircuit, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Plane, 
  ShieldCheck, 
  Clock, 
  Stethoscope, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CareObservation, SDoHRecord, PayerCoverage } from '@/types/clinical';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'OBSERVATION' | 'AI_REASONING' | 'APPOINTMENT' | 'PRESCRIPTION' | 'LOGISTICS' | 'PAYER_CLAIM' | 'WHATSAPP';
  title: string;
  description: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'outline' | 'secondary' | 'destructive';
  details?: Record<string, any>;
}

interface UnifiedCaseTimelineProps {
  patientId: string;
  patientName: string;
  careObservations?: CareObservation[];
  sdohRecords?: SDoHRecord[];
  payerCoverage?: PayerCoverage;
}

export function UnifiedCaseTimeline({
  patientId,
  patientName,
  careObservations = [],
  sdohRecords = [],
  payerCoverage
}: UnifiedCaseTimelineProps) {
  const [filterType, setFilterType] = useState<string>('ALL');

  const defaultEvents: TimelineEvent[] = [
    {
      id: 'evt-1',
      timestamp: '2026-08-14 10:30',
      type: 'OBSERVATION',
      title: 'FHIR Care Observation Kaydedildi',
      description: 'Kan Glukozu: 195 mg/dL (Yüksek), HbA1c: %8.4 (Kritik). LOINC Code: 4548-4.',
      badgeText: 'Kritik Vital',
      badgeVariant: 'destructive'
    },
    {
      id: 'evt-2',
      timestamp: '2026-08-14 10:31',
      type: 'AI_REASONING',
      title: 'Agentforce Reasoning Engine Triyaj Kararı',
      description: 'Yüksek glukoz ve HbA1c seviyesi nedeniyle hasta "Tip 2 Diyabet Takibi" mikrosegmentine eşlendi. Endokrinoloji randevusu önerildi.',
      badgeText: 'AI Triyaj: URGENT',
      badgeVariant: 'default'
    },
    {
      id: 'evt-3',
      timestamp: '2026-08-14 11:15',
      type: 'PAYER_CLAIM',
      title: 'Sigorta Ön Yetkilendirme (Prior Auth) Oluşturuldu',
      description: `Mapfre Sigorta (Poliçe: MP-982341) kapsamında Endokrinoloji Muayenesi ve Sensör Takibi ön onayı %94 olasılıkla onaylandı.`,
      badgeText: 'Prior Auth Approved',
      badgeVariant: 'secondary'
    },
    {
      id: 'evt-4',
      timestamp: '2026-08-13 14:00',
      type: 'WHATSAPP',
      title: 'WhatsApp Mesajlaşması & Otonom SDR Ajanı',
      description: 'Hasta diyabet kontrolü ve beslenme danışmanlığı hakkında bilgi talep etti. Otomatik SDR yanıtı iletildi.',
      badgeText: 'WhatsApp Inbound',
      badgeVariant: 'outline'
    },
    {
      id: 'evt-5',
      timestamp: '2026-08-10 09:00',
      type: 'APPOINTMENT',
      title: 'Geçmiş Poliklinik Randevusu Tamamlandı',
      description: 'Dahiliye Polikliniği — Dr. Ahmet Yılmaz. Rutin tetkikler istendi.',
      badgeText: 'Tamamlandı',
      badgeVariant: 'outline'
    }
  ];

  const filteredEvents = filterType === 'ALL' 
    ? defaultEvents 
    : defaultEvents.filter(e => e.type === filterType);

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'OBSERVATION': return <Activity className="h-4 w-4 text-rose-500" />;
      case 'AI_REASONING': return <BrainCircuit className="h-4 w-4 text-primary" />;
      case 'APPOINTMENT': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'PRESCRIPTION': return <FileText className="h-4 w-4 text-emerald-500" />;
      case 'LOGISTICS': return <Plane className="h-4 w-4 text-amber-500" />;
      case 'PAYER_CLAIM': return <ShieldCheck className="h-4 w-4 text-purple-500" />;
      case 'WHATSAPP': return <MessageSquare className="h-4 w-4 text-emerald-600" />;
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Unified Case Timeline (Birleşik Hasta Yolculuğu Zaman Çizelgesi)
          </CardTitle>
          <CardDescription>
            {patientName} için tüm klinik gözlemler, AI akıl yürütme logları, WhatsApp mesajları ve sigorta süreçlerinin kronolojik akışı
          </CardDescription>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <Button 
            size="xs" 
            variant={filterType === 'ALL' ? 'default' : 'outline'}
            onClick={() => setFilterType('ALL')}
          >
            Tümü
          </Button>
          <Button 
            size="xs" 
            variant={filterType === 'OBSERVATION' ? 'default' : 'outline'}
            onClick={() => setFilterType('OBSERVATION')}
          >
            Vitals (FHIR)
          </Button>
          <Button 
            size="xs" 
            variant={filterType === 'AI_REASONING' ? 'default' : 'outline'}
            onClick={() => setFilterType('AI_REASONING')}
          >
            AI Reasoning
          </Button>
          <Button 
            size="xs" 
            variant={filterType === 'PAYER_CLAIM' ? 'default' : 'outline'}
            onClick={() => setFilterType('PAYER_CLAIM')}
          >
            Sigorta / Claim
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative pl-6 space-y-4 before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 top-1 p-1 rounded-full bg-card border shadow-sm group-hover:scale-110 transition-transform">
                {getEventIcon(evt.type)}
              </div>

              {/* Timeline Card */}
              <div className="p-3.5 rounded-xl border bg-card hover:bg-accent/40 transition-colors space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm flex items-center gap-2">
                    {evt.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {evt.badgeText && (
                      <Badge variant={evt.badgeVariant || 'outline'} className="text-[10px]">
                        {evt.badgeText}
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {evt.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {evt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
