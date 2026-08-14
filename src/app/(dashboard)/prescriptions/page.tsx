"use client";

import React, { useState, useEffect } from 'react';
import { fetchPrescriptions, createPrescription } from '@/lib/clinical/healthcare-service';
import { fetchPatients } from '@/lib/clinical/service';
import { Prescription, MedicationItem } from '@/types/healthcare';
import { Patient } from '@/types/clinical';
import {
  Pill,
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  FileText,
  User,
  Stethoscope,
  Loader2,
  X,
  Printer,
  Share2,
  Trash2
} from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Prescription Form state
  const [newRx, setNewRx] = useState({
    patientId: '',
    patientName: '',
    doctorName: 'Prof. Dr. Mehmet Öz',
    diagnosis: '',
    consentFormTitle: 'Genel Tedavi & İlaç Kullanım Aydınlatılmış Onam Formu',
    medications: [
      { id: 'm-1', name: '', dosage: '1 Tablet', frequency: 'Günde 2 Defa (Aç)', duration: '14 Gün', notes: '' }
    ]
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const [fetchedRx, fetchedP] = await Promise.all([
        fetchPrescriptions(),
        fetchPatients()
      ]);
      if (isMounted) {
        setPrescriptions(fetchedRx);
        setPatients(fetchedP);
        if (fetchedP.length > 0) {
          setNewRx(prev => ({
            ...prev,
            patientId: fetchedP[0].id,
            patientName: fetchedP[0].name
          }));
        }
        setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const filteredPrescriptions = prescriptions.filter(rx =>
    rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicationRow = () => {
    setNewRx(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { id: `m-${Date.now()}`, name: '', dosage: '1 Tablet', frequency: 'Günde 1 Defa (Tok)', duration: '7 Gün', notes: '' }
      ]
    }));
  };

  const handleRemoveMedicationRow = (id: string) => {
    if (newRx.medications.length <= 1) return;
    setNewRx(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== id)
    }));
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const created: Prescription = {
      id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: newRx.patientId || (patients[0]?.id || 'MRN-001'),
      patientName: newRx.patientName || (patients[0]?.name || 'Hasta'),
      doctorName: newRx.doctorName,
      diagnosis: newRx.diagnosis,
      medications: newRx.medications.filter(m => m.name.trim() !== ''),
      consentFormTitle: newRx.consentFormTitle,
      consentSigned: true,
      signedAt: new Date().toISOString()
    };

    const saved = await createPrescription(created);
    setPrescriptions([saved, ...prescriptions]);
    setIsSubmitting(false);
    setIsAddModalOpen(false);

    setToastMessage(`"${saved.patientName}" için dijital reçete düzenlendi ve onam formu oluşturuldu.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dijital Reçete & Onam Formları Yönetimi</h1>
          <p className="text-sm text-muted-foreground">
            Hastaya özel reçeteler, dozaj rehberi ve tıbbi aydınlatılmış onam formları.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Yeni Reçete Düzenle
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="font-bold underline">Kapat</button>
        </div>
      )}

      {/* Search */}
      <div className="bg-card p-4 rounded-xl border border-border">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Hasta adı, teşhis veya hekim ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Reçeteler yükleniyor...</p>
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Henüz kayıtlı reçete bulunamadı.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPrescriptions.map(rx => (
            <div key={rx.id} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {rx.id}
                  </span>
                  <h3 className="font-bold text-base mt-2 text-foreground">{rx.patientName}</h3>
                  <p className="text-xs text-muted-foreground">{rx.doctorName}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <FileCheck className="h-3.5 w-3.5" /> Onam İmzalandı
                </span>
              </div>

              <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-1 text-xs">
                <span className="text-muted-foreground font-semibold block">Teşhis & Klinik Tanı:</span>
                <span className="font-medium text-foreground">{rx.diagnosis}</span>
              </div>

              {/* Medication List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Pill className="h-4 w-4 text-primary" /> Reçete Edilen İlaçlar ({rx.medications.length})
                </span>
                <div className="space-y-1.5">
                  {rx.medications.map((m, idx) => (
                    <div key={m.id || idx} className="rounded border border-border p-2 text-xs flex items-center justify-between bg-card">
                      <div>
                        <span className="font-bold text-foreground block">{m.name}</span>
                        <span className="text-[11px] text-muted-foreground">{m.dosage} • {m.frequency}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {m.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Onam: <strong className="text-foreground">{rx.consentFormTitle}</strong>
                </span>
                <button
                  onClick={() => setSelectedPrescription(rx)}
                  className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1 font-medium hover:bg-muted"
                >
                  <Printer className="h-3 w-3 text-primary" /> Yazdır / Görüntüle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedPrescription(null)} className="absolute right-4 top-4 text-muted-foreground hover:bg-muted p-1 rounded-full">
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-border pb-4 space-y-1">
              <span className="text-xs font-mono font-bold text-primary">{selectedPrescription.id} • DİJİTAL REÇETE BELGESİ</span>
              <h2 className="text-xl font-bold">{selectedPrescription.patientName}</h2>
              <p className="text-xs text-muted-foreground">Düzenleyen Hekim: {selectedPrescription.doctorName}</p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-foreground">Teşhis:</span>
              <p className="bg-muted/40 p-3 rounded border border-border">{selectedPrescription.diagnosis}</p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-foreground">İlaç Kullanım Rehberi:</span>
              <div className="space-y-2">
                {selectedPrescription.medications.map((m, i) => (
                  <div key={i} className="p-3 border border-border rounded-lg bg-card space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{i + 1}. {m.name}</span>
                      <span className="text-primary">{m.dosage}</span>
                    </div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>Kullanım Sıklığı: {m.frequency}</span>
                      <span>Süre: {m.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-600" />
                <span>{selectedPrescription.consentFormTitle} dijital olarak onaylanmıştır.</span>
              </div>
              <span className="text-[10px] font-mono font-bold">İmzalandı</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button onClick={() => setSelectedPrescription(null)} className="px-4 py-2 text-xs font-medium border border-input rounded-md hover:bg-muted">
                Kapat
              </button>
              <button onClick={() => window.print()} className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-1.5">
                <Printer className="h-3.5 w-3.5" /> Reçeteyi Yazdır
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Yeni Dijital Reçete Yaz</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Hasta Seçimi</label>
                <select
                  value={newRx.patientId}
                  onChange={e => {
                    const p = patients.find(pt => pt.id === e.target.value);
                    setNewRx({ ...newRx, patientId: e.target.value, patientName: p ? p.name : '' });
                  }}
                  className="w-full rounded-md border border-input bg-background p-2"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Teşhis & Klinik Tanı</label>
                <textarea
                  required
                  rows={2}
                  value={newRx.diagnosis}
                  onChange={e => setNewRx({ ...newRx, diagnosis: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                  placeholder="Örn: Hipertansiyon & Kardiyak Taşikardi..."
                />
              </div>

              {/* Dynamic Medication Rows */}
              <div className="space-y-3 border-t border-b border-border py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Reçete İlaçları</span>
                  <button
                    type="button"
                    onClick={handleAddMedicationRow}
                    className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> İlaç Ekle
                  </button>
                </div>

                {newRx.medications.map((m, idx) => (
                  <div key={m.id} className="p-3 border border-border rounded-lg bg-muted/20 space-y-2 relative">
                    {newRx.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicationRow(m.id)}
                        className="absolute right-2 top-2 text-rose-500 hover:bg-rose-50 p-1 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <input
                      type="text"
                      required
                      placeholder="İlaç Adı (Örn: Beloc ZOK 50mg)"
                      value={m.name}
                      onChange={e => {
                        const updated = [...newRx.medications];
                        updated[idx].name = e.target.value;
                        setNewRx({ ...newRx, medications: updated });
                      }}
                      className="w-full rounded-md border border-input bg-background p-1.5 text-xs"
                    />

                    <div className="grid grid-cols-3 gap-1.5">
                      <input
                        type="text"
                        placeholder="Dozaj (1 Tablet)"
                        value={m.dosage}
                        onChange={e => {
                          const updated = [...newRx.medications];
                          updated[idx].dosage = e.target.value;
                          setNewRx({ ...newRx, medications: updated });
                        }}
                        className="rounded-md border border-input bg-background p-1 text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Sıklık (Günde 2)"
                        value={m.frequency}
                        onChange={e => {
                          const updated = [...newRx.medications];
                          updated[idx].frequency = e.target.value;
                          setNewRx({ ...newRx, medications: updated });
                        }}
                        className="rounded-md border border-input bg-background p-1 text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Süre (14 Gün)"
                        value={m.duration}
                        onChange={e => {
                          const updated = [...newRx.medications];
                          updated[idx].duration = e.target.value;
                          setNewRx({ ...newRx, medications: updated });
                        }}
                        className="rounded-md border border-input bg-background p-1 text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Tıbbi Onam Formu Başlığı</label>
                <input
                  type="text"
                  value={newRx.consentFormTitle}
                  onChange={e => setNewRx({ ...newRx, consentFormTitle: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                />
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
                  Reçeteyi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
