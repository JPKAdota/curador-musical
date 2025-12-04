// Script to trigger playlist generation via API (Port 3000 - Production)

async function triggerGeneration() {
    const brandId = 30;
    console.log(`✅ Usando Brand ID: ${brandId}`);
    console.log('🚀 Disparando geração de playlists (Port 3000)...');

    try {
        const response = await fetch('http://localhost:3000/api/playlists/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brandId })
        });

        console.log('Status:', response.status);
        if (response.status !== 200) {
            const text = await response.text();
            console.log('Error Body:', text);
        } else {
            const data = await response.json();
            console.log('🏁 Geração concluída!');
        }
    } catch (error) {
        console.error('❌ Erro ao chamar API:', error.message);
    }
}

triggerGeneration();
