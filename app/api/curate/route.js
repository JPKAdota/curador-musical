import { NextResponse } from 'next/server';
import supabase from '../../../lib/db.js';

// Professional AI Analysis Function (Mock - will be replaced with real AI)
function professionalAIAnalysis(brandData) {
  const { name } = brandData;

  // Infer brand characteristics from name
  const nameLower = name.toLowerCase();

  // Detect segment
  let segment = 'Varejo';
  let positioning = 'médio';
  let communication_style = 'informal';

  if (nameLower.includes('cafe') || nameLower.includes('coffee') || nameLower.includes('starbucks')) {
    segment = 'Cafeteria';
    positioning = 'premium';
    communication_style = 'sofisticado';
  } else if (nameLower.includes('fit') || nameLower.includes('gym') || nameLower.includes('academia')) {
    segment = 'Academia';
    positioning = 'médio';
    communication_style = 'jovem';
  } else if (nameLower.includes('store') || nameLower.includes('shop') || nameLower.includes('zara') || nameLower.includes('moda')) {
    segment = 'Varejo de Moda';
    positioning = 'premium';
    communication_style = 'sofisticado';
  } else if (nameLower.includes('rest') || nameLower.includes('bistro') || nameLower.includes('grill')) {
    segment = 'Gastronomia';
    positioning = 'premium';
    communication_style = 'formal';
  }

  // Mock analysis (will be replaced with real Gemini API call)
  const analysis = {
    brand_profile: `${name} é uma marca ${positioning} no segmento de ${segment}. A identidade da marca transmite ${getEmotionalTone(positioning, communication_style).toLowerCase()}, criando uma experiência única para seus clientes.`,

    target_audience_profile: getTargetAudience(segment, positioning),

    emotional_tone: getEmotionalTone(positioning, communication_style),

    ideal_music_style: getMusicStyle(segment, positioning),

    time_variations: {
      weekday_morning: {
        description: "Segunda a sexta, manhã (6h-12h)",
        bpm: getBPMRange(segment, 'morning'),
        energy: "Média-Alta",
        genres: getGenres(segment, 'morning', positioning)
      },
      weekday_afternoon: {
        description: "Segunda a sexta, tarde (12h-18h)",
        bpm: getBPMRange(segment, 'afternoon'),
        energy: "Alta",
        genres: getGenres(segment, 'afternoon', positioning)
      },
      weekday_evening: {
        description: "Segunda a sexta, noite (18h-22h)",
        bpm: getBPMRange(segment, 'evening'),
        energy: "Média",
        genres: getGenres(segment, 'evening', positioning)
      },
      weekend: {
        description: "Fim de semana",
        bpm: { min: 95, max: 125 },
        energy: "Variada",
        genres: getGenres(segment, 'weekend', positioning)
      }
    },

    recommended_genres: getGenres(segment, 'all', positioning),

    avoid: getAvoidList(segment, positioning),

    voice_type: getVoiceType(positioning, communication_style),

    thematic_playlists: [
      {
        name: `${name} - Energia Matinal`,
        description: "Playlist para começar o dia com energia positiva",
        tags: getGenres(segment, 'morning', positioning).slice(0, 4)
      },
      {
        name: `${name} - Foco e Produtividade`,
        description: "Músicas para manter o ambiente produtivo",
        tags: getGenres(segment, 'afternoon', positioning).slice(0, 4)
      },
      {
        name: `${name} - Relaxamento`,
        description: "Playlist para momentos de descontração",
        tags: getGenres(segment, 'evening', positioning).slice(0, 4)
      }
    ],

    // For compatibility with existing system
    business_type: segment,
    vibe: getEmotionalTone(positioning, communication_style),
    suggested_tags: getGenres(segment, 'all', positioning).slice(0, 6),
    bpm_breakdown: {
      morning: {
        min: getBPMRange(segment, 'morning').min,
        max: getBPMRange(segment, 'morning').max,
        genres: getGenres(segment, 'morning', positioning)
      },
      afternoon: {
        min: getBPMRange(segment, 'afternoon').min,
        max: getBPMRange(segment, 'afternoon').max,
        genres: getGenres(segment, 'afternoon', positioning)
      },
      evening: {
        min: getBPMRange(segment, 'evening').min,
        max: getBPMRange(segment, 'evening').max,
        genres: getGenres(segment, 'evening', positioning)
      }
    }
  };

  return analysis;
}

// Helper functions for mock analysis
function getTargetAudience(segment, positioning) {
  const audiences = {
    'Cafeteria-premium': 'Jovens profissionais 25-40 anos, freelancers e amantes de café especial',
    'Cafeteria-médio': 'Público geral 20-50 anos, estudantes e trabalhadores',
    'Academia-premium': 'Atletas e entusiastas fitness 25-45 anos, classe A/B',
    'Academia-médio': 'Pessoas ativas 18-45 anos buscando saúde e bem-estar',
    'Varejo de Moda-premium': 'Fashionistas 25-45 anos, classe A/B, alto poder aquisitivo',
    'Varejo de Moda-médio': 'Público moderno 20-40 anos, classe B/C',
    'Gastronomia-premium': 'Casais e famílias 30-60 anos, apreciadores de gastronomia',
    'Gastronomia-médio': 'Público geral 25-55 anos buscando experiências gastronômicas'
  };
  const key = `${segment}-${positioning}`;
  return audiences[key] || 'Público geral diversificado';
}

function getEmotionalTone(positioning, style) {
  const tones = {
    'premium-formal': 'Sofisticado & Exclusivo',
    'premium-sofisticado': 'Elegante & Refinado',
    'médio-informal': 'Acolhedor & Descontraído',
    'médio-jovem': 'Moderno & Dinâmico',
    'popular-informal': 'Alegre & Acessível',
    'popular-jovem': 'Vibrante & Energético'
  };
  return tones[`${positioning}-${style}`] || 'Equilibrado & Profissional';
}

function getMusicStyle(segment, positioning) {
  const styles = {
    'cafeteria-premium': 'Jazz suave, Bossa Nova, Acoustic Indie',
    'cafeteria-médio': 'Indie Pop, Acoustic, Lofi',
    'academia-premium': 'Electronic Dance, Deep House, Motivational',
    'academia-médio': 'Pop Rock, Electronic, Workout',
    'varejo-premium': 'Lounge, Nu Jazz, Chill House',
    'varejo-médio': 'Pop, Indie, Modern Hits'
  };
  const key = `${segment.toLowerCase()}-${positioning}`;
  return styles[key] || 'Eclectic Mix adaptado ao público';
}

function getBPMRange(segment, period) {
  const ranges = {
    'cafeteria': { morning: { min: 80, max: 110 }, afternoon: { min: 90, max: 120 }, evening: { min: 70, max: 100 } },
    'academia': { morning: { min: 120, max: 140 }, afternoon: { min: 130, max: 150 }, evening: { min: 110, max: 130 } },
    'varejo': { morning: { min: 100, max: 120 }, afternoon: { min: 110, max: 130 }, evening: { min: 95, max: 115 } },
    'restaurante': { morning: { min: 90, max: 110 }, afternoon: { min: 85, max: 105 }, evening: { min: 70, max: 95 } }
  };

  const segmentKey = Object.keys(ranges).find(key => segment.toLowerCase().includes(key)) || 'varejo';
  return ranges[segmentKey][period] || { min: 90, max: 120 };
}

function getGenres(segment, period, positioning) {
  const genreMap = {
    'cafeteria': {
      morning: ['Acoustic', 'Jazz', 'Bossa Nova', 'Indie Folk'],
      afternoon: ['Indie Pop', 'Folk', 'Chill', 'Lofi'],
      evening: ['Jazz', 'Ambient', 'Piano', 'Smooth'],
      weekend: ['Bossa Nova', 'Acoustic', 'Indie', 'Chill'],
      all: ['Acoustic', 'Jazz', 'Bossa Nova', 'Indie', 'Lofi', 'Chill']
    },
    'academia': {
      morning: ['Electronic', 'Rock', 'Energy', 'Workout'],
      afternoon: ['EDM', 'Hard Rock', 'Motivation', 'Upbeat'],
      evening: ['Pop Rock', 'Electronic', 'Chill House', 'Downtempo'],
      weekend: ['EDM', 'Electronic', 'Dance', 'Energy'],
      all: ['Electronic', 'Rock', 'EDM', 'Workout', 'Energy', 'Motivation']
    },
    'varejo': {
      morning: ['Pop', 'Indie Pop', 'Modern', 'Upbeat'],
      afternoon: ['Deep House', 'Nu Disco', 'Fashion', 'Modern'],
      evening: ['Lounge', 'Chill House', 'Downtempo', 'Ambient'],
      weekend: ['Pop', 'Dance', 'Modern Hits', 'Upbeat'],
      all: ['Pop', 'Indie', 'Deep House', 'Lounge', 'Modern', 'Chill']
    }
  };

  const segmentKey = Object.keys(genreMap).find(key => segment.toLowerCase().includes(key)) || 'varejo';
  return genreMap[segmentKey][period] || genreMap['varejo']['all'];
}

function getAvoidList(segment, positioning) {
  return {
    musical_styles: ['Heavy Metal', 'Música muito lenta ou melancólica', 'Letras explícitas ou controversas'],
    behaviors: ['Volume muito alto', 'Mudanças bruscas de ritmo', 'Silêncios prolongados']
  };
}

function getVoiceType(positioning, style) {
  const voices = {
    'premium': 'Voz feminina ou masculina, tom médio-grave, dicção clara, ritmo pausado e sofisticado',
    'médio': 'Voz neutra e amigável, tom médio, ritmo natural e acolhedor',
    'popular': 'Voz jovem e energética, tom médio-agudo, ritmo dinâmico e descontraído'
  };
  return voices[positioning] || voices['médio'];
}

// API Route
export async function POST(request) {
  try {
    const brandData = await request.json();
    const { brandId } = brandData;

    if (!brandData.name) {
      return NextResponse.json({ error: 'Brand data required' }, { status: 400 });
    }

    // Generate professional analysis
    const analysis = professionalAIAnalysis(brandData);

    // Save analysis to database
    if (brandId) {
      await supabase
        .from('companies')
        .update({
          business_type: analysis.business_type,
          vibe: analysis.vibe,
          genres: analysis.suggested_tags,
          bpm_ranges: analysis.bpm_breakdown,
          status: 'analyzing',
          metadata: {
            ...brandData,
            full_analysis: analysis
          }
        })
        .eq('id', brandId);
    }

    return NextResponse.json({
      company: brandData.name,
      analysis: {
        // Full professional analysis
        brand_profile: analysis.brand_profile,
        target_audience: analysis.target_audience_profile,
        emotional_tone: analysis.emotional_tone,
        ideal_music_style: analysis.ideal_music_style,
        time_variations: analysis.time_variations,
        recommended_genres: analysis.recommended_genres,
        avoid: analysis.avoid,
        voice_type: analysis.voice_type,
        thematic_playlists: analysis.thematic_playlists,

        // Compatibility fields
        specialist_summary: analysis.brand_profile,
        business_type: analysis.business_type,
        vibe: analysis.vibe,
        suggested_tags: analysis.suggested_tags,
        bpm_breakdown: analysis.bpm_breakdown,
        time_distribution: { morning: 33, afternoon: 34, evening: 33 }
      },
      status: "waiting_approval"
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Keep GET for backward compatibility
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');

  if (!company) {
    return NextResponse.json({ error: 'Company name required' }, { status: 400 });
  }

  // Simple mock for GET requests
  const mockData = { name: company, segment: 'Varejo', positioning: 'médio', communication_style: 'informal', brand_colors: 'Azul' };
  const analysis = professionalAIAnalysis(mockData);

  return NextResponse.json({
    company,
    analysis: {
      specialist_summary: analysis.brand_profile,
      target_audience: analysis.target_audience_profile,
      vibe: analysis.vibe,
      business_type: analysis.business_type,
      suggested_tags: analysis.suggested_tags,
      time_distribution: { morning: 33, afternoon: 34, evening: 33 },
      bpm_breakdown: analysis.bpm_breakdown
    },
    status: "waiting_approval"
  });
}