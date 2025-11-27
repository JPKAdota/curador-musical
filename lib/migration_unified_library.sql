-- Migration: Biblioteca Unificada com Detecção de Duplicatas
-- Execute este SQL no Supabase SQL Editor

-- Adicionar campos à tabela tracks para suportar músicas do Jamendo
ALTER TABLE tracks 
ADD COLUMN IF NOT EXISTS jamendo_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'bensound',
ADD COLUMN IF NOT EXISTS bpm INTEGER,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS time_period VARCHAR(20);

-- Criar índice único para jamendo_id (evitar duplicatas)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tracks_jamendo_id_unique ON tracks(jamendo_id) WHERE jamendo_id IS NOT NULL;

-- Criar índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_tracks_source ON tracks(source);
CREATE INDEX IF NOT EXISTS idx_tracks_time_period ON tracks(time_period);

-- Adicionar coluna track_ids à tabela playlists (manter tracks para compatibilidade)
ALTER TABLE playlists 
ADD COLUMN IF NOT EXISTS track_ids INTEGER[];

-- Comentários para documentação
COMMENT ON COLUMN tracks.jamendo_id IS 'ID único do Jamendo para evitar duplicatas';
COMMENT ON COLUMN tracks.source IS 'Origem da música: bensound ou jamendo';
COMMENT ON COLUMN tracks.bpm IS 'Batidas por minuto';
COMMENT ON COLUMN tracks.time_period IS 'Período recomendado: morning, afternoon, evening';
COMMENT ON COLUMN playlists.track_ids IS 'Array de IDs referenciando tabela tracks';
COMMENT ON COLUMN playlists.tracks IS 'DEPRECATED: Mantido para compatibilidade com playlists antigas';

-- Atualizar músicas existentes (Bensound) com source
UPDATE tracks SET source = 'bensound' WHERE source IS NULL;
