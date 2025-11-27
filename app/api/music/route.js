import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags');

    if (!tags) {
        return NextResponse.json({ error: 'Tags required' }, { status: 400 });
    }

    const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

    try {
        // Separar tags e pegar a primeira (mais relevante)
        const tagArray = tags.split(',').map(t => t.trim());
        const primaryTag = tagArray[0];

        // Buscar músicas na Jamendo API
        // Docs: https://developer.jamendo.com/v3.0/tracks/tracks
        let response = await fetch(
            `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&tags=${encodeURIComponent(primaryTag)}&include=musicinfo&audioformat=mp32`
        );

        if (!response.ok) {
            throw new Error(`Jamendo API error: ${response.statusText}`);
        }

        let data = await response.json();

        // Se não encontrou músicas com a tag específica, buscar por popularidade
        if (!data.results || data.results.length === 0) {
            console.log(`No tracks found for tag "${primaryTag}", fetching popular tracks instead`);
            response = await fetch(
                `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&order=popularity_total&include=musicinfo&audioformat=mp32`
            );
            data = await response.json();
        }

        // Formatar para o nosso player
        const tracks = data.results.map(item => ({
            id: item.id,
            title: item.name,
            artist: item.artist_name,
            genre: item.musicinfo?.tags?.genres ? item.musicinfo.tags.genres[0] : 'Music',
            url: item.audio, // URL do MP3
            duration: item.duration,
            license: item.license_ccurl || 'Creative Commons',
            image: item.image, // Capa do álbum
            tags: item.musicinfo?.tags?.vartags || []
        }));

        console.log(`Returning ${tracks.length} tracks`);
        return NextResponse.json({ tracks });

    } catch (error) {
        console.error('Error fetching music:', error);
        return NextResponse.json({ error: `Failed to fetch music: ${error.message}` }, { status: 500 });
    }
}
