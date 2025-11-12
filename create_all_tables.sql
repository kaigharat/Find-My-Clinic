-- Create all tables for ClinicFinder application
-- Run this script in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  name_hi TEXT,
  name_mr TEXT,
  address TEXT NOT NULL,
  address_en TEXT,
  address_hi TEXT,
  address_mr TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  latitude TEXT NOT NULL,
  longitude TEXT NOT NULL,
  current_wait_time INTEGER,
  queue_size INTEGER,
  status TEXT DEFAULT 'active',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create queue_tokens table
CREATE TABLE IF NOT EXISTS queue_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  token_number INTEGER NOT NULL,
  status TEXT DEFAULT 'waiting',
  estimated_wait_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  called_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  clinic_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
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

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  severity TEXT,
  duration TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create symptom_analyses table
CREATE TABLE IF NOT EXISTS symptom_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
  recommended_specialty_id UUID REFERENCES specialties(id) ON DELETE SET NULL,
  recommended_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  analysis_result TEXT NOT NULL,
  confidence DECIMAL(5,4),
  urgency TEXT,
  recommendations TEXT,
  possible_conditions TEXT[], -- Array of text for possible conditions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  phone TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  blood_type TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  medications TEXT,
  insurance_provider TEXT,
  insurance_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clinics_location ON clinics(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_clinic_id ON queue_tokens(clinic_id);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_patient_id ON queue_tokens(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctors_clinic_id ON doctors(clinic_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_patient_id ON symptoms(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptom_analyses_symptom_id ON symptom_analyses(symptom_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Add additional columns to symptom_analyses table (as per existing migration scripts)
ALTER TABLE symptom_analyses ADD COLUMN IF NOT EXISTS recommended_specialty TEXT;

-- Basic RLS Policies (you may need to adjust these based on your authentication setup)

-- Clinics table policies
CREATE POLICY "Anyone can view clinics" ON clinics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage clinics" ON clinics FOR ALL USING (auth.role() = 'authenticated');

-- Patients table policies
CREATE POLICY "Patients can view their own data" ON patients FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Patients can insert their own data" ON patients FOR INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Patients can update their own data" ON patients FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Clinic staff can view patient data" ON patients FOR SELECT USING (auth.role() = 'authenticated');

-- Queue tokens policies
CREATE POLICY "Users can view their own queue tokens" ON queue_tokens FOR SELECT USING (auth.uid()::text = patient_id::text);
CREATE POLICY "Clinic staff can manage queue tokens" ON queue_tokens FOR ALL USING (auth.role() = 'authenticated');

-- Contact requests policies
CREATE POLICY "Anyone can create contact requests" ON contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view contact requests" ON contact_requests FOR SELECT USING (auth.role() = 'authenticated');

-- Doctors table policies
CREATE POLICY "Anyone can view doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Clinic staff can manage doctors" ON doctors FOR ALL USING (auth.role() = 'authenticated');

-- Specialties table policies
CREATE POLICY "Anyone can view specialties" ON specialties FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage specialties" ON specialties FOR ALL USING (auth.role() = 'authenticated');

-- Doctor specialties policies
CREATE POLICY "Anyone can view doctor specialties" ON doctor_specialties FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage doctor specialties" ON doctor_specialties FOR ALL USING (auth.role() = 'authenticated');

-- Symptoms table policies
CREATE POLICY "Users can view their own symptoms" ON symptoms FOR SELECT USING (auth.uid()::text = patient_id::text);
CREATE POLICY "Users can insert their own symptoms" ON symptoms FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);
CREATE POLICY "Clinic staff can view symptoms" ON symptoms FOR SELECT USING (auth.role() = 'authenticated');

-- Symptom analyses policies
CREATE POLICY "Users can view their own symptom analyses" ON symptom_analyses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM symptoms s WHERE s.id = symptom_analyses.symptom_id AND s.patient_id::text = auth.uid()::text
  )
);
CREATE POLICY "Clinic staff can manage symptom analyses" ON symptom_analyses FOR ALL USING (auth.role() = 'authenticated');

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Clinic staff can view user profiles" ON user_profiles FOR SELECT USING (auth.role() = 'authenticated');