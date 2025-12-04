import { NextResponse } from 'next/server';
import supabase from '../../../lib/db.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
// Note: We initialize it inside the handler or check for key existence to avoid build errors if key is missing
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Real AI Analysis Function using Gemini
async function generateBrandAnalysis(brandData) {
  const { name, description = '', sector = '' } = brandData;

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not defined");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Atue como um especialista em Branding, Marketing Sensorial e Curadoria Musical.
    Analise a marca abaixo e gere um perfil completo de identidade musical e sensorial.
    
    Marca: ${name}
    Setor/Descrição: ${sector} ${description}
    
    Retorne APENAS um objeto JSON válido com a seguinte estrutura exata (sem markdown, sem explicações adicionais, sem blocos de código \`\`\`json):
    {
      "brand_profile": "Descrição do perfil da marca, arquétipo e posicionamento",
      "target_audience_profile": "Descrição detalhada do público-alvo",
      "emotional_tone": "Tom emocional (ex: Sofisticado & Exclusivo)",
      "ideal_music_style": "Estilo musical ideal (ex: Jazz, Pop, Lofi)",
      "business_type": "Tipo de negócio inferido (ex: Cafeteria, Academia)",
      "vibe": "Vibe geral (ex: Energética, Relaxante)",
      "time_variations": {
        "weekday_morning": { "description": "...", "bpm": { "min": 0, "max": 0 }, "energy": "...", "genres": ["..."] },
        "weekday_afternoon": { "description": "...", "bpm": { "min": 0, "max": 0 }, "energy": "...", "genres": ["..."] },
        "weekday_evening": { "description": "...", "bpm": { "min": 0, "max": 0 }, "energy": "...", "genres": ["..."] },
        "weekend": { "description": "...", "bpm": { "min": 0, "max": 0 }, "energy": "...", "genres": ["..."] }
      },
      "recommended_genres": ["gênero1", "gênero2", "gênero3", "gênero4", "gênero5", "gênero6"],
      "avoid": {
        "musical_styles": ["estilo a evitar 1", "estilo a evitar 2"],
        "behaviors": ["comportamento a evitar 1"]
      },
      "voice_type": "Descrição da voz ideal para locução",
      "thematic_playlists": [
        { "name": "Nome da Playlist 1", "description": "Descrição", "tags": ["tag1", "tag2"] },
        { "name": "Nome da Playlist 2", "description": "Descrição", "tags": ["tag1", "tag2"] },
        { "name": "Nome da Playlist 3", "description": "Descrição", "tags": ["tag1", "tag2"] }
      ],
      "suggested_tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
      "bpm_breakdown": {
        "morning": { "min": 0, "max": 0, "genres": ["..."] },
        "afternoon": { "min": 0, "max": 0, "genres": ["..."] },
        "evening": { "min": 0, "max": 0, "genres": ["..."] }
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback to a basic generic structure if AI fails
    return {
      brand_profile: `Análise automática indisponível para ${name}. (Erro na IA)`,
      target_audience_profile: "Público geral",
      emotional_tone: "Neutro",
      ideal_music_style: "Pop Variado",
      business_type: "Varejo",
      vibe: "Agradável",
      time_variations: {
        weekday_morning: { description: "Manhã", bpm: { min: 80, max: 100 }, energy: "Média", genres: ["Pop"] },
        weekday_afternoon: { description: "Tarde", bpm: { min: 90, max: 110 }, energy: "Alta", genres: ["Pop"] },
        weekday_evening: { description: "Noite", bpm: { min: 70, max: 90 }, energy: "Baixa", genres: ["Pop"] },
        weekend: { description: "Fim de semana", bpm: { min: 90, max: 120 }, energy: "Alta", genres: ["Pop"] }
      },
      recommended_genres: ["Pop", "Lounge"],
      avoid: { musical_styles: ["Heavy Metal"], behaviors: ["Volume excessivo"] },
      voice_type: "Neutra",
      thematic_playlists: [],
      suggested_tags: ["Pop", "Hits"],
      bpm_breakdown: {
        morning: { min: 80, max: 100, genres: ["Pop"] },
        afternoon: { min: 90, max: 110, genres: ["Pop"] },
        evening: { min: 70, max: 90, genres: ["Pop"] }
      }
    };
  }
}

// API Route
export async function POST(request) {
  try {
    const brandData = await request.json();
    const { brandId } = brandData;

    if (!brandData.name) {
      return NextResponse.json({ error: 'Brand data required' }, { status: 400 });
    }

    // Generate professional analysis using Gemini
    const analysis = await generateBrandAnalysis(brandData);

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

// Keep GET for backward compatibility (Simple Mock)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');

  if (!company) {
    return NextResponse.json({ error: 'Company name required' }, { status: 400 });
  }

  // Simple static mock for GET requests to avoid API costs on simple fetches
  return NextResponse.json({
    company,
    analysis: {
      specialist_summary: `Análise demonstrativa para ${company}`,
      target_audience_profile: "Público Geral",
      vibe: "Acolhedora",
      business_type: "Varejo",
      suggested_tags: ["Pop", "Lounge", "Acoustic"],
      time_distribution: { morning: 33, afternoon: 34, evening: 33 },
      bpm_breakdown: {
        morning: { min: 80, max: 100, genres: ["Acoustic"] },
        afternoon: { min: 100, max: 120, genres: ["Pop"] },
        evening: { min: 70, max: 90, genres: ["Lounge"] }
      }
    },
    status: "waiting_approval"
  });
}