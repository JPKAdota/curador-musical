import { NextResponse } from 'next/server';
import supabase from '../../../lib/db.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    if (!brandId) {
        return NextResponse.json({ error: 'Brand ID required' }, { status: 400 });
    }

    try {
        const { data: playlists, error } = await supabase
            .from('playlists')
            .select('*')
            .eq('company_id', brandId)
            .order('time_period', { ascending: true });

        if (error) throw error;

        // For each playlist, fetch tracks if track_ids exist
        for (const playlist of (playlists || [])) {
            if (playlist.track_ids && playlist.track_ids.length > 0) {
                const { data: tracks } = await supabase
                    .from('tracks')
                    .select('*')
                    .in('id', playlist.track_ids);

                playlist.tracks = tracks || [];
            }
        }

        return NextResponse.json({ playlists: playlists || [] });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
