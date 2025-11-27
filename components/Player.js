'use client';
import { useState, useEffect, useRef } from 'react';

export default function Player({ company, tags }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Carregar playlist da Jamendo via nossa API
  const loadPlaylist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/music?tags=${encodeURIComponent(tags)}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.tracks && data.tracks.length > 0) {
        setPlaylist(data.tracks);
        setCurrentTrack({ ...data.tracks[0], index: 0 });
      } else {
        setError('Nenhuma música encontrada para essas tags. Tente outra marca!');
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      setError(`Erro ao carregar músicas: ${error.message}`);
    }
    setLoading(false);
  };

  // Log de reprodução (DESABILITADO: músicas da Jamendo não estão na nossa tabela tracks)
  const logPlay = async (track, action) => {
    // try {
    //   await fetch('/api/playlog', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       company,
    //       track_id: track.id,
    //       started_at: action === 'start' ? new Date().toISOString() : null,
    //       ended_at: action === 'end' ? new Date().toISOString() : null
    //     })
    //   });
    // } catch (error) {
    //   console.error('Error logging play:', error);
    // }
  };

  // Próxima música
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;

    const nextIndex = (currentTrack.index + 1) % playlist.length;
    const next = { ...playlist[nextIndex], index: nextIndex };

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

    const upcoming = [];

    for (let i = 1; i <= 5; i++) {
      const index = (currentTrack.index + i) % playlist.length;
      upcoming.push(playlist[index]);
    }

    return upcoming;
  };

  useEffect(() => {
    if (company && tags) loadPlaylist();
  }, [company, tags]);

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
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <div className="text-lg text-purple-300">🎵 Buscando músicas perfeitas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 backdrop-blur-lg rounded-2xl border border-red-700 p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Ops!</h3>
        <p className="text-gray-300">{error}</p>
        <button
          onClick={loadPlaylist}
          className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
        >
          🔄 Tentar Novamente
        </button>
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
            {currentTrack.image && (
              <img
                src={currentTrack.image}
                alt={currentTrack.title}
                className="w-48 h-48 mx-auto rounded-lg shadow-lg mb-4 object-cover"
              />
            )}
            <h3 className="font-semibold text-xl">{currentTrack.title}</h3>
            <p className="text-gray-600">{currentTrack.artist}</p>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">{currentTrack.genre}</p>
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