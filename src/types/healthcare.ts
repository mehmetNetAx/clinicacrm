export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'PLANNED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  whatsappReminderSent?: boolean;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  medications: MedicationItem[];
  consentFormTitle?: string;
  consentSigned?: boolean;
  signedAt?: string;
  createdAt?: string;
}

export interface HealthTourismLogistics {
  id: string;
  patientId: string;
  patientName: string;
  country: string;
  passportNumber?: string;
  flightCode?: string;
  arrivalDate?: string;
  departureDate?: string;
  hotelName?: string;
  transferDriverName?: string;
  transferStatus: 'SCHEDULED' | 'PICKED_UP' | 'COMPLETED' | 'CANCELLED';
  translatorName?: string;
  language?: string;
  packagePrice: number;
  currency: 'EUR' | 'USD' | 'GBP' | 'TRY';
}

export interface MedicalMedia {
  id: string;
  patientId: string;
  patientName: string;
  treatmentTitle: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  captureDate: string;
  marketingConsentGiven: boolean;
  notes?: string;
}
