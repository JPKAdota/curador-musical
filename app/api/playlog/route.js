import { NextResponse } from 'next/server';
import supabase from '../../../lib/db.js';

export async function POST(request) {
  try {
    const logData = await request.json();
    
    const { company, track_id, started_at } = logData;
    
    if (!company || !track_id || !started_at) {
      return NextResponse.json(
        { error: 'Missing required fields: company, track_id, started_at' }, 
        { status: 400 }
      );
    }

    // Salvar log no Supabase
    const { error } = await supabase.from('play_logs').insert({
      company_name: company,
      track_id: parseInt(track_id),
      started_at,
      ended_at: logData.ended_at || null
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Log recorded successfully' 
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Invalid JSON data' }, 
      { status: 400 }
    );
  }
}