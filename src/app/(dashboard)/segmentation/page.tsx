"use client";

import React, { useState, useEffect } from 'react';
import { fetchMicroSegments, fetchPatients } from '@/lib/clinical/service';
import { matchPatientToMicroSegments } from '@/lib/clinical/rules-engine';
import { MicroSegment, Patient } from '@/types/clinical';
import {
  Layers,
  Users,
  MessageSquare,
  Send,
  DollarSign,
  Sparkles,
  Zap,
  TrendingUp,
  SlidersHorizontal,
  CheckCircle2,
  Share2,
  Loader2
} from 'lucide-react';

export default function SegmentationPage() {
  const [segments, setSegments] = useState<MicroSegment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<MicroSegment | null>(null);
  const [messageTemplate, setMessageTemplate] = useState<string>('');
  const [broadcastSent, setBroadcastSent] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const [fetchedSegments, fetchedPatients] = await Promise.all([
        fetchMicroSegments(),
        fetchPatients()
      ]);

      if (isMounted) {
        setSegments(fetchedSegments);
        setPatients(fetchedPatients);
        if (fetchedSegments.length > 0) {
          setSelectedSegment(fetchedSegments[0]);
          setMessageTemplate(fetchedSegments[0].defaultMessageTemplateTr);
        }
        setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const matchedPatients = patients.filter(p => {
    if (!selectedSegment) return false;
    const matches = matchPatientToMicroSegments(p, [selectedSegment]);
    return matches.includes(selectedSegment.id);
  });

  const handleSendBroadcast = () => {
    if (!selectedSegment) return;
    setBroadcastSent(`"${selectedSegment.titleTr}" segmentindeki ${matchedPatients.length} hastaya ${selectedSegment.recommendedChannel} toplu mesaj gönderimi başlatıldı.`);
    setTimeout(() => setBroadcastSent(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Segmentasyon Yönetimi (Micro-Segmentation)</h1>
        <p className="text-sm text-muted-foreground">
          Klinik kriterlere göre otomatik hasta mikro-gruplaması ve hedeflenmiş WhatsApp/SMS kampanyaları.
        </p>
      </div>

      {/* Broadcast Toast Banner */}
      {broadcastSent && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{broadcastSent}</span>
          </div>
          <button onClick={() => setBroadcastSent(null)} className="font-bold underline">Kapat</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Segmentasyon verileri yükleniyor...</p>
        </div>
      ) : (
        <>
          {/* Segment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {segments.map(seg => {
              const isSelected = selectedSegment?.id === seg.id;
              const currentMatches = patients.filter(p => matchPatientToMicroSegments(p, [seg]).includes(seg.id));

              return (
                <div
                  key={seg.id}
                  onClick={() => {
                    setSelectedSegment(seg);
                    setMessageTemplate(seg.defaultMessageTemplateTr);
                  }}
                  className={`cursor-pointer rounded-xl border p-5 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                      {seg.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {seg.recommendedChannel}
                    </span>
                  </div>

                  <h3 className="font-bold text-base mt-3 text-foreground">{seg.titleTr}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{seg.descriptionTr}</p>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-bold text-foreground">{currentMatches.length} Hasta Eşleşti</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-3.5 w-3.5" />
                      ₺{seg.estRevenuePerPatient.toLocaleString()} / Hasta
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Segment Action Center */}
          {selectedSegment && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Matched Patients */}
              <div className="lg:col-span-1 rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-sm font-bold flex items-center justify-between">
                  <span>Eşleşen Hastalar ({matchedPatients.length})</span>
                  <span className="text-xs font-normal text-muted-foreground">{selectedSegment.category}</span>
                </h3>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {matchedPatients.length > 0 ? (
                    matchedPatients.map(p => (
                      <div key={p.id} className="rounded-lg border border-border p-3 text-xs bg-muted/20 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">{p.name}</div>
                          <div className="text-muted-foreground">{p.id} • {p.phone}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                          Eşleşti
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-8 text-center">
                      Şu an bu kritere uyan hasta bulunamadı.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Campaign & Message Template Composer */}
              <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 space-y-5">
                <div className="border-b border-border pb-3">
                  <span className="text-xs text-primary font-semibold">Hedeflenen Kampanya Kanalları</span>
                  <h2 className="text-xl font-bold">{selectedSegment.recommendedCampaignNameTr}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Kriter: {selectedSegment.criteriaDescriptionTr}</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-foreground">
                    Şablon Mesaj metni ({selectedSegment.recommendedChannel})
                  </label>
                  <textarea
                    rows={4}
                    value={messageTemplate}
                    onChange={e => setMessageTemplate(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Kullanılabilir dinamik parametreler: <code className="bg-muted px-1 rounded text-primary">{'{name}'}</code>, <code className="bg-muted px-1 rounded text-primary">{'{action}'}</code>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Potansiyel Gelir Etkisi: </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₺{(selectedSegment.estRevenuePerPatient * Math.max(1, matchedPatients.length)).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={handleSendBroadcast}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {selectedSegment.recommendedChannel} Toplu İletişim Başlat
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
