-- Add possible_conditions column to symptom_analyses table
ALTER TABLE symptom_analyses ADD COLUMN possible_conditions TEXT[];
