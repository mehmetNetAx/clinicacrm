-- 042_care_observations_sdoh_payer.sql
-- ClinicaCRM: FHIR Care Observations, SDoH ve Payer/Sigorta Tabloları

-- 1. CareObservations (FHIR Uyumlu Klinik Vital Bulgular) Tablosu
CREATE TABLE IF NOT EXISTS public.care_observations (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    observation_type VARCHAR(100) NOT NULL,
    loinc_code VARCHAR(50),
    value_number NUMERIC(10,2),
    value_string VARCHAR(250),
    unit VARCHAR(50),
    effective_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'final',
    interpretation VARCHAR(30) DEFAULT 'Normal' CHECK (interpretation IN ('Normal', 'High', 'Critical', 'Low')),
    fhir_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SDoH Records (Social Determinants of Health / Sosyal Belirleyiciler) Tablosu
CREATE TABLE IF NOT EXISTS public.sdoh_records (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Housing', 'Food Security', 'Transportation', 'Lifestyle & Diet', 'Language', 'Social Support')),
    code VARCHAR(50),
    assessment_finding TEXT NOT NULL,
    impact_level VARCHAR(20) DEFAULT 'Medium' CHECK (impact_level IN ('High', 'Medium', 'Low')),
    interventions_recommended TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PayerCoverages (Sigorta Poliçeleri & Üye Teminatları) Tablosu
CREATE TABLE IF NOT EXISTS public.payer_coverages (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    payer_name VARCHAR(250) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    coverage_status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (coverage_status IN ('ACTIVE', 'PENDING', 'EXPIRED')),
    eligible_services JSONB DEFAULT '[]'::jsonb,
    copay_rate NUMERIC(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PriorAuthorizations (Sigorta Ön Yetkilendirme ve Talep Yönetimi) Tablosu
CREATE TABLE IF NOT EXISTS public.prior_authorizations (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    coverage_id VARCHAR(50) REFERENCES public.payer_coverages(id) ON DELETE SET NULL,
    service_name VARCHAR(250) NOT NULL,
    requested_amount NUMERIC(10,2) DEFAULT 0.0,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'ADDITIONAL_INFO_NEEDED')),
    ai_approval_probability NUMERIC(5,2) DEFAULT 85.0,
    reasoning_log JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index Tanımları
CREATE INDEX IF NOT EXISTS idx_care_obs_patient ON public.care_observations(patient_id);
CREATE INDEX IF NOT EXISTS idx_care_obs_type ON public.care_observations(observation_type);
CREATE INDEX IF NOT EXISTS idx_sdoh_patient ON public.sdoh_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_payer_coverages_patient ON public.payer_coverages(patient_id);
CREATE INDEX IF NOT EXISTS idx_prior_auth_patient ON public.prior_authorizations(patient_id);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.care_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sdoh_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payer_coverages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prior_authorizations ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'care_observations' AND policyname = 'Allow authenticated read/write access to care_observations'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to care_observations" ON public.care_observations FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'sdoh_records' AND policyname = 'Allow authenticated read/write access to sdoh_records'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to sdoh_records" ON public.sdoh_records FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'payer_coverages' AND policyname = 'Allow authenticated read/write access to payer_coverages'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to payer_coverages" ON public.payer_coverages FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'prior_authorizations' AND policyname = 'Allow authenticated read/write access to prior_authorizations'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to prior_authorizations" ON public.prior_authorizations FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;
