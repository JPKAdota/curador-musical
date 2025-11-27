
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler variáveis de ambiente do .env.local manualmente
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars['SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_KEY'];
const jamendoId = envVars['JAMENDO_CLIENT_ID'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Erro: Credenciais não encontradas no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- Verificando Banco de Dados ---');
    console.log(`JAMENDO_CLIENT_ID: ${jamendoId ? 'Configurado' : 'NÃO ENCONTRADO'}`);

    // Check Companies
    const { data: companies } = await supabase.from('companies').select('id, name, track_count, status');
    console.log(`\nEmpresas (${companies.length}):`);
    companies.forEach(c => console.log(` - ${c.name} (ID: ${c.id}): Meta ${c.track_count} músicas, Status: ${c.status}`));

    // Check Tracks
    const { count: tracksCount, data: tracks } = await supabase.from('tracks').select('id, title, source', { count: 'exact' });
    console.log(`\nMúsicas Totais: ${tracksCount}`);
    if (tracks.length > 0) {
        console.log(`IDs das músicas: ${tracks.map(t => t.id).join(', ')}`);
        const sources = tracks.reduce((acc, t) => { acc[t.source] = (acc[t.source] || 0) + 1; return acc; }, {});
        console.log('Fontes:', sources);
    }

    // Check Playlists
    const { data: playlists } = await supabase.from('playlists').select('id, time_period, track_ids, company_id');
    console.log(`\nPlaylists (${playlists.length}):`);

    for (const p of playlists) {
        const trackIds = p.track_ids || [];
        console.log(` - Playlist ${p.id} (Empresa ${p.company_id}, ${p.time_period}): ${trackIds.length} IDs de músicas`);

        // Verify if tracks exist
        if (trackIds.length > 0) {
            const { count } = await supabase.from('tracks').select('id', { count: 'exact', head: true }).in('id', trackIds);
            console.log(`   -> ${count} músicas encontradas no banco de dados (de ${trackIds.length} IDs)`);
        }
    }
}

check();
