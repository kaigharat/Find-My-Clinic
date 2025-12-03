-- Fix symptom_analyses table row level security policies to allow all authenticated users insert and update access

ALTER TABLE symptom_analyses ENABLE ROW LEVEL SECURITY;

-- Drop previous policies that restrict insert or update for normal users if they exist
DROP POLICY IF EXISTS "Users can insert symptom analyses" ON symptom_analyses;
DROP POLICY IF EXISTS "Users can update symptom analyses" ON symptom_analyses;

-- Create new policies allowing all authenticated users to insert and update symptom_analyses
CREATE POLICY "Authenticated users can insert symptom analyses" ON symptom_analyses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update symptom analyses" ON symptom_analyses
  FOR UPDATE USING (auth.role() = 'authenticated');
