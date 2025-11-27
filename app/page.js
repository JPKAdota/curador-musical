'use client';
import { useState } from 'react';
import Stepper from '../components/Stepper';

export default function Home() {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({
    name: '',
    track_count: 100,
    id: null
  });
  const [analysis, setAnalysis] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: brandData.name, track_count: brandData.track_count })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setBrandData({ ...brandData, id: data.brand.id });

      // Auto-analyze with AI
      const analyzeResponse = await fetch('/api/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: brandData.name, brandId: data.brand.id })
      });
      const analyzeData = await analyzeResponse.json();
      setAnalysis(analyzeData.analysis);
      setStep(2);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/playlists/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: brandData.id })
      });
      const data = await response.json();
      setPlaylists(data.playlists);
      setStep(3);
    } catch (error) {
      alert('Erro ao gerar playlists');
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(1);
    setBrandData({ name: '', track_count: 100, id: null });
    setAnalysis(null);
    setPlaylists(null);
  };

  return (
    <div className="p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            AI Music Curator Pro
          </h1>
          <p className="text-gray-400">Sistema Profissional de Curadoria Musical</p>
        </header>

        <Stepper currentStep={step} />

        {/* STEP 1: CADASTRO SIMPLES */}
        {step === 1 && (
          <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">📝 Cadastro da Marca</h2>
            <p className="text-gray-400 mb-6">
              Nossa IA especialista em branding e marketing sensorial irá analisar sua marca e criar a curadoria musical perfeita.
            </p>
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da Marca *</label>
                <input
                  type="text"
                  value={brandData.name}
                  onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Ex: Starbucks, Smart Fit, Zara..."
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 A IA irá analisar automaticamente: segmento, público-alvo, vibe, cores e muito mais!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantidade de Músicas *</label>
                <select
                  value={brandData.track_count}
                  onChange={(e) => setBrandData({ ...brandData, track_count: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value={50}>50 músicas</option>
                  <option value={100}>100 músicas</option>
                  <option value={200}>200 músicas</option>
                  <option value={400}>400 músicas</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-lg font-bold text-lg hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading ? '🤖 IA Analisando sua Marca...' : '✨ Analisar com IA Especialista'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: ANÁLISE */}
        {step === 2 && analysis && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">🤖 Análise Profissional da Marca</h2>

              {/* Brand Profile */}
              {analysis.brand_profile && (
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-lg mb-6 border border-purple-700/50">
                  <h3 className="text-purple-400 text-sm font-bold mb-3">📊 PERFIL DA MARCA</h3>
                  <p className="text-gray-200 leading-relaxed">{analysis.brand_profile}</p>
                </div>
              )}

              {/* Emotional Tone & Target Audience */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-blue-400 text-sm font-bold mb-2">🎭 TOM EMOCIONAL</h3>
                  <p>{analysis.emotional_tone || analysis.vibe}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="text-green-400 text-sm font-bold mb-2">👥 PÚBLICO-ALVO</h3>
                  <p>{analysis.target_audience}</p>
                </div>
              </div>

              {/* Music Style */}
              {analysis.ideal_music_style && (
                <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                  <h3 className="text-yellow-400 text-sm font-bold mb-2">🎵 ESTILO MUSICAL IDEAL</h3>
                  <p className="italic">"{analysis.ideal_music_style}"</p>
                </div>
              )}

              {/* Time Variations */}
              {analysis.time_variations && (
                <>
                  <h3 className="text-xl font-bold mb-4">⏰ Variações por Horário</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {Object.entries(analysis.time_variations).map(([key, data]) => (
                      <div key={key} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-blue-700/50">
                        <h4 className="font-bold text-lg mb-2">{data.description}</h4>
                        <p className="text-sm text-gray-300 mb-2">
                          BPM: {data.bpm.min}-{data.bpm.max} | Energia: {data.energy}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {data.genres.map((genre, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-600/30 rounded text-xs">{genre}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* BPM Breakdown (fallback) */}
              {!analysis.time_variations && analysis.bpm_breakdown && (
                <>
                  <h3 className="text-xl font-bold mb-4">📊 Distribuição por Horário</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {Object.entries(analysis.bpm_breakdown).map(([period, data]) => (
                      <div key={period} className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-700/50">
                        <h4 className="font-bold text-lg mb-2 capitalize">
                          {period === 'morning' ? '🌅 Manhã' : period === 'afternoon' ? '☀️ Tarde' : '🌙 Noite'}
                        </h4>
                        <p className="text-sm text-gray-300 mb-2">BPM: {data.min}-{data.max}</p>
                        <div className="flex flex-wrap gap-1">
                          {data.genres.map((genre, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-600/30 rounded text-xs">{genre}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Avoid List */}
              {analysis.avoid && (
                <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg mb-6">
                  <h3 className="text-red-400 text-sm font-bold mb-3">⚠️ O QUE EVITAR</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Estilos Musicais:</p>
                      <ul className="text-sm space-y-1">
                        {analysis.avoid.musical_styles.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Comportamentos:</p>
                      <ul className="text-sm space-y-1">
                        {analysis.avoid.behaviors.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Type */}
              {analysis.voice_type && (
                <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                  <h3 className="text-cyan-400 text-sm font-bold mb-2">🎙️ TIPO DE VOZ IDEAL PARA LOCUÇÕES</h3>
                  <p className="text-sm">{analysis.voice_type}</p>
                </div>
              )}

              {/* Thematic Playlists */}
              {analysis.thematic_playlists && (
                <>
                  <h3 className="text-xl font-bold mb-4">🎧 Playlists Temáticas Sugeridas</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {analysis.thematic_playlists.map((playlist, i) => (
                      <div key={i} className="bg-gradient-to-br from-green-900/30 to-blue-900/30 p-4 rounded-lg border border-green-700/50">
                        <h4 className="font-bold mb-2">{playlist.name}</h4>
                        <p className="text-xs text-gray-400 mb-3">{playlist.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {playlist.tags.map((tag, j) => (
                            <span key={j} className="px-2 py-1 bg-green-600/30 rounded text-xs">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600">
                  ← Voltar
                </button>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-500 disabled:opacity-50"
                >
                  {loading ? 'Gerando...' : '✅ Aprovar e Gerar Playlists'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PLAYLISTS */}
        {step === 3 && playlists && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">🎵 Playlists Geradas</h2>

            {playlists.map((playlist, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold capitalize">
                    {playlist.period === 'morning' ? '🌅 Manhã' : playlist.period === 'afternoon' ? '☀️ Tarde' : '🌙 Noite'}
                  </h3>
                  <div className="text-sm text-gray-400">
                    <span className="mr-4">BPM: {playlist.bpm_range}</span>
                    <span>{playlist.track_count} músicas</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {playlist.genres.map((genre, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">{genre}</span>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-900/50">
                      <tr>
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">▶️</th>
                        <th className="p-2 text-left">Música</th>
                        <th className="p-2 text-left">Artista</th>
                        <th className="p-2 text-left">Gênero</th>
                        <th className="p-2 text-left">BPM</th>
                        <th className="p-2 text-left">Duração</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playlist.tracks.slice(0, 10).map((track, i) => {
                        const trackId = `${playlist.period}-${i}`;
                        const isPlaying = playingTrackId === trackId;

                        return (
                          <tr key={i} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                            <td className="p-2">{i + 1}</td>
                            <td className="p-2">
                              <button
                                onClick={() => {
                                  if (isPlaying) {
                                    // Parar música
                                    if (currentAudio) {
                                      currentAudio.pause();
                                      currentAudio.currentTime = 0;
                                    }
                                    setPlayingTrackId(null);
                                    setCurrentAudio(null);
                                  } else {
                                    // Parar música anterior
                                    if (currentAudio) {
                                      currentAudio.pause();
                                      currentAudio.currentTime = 0;
                                    }
                                    // Tocar nova música
                                    const audio = new Audio(track.url);
                                    audio.play();
                                    audio.onended = () => {
                                      setPlayingTrackId(null);
                                      setCurrentAudio(null);
                                    };
                                    setCurrentAudio(audio);
                                    setPlayingTrackId(trackId);
                                  }
                                }}
                                className={`px-2 py-1 rounded text-xs ${isPlaying
                                    ? 'bg-red-600 hover:bg-red-500'
                                    : 'bg-green-600 hover:bg-green-500'
                                  }`}
                                title={isPlaying ? "Parar música" : "Ouvir música"}
                              >
                                {isPlaying ? '⏹️' : '▶️'}
                              </button>
                            </td>
                            <td className="p-2 font-medium">{track.title}</td>
                            <td className="p-2 text-gray-400">{track.artist}</td>
                            <td className="p-2 text-gray-400">{track.genre}</td>
                            <td className="p-2 text-purple-400">{track.bpm}</td>
                            <td className="p-2 text-gray-400">{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {playlist.tracks.length > 10 && (
                    <p className="text-center text-gray-500 mt-4 text-sm">+ {playlist.tracks.length - 10} músicas...</p>
                  )}
                </div>
              </div>
            ))}

            <div className="text-center">
              <button onClick={reset} className="px-8 py-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-500">
                🎉 Finalizar e Criar Nova Marca
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}