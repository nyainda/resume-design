
-- Create resume_tracking table for tracking resume email interactions
CREATE TABLE IF NOT EXISTS resume_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  email_content TEXT NOT NULL,
  resume_data JSONB NOT NULL,
  tracking_url TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'downloaded')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  downloaded_at TIMESTAMP WITH TIME ZONE,
  location TEXT,
  device TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE resume_tracking ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own tracking data
CREATE POLICY "Users can view their own tracking data" ON resume_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own tracking data
CREATE POLICY "Users can insert their own tracking data" ON resume_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own tracking data
CREATE POLICY "Users can update their own tracking data" ON resume_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resume_tracking_updated_at
  BEFORE UPDATE ON resume_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
