import { NextResponse } from 'next/server';
import supabase from '../../../../lib/db.js';

function log(message, data = null) {
    // Also log to console for development
    console.log(message, data || '');
}

export async function POST(request) {
    try {
        const { brandId } = await request.json();

        if (!brandId) {
            return NextResponse.json({ error: 'Brand ID required' }, { status: 400 });
        }

        // Get brand data
        const { data: brand, error: brandError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', brandId)
            .single();

        if (brandError || !brand) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }

        log('🎵 Gerando playlists para:', brand.name);
        log('📊 Dados da brand:', { track_count: brand.track_count, bpm_ranges: brand.bpm_ranges, time_distribution: brand.time_distribution });

        const { track_count, bpm_ranges, genres, time_distribution } = brand;

        // Calculate tracks per period
        const tracksPerPeriod = {
            morning: Math.floor(track_count * (time_distribution.morning / 100)),
            afternoon: Math.floor(track_count * (time_distribution.afternoon / 100)),
            evening: Math.floor(track_count * (time_distribution.evening / 100))
        };

        log('📈 Músicas por período:', tracksPerPeriod);

        const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;
        log('🔑 Jamendo Client ID:', CLIENT_ID ? 'Configurado ✅' : 'NÃO CONFIGURADO ❌');

        const playlists = [];

        // Generate playlist for each period
        for (const [period, count] of Object.entries(tracksPerPeriod)) {
            log(`\n⏰ Gerando playlist para: ${period} (${count} músicas)`);

            const periodData = bpm_ranges[period];
            log('   Dados do período:', periodData);

            const tagsList = periodData.genres;
            // Pick ONE random tag to increase chance of results
            const randomTag = tagsList[Math.floor(Math.random() * tagsList.length)];
            log('   Tags disponíveis:', tagsList);
            log('   Tag selecionada para busca:', randomTag);

            // Fetch from Jamendo
            const poolSize = Math.max(count * 5, 50);

            // 1. Fetch a SEED track first
            const orders = ['popularity_month', 'releasedate', 'relevance', 'popularity_total'];
            const randomOrder = orders[Math.floor(Math.random() * orders.length)];
            const randomOffset = Math.floor(Math.random() * 500);

            // Fetch just 1 track to be the seed
            const seedUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=1&tags=${encodeURIComponent(randomTag)}&include=musicinfo&audioformat=mp32&order=${randomOrder}&offset=${randomOffset}`;
            console.log(`   🌱 Buscando seed track (Order: ${randomOrder}, Offset: ${randomOffset}):`, seedUrl);

            const seedResponse = await fetch(seedUrl, { cache: 'no-store' });
            const seedData = await seedResponse.json();
            const seedTrack = seedData.results?.[0];

            let allTracks = [];

            if (seedTrack) {
                console.log(`   ✨ Seed encontrada: ${seedTrack.name} (ID: ${seedTrack.id})`);
                allTracks.push(seedTrack);

                // 2. Fetch SIMILAR tracks based on the seed
                const similarUrl = `https://api.jamendo.com/v3.0/tracks/similar/?client_id=${CLIENT_ID}&format=json&limit=${poolSize}&id=${seedTrack.id}&no_artist=1&include=musicinfo&audioformat=mp32`;
                console.log(`   🔗 Buscando similares:`, similarUrl);

                const similarResponse = await fetch(similarUrl, { cache: 'no-store' });
                const similarData = await similarResponse.json();

                if (similarData.results && similarData.results.length > 0) {
                    console.log(`   👯 Encontradas ${similarData.results.length} músicas similares.`);
                    allTracks = [...allTracks, ...similarData.results];
                } else {
                    console.log(`   ⚠️  Nenhuma música similar encontrada.`);
                }
            } else {
                console.log(`   ⚠️  Nenhuma seed encontrada com offset ${randomOffset}.`);
            }

            // 3. Fallback / Fill Logic
            if (allTracks.length < count) {
                console.log(`   ⚠️  Músicas insuficientes (${allTracks.length}/${count}). Completando com busca por tag...`);

                // Retry logic for tag search
                let tagTracks = [];

                // Try high offset first
                const tagUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=${poolSize}&tags=${encodeURIComponent(randomTag)}&include=musicinfo&audioformat=mp32&order=${randomOrder}&offset=${randomOffset}`;
                console.log(`   🔗 URL Tag Search:`, tagUrl);

                const tagResponse = await fetch(tagUrl, { cache: 'no-store' });
                const tagData = await tagResponse.json();
                tagTracks = tagData.results || [];

                // Retry with low offset if empty
                if (tagTracks.length === 0 && randomOffset > 50) {
                    const lowOffset = Math.floor(Math.random() * 50);
                    console.log(`   ⚠️  Nenhuma música com offset ${randomOffset}. Tentando novamente com offset baixo (${lowOffset})...`);

                    const retryUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=${poolSize}&tags=${encodeURIComponent(randomTag)}&include=musicinfo&audioformat=mp32&order=${randomOrder}&offset=${lowOffset}`;
                    console.log(`   🔗 URL Retry:`, retryUrl);

                    const retryResponse = await fetch(retryUrl, { cache: 'no-store' });
                    const retryData = await retryResponse.json();
                    tagTracks = retryData.results || [];
                }

                // If still empty, go to popular
                if (tagTracks.length === 0) {
                    console.log(`   ⚠️  Ainda sem músicas para tag '${randomTag}'. Buscando populares...`);
                    const fallbackOrder = orders[Math.floor(Math.random() * orders.length)];
                    const fallbackOffset = Math.floor(Math.random() * 1000);

                    const fallbackUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=${poolSize}&order=${fallbackOrder}&offset=${fallbackOffset}&include=musicinfo&audioformat=mp32`;
                    console.log(`   🔗 URL Fallback (Order: ${fallbackOrder}, Offset: ${fallbackOffset}):`, fallbackUrl);

                    const fallbackResponse = await fetch(fallbackUrl, { cache: 'no-store' });
                    const fallbackData = await fallbackResponse.json();
                    tagTracks = fallbackData.results || [];
                }

                // Add unique tracks to allTracks
                const existingIds = new Set(allTracks.map(t => t.id));
                for (const track of tagTracks) {
                    if (!existingIds.has(track.id)) {
                        allTracks.push(track);
                        existingIds.add(track.id);
                    }
                }
            }

            // Shuffle tracks (Fisher-Yates algorithm)
            for (let i = allTracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allTracks[i], allTracks[j]] = [allTracks[j], allTracks[i]];
            }

            // Select only the needed amount
            const tracks = allTracks.slice(0, count);

            // Save tracks to database (without duplicates)
            log(`   💾 Salvando ${tracks.length} músicas na biblioteca...`);
            const trackIds = [];

            for (const item of tracks) {
                // Check if track already exists by jamendo_id
                const { data: existingTrack } = await supabase
                    .from('tracks')
                    .select('id')
                    .eq('jamendo_id', String(item.id))
                    .single();

                if (existingTrack) {
                    log(`   ♻️  Música já existe: ${item.name} (ID: ${existingTrack.id})`);
                    trackIds.push(existingTrack.id);
                } else {
                    // Insert new track
                    const { data: newTrack, error: trackError } = await supabase
                        .from('tracks')
                        .insert({
                            jamendo_id: String(item.id),
                            title: item.name,
                            artist: item.artist_name,
                            genre: item.musicinfo?.tags?.genres?.[0] || 'Music',
                            url: item.audio,
                            duration: item.duration,
                            image: item.image,
                            bpm: Math.floor(Math.random() * (periodData.max - periodData.min) + periodData.min),
                            source: 'jamendo',
                            license: 'Creative Commons',
                            tags: item.musicinfo?.tags?.vartags || [],
                            time_period: period
                        })
                        .select('id')
                        .single();

                    if (trackError) {
                        console.error(`   ❌ Erro ao salvar música: ${trackError.message}`);
                    } else {
                        log(`   ✅ Nova música salva: ${item.name} (ID: ${newTrack.id})`);
                        trackIds.push(newTrack.id);
                    }
                }
            }

            // Save playlist to database with track IDs
            log(`   💾 Salvando playlist no banco com ${trackIds.length} músicas...`);
            const { data: savedData, error: playlistError } = await supabase
                .from('playlists')
                .insert({
                    company_id: brandId,
                    time_period: period,
                    bpm_min: periodData.min,
                    bpm_max: periodData.max,
                    genres: periodData.genres,
                    track_ids: trackIds
                })
                .select();

            if (playlistError) {
                console.error('   ❌ Erro ao salvar playlist:', playlistError);
            } else {
                log(`   ✅ Playlist salva com sucesso! ID: ${savedData?.[0]?.id}`);
            }

            // Fetch tracks for response
            const { data: playlistTracks } = await supabase
                .from('tracks')
                .select('*')
                .in('id', trackIds);

            playlists.push({
                period,
                bpm_range: `${periodData.min}-${periodData.max}`,
                genres: periodData.genres,
                track_count: playlistTracks?.length || 0,
                tracks: playlistTracks || []
            });
        }

        // Update brand status
        await supabase
            .from('companies')
            .update({ status: 'completed' })
            .eq('id', brandId);

        return NextResponse.json({ playlists });
    } catch (error) {
        console.error('Error generating playlists:', error);
        log('Error generating playlists:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
