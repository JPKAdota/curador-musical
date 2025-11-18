'use client';
import { useState, useEffect, useRef } from 'react';

export default function Player({ company }) {
  const [playlist, setPlaylist] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  // Carregar playlist
  const loadPlaylist = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/curate?company=${encodeURIComponent(company)}`);
      const data = await response.json();
      setPlaylist(data);
      
      // Selecionar primeira música baseada no horário
      const hour = new Date().getHours();
      let timeOfDay = 'morning';
      if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
      else if (hour >= 18) timeOfDay = 'evening';
      
      const tracks = data.playlist[timeOfDay];
      if (tracks && tracks.length > 0) {
        setCurrentTrack({ ...tracks[0], timeOfDay, index: 0 });
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
    setLoading(false);
  };

  // Log de reprodução
  const logPlay = async (track, action) => {
    try {
      await fetch('/api/playlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          track_id: track.id,
          started_at: action === 'start' ? new Date().toISOString() : null,
          ended_at: action === 'end' ? new Date().toISOString() : null
        })
      });
    } catch (error) {
      console.error('Error logging play:', error);
    }
  };

  // Próxima música
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const tracks = playlist.playlist[currentTrack.timeOfDay];
    const nextIndex = (currentTrack.index + 1) % tracks.length;
    const next = { ...tracks[nextIndex], timeOfDay: currentTrack.timeOfDay, index: nextIndex };
    
    if (currentTrack) logPlay(currentTrack, 'end');
    setCurrentTrack(next);
    setIsPlaying(true);
  };

  // Controles de áudio
  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      logPlay(currentTrack, 'start');
    }
  };

  // Atualizar curadoria
  const updateCuration = () => {
    loadPlaylist();
  };

  // Próximas 5 músicas
  const getUpcomingTracks = () => {
    if (!playlist || !currentTrack) return [];
    
    const tracks = playlist.playlist[currentTrack.timeOfDay];
    const upcoming = [];
    
    for (let i = 1; i <= 5; i++) {
      const index = (currentTrack.index + i) % tracks.length;
      upcoming.push(tracks[index]);
    }
    
    return upcoming;
  };

  useEffect(() => {
    if (company) loadPlaylist();
  }, [company]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">🎵 Carregando curadoria musical...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-center mb-4">{company}</h2>
      
      {currentTrack && (
        <>
          <audio ref={audioRef} src={currentTrack.url} />
          
          {/* Música atual */}
          <div className="text-center mb-4">
            <h3 className="font-semibold">{currentTrack.title}</h3>
            <p className="text-gray-600">{currentTrack.artist}</p>
            <p className="text-sm text-gray-500">{currentTrack.genre}</p>
          </div>

          {/* Controles */}
          <div className="flex justify-center space-x-4 mb-4">
            <button 
              onClick={togglePlay}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button 
              onClick={nextTrack}
              className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600"
            >
              ⏭️
            </button>
          </div>

          {/* Barra de progresso */}
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTrack % 60)).padStart(2, '0')}</span>
              <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Próximas músicas */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Próximas:</h4>
            {getUpcomingTracks().slice(0, 5).map((track, index) => (
              <div key={index} className="text-sm text-gray-600 py-1">
                {track.title} - {track.artist}
              </div>
            ))}
          </div>

          {/* Botão atualizar */}
          <button 
            onClick={updateCuration}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            🔄 Atualizar Curadoria
          </button>
        </>
      )}
    </div>
  );
}