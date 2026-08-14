"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { fetchPatients, createPatient } from '@/lib/clinical/service';
import { getRiskScore, getAIUrgencyTag } from '@/lib/clinical/rules-engine';
import { Patient } from '@/types/clinical';
import {
  Search,
  Plus,
  Filter,
  HeartPulse,
  Activity,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight,
  X,
  FileText,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Stethoscope,
  Building2,
  Check,
  Loader2
} from 'lucide-react';

import { UnifiedCaseTimeline } from '@/components/patient/unified-case-timeline';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Patient Form state
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: 45,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    category: 'Cardiology' as Patient['recommendedCategory'],
    systolic: 130,
    diastolic: 85,
    heartRate: 78
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await fetchPatients();
      if (isMounted) {
        setPatients(data);
        setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.phone.includes(searchTerm);
      const matchesCat = selectedCategory === 'ALL' || p.recommendedCategory === selectedCategory;
      const matchesPrio = selectedPriority === 'ALL' || p.priority === selectedPriority;
      return matchesSearch && matchesCat && matchesPrio;
    });
  }, [patients, searchTerm, selectedCategory, selectedPriority]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const id = `MRN-${Math.floor(10000 + Math.random() * 90000)}`;
    const initials = newPatient.name.split(' ').map(n => n[0]).join('.').toUpperCase();
    const urgency = getAIUrgencyTag({ systolic: newPatient.systolic, diastolic: newPatient.diastolic, heartRate: newPatient.heartRate });

    const createdPayload: Patient = {
      id,
      name: newPatient.name,
      initials,
      age: Number(newPatient.age),
      gender: newPatient.gender,
      bloodType: 'A RH+',
      bmi: 24.5,
      bmiStatus: 'Normal',
      lastVisit: new Date().toISOString().split('T')[0],
      lastVisitMonths: 0,
      crmScore: 65,
      recommendedAction: `${newPatient.category} Rutin Muayenesi`,
      recommendedActionIcon: 'Stethoscope',
      recommendedCategory: newPatient.category,
      priority: urgency.priority,
      status: 'Active',
      phone: newPatient.phone,
      email: newPatient.email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      vitals: {
        systolic: Number(newPatient.systolic),
        diastolic: Number(newPatient.diastolic),
        heartRate: Number(newPatient.heartRate)
      },
      riskFactors: {
        smoking: 'None',
        familyHistory: 'None',
        controlGap: 'Newly Registered'
      },
      history: [
        { id: `h-${Date.now()}`, date: new Date().toISOString().split('T')[0], type: 'general', title: 'İlk Kayıt & Triyaj', detail: 'Yeni hasta kaydı oluşturuldu ve vital veriler alındı.' }
      ],
      aiConfidence: 92,
      aiReasoning: urgency.reasoningTr,
      aiRuleCode: 'RULE-REG-NEW',
      treatmentFollowUp: 'Takip başlatıldı'
    };

    const saved = await createPatient(createdPayload);
    setPatients([saved, ...patients]);
    setIsSubmitting(false);
    setIsAddModalOpen(false);

    // Reset form
    setNewPatient({
      name: '',
      age: 45,
      gender: 'Male',
      phone: '',
      email: '',
      category: 'Cardiology',
      systolic: 130,
      diastolic: 85,
      heartRate: 78
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hasta Kayıt Yönetimi (Patient Management)</h1>
          <p className="text-sm text-muted-foreground">
            Hasta kayıtları, 360° klinik geçmiş, vital takibi ve triyaj öncelikleri.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Yeni Hasta Kaydı
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Hasta adı, MRN No veya Telefon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ALL">Tüm Kategoriler</option>
            <option value="Cardiology">Kardiyoloji</option>
            <option value="Diabetes">Diyabet</option>
            <option value="Oncology">Onkoloji</option>
            <option value="Preventative">Koruyucu Tıp</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ALL">Tüm Öncelikler</option>
            <option value="URGENT">Acil (Urgent)</option>
            <option value="MEDIUM">Orta (Medium)</option>
            <option value="ROUTINE">Rutin (Routine)</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Hasta kayıtları yükleniyor...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Aramaya veya filtreye uygun hasta kaydı bulunamadı.
        </div>
      ) : (
        /* Patient Cards Grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => {
            const risk = getRiskScore(patient);
            const urgency = getAIUrgencyTag(patient.vitals);

            return (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="group cursor-pointer rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={patient.avatarUrl}
                      alt={patient.name}
                      className="h-12 w-12 rounded-full object-cover border border-border"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{patient.id} • {patient.age} yaş ({patient.gender === 'Female' ? 'Kadın' : 'Erkek'})</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${urgency.color}`}>
                    {urgency.priority}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Yaşamsal Bulgular:</span>
                    <span className="font-medium text-foreground">{urgency.vitalsStr}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Klinik Risk Skoru:</span>
                    <span className={`font-bold ${risk.color}`}>%{risk.score} ({risk.level})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Son Muayene:</span>
                    <span className="text-foreground">{patient.lastVisit} ({patient.lastVisitMonths} ay önce)</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-2.5 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <HeartPulse className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate text-foreground font-medium">{patient.recommendedAction}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 360 Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <img
                src={selectedPatient.avatarUrl}
                alt={selectedPatient.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {selectedPatient.id}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedPatient.age} Yaş • {selectedPatient.gender} • Kan Grubu: {selectedPatient.bloodType} • BMI: {selectedPatient.bmi} ({selectedPatient.bmiStatus})
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {selectedPatient.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {selectedPatient.email}</span>
                </div>
              </div>
            </div>

            {/* AI Urgency & Clinical Intelligence Banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" /> Klinik AI Triyaj Değerlendirmesi (%{selectedPatient.aiConfidence} Güven)
                </span>
                <span className="text-xs font-mono bg-primary/10 px-2 py-0.5 rounded text-primary">
                  Kural: {selectedPatient.aiRuleCode}
                </span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                {selectedPatient.aiReasoning}
              </p>
            </div>

            {/* Vitals Summary Card */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3 text-center bg-muted/20">
                <span className="text-xs text-muted-foreground block">Kan Basıncı</span>
                <span className="text-base font-bold text-foreground">{selectedPatient.vitals?.systolic}/{selectedPatient.vitals?.diastolic} mmHg</span>
              </div>
              <div className="rounded-lg border border-border p-3 text-center bg-muted/20">
                <span className="text-xs text-muted-foreground block">İstirahat Nabız</span>
                <span className="text-base font-bold text-foreground">{selectedPatient.vitals?.heartRate} BPM</span>
              </div>
              <div className="rounded-lg border border-border p-3 text-center bg-muted/20">
                <span className="text-xs text-muted-foreground block">Oksijen Satürasyonu</span>
                <span className="text-base font-bold text-foreground">%{selectedPatient.vitals?.oxygenSaturation || 98} SpO2</span>
              </div>
            </div>

            {/* Patient 360 Unified Case Timeline */}
            <UnifiedCaseTimeline 
              patientId={selectedPatient.id}
              patientName={selectedPatient.name}
            />

            {/* Action Bar */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Kapat
              </button>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Klinik Randevu Ver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Yeni Hasta Kaydı</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Ad Soyad</label>
                <input
                  required
                  type="text"
                  value={newPatient.name}
                  onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2"
                  placeholder="Örn: Fatma Özkan"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Yaş</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={e => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Cinsiyet</label>
                  <select
                    value={newPatient.gender}
                    onChange={e => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  >
                    <option value="Male">Erkek</option>
                    <option value="Female">Kadın</option>
                    <option value="Other">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Telefon</label>
                  <input
                    type="text"
                    value={newPatient.phone}
                    onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2"
                    placeholder="+90 5XX..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">E-Posta</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={e => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Sistolik BP</label>
                  <input
                    type="number"
                    value={newPatient.systolic}
                    onChange={e => setNewPatient({ ...newPatient, systolic: Number(e.target.value) })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Diyastolik BP</label>
                  <input
                    type="number"
                    value={newPatient.diastolic}
                    onChange={e => setNewPatient({ ...newPatient, diastolic: Number(e.target.value) })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Nabız (BPM)</label>
                  <input
                    type="number"
                    value={newPatient.heartRate}
                    onChange={e => setNewPatient({ ...newPatient, heartRate: Number(e.target.value) })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
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
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
