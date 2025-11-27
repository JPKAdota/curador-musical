-- Migration V3: Add metadata column to companies table
-- Run this in Supabase SQL Editor

-- Add metadata column to store additional brand information
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN companies.metadata IS 'Stores additional brand information: segment, products, target_audience, positioning, location, communication_style, brand_colors, and full AI analysis';

-- Create index for better query performance on metadata
CREATE INDEX IF NOT EXISTS idx_companies_metadata ON companies USING GIN (metadata);
