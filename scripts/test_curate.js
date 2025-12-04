// Script to trigger curate API (Port 3000 - Production)

async function triggerCurate() {
    const brandData = {
        name: "Teste Brand Local",
        description: "Uma marca de teste para validação local",
        sector: "Tecnologia",
        brandId: 30 // Using existing ID
    };

    console.log('🚀 Disparando curadoria (Port 3000)...');

    try {
        const response = await fetch('http://localhost:3000/api/curate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(brandData)
        });

        console.log('Status:', response.status);
        if (response.status !== 200) {
            const text = await response.text();
            console.log('Error Body:', text);
        } else {
            const data = await response.json();
            console.log('✅ Curadoria concluída!');
            console.log('Analysis:', data.analysis.brand_profile);
        }
    } catch (error) {
        console.error('❌ Erro ao chamar API:', error.message);
    }
}

triggerCurate();
