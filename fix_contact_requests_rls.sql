-- Fix RLS policies for contact_requests table to allow anonymous submissions
-- This allows clinic demo requests to be submitted without authentication

-- Enable RLS if not already enabled
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be blocking inserts
DROP POLICY IF EXISTS "Allow anonymous contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Users can insert contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Authenticated users can insert contact requests" ON contact_requests;

-- Allow anonymous users to insert contact requests (for demo requests)
CREATE POLICY "Allow anonymous contact requests" ON contact_requests
  FOR INSERT WITH CHECK (true);

-- Prevent anonymous users from viewing/updating/deleting contact requests
-- Only authenticated users with proper permissions should access existing records
-- For now, we'll allow authenticated users to view all (you can restrict this later)
CREATE POLICY "Authenticated users can view contact requests" ON contact_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Note: Update and delete policies are not added - only admins should modify contact requests
-- You can add those policies as needed for your admin users
