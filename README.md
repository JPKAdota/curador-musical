# 🎵 Curador Musical Inteligente + Player Web (MVP)

Sistema completo de curadoria musical inteligente com player web corporativo.

## 🚀 Funcionalidades

- **Análise Inteligente**: Analisa empresa apenas pelo nome
- **Curadoria Automática**: Gera playlist de 400 músicas
- **Player Web**: Interface responsiva com controles completos
- **Músicas Livres**: 100% Creative Commons
- **Logs de Reprodução**: Registra estatísticas de uso
- **Atualização Dinâmica**: Renova 15-25% da playlist

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 + React
- **Styling**: Tailwind CSS
- **API**: Serverless Functions
- **Audio**: HTML5 Audio API
- **Deploy**: Vercel (gratuito)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🌐 Deploy na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push

```bash
# Ou via CLI
npx vercel --prod
```

## 📋 Estrutura da API

### GET /api/curate?company=NomeEmpresa
Retorna curadoria completa em JSON:
```json
{
  "metadata": {
    "company": "Café Central",
    "total_tracks": 400
  },
  "profile": {
    "business_type": "cafe",
    "vibe": "cozy",
    "primary_genres": ["Acoustic", "Folk", "Jazz"]
  },
  "playlist": {
    "morning": [...],
    "afternoon": [...], 
    "evening": [...]
  }
}
```

### POST /api/playlog
Registra logs de reprodução:
```json
{
  "company": "Café Central",
  "track_id": "1",
  "started_at": "2024-01-01T10:00:00Z",
  "ended_at": "2024-01-01T10:03:30Z"
}
```

## 🎵 Músicas de Exemplo

10 faixas Creative Commons da Bensound:
- Acoustic Breeze
- Happy Rock  
- Jazz Comedy
- Relaxing
- Sunny
- Creative Minds
- Tenderness
- Ukulele
- Energy
- Piano Moment

## 🔄 Como Funciona

1. **Input**: Nome da empresa
2. **Análise**: IA identifica tipo de negócio e vibe
3. **Curadoria**: Seleciona músicas por gênero e horário
4. **Player**: Interface web com controles completos
5. **Logs**: Registra estatísticas de reprodução

## 📱 Interface Responsiva

- **Desktop**: Player completo com próximas músicas
- **Mobile**: Interface otimizada para toque
- **Controles**: Play/Pause, Skip, Progress Bar
- **Info**: Música atual, artista, gênero

## 🎯 Casos de Uso

- **Cafés**: Música ambiente relaxante
- **Restaurantes**: Jazz e clássicos elegantes  
- **Lojas**: Pop e eletrônico energético
- **Escritórios**: Música corporativa focada
- **SPAs**: Ambient e piano relaxante
- **Hotéis**: Clássicos elegantes

## 📊 Métricas

- Total de reproduções por empresa
- Músicas mais tocadas
- Horários de maior uso
- Tempo médio de sessão

## 🔧 Customização

Para adicionar mais músicas:
1. Edite `lib/musicData.js`
2. Adicione URLs de músicas Creative Commons
3. Configure tags apropriadas (morning/afternoon/evening)
4. Deploy automático na Vercel

## 📄 Licença

MIT License - Uso comercial permitido
Músicas: Creative Commons (Bensound)