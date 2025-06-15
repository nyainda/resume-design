
-- Add references column to resumes table (using quotes because references is a reserved keyword)
ALTER TABLE resumes ADD COLUMN "references" jsonb DEFAULT '[]'::jsonb;
