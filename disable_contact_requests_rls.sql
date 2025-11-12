-- Disable Row Level Security for contact_requests table
-- This allows anonymous submissions for demo requests

ALTER TABLE contact_requests DISABLE ROW LEVEL SECURITY;
