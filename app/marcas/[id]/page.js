'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BrandDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const brandId = params.id;

    const [brand, setBrand] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [playingTrackId, setPlayingTrackId] = useState(null);

    useEffect(() => {
        fetchBrandDetails();
    }, [brandId]);

    const fetchBrandDetails = async () => {
        try {
            // Buscar dados da marca
            const brandResponse = await fetch(`/api/brands?id=${brandId}`);
            const brandData = await brandResponse.json();
            setBrand(brandData.brand);

            // Buscar playlists da marca
            const playlistsResponse = await fetch(`/api/playlists?brandId=${brandId}`);
            const playlistsData = await playlistsResponse.json();
            setPlaylists(playlistsData.playlists || []);
        } catch (error) {
            console.error('Error fetching brand details:', error);
        }
        setLoading(false);
    };

    const handleGeneratePlaylists = async () => {
        setGenerating(true);
        try {
            const response = await fetch('/api/playlists/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brandId })
            });

            if (!response.ok) {
                throw new Error('Falha ao gerar playlists');
            }

            const data = await response.json();
            setPlaylists(data.playlists);

            // Atualizar dados da marca para refletir novo status
            fetchBrandDetails();

            alert('Playlists geradas com sucesso!');
        } catch (error) {
            console.error('Error generating playlists:', error);
            alert('Erro ao gerar playlists. Tente novamente.');
        }
        setGenerating(false);
    };

    const playTrack = (url, trackId) => {
        if (playingTrackId === trackId) {
            // Stop current track
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            setPlayingTrackId(null);
            setCurrentAudio(null);
        } else {
            // Stop previous track if any
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Play new track
            const audio = new Audio(url);
            audio.play();
            audio.onended = () => {
                setPlayingTrackId(null);
                setCurrentAudio(null);
            };
            setCurrentAudio(audio);
            setPlayingTrackId(trackId);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-6xl p-6">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-400">Carregando detalhes...</p>
                </div>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="container mx-auto max-w-6xl p-6">
                <div className="bg-red-900/20 border border-red-700/50 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">❌ Marca não encontrada</h2>
                    <p className="text-gray-400 mb-4">A marca solicitada não existe ou foi removida.</p>
                    <Link href="/marcas" className="px-4 py-2 bg-purple-600 rounded-lg inline-block">
                        ← Voltar para Marcas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl p-6">
            {/* Header */}
            <div className="mb-8">
                <Link href="/marcas" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
                    ← Voltar para Marcas
                </Link>
                <h1 className="text-4xl font-bold mb-2">{brand.name}</h1>
                <p className="text-gray-400">
                    Criado em {new Date(brand.created_at).toLocaleDateString('pt-BR')}
                </p>
            </div>

            {/* Informações da Marca */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 mb-6">
                <h2 className="text-2xl font-bold mb-4">📊 Informações da Marca</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Tipo de Negócio</p>
                        <p className="font-bold">{brand.business_type || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Vibe</p>
                        <p className="font-bold">{brand.vibe || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Total de Músicas</p>
                        <p className="font-bold">{brand.track_count || 0}</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Status</p>
                        <p className="font-bold capitalize">{brand.status || 'draft'}</p>
                    </div>
                </div>

                {brand.genres && brand.genres.length > 0 && (
                    <div className="mt-4">
                        <p className="text-gray-400 text-sm mb-2">Gêneros:</p>
                        <div className="flex flex-wrap gap-2">
                            {brand.genres.map((genre, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Playlists */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">🎵 Playlists Geradas</h2>
                    {playlists.length === 0 && (
                        <button
                            onClick={handleGeneratePlaylists}
                            disabled={generating}
                            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {generating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Gerando...
                                </>
                            ) : (
                                '✨ Gerar Playlists com IA'
                            )}
                        </button>
                    )}
                </div>

                {playlists.length === 0 ? (
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 text-center border border-gray-700">
                        <div className="text-6xl mb-4">🎵</div>
                        <h3 className="text-2xl font-bold mb-2">Nenhuma playlist gerada</h3>
                        <p className="text-gray-400 mb-6">
                            Esta marca ainda não possui playlists. Clique no botão acima para gerar.
                        </p>
                    </div>
                ) : (
                    playlists.map((playlist, idx) => (
                        <div key={idx} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold capitalize">
                                    {playlist.time_period === 'morning' ? '🌅 Manhã' :
                                        playlist.time_period === 'afternoon' ? '☀️ Tarde' : '🌙 Noite'}
                                </h3>
                                <div className="text-sm text-gray-400">
                                    <span className="mr-4">BPM: {playlist.bpm_min}-{playlist.bpm_max}</span>
                                    <span>{playlist.tracks?.length || 0} músicas</span>
                                </div>
                            </div>

                            {playlist.genres && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {playlist.genres.map((genre, i) => (
                                        <span key={i} className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}

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
                                        {playlist.tracks?.slice(0, 20).map((track, i) => {
                                            const uniqueId = `${playlist.id}-${track.id}-${i}`;
                                            const isPlaying = playingTrackId === uniqueId;

                                            return (
                                                <tr key={i} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                                                    <td className="p-2">{i + 1}</td>
                                                    <td className="p-2">
                                                        <button
                                                            onClick={() => playTrack(track.url, uniqueId)}
                                                            className={`px-2 py-1 rounded text-xs ${isPlaying
                                                                ? 'bg-red-600 hover:bg-red-500'
                                                                : 'bg-green-600 hover:bg-green-500'}`}
                                                            title={isPlaying ? "Parar música" : "Ouvir música"}
                                                        >
                                                            {isPlaying ? '⏹️' : '▶️'}
                                                        </button>
                                                    </td>
                                                    <td className="p-2 font-medium">{track.title}</td>
                                                    <td className="p-2 text-gray-400">{track.artist}</td>
                                                    <td className="p-2 text-gray-400">{track.genre}</td>
                                                    <td className="p-2 text-purple-400">{track.bpm}</td>
                                                    <td className="p-2 text-gray-400">
                                                        {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {playlist.tracks && playlist.tracks.length > 20 && (
                                    <p className="text-center text-gray-500 mt-4 text-sm">
                                        + {playlist.tracks.length - 20} músicas...
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
