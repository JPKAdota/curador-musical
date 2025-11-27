// Script de teste para verificar a API da Jamendo
const CLIENT_ID = 'ec7b6ebe';

async function testJamendo() {
    console.log('Testando Jamendo API...\n');

    // Teste 1: Buscar por tag
    console.log('1. Buscando por tag "jazz":');
    let response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=5&tags=jazz&include=musicinfo&audioformat=mp32`
    );
    let data = await response.json();
    console.log(`   Encontrou ${data.results?.length || 0} músicas`);
    if (data.results?.length > 0) {
        console.log(`   Primeira: ${data.results[0].name} - ${data.results[0].artist_name}`);
    }

    // Teste 2: Buscar populares
    console.log('\n2. Buscando músicas populares:');
    response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=5&order=popularity_total&include=musicinfo&audioformat=mp32`
    );
    data = await response.json();
    console.log(`   Encontrou ${data.results?.length || 0} músicas`);
    if (data.results?.length > 0) {
        console.log(`   Primeira: ${data.results[0].name} - ${data.results[0].artist_name}`);
        console.log(`   URL: ${data.results[0].audio}`);
    }
}

testJamendo();
