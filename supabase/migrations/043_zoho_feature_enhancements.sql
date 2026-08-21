-- 043_zoho_feature_enhancements.sql
-- ClinicaCRM: Zoho CRM Esintili Süreç Güvencesi (Blueprint), Dinamik Skorlama, SLA Takibi, Tedavi Teklif Motoru ve Hasta Portalı

-- 1. Pipeline Blueprints (Aşama Güvencesi ve Şartlı İş Akışları)
CREATE TABLE IF NOT EXISTS public.pipeline_blueprints (
    id VARCHAR(50) PRIMARY KEY,
    pipeline_id VARCHAR(50) NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    required_fields JSONB DEFAULT '[]'::jsonb, -- e.g. ["doctor_notes", "passport_number"]
    required_documents JSONB DEFAULT '[]'::jsonb, -- e.g. ["XRAY", "BLOOD_TEST"]
    sla_duration_hours INT DEFAULT 24,
    auto_action VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Lead Scoring Rules (Dinamik Hasta & Fırsat Skorlama Kuralları)
CREATE TABLE IF NOT EXISTS public.lead_scoring_rules (
    id VARCHAR(50) PRIMARY KEY,
    rule_name VARCHAR(250) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('LOCATION', 'BUDGET', 'TREATMENT', 'ENGAGEMENT', 'ACUITY')),
    condition_key VARCHAR(100) NOT NULL, -- e.g. "country", "budget_eur", "whatsapp_replied"
    operator VARCHAR(20) NOT NULL CHECK (operator IN ('EQUALS', 'CONTAINS', 'GREATER_THAN', 'LESS_THAN')),
    condition_value VARCHAR(250) NOT NULL,
    score_points INT NOT NULL DEFAULT 10,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SLA Policies & Breaches (Service Level Agreement & Escalation)
CREATE TABLE IF NOT EXISTS public.sla_policies (
    id VARCHAR(50) PRIMARY KEY,
    policy_name VARCHAR(250) NOT NULL,
    target_stage VARCHAR(100) NOT NULL,
    max_duration_hours INT NOT NULL DEFAULT 4,
    escalation_role VARCHAR(50) DEFAULT 'admin',
    alert_channel VARCHAR(50) DEFAULT 'IN_APP',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sla_breaches (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    policy_id VARCHAR(50) REFERENCES public.sla_policies(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    breached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_over_minutes INT DEFAULT 0,
    is_resolved BOOLEAN DEFAULT false,
    resolution_notes TEXT
);

-- 4. Treatment Quotes & Quote Items (Çoklu Para Birimli Tedavi Paket & Teklif Motoru)
CREATE TABLE IF NOT EXISTS public.treatment_quotes (
    id VARCHAR(50) PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(250) NOT NULL,
    title VARCHAR(250) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD', 'GBP', 'TRY')),
    total_amount NUMERIC(12,2) DEFAULT 0.0,
    discount_amount NUMERIC(12,2) DEFAULT 0.0,
    net_amount NUMERIC(12,2) DEFAULT 0.0,
    status VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    valid_until DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.treatment_quote_items (
    id VARCHAR(50) PRIMARY KEY,
    quote_id VARCHAR(50) REFERENCES public.treatment_quotes(id) ON DELETE CASCADE,
    item_category VARCHAR(100) NOT NULL, -- e.g. 'Procedure', 'Hotel', 'VIP Transfer', 'Interpreter'
    title VARCHAR(250) NOT NULL,
    unit_price NUMERIC(10,2) DEFAULT 0.0,
    quantity INT DEFAULT 1,
    total_price NUMERIC(10,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Patient Portal Tokens (Güvenli Self-Servis Hasta Portalı)
CREATE TABLE IF NOT EXISTS public.patient_portal_tokens (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) REFERENCES public.patients(id) ON DELETE CASCADE,
    token VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index Tanımları
CREATE INDEX IF NOT EXISTS idx_blueprints_pipeline ON public.pipeline_blueprints(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_scoring_rules_cat ON public.lead_scoring_rules(category);
CREATE INDEX IF NOT EXISTS idx_sla_breaches_patient ON public.sla_breaches(patient_id);
CREATE INDEX IF NOT EXISTS idx_quotes_patient ON public.treatment_quotes(patient_id);
CREATE INDEX IF NOT EXISTS idx_portal_tokens_token ON public.patient_portal_tokens(token);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.pipeline_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_portal_tokens ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pipeline_blueprints' AND policyname = 'Allow authenticated access to pipeline_blueprints') THEN
        CREATE POLICY "Allow authenticated access to pipeline_blueprints" ON public.pipeline_blueprints FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lead_scoring_rules' AND policyname = 'Allow authenticated access to lead_scoring_rules') THEN
        CREATE POLICY "Allow authenticated access to lead_scoring_rules" ON public.lead_scoring_rules FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sla_policies' AND policyname = 'Allow authenticated access to sla_policies') THEN
        CREATE POLICY "Allow authenticated access to sla_policies" ON public.sla_policies FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sla_breaches' AND policyname = 'Allow authenticated access to sla_breaches') THEN
        CREATE POLICY "Allow authenticated access to sla_breaches" ON public.sla_breaches FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'treatment_quotes' AND policyname = 'Allow authenticated access to treatment_quotes') THEN
        CREATE POLICY "Allow authenticated access to treatment_quotes" ON public.treatment_quotes FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'treatment_quote_items' AND policyname = 'Allow authenticated access to treatment_quote_items') THEN
        CREATE POLICY "Allow authenticated access to treatment_quote_items" ON public.treatment_quote_items FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patient_portal_tokens' AND policyname = 'Allow authenticated access to patient_portal_tokens') THEN
        CREATE POLICY "Allow authenticated access to patient_portal_tokens" ON public.patient_portal_tokens FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;
