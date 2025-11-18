'use client';
import { useState } from 'react';
import Player from '../components/Player';

export default function Home() {
  const [company, setCompany] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company.trim()) {
      setShowPlayer(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎵 Curador Musical Inteligente
          </h1>
          <p className="text-gray-600">
            Player Web Corporativo - MVP Gratuito
          </p>
        </header>

        {!showPlayer ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Digite o nome da sua empresa
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Café Central, TechCorp, Spa Wellness..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                🎵 Gerar Curadoria Musical
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <p>✅ 100% gratuito</p>
              <p>✅ Músicas livres de direitos</p>
              <p>✅ Curadoria inteligente por IA</p>
              <p>✅ Player web responsivo</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={() => setShowPlayer(false)}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                ← Voltar para nova empresa
              </button>
            </div>
            
            <Player company={company} />
            
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">📊 Sobre a Curadoria</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Total de músicas:</strong> 400 faixas</p>
                  <p><strong>Licença:</strong> Creative Commons</p>
                  <p><strong>Divisão por horário:</strong> Manhã, Tarde, Noite</p>
                </div>
                <div>
                  <p><strong>Atualização:</strong> 15-25% sob demanda</p>
                  <p><strong>Formato:</strong> MP3 streaming</p>
                  <p><strong>Logs:</strong> Reprodução registrada</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>Curador Musical Inteligente - MVP 2024</p>
          <p>Hospedado gratuitamente na Vercel</p>
        </footer>
      </div>
    </div>
  );
}