-- 041_healthcare_crm_expansion.sql
-- ClinicaCRM: Randevu, Reçete/Onam, Sağlık Turizmi Lojistik ve Medikal Galeri Tabloları

-- 1. Appointments (Randevular) Tablosu
CREATE TABLE IF NOT EXISTS public.appointments (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(250) NOT NULL,
    doctor_name VARCHAR(250) NOT NULL,
    department VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    notes TEXT,
    whatsapp_reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Prescriptions (Reçeteler & Onam Formları) Tablosu
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(250) NOT NULL,
    doctor_name VARCHAR(250) NOT NULL,
    diagnosis TEXT NOT NULL,
    medications JSONB DEFAULT '[]'::jsonb,
    consent_form_title TEXT,
    consent_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HealthTourismLogistics (Sağlık Turizmi & Lojistik) Tablosu
CREATE TABLE IF NOT EXISTS public.health_tourism_logistics (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(250) NOT NULL,
    country VARCHAR(100) NOT NULL,
    passport_number VARCHAR(50),
    flight_code VARCHAR(50),
    arrival_date TIMESTAMP WITH TIME ZONE,
    departure_date TIMESTAMP WITH TIME ZONE,
    hotel_name VARCHAR(250),
    transfer_driver_name VARCHAR(250),
    transfer_status VARCHAR(30) DEFAULT 'SCHEDULED' CHECK (transfer_status IN ('SCHEDULED', 'PICKED_UP', 'COMPLETED', 'CANCELLED')),
    translator_name VARCHAR(250),
    language VARCHAR(50),
    package_price NUMERIC(10,2) DEFAULT 0.0,
    currency VARCHAR(10) DEFAULT 'EUR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MedicalMedia (Medikal Galeri & Before/After) Tablosu
CREATE TABLE IF NOT EXISTS public.medical_media (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(250) NOT NULL,
    treatment_title VARCHAR(250) NOT NULL,
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    capture_date DATE DEFAULT CURRENT_DATE,
    marketing_consent_given BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index Tanımları
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_logistics_country ON public.health_tourism_logistics(country);
CREATE INDEX IF NOT EXISTS idx_medical_media_patient ON public.medical_media(patient_id);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_tourism_logistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_media ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Allow authenticated read/write access to appointments'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to appointments" ON public.appointments FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'prescriptions' AND policyname = 'Allow authenticated read/write access to prescriptions'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to prescriptions" ON public.prescriptions FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'health_tourism_logistics' AND policyname = 'Allow authenticated read/write access to health_tourism_logistics'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to health_tourism_logistics" ON public.health_tourism_logistics FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'medical_media' AND policyname = 'Allow authenticated read/write access to medical_media'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to medical_media" ON public.medical_media FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;
