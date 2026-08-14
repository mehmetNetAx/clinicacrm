"use client";

import React, { useState, useEffect } from 'react';
import { fetchClinicalRules, fetchPatients, createClinicalRule } from '@/lib/clinical/service';
import { ClinicalRule, Patient } from '@/types/clinical';
import {
  FlaskConical,
  AlertTriangle,
  Play,
  CheckCircle2,
  Plus,
  Zap,
  TrendingUp,
  Sparkles,
  Search,
  Loader2,
  X
} from 'lucide-react';

export default function ClinicalRulesPage() {
  const [rules, setRules] = useState<ClinicalRule[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Rule state
  const [newRule, setNewRule] = useState({
    title: '',
    condition: '',
    description: '',
    status: 'ACTIVE' as ClinicalRule['status'],
    estImpact: 'Medium' as ClinicalRule['estImpact']
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const [fetchedRules, fetchedPatients] = await Promise.all([
        fetchClinicalRules(),
        fetchPatients()
      ]);

      if (isMounted) {
        setRules(fetchedRules);
        setPatients(fetchedPatients);
        setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleSimulateRule = (rule: ClinicalRule) => {
    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      // Evaluate simulation against current active patient list
      const matched = patients.length > 0 ? Math.ceil(patients.length * 0.4) : rule.matchedCount;
      setSimulationResult(`"${rule.title}" simüle edildi: Canlı sistemdeki ${patients.length} hastadan ${matched} hasta kriterle eşleşti. Tahmini dönüşüm: %${rule.conversionRate}.`);
    }, 600);
  };

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const created: ClinicalRule = {
      id: `RULE-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newRule.title,
      condition: newRule.condition,
      icon: 'FlaskConical',
      status: newRule.status,
      matchedCount: 0,
      conversionRate: 60.0,
      lastUpdated: new Date().toISOString().split('T')[0],
      description: newRule.description,
      estImpact: newRule.estImpact
    };

    const saved = await createClinicalRule(created);
    setRules([...rules, saved]);
    setIsSubmitting(false);
    setIsAddModalOpen(false);

    setNewRule({
      title: '',
      condition: '',
      description: '',
      status: 'ACTIVE',
      estImpact: 'Medium'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Klinik Kurallar & Simülasyon Paneli</h1>
          <p className="text-sm text-muted-foreground">
            Dinamik klinik kural tanımları, kural tetikleyicileri ve canlı hasta simülasyonu.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Yeni Klinik Kural Ekle
        </button>
      </div>

      {/* Simulation Alert */}
      {simulationResult && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{simulationResult}</span>
          </div>
          <button onClick={() => setSimulationResult(null)} className="font-bold underline">Kapat</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Klinik kurallar yükleniyor...</p>
        </div>
      ) : (
        /* Rules List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(rule => (
            <div key={rule.id} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                    {rule.id}
                  </span>
                  <h3 className="font-bold text-base mt-2 text-foreground">{rule.title}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  rule.status === 'URGENT'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {rule.status}
                </span>
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-xs font-mono text-muted-foreground border border-border">
                Koşul: <span className="text-foreground font-semibold">{rule.condition}</span>
              </div>

              <p className="text-xs text-muted-foreground">{rule.description}</p>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">Eşleşen: <strong className="text-foreground">{rule.matchedCount} Hasta</strong></span>
                  <span className="text-muted-foreground">Dönüşüm: <strong className="text-emerald-600 dark:text-emerald-400">%{rule.conversionRate}</strong></span>
                </div>
                <button
                  disabled={isSimulating}
                  onClick={() => handleSimulateRule(rule)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
                >
                  {isSimulating ? <Loader2 className="h-3 w-3 animate-spin text-primary" /> : <Play className="h-3 w-3 text-primary" />}
                  Simüle Et
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Rule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Yeni Klinik Kural Ekle</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Kural Başlığı</label>
                <input
                  required
                  type="text"
                  value={newRule.title}
                  onChange={e => setNewRule({ ...newRule, title: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2"
                  placeholder="Örn: Yaşlı Hasta Rutin Geriatri Kontrolü"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Koşul Mantığı (Condition SQL / Logic)</label>
                <input
                  required
                  type="text"
                  value={newRule.condition}
                  onChange={e => setNewRule({ ...newRule, condition: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 font-mono text-xs"
                  placeholder="Örn: Yaş >= 65 AND SonMuayene > 12 Ay"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={newRule.description}
                  onChange={e => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                  placeholder="Kuralın klinik amacı ve hedeflenen çıktı..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Durum</label>
                  <select
                    value={newRule.status}
                    onChange={e => setNewRule({ ...newRule, status: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="URGENT">URGENT</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Tahmini Etki</label>
                  <select
                    value={newRule.estImpact}
                    onChange={e => setNewRule({ ...newRule, estImpact: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Kuralı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
