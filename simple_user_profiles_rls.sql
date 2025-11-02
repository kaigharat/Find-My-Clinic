-- Simple RLS policies for user_profiles table
-- This version doesn't query auth.users table to avoid permission issues

-- First, ensure the table exists
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

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Clinic users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON user_profiles;

-- Create simple policies
-- Allow users to manage their own profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- For clinic users, we'll need to handle this differently
-- For now, allow all authenticated users to view profiles (temporary solution)
-- In production, you'd want to check user roles properly
CREATE POLICY "Authenticated users can view profiles" ON user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);