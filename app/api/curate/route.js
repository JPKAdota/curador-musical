import { NextResponse } from 'next/server';
import pool from '../../../lib/db.js';
import { analyzeCompany } from '../../../lib/musicData.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');
  
  if (!company) {
    return NextResponse.json({ error: 'Company name required' }, { status: 400 });
  }

  try {
    const analysis = analyzeCompany(company);
    
    // Salvar empresa no banco
    await pool.query(
      'INSERT INTO companies (name, business_type, vibe, genres) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      [company, analysis.businessType, analysis.vibe, JSON.stringify(analysis.genres)]
    );
    
    // Buscar músicas do banco baseado nos gêneros
    const { rows: tracks } = await pool.query(
      'SELECT * FROM tracks WHERE genre = ANY($1) OR $2 = true',
      [analysis.genres, analysis.genres.length === 0]
    );
    
    // Se não houver músicas suficientes, buscar todas
    const availableMusic = tracks.length >= 5 ? tracks : 
      (await pool.query('SELECT * FROM tracks')).rows;
    
    // Filtrar por horário
    const morningTracks = availableMusic.filter(track => 
      track.tags.includes('morning')
    );
    const afternoonTracks = availableMusic.filter(track => 
      track.tags.includes('afternoon')
    );
    const eveningTracks = availableMusic.filter(track => 
      track.tags.includes('evening')
    );
    
    // Expandir playlist
    const expandPlaylist = (tracks, targetCount) => {
      const expanded = [];
      while (expanded.length < targetCount && tracks.length > 0) {
        expanded.push(...tracks);
      }
      return expanded.slice(0, targetCount).map((track, index) => ({
        ...track,
        id: `${track.id}_${index}`
      }));
    };

    const playlist = {
      morning: expandPlaylist(morningTracks.length > 0 ? morningTracks : availableMusic, 130),
      afternoon: expandPlaylist(afternoonTracks.length > 0 ? afternoonTracks : availableMusic, 140),
      evening: expandPlaylist(eveningTracks.length > 0 ? eveningTracks : availableMusic, 130)
    };

    const response = {
      metadata: {
        company: company,
        generated_at: new Date().toISOString(),
        total_tracks: 400,
        version: "1.0"
      },
      profile: {
        business_type: analysis.businessType,
        vibe: analysis.vibe,
        primary_genres: analysis.genres,
        target_audience: "25-50, professionals",
        atmosphere: "welcoming and engaging"
      },
      playlist: playlist,
      update_instructions: {
        update_percentage: "15-25%",
        frequency: "on_demand",
        maintain_vibe: true
      }
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}