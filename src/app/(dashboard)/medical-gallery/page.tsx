"use client";

import React, { useState, useEffect } from 'react';
import { fetchMedicalMedia, createMedicalMedia } from '@/lib/clinical/healthcare-service';
import { fetchPatients } from '@/lib/clinical/service';
import { MedicalMedia } from '@/types/healthcare';
import { Patient } from '@/types/clinical';
import {
  Image as ImageIcon,
  Plus,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  Loader2,
  X,
  FileCheck,
  ShieldCheck,
  Eye,
  Camera
} from 'lucide-react';

export default function MedicalGalleryPage() {
  const [mediaItems, setMediaItems] = useState<MedicalMedia[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MedicalMedia | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Media state
  const [newMedia, setNewMedia] = useState({
    patientId: '',
    patientName: '',
    treatmentTitle: 'Estetik Zirkonyum Diş Restorasyonu',
    beforeImageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
    marketingConsentGiven: true,
    notes: 'Operasyon sonrası 3. ay kontrol fotosu.'
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const [fetchedM, fetchedP] = await Promise.all([
        fetchMedicalMedia(),
        fetchPatients()
      ]);
      if (isMounted) {
        setMediaItems(fetchedM);
        setPatients(fetchedP);
        if (fetchedP.length > 0) {
          setNewMedia(prev => ({
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

  const filteredMedia = mediaItems.filter(item =>
    item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.treatmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const created: MedicalMedia = {
      id: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: newMedia.patientId || (patients[0]?.id || 'MRN-001'),
      patientName: newMedia.patientName || (patients[0]?.name || 'Hasta'),
      treatmentTitle: newMedia.treatmentTitle,
      beforeImageUrl: newMedia.beforeImageUrl,
      afterImageUrl: newMedia.afterImageUrl,
      captureDate: new Date().toISOString().split('T')[0],
      marketingConsentGiven: newMedia.marketingConsentGiven,
      notes: newMedia.notes
    };

    const saved = await createMedicalMedia(created);
    setMediaItems([saved, ...mediaItems]);
    setIsSubmitting(false);
    setIsAddModalOpen(false);

    setToastMessage(`"${saved.patientName}" için medikal Before/After medya arşive eklendi.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tıbbi Medya & Before/After Galerisi</h1>
          <p className="text-sm text-muted-foreground">
            Operasyon öncesi ve sonrası medikal fotoğraf karşılaştırması ve KVKK/Onam arşivleme.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Yeni Medya Karşılaştırması Ekle
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
            placeholder="Hasta veya tedavi adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Media Gallery Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Medikal medya arşivi yükleniyor...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Kayıtlı tıbbi fotoğraf bulunamadı.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredMedia.map(item => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {item.id}
                  </span>
                  <h3 className="font-bold text-base mt-1 text-foreground">{item.patientName}</h3>
                  <p className="text-xs font-medium text-primary">{item.treatmentTitle}</p>
                </div>
                {item.marketingConsentGiven && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <ShieldCheck className="h-3 w-3" /> Medya İzni Var
                  </span>
                )}
              </div>

              {/* Side-by-side Before/After Image Comparison Container */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative group overflow-hidden rounded-lg border border-border bg-black/5">
                  <img
                    src={item.beforeImageUrl}
                    alt="Öncesi (Before)"
                    className="w-full h-44 object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                    ÖNCESİ (BEFORE)
                  </span>
                </div>
                <div className="relative group overflow-hidden rounded-lg border border-border bg-black/5">
                  <img
                    src={item.afterImageUrl}
                    alt="Sonrası (After)"
                    className="w-full h-44 object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                    SONRASI (AFTER)
                  </span>
                </div>
              </div>

              {item.notes && (
                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-border">
                  Klinik Not: {item.notes}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Kayıt Tarihi: {item.captureDate}</span>
                <button
                  onClick={() => setSelectedMedia(item)}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <Eye className="h-3.5 w-3.5" /> Tam Ekran İncele
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl rounded-2xl bg-card border border-border p-6 space-y-4 shadow-2xl">
            <button onClick={() => setSelectedMedia(null)} className="absolute right-4 top-4 text-muted-foreground hover:bg-muted p-1.5 rounded-full">
              <X className="h-6 w-6" />
            </button>

            <div>
              <span className="text-xs text-primary font-mono font-bold">{selectedMedia.id}</span>
              <h2 className="text-xl font-bold">{selectedMedia.patientName} • {selectedMedia.treatmentTitle}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground block text-center">OPERASYON ÖNCESİ (BEFORE)</span>
                <img src={selectedMedia.beforeImageUrl} alt="Before" className="w-full h-80 object-cover rounded-xl border border-border" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 block text-center">OPERASYON SONRASI (AFTER)</span>
                <img src={selectedMedia.afterImageUrl} alt="After" className="w-full h-80 object-cover rounded-xl border border-emerald-500/30" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedMedia(null)} className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Yeni Medikal Galeri Kaydı</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Hasta Seçimi</label>
                <select
                  value={newMedia.patientId}
                  onChange={e => {
                    const p = patients.find(pt => pt.id === e.target.value);
                    setNewMedia({ ...newMedia, patientId: e.target.value, patientName: p ? p.name : '' });
                  }}
                  className="w-full rounded-md border border-input bg-background p-2"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Tedavi / Operasyon Başlığı</label>
                <input
                  type="text"
                  required
                  value={newMedia.treatmentTitle}
                  onChange={e => setNewMedia({ ...newMedia, treatmentTitle: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Öncesi (Before) Fotoğraf URL</label>
                <input
                  type="text"
                  required
                  value={newMedia.beforeImageUrl}
                  onChange={e => setNewMedia({ ...newMedia, beforeImageUrl: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Sonrası (After) Fotoğraf URL</label>
                <input
                  type="text"
                  required
                  value={newMedia.afterImageUrl}
                  onChange={e => setNewMedia({ ...newMedia, afterImageUrl: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Klinik Notlar</label>
                <textarea
                  rows={2}
                  value={newMedia.notes}
                  onChange={e => setNewMedia({ ...newMedia, notes: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  checked={newMedia.marketingConsentGiven}
                  onChange={e => setNewMedia({ ...newMedia, marketingConsentGiven: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <label htmlFor="marketingConsent" className="text-xs text-foreground cursor-pointer">
                  Hasta pazarlama ve vaka paylaşım onamını imzaladı.
                </label>
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
                  Medyayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
