-- 040_clinical_crm.sql
-- ClinicaCRM: Hasta Kayıt, Triyaj, Mikro-Segmentasyon ve Klinik Kurallar Tabloları

-- 1. Patients Tablosu
CREATE TABLE IF NOT EXISTS public.patients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    initials VARCHAR(10),
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_type VARCHAR(10),
    bmi NUMERIC(5,2),
    bmi_status VARCHAR(30),
    last_visit DATE,
    last_visit_months INT DEFAULT 0,
    crm_score INT DEFAULT 0,
    recommended_action TEXT,
    recommended_action_icon VARCHAR(50),
    recommended_category VARCHAR(50),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('URGENT', 'MEDIUM', 'ROUTINE')),
    status VARCHAR(20) DEFAULT 'Active',
    phone VARCHAR(50),
    email VARCHAR(150),
    avatar_url TEXT,
    risk_factors JSONB DEFAULT '{}'::jsonb,
    history JSONB DEFAULT '[]'::jsonb,
    vitals JSONB DEFAULT '{}'::jsonb,
    ai_confidence INT DEFAULT 90,
    ai_reasoning TEXT,
    ai_rule_code VARCHAR(50),
    treatment_follow_up TEXT,
    recommended_follow_up_months INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MicroSegments Tablosu
CREATE TABLE IF NOT EXISTS public.micro_segments (
    id VARCHAR(50) PRIMARY KEY,
    title_tr VARCHAR(250) NOT NULL,
    title_en VARCHAR(250),
    description_tr TEXT,
    description_en TEXT,
    category VARCHAR(100),
    criteria_description_tr TEXT,
    criteria_description_en TEXT,
    matched_patients_count INT DEFAULT 0,
    patient_ids JSONB DEFAULT '[]'::jsonb,
    recommended_campaign_name_tr TEXT,
    recommended_campaign_name_en TEXT,
    recommended_channel VARCHAR(50) CHECK (recommended_channel IN ('WhatsApp', 'SMS', 'Email', 'Multi-Channel')),
    est_revenue_per_patient NUMERIC(10,2) DEFAULT 0.0,
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('HIGH', 'MEDIUM', 'ROUTINE')),
    default_message_template_tr TEXT,
    default_message_template_en TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ClinicalRules Tablosu
CREATE TABLE IF NOT EXISTS public.clinical_rules (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    condition TEXT NOT NULL,
    icon VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'URGENT', 'DRAFT')),
    matched_count INT DEFAULT 0,
    conversion_rate NUMERIC(5,2) DEFAULT 0.0,
    last_updated DATE DEFAULT CURRENT_DATE,
    description TEXT,
    est_impact VARCHAR(20) CHECK (est_impact IN ('High', 'Medium', 'Low')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index Tanımları
CREATE INDEX IF NOT EXISTS idx_patients_priority ON public.patients(priority);
CREATE INDEX IF NOT EXISTS idx_patients_status ON public.patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_category ON public.patients(recommended_category);
CREATE INDEX IF NOT EXISTS idx_micro_segments_category ON public.micro_segments(category);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_rules ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'Allow authenticated read/write access to patients'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to patients" ON public.patients FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'micro_segments' AND policyname = 'Allow authenticated read/write access to micro_segments'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to micro_segments" ON public.micro_segments FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'clinical_rules' AND policyname = 'Allow authenticated read/write access to clinical_rules'
    ) THEN
        CREATE POLICY "Allow authenticated read/write access to clinical_rules" ON public.clinical_rules FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;
