import { createClient } from '@/lib/supabase/client';
import { Appointment, Prescription, HealthTourismLogistics, MedicalMedia } from '@/types/healthcare';

// --- Mock Initial Fallback Data ---

export const mockAppointments: Appointment[] = [
  {
    id: "APT-1001",
    patientId: "MRN-88421",
    patientName: "Ayşe Yılmaz",
    doctorName: "Prof. Dr. Mehmet Öz",
    department: "Kardiyoloji",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "10:30",
    status: "CONFIRMED",
    notes: "EKO & Hipertansiyon takibi. Aç gelinmesi rica edildi.",
    whatsappReminderSent: true
  },
  {
    id: "APT-1002",
    patientId: "MRN-92104",
    patientName: "Mehmet Kaya",
    doctorName: "Doç. Dr. Elif Arslan",
    department: "Endokrinoloji",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "14:00",
    status: "PLANNED",
    notes: "HbA1c kan şekeri regülasyon kontrolü.",
    whatsappReminderSent: false
  },
  {
    id: "APT-1003",
    patientId: "MRN-73419",
    patientName: "Zeynep Demir",
    doctorName: "Dr. Canan Yılmaz",
    department: "Koruyucu Onkoloji",
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    appointmentTime: "11:15",
    status: "CONFIRMED",
    notes: "Yıllık mamografi ve ultrason kontrolü.",
    whatsappReminderSent: true
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: "RX-4001",
    patientId: "MRN-88421",
    patientName: "Ayşe Yılmaz",
    doctorName: "Prof. Dr. Mehmet Öz",
    diagnosis: "Primer Hipertansiyon & Sinüs Trakikardi",
    medications: [
      { id: "m1", name: "Beloc ZOK 50mg", dosage: "1 Tablet", frequency: "Günde 1 Defa (Sabah Tok)", duration: "30 Gün", notes: "Düzenli tansiyon ölçümü ile alınmalı." },
      { id: "m2", name: "Coraspin 100mg", dosage: "1 Tablet", frequency: "Günde 1 Defa (Öğle Tok)", duration: "90 Gün" }
    ],
    consentFormTitle: "Kardiyak Girişimsel EKO Aydınlatılmış Onam Formu",
    consentSigned: true,
    signedAt: "2026-08-10T14:30:00Z"
  },
  {
    id: "RX-4002",
    patientId: "MRN-92104",
    patientName: "Mehmet Kaya",
    doctorName: "Doç. Dr. Elif Arslan",
    diagnosis: "Tip 2 Diyabet (Glukoz İntoleransı)",
    medications: [
      { id: "m3", name: "Glucophage 1000mg", dosage: "1 Tablet", frequency: "Günde 2 Defa (Aç/Tok)", duration: "60 Gün", notes: "Diyet programına uyulmalı." }
    ],
    consentFormTitle: "Diyabet Tedavi Protokolü & Kan Şekeri Takip Sözleşmesi",
    consentSigned: true,
    signedAt: "2026-08-05T09:15:00Z"
  }
];

export const mockHealthTourism: HealthTourismLogistics[] = [
  {
    id: "HT-7001",
    patientId: "MRN-88421",
    patientName: "John Smith",
    country: "İngiltere (UK)",
    passportNumber: "GB9823411",
    flightCode: "TK1984 (London LGW -> IST)",
    arrivalDate: new Date(Date.now() + 86400000).toISOString(),
    departureDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    hotelName: "Swissôtel The Bosphorus (5 Yıldız)",
    transferDriverName: "Hasan Usta (VIP Mercedes Vito)",
    transferStatus: "SCHEDULED",
    translatorName: "Selin Yılmaz",
    language: "İngilizce",
    packagePrice: 3500,
    currency: "EUR"
  },
  {
    id: "HT-7002",
    patientId: "MRN-92104",
    patientName: "Tareq Al-Mansoor",
    country: "Birleşik Arap Emirlikleri (UAE)",
    passportNumber: "AE7741209",
    flightCode: "EK121 (Dubai DXB -> IST)",
    arrivalDate: new Date().toISOString(),
    departureDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    hotelName: "Raffles İstanbul",
    transferDriverName: "Murat Şahin (Sprinter VIP)",
    transferStatus: "PICKED_UP",
    translatorName: "Ahmet Al-Bitar",
    language: "Arapça",
    packagePrice: 6200,
    currency: "EUR"
  }
];

export const mockMedicalMedia: MedicalMedia[] = [
  {
    id: "MED-5001",
    patientId: "MRN-88421",
    patientName: "Ayşe Yılmaz",
    treatmentTitle: "Zirkonyum Gülüş Tasarımı & Estetik Diş",
    beforeImageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80",
    captureDate: "2026-08-01",
    marketingConsentGiven: true,
    notes: "12 Üye Zirkonyum Kron restorasyonu tamamlandı."
  },
  {
    id: "MED-5002",
    patientId: "MRN-92104",
    patientName: "Mehmet Kaya",
    treatmentTitle: "FUE Saç Ekimi Operasyonu (4200 Greft)",
    beforeImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    captureDate: "2026-07-15",
    marketingConsentGiven: true,
    notes: "Ön çizgi ve tepe bölgesi yoğunlaştırma ekimi."
  }
];

// --- Data Mappers ---

export function mapDbToAppointment(row: any): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    doctorName: row.doctor_name,
    department: row.department,
    appointmentDate: String(row.appointment_date),
    appointmentTime: row.appointment_time,
    status: row.status,
    notes: row.notes || '',
    whatsappReminderSent: Boolean(row.whatsapp_reminder_sent)
  };
}

export function mapAppointmentToDb(item: Appointment): any {
  return {
    id: item.id,
    patient_id: item.patientId,
    patient_name: item.patientName,
    doctor_name: item.doctorName,
    department: item.department,
    appointment_date: item.appointmentDate,
    appointment_time: item.appointmentTime,
    status: item.status,
    notes: item.notes,
    whatsapp_reminder_sent: item.whatsappReminderSent || false
  };
}

export function mapDbToPrescription(row: any): Prescription {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    doctorName: row.doctor_name,
    diagnosis: row.diagnosis,
    medications: Array.isArray(row.medications) ? row.medications : [],
    consentFormTitle: row.consent_form_title || '',
    consentSigned: Boolean(row.consent_signed),
    signedAt: row.signed_at || undefined,
    createdAt: row.created_at || undefined
  };
}

export function mapPrescriptionToDb(item: Prescription): any {
  return {
    id: item.id,
    patient_id: item.patientId,
    patient_name: item.patientName,
    doctor_name: item.doctorName,
    diagnosis: item.diagnosis,
    medications: item.medications,
    consent_form_title: item.consentFormTitle,
    consent_signed: item.consentSigned || false,
    signed_at: item.signedAt || null
  };
}

export function mapDbToHealthTourism(row: any): HealthTourismLogistics {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    country: row.country,
    passportNumber: row.passport_number || '',
    flightCode: row.flight_code || '',
    arrivalDate: row.arrival_date || undefined,
    departureDate: row.departure_date || undefined,
    hotelName: row.hotel_name || '',
    transferDriverName: row.transfer_driver_name || '',
    transferStatus: row.transfer_status || 'SCHEDULED',
    translatorName: row.translator_name || '',
    language: row.language || '',
    packagePrice: Number(row.package_price || 0),
    currency: row.currency || 'EUR'
  };
}

export function mapHealthTourismToDb(item: HealthTourismLogistics): any {
  return {
    id: item.id,
    patient_id: item.patientId,
    patient_name: item.patientName,
    country: item.country,
    passport_number: item.passportNumber,
    flight_code: item.flightCode,
    arrival_date: item.arrivalDate || null,
    departure_date: item.departureDate || null,
    hotel_name: item.hotelName,
    transfer_driver_name: item.transferDriverName,
    transfer_status: item.transferStatus,
    translator_name: item.translatorName,
    language: item.language,
    package_price: item.packagePrice,
    currency: item.currency
  };
}

export function mapDbToMedicalMedia(row: any): MedicalMedia {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patient_name,
    treatmentTitle: row.treatment_title,
    beforeImageUrl: row.before_image_url,
    afterImageUrl: row.after_image_url,
    captureDate: String(row.capture_date),
    marketingConsentGiven: Boolean(row.marketing_consent_given),
    notes: row.notes || ''
  };
}

export function mapMedicalMediaToDb(item: MedicalMedia): any {
  return {
    id: item.id,
    patient_id: item.patientId,
    patient_name: item.patientName,
    treatment_title: item.treatmentTitle,
    before_image_url: item.beforeImageUrl,
    after_image_url: item.afterImageUrl,
    capture_date: item.captureDate,
    marketing_consent_given: item.marketingConsentGiven || false,
    notes: item.notes
  };
}

// --- Service Operations ---

export async function fetchAppointments(): Promise<Appointment[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error || !data || data.length === 0) {
      if (!error && data && data.length === 0) {
        await seedAppointments();
        return mockAppointments;
      }
      return mockAppointments;
    }
    return data.map(mapDbToAppointment);
  } catch (err) {
    console.warn('fetchAppointments fallback:', err);
    return mockAppointments;
  }
}

export async function createAppointment(item: Appointment): Promise<Appointment> {
  try {
    const supabase = createClient();
    const payload = mapAppointmentToDb(item);
    const { data, error } = await supabase.from('appointments').insert(payload).select('*').single();
    if (error || !data) return item;
    return mapDbToAppointment(data);
  } catch (err) {
    console.warn('createAppointment error:', err);
    return item;
  }
}

export async function fetchPrescriptions(): Promise<Prescription[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (!error && data && data.length === 0) {
        await seedPrescriptions();
        return mockPrescriptions;
      }
      return mockPrescriptions;
    }
    return data.map(mapDbToPrescription);
  } catch (err) {
    console.warn('fetchPrescriptions fallback:', err);
    return mockPrescriptions;
  }
}

export async function createPrescription(item: Prescription): Promise<Prescription> {
  try {
    const supabase = createClient();
    const payload = mapPrescriptionToDb(item);
    const { data, error } = await supabase.from('prescriptions').insert(payload).select('*').single();
    if (error || !data) return item;
    return mapDbToPrescription(data);
  } catch (err) {
    console.warn('createPrescription error:', err);
    return item;
  }
}

export async function fetchHealthTourismLogistics(): Promise<HealthTourismLogistics[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('health_tourism_logistics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (!error && data && data.length === 0) {
        await seedHealthTourism();
        return mockHealthTourism;
      }
      return mockHealthTourism;
    }
    return data.map(mapDbToHealthTourism);
  } catch (err) {
    console.warn('fetchHealthTourismLogistics fallback:', err);
    return mockHealthTourism;
  }
}

export async function createHealthTourismLogistics(item: HealthTourismLogistics): Promise<HealthTourismLogistics> {
  try {
    const supabase = createClient();
    const payload = mapHealthTourismToDb(item);
    const { data, error } = await supabase.from('health_tourism_logistics').insert(payload).select('*').single();
    if (error || !data) return item;
    return mapDbToHealthTourism(data);
  } catch (err) {
    console.warn('createHealthTourismLogistics error:', err);
    return item;
  }
}

export async function fetchMedicalMedia(): Promise<MedicalMedia[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('medical_media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (!error && data && data.length === 0) {
        await seedMedicalMedia();
        return mockMedicalMedia;
      }
      return mockMedicalMedia;
    }
    return data.map(mapDbToMedicalMedia);
  } catch (err) {
    console.warn('fetchMedicalMedia fallback:', err);
    return mockMedicalMedia;
  }
}

export async function createMedicalMedia(item: MedicalMedia): Promise<MedicalMedia> {
  try {
    const supabase = createClient();
    const payload = mapMedicalMediaToDb(item);
    const { data, error } = await supabase.from('medical_media').insert(payload).select('*').single();
    if (error || !data) return item;
    return mapDbToMedicalMedia(data);
  } catch (err) {
    console.warn('createMedicalMedia error:', err);
    return item;
  }
}

// --- Seeding Functions ---

async function seedAppointments() {
  try {
    const supabase = createClient();
    await supabase.from('appointments').upsert(mockAppointments.map(mapAppointmentToDb));
  } catch (e) { console.warn('seedAppointments warning:', e); }
}

async function seedPrescriptions() {
  try {
    const supabase = createClient();
    await supabase.from('prescriptions').upsert(mockPrescriptions.map(mapPrescriptionToDb));
  } catch (e) { console.warn('seedPrescriptions warning:', e); }
}

async function seedHealthTourism() {
  try {
    const supabase = createClient();
    await supabase.from('health_tourism_logistics').upsert(mockHealthTourism.map(mapHealthTourismToDb));
  } catch (e) { console.warn('seedHealthTourism warning:', e); }
}

async function seedMedicalMedia() {
  try {
    const supabase = createClient();
    await supabase.from('medical_media').upsert(mockMedicalMedia.map(mapMedicalMediaToDb));
  } catch (e) { console.warn('seedMedicalMedia warning:', e); }
}
