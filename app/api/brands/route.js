import { NextResponse } from 'next/server';
import supabase from '../../../lib/db.js';

// POST - Create new brand
export async function POST(request) {
    try {
        const { name, track_count } = await request.json();

        if (!name || !track_count) {
            return NextResponse.json({ error: 'Name and track_count required' }, { status: 400 });
        }

        // Check if brand already exists
        const { data: existing } = await supabase
            .from('companies')
            .select('id')
            .eq('name', name)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Brand already exists' }, { status: 409 });
        }

        // Create brand
        const { data, error } = await supabase
            .from('companies')
            .insert({
                name,
                track_count,
                status: 'draft',
                time_distribution: { morning: 33, afternoon: 34, evening: 33 }
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ brand: data });
    } catch (error) {
        console.error('Error creating brand:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET - List all brands or get single brand by ID
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        // If ID provided, return single brand
        if (id) {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (!data) {
                return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
            }

            return NextResponse.json({ brand: data });
        }

        // Otherwise, return all brands
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ brands: data });
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Remove brand
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Brand ID required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting brand:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
