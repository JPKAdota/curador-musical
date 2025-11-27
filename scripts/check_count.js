
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabase = createClient(envVars['SUPABASE_URL'], envVars['SUPABASE_SERVICE_KEY']);

async function check() {
    const { count, data } = await supabase.from('tracks').select('*', { count: 'exact', head: true });
    console.log(`Total Tracks in DB: ${count}`);

    // Check if we can fetch a specific Jamendo track
    // "Wish You Were Here" from screenshot
    const { data: specific } = await supabase.from('tracks').select('id, title').eq('title', 'Wish You Were Here');
    console.log('Specific track search:', specific);
}

check();
