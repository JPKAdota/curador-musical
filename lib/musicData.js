// Base de dados de músicas livres de direitos
export const freeMusicDatabase = [
  {
    id: "1",
    title: "Acoustic Breeze",
    artist: "Benjamin Tissot",
    genre: "Acoustic",
    url: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    duration: 157,
    license: "Creative Commons",
    tags: ["relaxing", "morning", "cafe"]
  },
  {
    id: "2", 
    title: "Happy Rock",
    artist: "Benjamin Tissot",
    genre: "Rock",
    url: "https://www.bensound.com/bensound-music/bensound-happyrock.mp3",
    duration: 108,
    license: "Creative Commons",
    tags: ["energetic", "afternoon", "retail"]
  },
  {
    id: "3",
    title: "Jazz Comedy",
    artist: "Benjamin Tissot", 
    genre: "Jazz",
    url: "https://www.bensound.com/bensound-music/bensound-jazzcomedy.mp3",
    duration: 120,
    license: "Creative Commons",
    tags: ["upbeat", "afternoon", "restaurant"]
  },
  {
    id: "4",
    title: "Relaxing",
    artist: "Benjamin Tissot",
    genre: "Ambient",
    url: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3", 
    duration: 180,
    license: "Creative Commons",
    tags: ["calm", "evening", "spa"]
  },
  {
    id: "5",
    title: "Sunny",
    artist: "Benjamin Tissot",
    genre: "Pop",
    url: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
    duration: 142,
    license: "Creative Commons", 
    tags: ["happy", "morning", "retail"]
  },
  {
    id: "6",
    title: "Creative Minds",
    artist: "Benjamin Tissot",
    genre: "Corporate",
    url: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
    duration: 147,
    license: "Creative Commons",
    tags: ["professional", "afternoon", "office"]
  },
  {
    id: "7",
    title: "Tenderness",
    artist: "Benjamin Tissot", 
    genre: "Piano",
    url: "https://www.bensound.com/bensound-music/bensound-tenderness.mp3",
    duration: 135,
    license: "Creative Commons",
    tags: ["romantic", "evening", "restaurant"]
  },
  {
    id: "8",
    title: "Ukulele",
    artist: "Benjamin Tissot",
    genre: "Folk",
    url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
    duration: 146,
    license: "Creative Commons",
    tags: ["cheerful", "morning", "cafe"]
  },
  {
    id: "9",
    title: "Energy",
    artist: "Benjamin Tissot",
    genre: "Electronic",
    url: "https://www.bensound.com/bensound-music/bensound-energy.mp3",
    duration: 178,
    license: "Creative Commons", 
    tags: ["dynamic", "afternoon", "gym"]
  },
  {
    id: "10",
    title: "Piano Moment",
    artist: "Benjamin Tissot",
    genre: "Classical",
    url: "https://www.bensound.com/bensound-music/bensound-pianomoment.mp3",
    duration: 134,
    license: "Creative Commons",
    tags: ["elegant", "evening", "hotel"]
  }
];

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