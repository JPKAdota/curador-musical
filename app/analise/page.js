'use client';

export default function AnalisePage() {
    return (
        <div className="container mx-auto max-w-6xl p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">📊 Análise de Reprodução</h1>
                <p className="text-gray-400">Dashboard de análise e estatísticas (Em desenvolvimento)</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 text-center border border-gray-700">
                <div className="text-8xl mb-6">🚧</div>
                <h2 className="text-3xl font-bold mb-4">Funcionalidade em Desenvolvimento</h2>
                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    Em breve você poderá visualizar análises detalhadas de quantas vezes cada música foi tocada durante o dia,
                    estatísticas por horário, músicas mais populares e muito mais!
                </p>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-700/50">
                        <div className="text-4xl mb-3">📈</div>
                        <h3 className="font-bold text-lg mb-2">Estatísticas em Tempo Real</h3>
                        <p className="text-sm text-gray-400">
                            Acompanhe o desempenho das músicas em tempo real
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/30 to-green-900/30 p-6 rounded-xl border border-blue-700/50">
                        <div className="text-4xl mb-3">⏰</div>
                        <h3 className="font-bold text-lg mb-2">Análise por Horário</h3>
                        <p className="text-sm text-gray-400">
                            Veja quais músicas tocam mais em cada período do dia
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-900/30 to-purple-900/30 p-6 rounded-xl border border-green-700/50">
                        <div className="text-4xl mb-3">🏆</div>
                        <h3 className="font-bold text-lg mb-2">Top Músicas</h3>
                        <p className="text-sm text-gray-400">
                            Rankings das músicas mais tocadas por marca
                        </p>
                    </div>
                </div>

                <div className="mt-12 p-6 bg-yellow-900/20 border border-yellow-700/50 rounded-xl max-w-2xl mx-auto">
                    <h3 className="font-bold text-yellow-400 mb-2">💡 Recursos Planejados</h3>
                    <ul className="text-left text-sm text-gray-300 space-y-2">
                        <li>✓ Gráficos de reprodução por horário</li>
                        <li>✓ Heatmap de atividade musical</li>
                        <li>✓ Relatórios exportáveis em PDF</li>
                        <li>✓ Comparação entre marcas</li>
                        <li>✓ Insights de IA sobre preferências do público</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
