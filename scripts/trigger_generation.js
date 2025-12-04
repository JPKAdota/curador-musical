// Script to trigger playlist generation via API
import supabase from '../lib/db.js';

async function triggerGeneration() {
    console.log('🔍 Buscando uma marca para teste...');

    const { data: brand } = await supabase
        .from('companies')
        .select('id, name')
        .limit(1)
        .single();

    if (!brand) {
        console.error('❌ Nenhuma marca encontrada no banco de dados.');
        return;
    }

    console.log(`✅ Marca encontrada: ${brand.name} (${brand.id})`);
    console.log('🚀 Disparando geração de playlists...');

    try {
        const response = await fetch('http://localhost:3000/api/playlists/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandId: brand.id })
        });

        const data = await response.json();
        console.log('🏁 Geração concluída!');
        console.log('Status:', response.status);
        // console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Erro ao chamar API:', error.message);
    }
}

triggerGeneration();
