-- Fix symptoms table row level security policies to allow all authenticated users full access

ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own symptoms" ON symptoms;
DROP POLICY IF EXISTS "Users can insert their own symptoms" ON symptoms;

CREATE POLICY "Authenticated users can view symptoms" ON symptoms
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert symptoms" ON symptoms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
