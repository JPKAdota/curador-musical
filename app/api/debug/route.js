import { NextResponse } from 'next/server';
import supabase from '../../../lib/db.js';

export async function GET() {
    try {
        const { data: brand } = await supabase
            .from('companies')
            .select('id, name')
            .limit(1)
            .single();

        return NextResponse.json({ brand });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
