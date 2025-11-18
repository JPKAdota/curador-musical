import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const logData = await request.json();
    
    // Validar dados obrigatórios
    const { company, track_id, started_at } = logData;
    
    if (!company || !track_id || !started_at) {
      return NextResponse.json(
        { error: 'Missing required fields: company, track_id, started_at' }, 
        { status: 400 }
      );
    }

    // Em produção, aqui salvaria no banco de dados
    // Por enquanto, apenas log no console
    console.log('Play Log:', {
      company,
      track_id,
      started_at,
      ended_at: logData.ended_at || null,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Log recorded successfully' 
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' }, 
      { status: 400 }
    );
  }
}