// Script simples para testar geração de playlists
console.log('🎵 Testando Jamendo API para Playlists\n');

const CLIENT_ID = 'ec7b6ebe';

// Teste 1: Buscar músicas de Jazz (manhã)
console.log('=== TESTE 1: Manhã (Jazz, Acoustic, Bossa Nova) ===');
const morningUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&tags=jazz+acoustic&include=musicinfo&audioformat=mp32`;
console.log('URL:', morningUrl);
console.log('\nExecute este comando para testar:');
console.log(`curl "${morningUrl}"`);

console.log('\n' + '='.repeat(60) + '\n');

// Teste 2: Buscar músicas de Indie Pop (tarde)
console.log('=== TESTE 2: Tarde (Indie Pop, Folk) ===');
const afternoonUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&tags=indie+pop&include=musicinfo&audioformat=mp32`;
console.log('URL:', afternoonUrl);
console.log('\nExecute este comando para testar:');
console.log(`curl "${afternoonUrl}"`);

console.log('\n' + '='.repeat(60) + '\n');

// Teste 3: Fallback (músicas populares)
console.log('=== TESTE 3: Fallback (Músicas Populares) ===');
const fallbackUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&order=popularity_total&include=musicinfo&audioformat=mp32`;
console.log('URL:', fallbackUrl);
console.log('\nExecute este comando para testar:');
console.log(`curl "${fallbackUrl}"`);

console.log('\n' + '='.repeat(60) + '\n');

console.log('💡 DIAGNÓSTICO:');
console.log('1. Se os comandos curl acima retornarem músicas, a API está OK');
console.log('2. Verifique o arquivo: app/api/playlists/generate/route.js');
console.log('3. Certifique-se que está usando process.env.JAMENDO_CLIENT_ID');
console.log('4. Teste criar uma marca na interface web (http://localhost:3000)');
console.log('\n✅ Para testar na interface:');
console.log('   1. Acesse http://localhost:3000');
console.log('   2. Cadastre marca "Starbucks"');
console.log('   3. Aprove a análise');
console.log('   4. Verifique se as playlists são geradas com músicas do Jamendo');
