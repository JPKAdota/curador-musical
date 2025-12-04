import { NextResponse } from 'next/server';
import supabase from '../../../../lib/db.js';

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

        console.log('🎵 Gerando playlists para:', brand.name);
        console.log('📊 Dados da brand:', { track_count: brand.track_count, bpm_ranges: brand.bpm_ranges, time_distribution: brand.time_distribution });

        const { track_count, bpm_ranges, genres, time_distribution } = brand;

        // Calculate tracks per period
        const tracksPerPeriod = {
            morning: Math.floor(track_count * (time_distribution.morning / 100)),
            afternoon: Math.floor(track_count * (time_distribution.afternoon / 100)),
            evening: Math.floor(track_count * (time_distribution.evening / 100))
        };

        console.log('📈 Músicas por período:', tracksPerPeriod);

        const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;
        console.log('🔑 Jamendo Client ID:', CLIENT_ID ? 'Configurado ✅' : 'NÃO CONFIGURADO ❌');

        const playlists = [];

        // Generate playlist for each period
        for (const [period, count] of Object.entries(tracksPerPeriod)) {
            console.log(`\n⏰ Gerando playlist para: ${period} (${count} músicas)`);

            const periodData = bpm_ranges[period];
            console.log('   Dados do período:', periodData);

            const tagsList = periodData.genres;
            // Pick ONE random tag to increase chance of results (AND logic with multiple tags often returns 0 results)
            const randomTag = tagsList[Math.floor(Math.random() * tagsList.length)];
            console.log('   Tags disponíveis:', tagsList);
            console.log('   Tag selecionada para busca:', randomTag);

            // Fetch from Jamendo
            // Fetch more tracks than needed to allow for randomization (pool size)
            const poolSize = Math.max(count * 5, 50);

            // Randomize sort order and offset to ensure variety
            const orders = ['popularity_month', 'releasedate', 'relevance', 'popularity_total'];
            const randomOrder = orders[Math.floor(Math.random() * orders.length)];
            const randomOffset = Math.floor(Math.random() * 50); // Skip up to 50 tracks

            // Use the single random tag
            const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=${poolSize}&tags=${encodeURIComponent(randomTag)}&include=musicinfo&audioformat=mp32&order=${randomOrder}&offset=${randomOffset}`;
            console.log(`   🔗 URL Jamendo (Order: ${randomOrder}, Offset: ${randomOffset}):`, url);

            // Disable caching to prevent stale results
            const response = await fetch(url, { cache: 'no-store' });
            const data = await response.json();

            // Fallback to popular if no results
            let allTracks = data.results || [];
            if (allTracks.length === 0) {
                console.log('   ⚠️  Nenhuma música encontrada com a tag, buscando populares (com randomização)...');

                // Also randomize the fallback to avoid always getting the same "top 50"
                const fallbackOrder = orders[Math.floor(Math.random() * orders.length)];
                const fallbackOffset = Math.floor(Math.random() * 100); // Larger offset for fallback

                const fallbackResponse = await fetch(
                    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=${poolSize}&order=${fallbackOrder}&offset=${fallbackOffset}&include=musicinfo&audioformat=mp32`,
                    { cache: 'no-store' }
                );
                const fallbackData = await fallbackResponse.json();
                allTracks = fallbackData.results || [];
            }

            // Shuffle tracks (Fisher-Yates algorithm)
            for (let i = allTracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allTracks[i], allTracks[j]] = [allTracks[j], allTracks[i]];
            }

            // Select only the needed amount
            const tracks = allTracks.slice(0, count);

            // Save tracks to database (without duplicates)
            console.log(`   💾 Salvando ${tracks.length} músicas na biblioteca...`);
            const trackIds = [];

            for (const item of tracks) {
                // Check if track already exists by jamendo_id
                const { data: existingTrack } = await supabase
                    .from('tracks')
                    .select('id')
                    .eq('jamendo_id', String(item.id))
                    .single();

                if (existingTrack) {
                    console.log(`   ♻️  Música já existe: ${item.name} (ID: ${existingTrack.id})`);
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
                        console.log(`   ✅ Nova música salva: ${item.name} (ID: ${newTrack.id})`);
                        trackIds.push(newTrack.id);
                    }
                }
            }

            // Save playlist to database with track IDs
            console.log(`   💾 Salvando playlist no banco com ${trackIds.length} músicas...`);
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
                console.log(`   ✅ Playlist salva com sucesso! ID: ${savedData?.[0]?.id}`);
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
