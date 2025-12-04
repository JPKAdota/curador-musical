// Script to trigger playlist generation via API (Port 3001)

async function triggerGeneration() {
    const brandId = 30;
    console.log(`✅ Usando Brand ID: ${brandId}`);
    console.log('🚀 Disparando geração de playlists (Port 3001)...');

    try {
        // Use fetch (Node 18+ has native fetch)
        const response = await fetch('http://localhost:3001/api/playlists/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandId })
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
