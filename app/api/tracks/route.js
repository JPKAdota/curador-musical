import { NextResponse } from 'next/server';
import supabase from '../../../lib/db.js';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: tracks, error } = await supabase
            .from('tracks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ tracks: tracks || [] });
    } catch (error) {
        console.error('Error fetching tracks:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
