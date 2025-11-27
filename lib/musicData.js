// Base de dados de músicas agora está no Supabase
// Mantemos este arquivo apenas para a lógica de análise de empresa


// Análise de marca baseada no nome da empresa
export function analyzeCompany(companyName) {
  const name = companyName.toLowerCase();

  const keywords = {
    cafe: ["cafe", "coffee", "espresso", "bean"],
    restaurant: ["restaurant", "bistro", "kitchen", "food"],
    retail: ["store", "shop", "boutique", "fashion"],
    tech: ["tech", "digital", "software", "app"],
    wellness: ["spa", "wellness", "yoga", "fitness"],
    hotel: ["hotel", "inn", "resort", "lodge"],
    office: ["office", "corporate", "business"]
  };

  let businessType = "general";
  let vibe = "neutral";
  let genres = ["Pop", "Acoustic"];

  for (const [type, words] of Object.entries(keywords)) {
    if (words.some(word => name.includes(word))) {
      businessType = type;
      break;
    }
  }

  switch (businessType) {
    case "cafe":
      vibe = "cozy";
      genres = ["Acoustic", "Folk", "Jazz"];
      break;
    case "restaurant":
      vibe = "sophisticated";
      genres = ["Jazz", "Classical", "Ambient"];
      break;
    case "retail":
      vibe = "energetic";
      genres = ["Pop", "Electronic", "Rock"];
      break;
    case "tech":
      vibe = "modern";
      genres = ["Electronic", "Corporate", "Ambient"];
      break;
    case "wellness":
      vibe = "relaxing";
      genres = ["Ambient", "Classical", "Piano"];
      break;
    case "hotel":
      vibe = "elegant";
      genres = ["Classical", "Jazz", "Piano"];
      break;
    case "office":
      vibe = "professional";
      genres = ["Corporate", "Classical", "Ambient"];
      break;
  }

  return { businessType, vibe, genres };
}