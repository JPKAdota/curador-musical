-- EXECUTE ESTE SQL NO SUPABASE SQL EDITOR
-- Verificar se as colunas já existem antes de adicionar

-- 1. Adicionar colunas se não existirem
DO $$ 
BEGIN
    -- jamendo_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='tracks' AND column_name='jamendo_id') THEN
        ALTER TABLE tracks ADD COLUMN jamendo_id VARCHAR(50);
    END IF;
    
    -- source
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='tracks' AND column_name='source') THEN
        ALTER TABLE tracks ADD COLUMN source VARCHAR(20) DEFAULT 'bensound';
    END IF;
    
    -- bpm
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='tracks' AND column_name='bpm') THEN
        ALTER TABLE tracks ADD COLUMN bpm INTEGER;
    END IF;
    
    -- image
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='tracks' AND column_name='image') THEN
        ALTER TABLE tracks ADD COLUMN image TEXT;
    END IF;
    
    -- time_period
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='tracks' AND column_name='time_period') THEN
        ALTER TABLE tracks ADD COLUMN time_period VARCHAR(20);
    END IF;
END $$;

-- 2. Criar índice único (drop primeiro se já existir)
DROP INDEX IF EXISTS idx_tracks_jamendo_id_unique;
CREATE UNIQUE INDEX idx_tracks_jamendo_id_unique ON tracks(jamendo_id) WHERE jamendo_id IS NOT NULL;

-- 3. Criar outros índices
CREATE INDEX IF NOT EXISTS idx_tracks_source ON tracks(source);
CREATE INDEX IF NOT EXISTS idx_tracks_time_period ON tracks(time_period);

-- 4. Adicionar track_ids na tabela playlists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='playlists' AND column_name='track_ids') THEN
        ALTER TABLE playlists ADD COLUMN track_ids INTEGER[];
    END IF;
END $$;

-- 5. Atualizar músicas existentes
UPDATE tracks SET source = 'bensound' WHERE source IS NULL;

-- 6. Verificar resultado
SELECT 
    COUNT(*) as total_tracks,
    COUNT(CASE WHEN source = 'bensound' THEN 1 END) as bensound_tracks,
    COUNT(CASE WHEN source = 'jamendo' THEN 1 END) as jamendo_tracks
FROM tracks;
