
-- Add job_description column to resumes table
ALTER TABLE public.resumes 
ADD COLUMN job_description TEXT;
