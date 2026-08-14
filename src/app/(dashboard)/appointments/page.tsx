"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { fetchAppointments, createAppointment } from '@/lib/clinical/healthcare-service';
import { fetchPatients } from '@/lib/clinical/service';
import { Appointment } from '@/types/healthcare';
import { Patient } from '@/types/clinical';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Loader2,
  X,
  Stethoscope,
  Building2,
  CalendarCheck
} from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Appointment state
  const [newApp, setNewApp] = useState({
    patientId: '',
    patientName: '',
    doctorName: 'Prof. Dr. Mehmet Öz',
    department: 'Kardiyoloji',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00',
    notes: ''
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const [fetchedApp, fetchedP] = await Promise.all([
        fetchAppointments(),
        fetchPatients()
      ]);
      if (isMounted) {
        setAppointments(fetchedApp);
        setPatients(fetchedP);
        if (fetchedP.length > 0) {
          setNewApp(prev => ({
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchesSearch = app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, selectedStatus]);

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const created: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: newApp.patientId || (patients[0]?.id || 'MRN-001'),
      patientName: newApp.patientName || (patients[0]?.name || 'Hasta'),
      doctorName: newApp.doctorName,
      department: newApp.department,
      appointmentDate: newApp.appointmentDate,
      appointmentTime: newApp.appointmentTime,
      status: 'CONFIRMED',
      notes: newApp.notes,
      whatsappReminderSent: false
    };

    const saved = await createAppointment(created);
    setAppointments([saved, ...appointments]);
    setIsSubmitting(false);
    setIsAddModalOpen(false);

    setToastMessage(`"${saved.patientName}" için ${saved.appointmentDate} saat ${saved.appointmentTime} randevusu başarıyla oluşturuldu.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendReminder = (app: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, whatsappReminderSent: true } : a));
    setToastMessage(`"${app.patientName}" isimli hastaya WhatsApp randevu hatırlatma mesajı iletildi.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Randevu & Hekim Takvimi Yönetimi</h1>
          <p className="text-sm text-muted-foreground">
            Poliklinik randevuları, hekim takvimleri ve otomatik WhatsApp randevu bildirimleri.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Yeni Randevu Oluştur
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

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Hasta adı, doktor veya poliklinik ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="ALL">Tüm Randevu Durumları</option>
          <option value="CONFIRMED">Onaylandı (Confirmed)</option>
          <option value="PLANNED">Planlandı (Planned)</option>
          <option value="COMPLETED">Tamamlandı (Completed)</option>
          <option value="CANCELLED">İptal Edildi (Cancelled)</option>
        </select>
      </div>

      {/* Appointment Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Randevu takvimi yükleniyor...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Kriterlere uygun randevu bulunamadı.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((app) => (
            <div key={app.id} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {app.id}
                  </span>
                  <h3 className="font-bold text-base mt-2 text-foreground">{app.patientName}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  app.status === 'CONFIRMED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : app.status === 'PLANNED'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {app.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground border-t border-b border-border py-3">
                <div className="flex items-center justify-between text-foreground">
                  <span className="flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-primary" /> Hekim:</span>
                  <span className="font-semibold">{app.doctorName}</span>
                </div>
                <div className="flex items-center justify-between text-foreground">
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-primary" /> Poliklinik:</span>
                  <span>{app.department}</span>
                </div>
                <div className="flex items-center justify-between text-foreground">
                  <span className="flex items-center gap-1.5"><CalendarCheck className="h-3.5 w-3.5 text-primary" /> Tarih / Saat:</span>
                  <span className="font-bold text-primary">{app.appointmentDate} • {app.appointmentTime}</span>
                </div>
              </div>

              {app.notes && (
                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-border">
                  Not: {app.notes}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  {app.whatsappReminderSent ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> WhatsApp Gönderildi</span>
                  ) : (
                    <span>Hatırlatma Bekliyor</span>
                  )}
                </span>
                <button
                  onClick={() => handleSendReminder(app)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 font-medium hover:bg-muted"
                >
                  <Send className="h-3 w-3 text-primary" />
                  WhatsApp Hatırlat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Appointment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">Yeni Randevu Kaydı</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Hasta Seçimi</label>
                <select
                  value={newApp.patientId}
                  onChange={e => {
                    const p = patients.find(pt => pt.id === e.target.value);
                    setNewApp({
                      ...newApp,
                      patientId: e.target.value,
                      patientName: p ? p.name : ''
                    });
                  }}
                  className="w-full rounded-md border border-input bg-background p-2"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Hekim Adı</label>
                <input
                  type="text"
                  required
                  value={newApp.doctorName}
                  onChange={e => setNewApp({ ...newApp, doctorName: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Poliklinik / Bölüm</label>
                <select
                  value={newApp.department}
                  onChange={e => setNewApp({ ...newApp, department: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2"
                >
                  <option value="Kardiyoloji">Kardiyoloji</option>
                  <option value="Endokrinoloji">Endokrinoloji</option>
                  <option value="Onkoloji">Koruyucu Onkoloji</option>
                  <option value="Ağız ve Diş Sağlığı">Ağız ve Diş Sağlığı</option>
                  <option value="Saç Ekimi & Estetik">Saç Ekimi & Estetik</option>
                  <option value="Genel Cerrahi">Genel Cerrahi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Randevu Tarihi</label>
                  <input
                    type="date"
                    required
                    value={newApp.appointmentDate}
                    onChange={e => setNewApp({ ...newApp, appointmentDate: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Randevu Saati</label>
                  <input
                    type="time"
                    required
                    value={newApp.appointmentTime}
                    onChange={e => setNewApp({ ...newApp, appointmentTime: e.target.value })}
                    className="w-full rounded-md border border-input bg-background p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Randevu Notları</label>
                <textarea
                  rows={2}
                  value={newApp.notes}
                  onChange={e => setNewApp({ ...newApp, notes: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs"
                  placeholder="Açlık durumu, getirilecek tetkikler..."
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
                  Randevuyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
