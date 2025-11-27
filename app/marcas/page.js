'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarcasPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await fetch('/api/brands');
            const data = await response.json();
            setBrands(data.brands || []);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (brandId, brandName) => {
        if (!confirm(`Tem certeza que deseja remover a marca "${brandName}"?`)) return;

        try {
            const response = await fetch(`/api/brands?id=${brandId}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Marca removida com sucesso!');
                fetchBrands();
            } else {
                alert('Erro ao remover marca');
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
            alert('Erro ao remover marca');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            analyzing: { color: 'bg-yellow-600', text: 'Analisando' },
            waiting_approval: { color: 'bg-blue-600', text: 'Aguardando Aprovação' },
            completed: { color: 'bg-green-600', text: 'Concluído' }
        };
        const badge = badges[status] || { color: 'bg-gray-600', text: 'Novo' };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                {badge.text}
            </span>
        );
    };

    return (
        <div className="container mx-auto max-w-6xl p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">🏢 Marcas Cadastradas</h1>
                    <p className="text-gray-400">Gerencie todas as suas marcas e playlists</p>
                </div>
                <Link
                    href="/"
                    className="px-6 py-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-500 transition"
                >
                    + Nova Marca
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-400">Carregando marcas...</p>
                </div>
            ) : brands.length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 text-center border border-gray-700">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-2xl font-bold mb-2">Nenhuma marca cadastrada</h3>
                    <p className="text-gray-400 mb-6">Comece criando sua primeira marca</p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-500"
                    >
                        Cadastrar Primeira Marca
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{brand.name}</h3>
                                    <p className="text-gray-400 text-sm">
                                        Criado em {new Date(brand.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                {getStatusBadge(brand.status)}
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Tipo</p>
                                    <p className="font-bold">{brand.business_type || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Vibe</p>
                                    <p className="font-bold">{brand.vibe || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Músicas</p>
                                    <p className="font-bold">{brand.track_count || 0}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Gêneros</p>
                                    <p className="font-bold text-sm">
                                        {brand.genres?.slice(0, 2).join(', ') || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {brand.genres && brand.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {brand.genres.map((genre, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-purple-600/30 rounded-full text-xs"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Link
                                    href={`/marcas/${brand.id}`}
                                    className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-center font-medium hover:bg-blue-500"
                                >
                                    Ver Detalhes
                                </Link>
                                <Link
                                    href={`/marcas/${brand.id}/editar`}
                                    className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-center font-medium hover:bg-gray-600"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(brand.id, brand.name)}
                                    className="px-4 py-2 bg-red-600 rounded-lg font-medium hover:bg-red-500"
                                >
                                    🗑️ Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
