-- Tabela de empresas
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  vibe VARCHAR(100),
  genres JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de músicas
CREATE TABLE tracks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  url TEXT NOT NULL,
  duration INTEGER,
  license VARCHAR(100),
  tags JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de logs de reprodução
CREATE TABLE play_logs (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  track_id INTEGER REFERENCES tracks(id),
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir músicas de exemplo
INSERT INTO tracks (title, artist, genre, url, duration, license, tags) VALUES
('Acoustic Breeze', 'Benjamin Tissot', 'Acoustic', 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3', 157, 'Creative Commons', '["relaxing", "morning", "cafe"]'),
('Happy Rock', 'Benjamin Tissot', 'Rock', 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3', 108, 'Creative Commons', '["energetic", "afternoon", "retail"]'),
('Jazz Comedy', 'Benjamin Tissot', 'Jazz', 'https://www.bensound.com/bensound-music/bensound-jazzcomedy.mp3', 120, 'Creative Commons', '["upbeat", "afternoon", "restaurant"]'),
('Relaxing', 'Benjamin Tissot', 'Ambient', 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3', 180, 'Creative Commons', '["calm", "evening", "spa"]'),
('Sunny', 'Benjamin Tissot', 'Pop', 'https://www.bensound.com/bensound-music/bensound-sunny.mp3', 142, 'Creative Commons', '["happy", "morning", "retail"]'),
('Creative Minds', 'Benjamin Tissot', 'Corporate', 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3', 147, 'Creative Commons', '["professional", "afternoon", "office"]'),
('Tenderness', 'Benjamin Tissot', 'Piano', 'https://www.bensound.com/bensound-music/bensound-tenderness.mp3', 135, 'Creative Commons', '["romantic", "evening", "restaurant"]'),
('Ukulele', 'Benjamin Tissot', 'Folk', 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3', 146, 'Creative Commons', '["cheerful", "morning", "cafe"]'),
('Energy', 'Benjamin Tissot', 'Electronic', 'https://www.bensound.com/bensound-music/bensound-energy.mp3', 178, 'Creative Commons', '["dynamic", "afternoon", "gym"]'),
('Piano Moment', 'Benjamin Tissot', 'Classical', 'https://www.bensound.com/bensound-music/bensound-pianomoment.mp3', 134, 'Creative Commons', '["elegant", "evening", "hotel"]');