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

            const tags = periodData.genres.join(' ');
            console.log('   Tags:', tags);

            // Fetch from Jamendo
            const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=${count}&tags=${encodeURIComponent(tags)}&include=musicinfo&audioformat=mp32`;
            console.log('   🔗 URL Jamendo:', url);

            const response = await fetch(url);
            const data = await response.json();

            // Fallback to popular if no results
            let tracks = data.results || [];
            if (tracks.length === 0) {
                console.log('   ⚠️  Nenhuma música encontrada, buscando populares...');
                const fallbackResponse = await fetch(
                    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=${count}&order=popularity_total&include=musicinfo&audioformat=mp32`
                );
                const fallbackData = await fallbackResponse.json();
                tracks = fallbackData.results || [];
            }

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
