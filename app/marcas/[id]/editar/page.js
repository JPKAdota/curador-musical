'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditBrandPage() {
    const params = useParams();
    const router = useRouter();
    const brandId = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sector: '',
        track_count: 30,
        time_distribution: {
            morning: 33,
            afternoon: 34,
            evening: 33
        }
    });

    useEffect(() => {
        fetchBrandDetails();
    }, [brandId]);

    const fetchBrandDetails = async () => {
        try {
            const response = await fetch(`/api/brands?id=${brandId}`);
            if (!response.ok) throw new Error('Failed to fetch brand');

            const data = await response.json();
            const brand = data.brand;

            setFormData({
                name: brand.name || '',
                description: brand.description || '',
                sector: brand.sector || '',
                track_count: brand.track_count || 30,
                time_distribution: brand.time_distribution || { morning: 33, afternoon: 34, evening: 33 }
            });
        } catch (error) {
            console.error('Error fetching brand:', error);
            alert('Erro ao carregar dados da marca.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimeChange = (period, value) => {
        setFormData(prev => ({
            ...prev,
            time_distribution: {
                ...prev.time_distribution,
                [period]: parseInt(value) || 0
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // TODO: Implement update API endpoint if needed, or reuse create/curate logic
            // For now, we'll just redirect back since the backend update logic might need adjustment
            // This is a placeholder for the actual update functionality

            // Simulating update for now as the API endpoint for PUT might not exist yet
            // In a real scenario: await fetch(`/api/brands/${brandId}`, { method: 'PUT', body: JSON.stringify(formData) });

            alert('Funcionalidade de edição em desenvolvimento. Redirecionando...');
            router.push(`/marcas/${brandId}`);
        } catch (error) {
            console.error('Error updating brand:', error);
            alert('Erro ao salvar alterações.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-2xl p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-400">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl p-6">
            <div className="mb-8">
                <Link href={`/marcas/${brandId}`} className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
                    ← Voltar para Detalhes
                </Link>
                <h1 className="text-3xl font-bold">Editar Marca</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 space-y-6">

                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Nome da Marca</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Setor / Indústria</label>
                        <input
                            type="text"
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                        ></textarea>
                    </div>
                </div>

                {/* Settings */}
                <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-bold mb-4">Configurações Musicais</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Total de Músicas</label>
                        <input
                            type="number"
                            name="track_count"
                            value={formData.track_count}
                            onChange={handleChange}
                            min="10"
                            max="200"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Manhã (%)</label>
                            <input
                                type="number"
                                value={formData.time_distribution.morning}
                                onChange={(e) => handleTimeChange('morning', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Tarde (%)</label>
                            <input
                                type="number"
                                value={formData.time_distribution.afternoon}
                                onChange={(e) => handleTimeChange('afternoon', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Noite (%)</label>
                            <input
                                type="number"
                                value={formData.time_distribution.evening}
                                onChange={(e) => handleTimeChange('evening', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-center"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end gap-3">
                    <Link href={`/marcas/${brandId}`} className="px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition">
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}
