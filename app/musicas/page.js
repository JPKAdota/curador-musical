'use client';
import { useState, useEffect } from 'react';

export default function MusicasPage() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        setLoading(true);
        try {
            // Add cache-busting parameter
            const response = await fetch(`/api/tracks?t=${Date.now()}`);
            const data = await response.json();
            setTracks(data.tracks || []);
            console.log('📚 Músicas carregadas:', data.tracks?.length || 0);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
        setLoading(false);
    };

    const filteredTracks = tracks.filter(track =>
        track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto max-w-6xl p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">🎵 Biblioteca de Músicas</h1>
                    <p className="text-gray-400">Gerencie todas as músicas disponíveis no sistema</p>
                </div>
                <button
                    onClick={fetchTracks}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition"
                    disabled={loading}
                >
                    {loading ? '🔄 Carregando...' : '🔄 Atualizar'}
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="🔍 Buscar por música, artista ou gênero..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-400">Carregando músicas...</p>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-gray-400">
                        Mostrando {filteredTracks.length} de {tracks.length} músicas
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/80">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Música</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Artista</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Gênero</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Período</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">BPM</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Duração</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTracks.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                                {searchTerm ? 'Nenhuma música encontrada' : 'Nenhuma música cadastrada'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTracks.map((track, index) => (
                                            <tr
                                                key={track.id}
                                                className="border-t border-gray-700/50 hover:bg-gray-700/30 transition"
                                            >
                                                <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                                                <td className="px-6 py-4 font-medium">{track.title}</td>
                                                <td className="px-6 py-4 text-gray-300">{track.artist}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-blue-600/30 rounded-full text-xs">
                                                        {track.genre}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-purple-600/30 rounded-full text-xs capitalize">
                                                        {track.time_period || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-purple-400">{track.bpm || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {track.duration ? `${Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}` : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
