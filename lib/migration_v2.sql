-- MIGRATION: Add new fields to companies table and create playlists table

-- Add new columns to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS track_count INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS time_distribution JSONB DEFAULT '{"morning": 33, "afternoon": 34, "evening": 33}'::jsonb,
ADD COLUMN IF NOT EXISTS bpm_ranges JSONB,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft';

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  time_period VARCHAR(20) NOT NULL, -- 'morning', 'afternoon', 'evening'
  bpm_min INTEGER,
  bpm_max INTEGER,
  genres JSONB,
  tracks JSONB, -- Array of track objects from Jamendo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_playlists_company ON playlists(company_id);
CREATE INDEX IF NOT EXISTS idx_playlists_period ON playlists(time_period);

-- Add unique constraint to companies.name
ALTER TABLE companies ADD CONSTRAINT unique_company_name UNIQUE (name);

COMMENT ON TABLE playlists IS 'Stores generated playlists for each company and time period';
COMMENT ON COLUMN companies.track_count IS 'Total number of tracks requested for this brand';
COMMENT ON COLUMN companies.status IS 'draft, analyzing, approved, completed';
