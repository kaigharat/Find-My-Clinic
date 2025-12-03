-- Fix confidence column in symptom_analyses table
-- DECIMAL(5,4) can only hold 0.0000-9.9999, but we need 0-100
-- Change to DECIMAL(5,2) to allow 0.00-99.99

ALTER TABLE symptom_analyses ALTER COLUMN confidence TYPE DECIMAL(5,2);