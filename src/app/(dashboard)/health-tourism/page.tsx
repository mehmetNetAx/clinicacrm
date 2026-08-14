"use client";

import React, { useState, useEffect } from 'react';
import { fetchHealthTourismLogistics, createHealthTourismLogistics } from '@/lib/clinical/healthcare-service';
import { fetchPatients } from '@/lib/clinical/service';
import { HealthTourismLogistics } from '@/types/healthcare';
import { Patient } from '@/types/clinical';
import {
  Plane,
  Building,
  Car,
  Languages,
  Plus,
  Search,
  CheckCircle2,
  Globe,
  DollarSign,
  Loader2,
  X,
  Phone,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function HealthTourismPage() {
  const [logistics, setLogistics] = useState<HealthTourismLogistics[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Health Tourism Entry state
  const [newHt, setNewHt] = useState({
    patientId: '',
    patientName: '',
    country: 'İngiltere (UK)',
    passportNumber: '',
    flightCode: 'TK1984',
    hotelName: 'Swissôtel The Bosphorus',
    transferDriverName: 'Hasan Usta (VIP Vito)',
    translatorName: 'Selin Yılmaz',
    language: 'İngilizce',
    packagePrice: 3500,
    currency: 'EUR' as 'EUR' | 'USD' | 'GBP' | 'TRY'
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const [fetchedHt, fetchedP] = await Promise.all([
        fetchHealthTourismLogistics(),
        fetchPatients()
      ]);
      if (isMounted) {
        setLogistics(fetchedHt);
        setPatients(fetchedP);
        if (fetchedP.length > 0) {
          setNewHt(prev => ({
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

  const filteredLogistics = logistics.filter(ht =>
    ht.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ht.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ht.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLogistics = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const created: HealthTourismLogistics = {
      id: `HT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: newHt.patientId || (patients[0]?.id || 'MRN-001'),
      patientName: newHt.patientName || (patients[0]?.name || 'Hasta'),
      country: newHt.country,
      passportNumber: newHt.passportNumber,
      flightCode: newHt.flightCode,
      arrivalDate: new Date(Date.now() + 86400000).toISOString(),
      departureDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      hotelName: newHt.hotelName,
      transferDriverName: newHt.transferDriverName,
      transferStatus: 'SCHEDULED',
      translatorName: newHt.translatorName,
      language: newHt.language,
      packagePrice: Number(newHt.packagePrice),
      currency: newHt.currency
    };

    const saved = await createHealthTourismLogistics(created);
    setLogistics([saved, ...logistics]);
    setIsSubmitting(false);
    setIsAddModalOpen(false);

    setToastMessage(`"${saved.patientName}" için medikal turizm lojistiği kaydedildi.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStatusChange = (id: string, status: HealthTourismLogistics['transferStatus']) => {
    setLogistics(prev => prev.map(ht => ht.id === id ? { ...ht, transferStatus: status } : ht));
    setToastMessage(`Transfer durumu güncellendi.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sağlık Turizmi & Lojistik Operasyonları</h1>
          <p className="text-sm text-muted-foreground">
            Yurt dışı hastaları için VIP havalimanı transferi, otel, uçuş ve tercüman takibi.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Yeni Lojistik Kaydı Ekle
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
            placeholder="Hasta adı, ülke veya pasaport no ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Logistics Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Sağlık turizmi kayıtları yükleniyor...</p>
        </div>
      ) : filteredLogistics.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Kayıtlı medikal turizm lojistiği bulunamadı.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredLogistics.map(ht => (
            <div key={ht.id} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {ht.id}
                    </span>
                    <span className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 text-primary" /> {ht.country}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mt-1 text-foreground">{ht.patientName}</h3>
                  <p className="text-xs text-muted-foreground">Pasaport: {ht.passportNumber || 'Belirtilmedi'}</p>
                </div>
                <span className="font-bold text-base text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  {ht.packagePrice.toLocaleString()} {ht.currency}
                </span>
              </div>

              {/* Logistics Details */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-border py-3">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Plane className="h-3.5 w-3.5 text-primary" /> Uçuş Kodu:</span>
                  <span className="font-semibold text-foreground block">{ht.flightCode}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Building className="h-3.5 w-3.5 text-primary" /> Otel Konaklama:</span>
                  <span className="font-semibold text-foreground block truncate">{ht.hotelName}</span>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Car className="h-3.5 w-3.5 text-primary" /> VIP Transfer Araç/Şoför:</span>
                  <span className="font-semibold text-foreground block truncate">{ht.transferDriverName}</span>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Languages className="h-3.5 w-3.5 text-primary" /> Tercüman ({ht.language}):</span>
                  <span className="font-semibold text-foreground block">{ht.translatorName}</span>
                </div>
              </div>

              {/* Status Action */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-muted-foreground">Transfer Durumu:</span>
                <select
                  value={ht.transferStatus}
                  onChange={(e) => handleStatusChange(ht.id, e.target.value as any)}
                  className="rounded border border-input bg-background px-2 py-1 text-xs font-semibold"
                >
                  <option value="SCHEDULED">Planlandı (Scheduled)</option>
                  <option value="PICKED_UP">Karşılandı (Picked Up)</option>
                  <option value="COMPLETED">Tamamlandı (Completed)</option>
                  <option value="CANCELLED">İptal Edildi (Cancelled)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Logistics Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Yeni Medikal Turizm Lojistiği Ekle</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <form onSubmit={handleAddLogistics} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Hasta Seçimi</label>
                <select
                  value={newHt.patientId}
                  onChange={e => {
                    const p = patients.find(pt => pt.id === e.target.value);
                    setNewHt({ ...newHt, patientId: e.target.value, patientName: p ? p.name : '' });
                  }}
                  className="w-full rounded-md border border-input bg-background p-2"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Ülke</label>
                  <input
                    type="text"
                    required
                    value={newHt.country}
                    onChange={e => setNewHt({ ...newHt, country: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Pasaport No</label>
                  <input
                    type="text"
                    value={newHt.passportNumber}
                    onChange={e => setNewHt({ ...newHt, passportNumber: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2"
                    placeholder="GB123456..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Uçuş Kodu</label>
                  <input
                    type="text"
                    value={newHt.flightCode}
                    onChange={e => setNewHt({ ...newHt, flightCode: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2"
                    placeholder="TK1984"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Otel Rezervasyonu</label>
                  <input
                    type="text"
                    value={newHt.hotelName}
                    onChange={e => setNewHt({ ...newHt, hotelName: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">VIP Transfer Şoför / Araç</label>
                  <input
                    type="text"
                    value={newHt.transferDriverName}
                    onChange={e => setNewHt({ ...newHt, transferDriverName: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Tercüman Adı & Dil</label>
                  <input
                    type="text"
                    value={newHt.translatorName}
                    onChange={e => setNewHt({ ...newHt, translatorName: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2"
                    placeholder="Selin Yılmaz (İngilizce)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Paket Fiyatı</label>
                  <input
                    type="number"
                    value={newHt.packagePrice}
                    onChange={e => setNewHt({ ...newHt, packagePrice: Number(e.target.value) })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Para Birimi</label>
                  <select
                    value={newHt.currency}
                    onChange={e => setNewHt({ ...newHt, currency: e.target.value as any })}
                    className="w-full rounded-md border border-input bg-background p-2"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="TRY">TRY (₺)</option>
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
                  Lojistik Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
