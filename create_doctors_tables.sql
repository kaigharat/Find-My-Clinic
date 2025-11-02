-- Create doctors table
DROP TABLE IF EXISTS doctors CASCADE;
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  specialization TEXT,
  experience_years INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT true,
  is_available_today BOOLEAN DEFAULT true,
  consultation_fee INTEGER DEFAULT 500,
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Create specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctor_specialties junction table
CREATE TABLE IF NOT EXISTS doctor_specialties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(doctor_id, specialty_id)
);

-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_specialties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can view doctors" ON doctors;
DROP POLICY IF EXISTS "Clinic users can manage their doctors" ON doctors;
DROP POLICY IF EXISTS "Anyone can view specialties" ON specialties;
DROP POLICY IF EXISTS "Anyone can view doctor specialties" ON doctor_specialties;

CREATE POLICY "Anyone can view doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Clinic users can manage their doctors" ON doctors FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view specialties" ON specialties FOR SELECT USING (true);
CREATE POLICY "Anyone can view doctor specialties" ON doctor_specialties FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_doctors_clinic_id ON doctors(clinic_id);