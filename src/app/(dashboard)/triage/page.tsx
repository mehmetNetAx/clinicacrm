"use client";

import React, { useState, useEffect } from 'react';
import { fetchPatients, updatePatientTriage } from '@/lib/clinical/service';
import { getAIUrgencyTag, getRiskScore } from '@/lib/clinical/rules-engine';
import { Patient } from '@/types/clinical';
import {
  Activity,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  Search,
  ChevronRight,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  Check
} from 'lucide-react';
import { PriorAuthorizationPanel } from '@/components/insurance/prior-authorization-panel';

export default function TriagePage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [triageNotes, setTriageNotes] = useState<{ [key: string]: string }>({});
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await fetchPatients();
      if (isMounted) {
        setPatients(data);
        if (data.length > 0) {
          setActivePatientId(data[0].id);
        }
        setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];
  const urgency = activePatient ? getAIUrgencyTag(activePatient.vitals) : null;
  const risk = activePatient ? getRiskScore(activePatient) : null;

  // Calculate live dynamic triage counters
  const counts = patients.reduce(
    (acc, p) => {
      const u = getAIUrgencyTag(p.vitals);
      if (u.priority === 'URGENT') acc.urgent += 1;
      else if (u.priority === 'MEDIUM') acc.medium += 1;
      else acc.routine += 1;
      return acc;
    },
    { urgent: 0, medium: 0, routine: 0 }
  );

  const handleSaveTriageNote = async () => {
    if (!activePatient) return;
    const note = triageNotes[activePatient.id];
    if (!note || !note.trim()) return;

    setIsSaving(true);
    setSaveSuccess(null);

    const updated = await updatePatientTriage(activePatient.id, note.trim());
    if (updated) {
      setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
      setSaveSuccess(`"${activePatient.name}" için triyaj notu başarıyla veritabanına kaydedildi.`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } else {
      // Local state fallback update if DB update warning
      const updatedLocal: Patient = {
        ...activePatient,
        treatmentFollowUp: note.trim(),
        history: [
          {
            id: `h-triage-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'general',
            title: 'Hekim Triyaj Kararı',
            detail: note.trim(),
            badgeColor: 'bg-primary/10 text-primary'
          },
          ...(activePatient.history || [])
        ]
      };
      setPatients(prev => prev.map(p => p.id === activePatient.id ? updatedLocal : p));
      setSaveSuccess(`"${activePatient.name}" için triyaj notu güncellendi.`);
      setTimeout(() => setSaveSuccess(null), 4000);
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Triyaj Yönetimi & Klinik Risk Motoru</h1>
        <p className="text-sm text-muted-foreground">
          Akut vitaller, acil hasta sınıflandırma ve yapay zekâ klinik ön değerlendirme paneli.
        </p>
      </div>

      {/* Save Toast Notification */}
      {saveSuccess && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{saveSuccess}</span>
          </div>
          <button onClick={() => setSaveSuccess(null)} className="font-bold underline">Kapat</button>
        </div>
      )}

      {/* Triage Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500 text-white">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">Acil Müdahale (Urgent)</span>
            <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-200">{counts.urgent} Hasta</h3>
            <p className="text-[11px] text-rose-600 dark:text-rose-400">Sistolik ≥ 150 veya Nabız ≥ 110</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-950 bg-amber-50/50 dark:bg-amber-950/20 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500 text-white">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Yakın İzlem (Medium)</span>
            <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200">{counts.medium} Hasta</h3>
            <p className="text-[11px] text-amber-600 dark:text-amber-400">10-14 gün kontrol takvimli</p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500 text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Stabil (Routine)</span>
            <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">{counts.routine} Hasta</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Fizyolojik bazal değerler</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Triyaj verileri yükleniyor...</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Triyaj için hasta kaydı bulunamadı.
        </div>
      ) : (
        /* Main Triage workspace */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Patient Triage List */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-sm font-bold text-foreground">Triyaj Bekleyen Hastalar ({patients.length})</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {patients.map(p => {
                const u = getAIUrgencyTag(p.vitals);
                const isSelected = p.id === activePatientId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePatientId(p.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{p.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${u.color}`}>
                        {u.priority}
                      </span>
                    </div>
                    <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Vitals:</span>
                        <span className="font-semibold text-foreground">{u.vitalsStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kategori:</span>
                        <span className="text-foreground">{p.recommendedCategory}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detail AI Progress Note Triage */}
          {activePatient && urgency && risk && (
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-xs text-primary font-semibold">{activePatient.id} • Triyaj İlerleme Notu</span>
                    <h2 className="text-xl font-bold">{activePatient.name}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${urgency.color}`}>
                    {urgency.category}
                  </span>
                </div>

                {/* AI Reasoning */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> AI Klinik Ön Değerlendirme & Güven Skoru (%{activePatient.aiConfidence})
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">
                    {activePatient.aiReasoning || urgency.reasoningTr}
                  </p>
                </div>

                {/* Clinical Metrics Detail */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-muted/40 border border-border">
                    <span className="text-muted-foreground block">Sistolik BP</span>
                    <span className="text-lg font-bold text-foreground">{activePatient.vitals?.systolic || 120} mmHg</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border">
                    <span className="text-muted-foreground block">Diyastolik BP</span>
                    <span className="text-lg font-bold text-foreground">{activePatient.vitals?.diastolic || 80} mmHg</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border">
                    <span className="text-muted-foreground block">Nabız</span>
                    <span className="text-lg font-bold text-foreground">{activePatient.vitals?.heartRate || 72} BPM</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 border border-border">
                    <span className="text-muted-foreground block">Risk Seviyesi</span>
                    <span className={`text-lg font-bold ${risk.color}`}>%{risk.score} ({risk.level})</span>
                  </div>
                </div>

                {/* Physician Note Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-foreground">Hekim Triyaj Notu & Kararı</label>
                  <textarea
                    rows={3}
                    value={triageNotes[activePatient.id] ?? activePatient.treatmentFollowUp ?? ''}
                    onChange={e => setTriageNotes({ ...triageNotes, [activePatient.id]: e.target.value })}
                    placeholder="Örn: Hasta kardiyoloji acil servisine sevk edildi. EKO takvimi oluşturuldu..."
                    className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    disabled={isSaving}
                    onClick={handleSaveTriageNote}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Triyaj Kararını Kaydet & Sevk Et
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payer & Prior Authorization Section */}
      <PriorAuthorizationPanel />
    </div>
  );
}
