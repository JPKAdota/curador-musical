import json
import os
from dotenv import load_dotenv
import google.generativeai as genai
from elevenlabs.client import ElevenLabs
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from datetime import datetime

# Carregar variáveis do .env
load_dotenv()

@dataclass
class IdentidadeMarca:
    nome: str
    essencia: List[str]
    personalidade_sonora: List[str]
    paleta_sonora: Dict[str, List[str]]
    valores: List[str]
    setor: str

@dataclass
class PublicoAlvo:
    faixa_etaria: str
    classe_social: str
    estilo_vida: List[str]
    regioes: List[str]
    comportamento: List[str]
    generos_preferidos: List[str]

@dataclass
class FaixaMusical:
    titulo: str
    genero: str
    clima: str
    descricao: str
    posicao_album: int

@dataclass
class AlbumConceitual:
    titulo: str
    narrativa: str
    faixas: List[FaixaMusical]
    duracao_total: int

class CuradorMusical:
    def __init__(self, api_key: str = None, elevenlabs_key: str = None):
        self.model = None
        self.elevenlabs_client = None
        
        # Configurar Gemini
        key = api_key or os.getenv('GEMINI_API_KEY')
        if key:
            genai.configure(api_key=key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Configurar ElevenLabs
        elevenlabs_api_key = elevenlabs_key or os.getenv('ELEVENLABS_API_KEY') or "4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf"
        if elevenlabs_api_key:
            self.elevenlabs_client = ElevenLabs(api_key=elevenlabs_api_key)
        
        self.generos_musicais = {
            "eletrônico": ["house", "techno", "ambient", "downtempo", "lo-fi"],
            "pop": ["pop alternativo", "indie pop", "electro-pop", "dream pop"],
            "urbano": ["hip-hop", "trap", "R&B", "neo-soul", "funk"],
            "brasileiro": ["MPB", "bossa nova", "samba", "forró", "axé"],
            "rock": ["indie rock", "alternative", "post-rock", "shoegaze"],
            "jazz": ["jazz fusion", "smooth jazz", "jazz-hop", "nu-jazz"]
        }
        
        self.perfis_marca = {
            "tecnologia": {
                "sonoridade": ["eletrônico", "pop", "ambient"],
                "energia": "média-alta",
                "modernidade": "alta"
            },
            "lifestyle": {
                "sonoridade": ["indie", "pop", "brasileiro"],
                "energia": "média",
                "modernidade": "média-alta"
            },
            "corporativo": {
                "sonoridade": ["jazz", "eletrônico suave", "instrumental"],
                "energia": "baixa-média",
                "modernidade": "média"
            }
        }

    def analisar_marca(self, nome_marca: str, setor: str) -> IdentidadeMarca:
        """Analisa a marca automaticamente usando IA"""
        
        if self.model:
            try:
                prompt = f"""
                Você é um curador musical especialista em identidade sonora de marcas. Analise marcas e crie perfis musicais únicos e criativos.
                
                Analise a marca "{nome_marca}" do setor "{setor}" e crie um perfil musical completo.
                
                Retorne um JSON com:
                {{
                    "essencia": ["palavra1", "palavra2", "palavra3", "palavra4"],
                    "personalidade_sonora": ["característica1", "característica2", "característica3"],
                    "valores": ["valor1", "valor2", "valor3", "valor4"],
                    "paleta_sonora": {{
                        "eletrônicos": ["instrumento1", "instrumento2"],
                        "orgânicos": ["instrumento1", "instrumento2"],
                        "rítmicos": ["elemento1", "elemento2"],
                        "vocais": ["estilo1", "estilo2"]
                    }}
                }}
                
                Seja criativo e específico para esta marca. Não use templates genéricos.
                """
                
                response = self.model.generate_content(prompt)
                return self._processar_resposta_json(nome_marca, setor, response.text)
                
            except Exception as e:
                print(f"Erro na API Gemini: {e}")
                return self._analisar_marca_offline(nome_marca, setor)
        else:
            return self._analisar_marca_offline(nome_marca, setor)

    def mapear_publico(self, marca: IdentidadeMarca) -> PublicoAlvo:
        """Mapeia o público-alvo usando IA"""
        
        if self.model:
            try:
                prompt = f"""
                Você é um especialista em análise de público e comportamento do consumidor.
                
                Baseado na marca "{marca.nome}" com essência {marca.essencia} e valores {marca.valores}, 
                defina o público-alvo ideal.
                
                Retorne um JSON:
                {{
                    "faixa_etaria": "idade específica",
                    "classe_social": "classe detalhada",
                    "estilo_vida": ["estilo1", "estilo2", "estilo3"],
                    "regioes": ["região1", "região2"],
                    "comportamento": ["comportamento1", "comportamento2", "comportamento3"],
                    "generos_preferidos": ["gênero1", "gênero2", "gênero3"]
                }}
                
                Seja específico e realista para esta marca.
                """
                
                response = self.model.generate_content(prompt)
                return self._processar_publico_json(response.text)
                
            except Exception as e:
                print(f"Erro na API: {e}")
                return self._mapear_publico_offline(marca)
        else:
            return self._mapear_publico_offline(marca)

    def criar_album_conceitual(self, marca: IdentidadeMarca, publico: PublicoAlvo) -> AlbumConceitual:
        """Cria um álbum conceitual baseado na marca e público"""
        
        titulo_album = f"{marca.essencia[0].title()} by {marca.nome}"
        
        # Estrutura narrativa do álbum
        narrativa = self._criar_narrativa_album(marca, publico)
        
        # Criação das faixas
        faixas = self._gerar_faixas_album(marca, publico)
        
        return AlbumConceitual(
            titulo=titulo_album,
            narrativa=narrativa,
            faixas=faixas,
            duracao_total=len(faixas) * 180  # 3 min por faixa
        )

    def gerar_prompt_criacao(self, faixa: FaixaMusical, marca: IdentidadeMarca, publico: PublicoAlvo) -> str:
        """Gera prompt usando IA para máxima personalização"""
        
        if self.model:
            try:
                prompt = f"""
                Você é um especialista em prompts para IAs musicais. Crie prompts detalhados e específicos.
                
                Crie um prompt completo para gerar a música "{faixa.titulo}" da marca {marca.nome}.
                
                Contexto:
                - Gênero: {faixa.genero}
                - Clima: {faixa.clima}
                - Marca: {marca.nome} ({', '.join(marca.essencia)})
                - Público: {publico.faixa_etaria}, {', '.join(publico.comportamento)}
                - Paleta sonora: {marca.paleta_sonora}
                
                Crie um prompt detalhado incluindo:
                1. Especificações técnicas específicas
                2. Instrumentação detalhada e criativa
                3. Direção vocal específica
                4. Mood e atmosfera únicos
                5. Referências artísticas relevantes
                6. Parâmetros para IA musical
                
                Seja específico e criativo, evite templates genéricos.
                """
                
                response = self.model.generate_content(prompt)
                return response.text
                
            except Exception as e:
                print(f"Erro na API: {e}")
                return self._gerar_prompt_offline(faixa, marca, publico)
        else:
            return self._gerar_prompt_offline(faixa, marca, publico)
    
    def melhorar_prompt(self, prompt_atual: str, feedback: str, faixa: FaixaMusical, marca: IdentidadeMarca, publico: PublicoAlvo) -> str:
        """Melhora um prompt existente baseado no feedback do usuário"""
        
        if self.model:
            try:
                prompt_melhoria = f"""
                Você é um especialista em prompts musicais. Precisa melhorar um prompt existente baseado no feedback.
                
                PROMPT ATUAL:
                {prompt_atual}
                
                FEEDBACK DO USUÁRIO:
                {feedback}
                
                CONTEXTO DA FAIXA:
                - Título: {faixa.titulo}
                - Gênero: {faixa.genero}
                - Clima: {faixa.clima}
                - Marca: {marca.nome}
                - Público: {publico.faixa_etaria}
                
                Crie uma versão melhorada do prompt que:
                1. Incorpore as sugestões do feedback
                2. Mantenha a qualidade técnica
                3. Seja mais específico onde necessário
                4. Corrija qualquer problema mencionado
                
                Retorne apenas o prompt melhorado, sem explicações adicionais.
                """
                
                response = self.model.generate_content(prompt_melhoria)
                return response.text
                
            except Exception as e:
                print(f"Erro na API: {e}")
                return prompt_atual
        else:
            return prompt_atual
    
    def gerar_musica(self, prompt: str, titulo: str, duracao: int = 180) -> Optional[str]:
        """Gera música usando a API da ElevenLabs"""
        
        if not self.elevenlabs_client:
            print("Cliente ElevenLabs não configurado")
            return None
        
        try:
            response = self.elevenlabs_client.text_to_music.convert(
                text=prompt,
                duration_seconds=duracao,
                prompt_influence=0.3
            )
            
            filename = f"{titulo.replace(' ', '_').lower()}.mp3"
            filepath = os.path.join("musicas_geradas", filename)
            
            os.makedirs("musicas_geradas", exist_ok=True)
            
            with open(filepath, "wb") as f:
                for chunk in response:
                    f.write(chunk)
            
            print(f"Música '{titulo}' gerada: {filepath}")
            return filepath
            
        except Exception as e:
            print(f"Erro ao gerar música: {e}")
            return None
    
    def gerar_album_completo(self, marca: IdentidadeMarca, publico: PublicoAlvo) -> Dict[str, Any]:
        """Gera um álbum completo com todas as músicas"""
        
        album = self.criar_album_conceitual(marca, publico)
        resultados = {
            "album": album,
            "prompts": [],
            "musicas_geradas": []
        }
        
        print(f"Gerando álbum '{album.titulo}' com {len(album.faixas)} faixas...")
        
        for i, faixa in enumerate(album.faixas, 1):
            print(f"\nProcessando faixa {i}/{len(album.faixas)}: {faixa.titulo}")
            
            prompt = self.gerar_prompt_criacao(faixa, marca, publico)
            resultados["prompts"].append({
                "faixa": faixa.titulo,
                "prompt": prompt
            })
            
            arquivo_musica = self.gerar_musica(prompt, faixa.titulo)
            if arquivo_musica:
                resultados["musicas_geradas"].append({
                    "faixa": faixa.titulo,
                    "arquivo": arquivo_musica
                })
        
        return resultados            response = self.model.generate_content(prompt_melhoria)
                return response.text
                
            except Exception as e:
                print(f"Erro na API: {e}")
                return prompt_atual  # Retorna o original se der erro
        else:
            return prompt_atual  # Retorna o original se não tiver IA

    def gerar_relatorio_completo(self, nome_marca: str, setor: str) -> Dict[str, Any]:
        """Gera relatório completo de curadoria musical"""
        
        # Análise da marca
        marca = self.analisar_marca(nome_marca, setor)
        
        # Mapeamento do público
        publico = self.mapear_publico(marca)
        
        # Criação do álbum
        album = self.criar_album_conceitual(marca, publico)
        
        # Geração de prompts para cada faixa
        prompts = []
        for faixa in album.faixas:
            prompt = self.gerar_prompt_criacao(faixa, marca, publico)
            prompts.append({
                "faixa": faixa.titulo,
                "prompt": prompt
            })
        
        # Converter dataclasses para dicionários
        album_dict = album.__dict__.copy()
        album_dict['faixas'] = [faixa.__dict__ for faixa in album.faixas]
        
        return {
            "timestamp": datetime.now().isoformat(),
            "marca": marca.__dict__,
            "publico": publico.__dict__,
            "album": album_dict,
            "prompts_criacao": prompts,
            "resumo_executivo": self._gerar_resumo_executivo(marca, publico, album)
        }

    # Métodos auxiliares
    def _processar_resposta_json(self, nome_marca: str, setor: str, resposta: str) -> IdentidadeMarca:
        """Processa resposta JSON da IA"""
        try:
            import re
            # Extrair JSON da resposta
            json_match = re.search(r'\{.*\}', resposta, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return IdentidadeMarca(
                    nome=nome_marca,
                    essencia=data.get('essencia', []),
                    personalidade_sonora=data.get('personalidade_sonora', []),
                    paleta_sonora=data.get('paleta_sonora', {}),
                    valores=data.get('valores', []),
                    setor=setor
                )
        except:
            pass
        return self._analisar_marca_offline(nome_marca, setor)
    
    def _processar_publico_json(self, resposta: str) -> PublicoAlvo:
        """Processa resposta JSON do público"""
        try:
            import re
            json_match = re.search(r'\{.*\}', resposta, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return PublicoAlvo(
                    faixa_etaria=data.get('faixa_etaria', ''),
                    classe_social=data.get('classe_social', ''),
                    estilo_vida=data.get('estilo_vida', []),
                    regioes=data.get('regioes', []),
                    comportamento=data.get('comportamento', []),
                    generos_preferidos=data.get('generos_preferidos', [])
                )
        except:
            pass
        return self._mapear_publico_offline_default()
    
    def _processar_faixas_json(self, resposta: str) -> List[FaixaMusical]:
        """Processa resposta JSON das faixas"""
        try:
            import re
            json_match = re.search(r'\{.*\}', resposta, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                faixas = []
                for i, faixa_data in enumerate(data.get('faixas', []), 1):
                    faixas.append(FaixaMusical(
                        titulo=faixa_data.get('titulo', f'Track {i}'),
                        genero=faixa_data.get('genero', 'music'),
                        clima=faixa_data.get('clima', 'neutral'),
                        descricao=faixa_data.get('descricao', f'Track {i}'),
                        posicao_album=i
                    ))
                return faixas
        except:
            pass
        return self._gerar_faixas_offline_default()
    
    def _analisar_marca_offline(self, nome_marca: str, setor: str) -> IdentidadeMarca:
        """Fallback mínimo sem API"""
        return self._gerar_fallback_ia_simples(nome_marca, setor)
    
    def _mapear_publico_offline(self, marca: IdentidadeMarca) -> PublicoAlvo:
        """Fallback offline para público"""
        return self._mapear_publico_offline_default()
    
    def _mapear_publico_offline_default(self) -> PublicoAlvo:
        """Fallback mínimo para público"""
        return PublicoAlvo(
            faixa_etaria="adultos",
            classe_social="geral",
            estilo_vida=["moderno"],
            regioes=["urbano"],
            comportamento=["consumidor"],
            generos_preferidos=["music"]
        )
    
    def _gerar_faixas_offline(self, marca: IdentidadeMarca, publico: PublicoAlvo) -> List[FaixaMusical]:
        """Fallback offline para faixas"""
        return self._gerar_faixas_offline_default()
    
    def _gerar_faixas_offline_default(self) -> List[FaixaMusical]:
        """Fallback mínimo para faixas"""
        return [
            FaixaMusical(f"Track {i}", "music", "neutral", f"Track {i}", i)
            for i in range(1, 7)
        ]
    
    def _gerar_prompt_offline(self, faixa: FaixaMusical, marca: IdentidadeMarca, publico: PublicoAlvo) -> str:
        """Fallback offline para prompts"""
        return f"Create music for {marca.nome}. Style: {faixa.genero}. Mood: {faixa.clima}. Duration: 180 seconds."
    
    def _criar_narrativa_album(self, marca: IdentidadeMarca, publico: PublicoAlvo) -> str:
        """Cria narrativa usando IA"""
        if self.model:
            try:
                prompt = f"""
                Você é um roteirista especializado em narrativas musicais.
                
                Crie uma narrativa única para o álbum da marca {marca.nome}.
                
                Contexto:
                - Essência: {marca.essencia}
                - Valores: {marca.valores}
                - Público: {publico.estilo_vida}
                
                Crie uma narrativa de 2-3 frases que conecte emocionalmente 
                a marca com o público através de uma jornada musical.
                """
                
                response = self.model.generate_content(prompt)
                return response.text
            except:
                pass
        
        return f"Musical journey for {marca.nome}."
    
    def _gerar_fallback_ia_simples(self, nome_marca: str, setor: str) -> IdentidadeMarca:
        """Fallback mínimo quando IA não está disponível"""
        return IdentidadeMarca(
            nome=nome_marca,
            essencia=["brand"],
            personalidade_sonora=["musical"],
            paleta_sonora={
                "instruments": ["music"]
            },
            valores=["quality"],
            setor=setor
        )



    def _gerar_faixas_album(self, marca: IdentidadeMarca, publico: PublicoAlvo) -> List[FaixaMusical]:
        """Gera faixas usando IA para máxima criatividade"""
        
        if self.model:
            try:
                prompt = f"""
                Você é um produtor musical criativo especializado em álbuns conceituais para marcas.
                
                Crie um álbum de 6 faixas para a marca "{marca.nome}".
                
                Contexto:
                - Essência: {marca.essencia}
                - Valores: {marca.valores}
                - Público: {publico.generos_preferidos}
                - Personalidade: {marca.personalidade_sonora}
                
                Retorne um JSON com 6 faixas criativas e únicas:
                {{
                    "faixas": [
                        {{
                            "titulo": "Nome criativo da faixa",
                            "genero": "gênero específico e interessante",
                            "clima": "mood único",
                            "descricao": "descrição da faixa",
                            "posicao_album": 1
                        }}
                    ]
                }}
                
                Seja MUITO criativo com gêneros, evite clichês. Explore fusões, subgêneros, estilos únicos.
                """
                
                response = self.model.generate_content(prompt)
                return self._processar_faixas_json(response.text)
                
            except Exception as e:
                print(f"Erro na API: {e}")
                return self._gerar_faixas_offline(marca, publico)
        else:
            return self._gerar_faixas_offline(marca, publico)



    def _gerar_resumo_executivo(self, marca: IdentidadeMarca, publico: PublicoAlvo, album: AlbumConceitual) -> str:
        """Gera resumo usando IA"""
        if self.model:
            try:
                prompt = f"""
                Você é um consultor de branding musical.
                
                Crie um resumo executivo para a curadoria musical da marca {marca.nome}.
                
                Contexto:
                - Essência: {marca.essencia}
                - Personalidade: {marca.personalidade_sonora}
                - Público: {publico.faixa_etaria}, {publico.classe_social}
                - Álbum: "{album.titulo}" com {len(album.faixas)} faixas
                
                Crie um resumo profissional de 3-4 frases explicando a estratégia musical.
                """
                
                response = self.model.generate_content(prompt)
                return response.text
            except:
                pass
        
        return f"Curadoria musical para {marca.nome} - Álbum {album.titulo} com {len(album.faixas)} faixas."

# Exemplo de uso
if __name__ == "__main__":
    # A API key será carregada automaticamente do arquivo .env
    # Certifique-se de ter GEMINI_API_KEY=sua_chave no .env
    curador = CuradorMusical()
    
    # Teste com uma marca
    relatorio = curador.gerar_relatorio_completo(
        nome_marca="TechFlow",
        setor="fintech"
    )
    
    print(json.dumps(relatorio, indent=2, ensure_ascii=False))
    def _processar_resposta_json(self, nome_marca: str, setor: str, resposta: str) -> IdentidadeMarca:
        """Processa resposta JSON da IA"""
        try:
            inicio = resposta.find('{')
            fim = resposta.rfind('}') + 1
            json_str = resposta[inicio:fim]
            
            data = json.loads(json_str)
            
            return IdentidadeMarca(
                nome=nome_marca,
                essencia=data.get('essencia', []),
                personalidade_sonora=data.get('personalidade_sonora', []),
                paleta_sonora=data.get('paleta_sonora', {}),
                valores=data.get('valores', []),
                setor=setor
            )
        except:
            return self._analisar_marca_offline(nome_marca, setor)
    
    def _processar_publico_json(self, resposta: str) -> PublicoAlvo:
        """Processa resposta JSON do público"""
        try:
            inicio = resposta.find('{')
            fim = resposta.rfind('}') + 1
            json_str = resposta[inicio:fim]
            
            data = json.loads(json_str)
            
            return PublicoAlvo(
                faixa_etaria=data.get('faixa_etaria', '25-35 anos'),
                classe_social=data.get('classe_social', 'Classe B'),
                estilo_vida=data.get('estilo_vida', []),
                regioes=data.get('regioes', []),
                comportamento=data.get('comportamento', []),
                generos_preferidos=data.get('generos_preferidos', [])
            )
        except:
            return self._mapear_publico_offline(None)
    
    def _analisar_marca_offline(self, nome_marca: str, setor: str) -> IdentidadeMarca:
        """Análise offline da marca"""
        return IdentidadeMarca(
            nome=nome_marca,
            essencia=["inovação", "qualidade", "confiança"],
            personalidade_sonora=["moderna", "envolvente", "profissional"],
            paleta_sonora={
                "eletrônicos": ["sintetizador", "pads"],
                "orgânicos": ["piano", "cordas"],
                "rítmicos": ["bateria eletrônica", "percussão"],
                "vocais": ["vocal limpo", "harmonias"]
            },
            valores=["excelência", "inovação", "sustentabilidade"],
            setor=setor
        )
    
    def _mapear_publico_offline(self, marca: IdentidadeMarca) -> PublicoAlvo:
        """Mapeamento offline do público"""
        return PublicoAlvo(
            faixa_etaria="25-40 anos",
            classe_social="Classe A/B",
            estilo_vida=["urbano", "conectado", "consciente"],
            regioes=["grandes centros", "capitais"],
            comportamento=["early adopter", "influenciador", "exigente"],
            generos_preferidos=["eletrônico", "pop", "indie"]
        )
    
    def _criar_narrativa_album(self, marca: IdentidadeMarca, publico: PublicoAlvo) -> str:
        """Cria narrativa do álbum"""
        return f"Uma jornada sonora que captura a essência de {marca.nome}, conectando {', '.join(marca.essencia)} com o universo do público {publico.faixa_etaria}."
    
    def _gerar_faixas_album(self, marca: IdentidadeMarca, publico: PublicoAlvo) -> List[FaixaMusical]:
        """Gera faixas do álbum"""
        generos = publico.generos_preferidos if publico.generos_preferidos else ["eletrônico", "pop"]
        
        faixas = [
            FaixaMusical("Abertura", generos[0], "inspirador", "Faixa de abertura energética", 1),
            FaixaMusical("Essência", generos[1] if len(generos) > 1 else "pop", "reflexivo", "Captura a essência da marca", 2),
            FaixaMusical("Conexão", "pop", "emotivo", "Conecta marca e público", 3),
            FaixaMusical("Transformação", "eletrônico", "dinâmico", "Representa mudança e inovação", 4),
            FaixaMusical("Futuro", generos[0], "otimista", "Visão de futuro da marca", 5)
        ]
        return faixas
    
    def _gerar_prompt_offline(self, faixa: FaixaMusical, marca: IdentidadeMarca, publico: PublicoAlvo) -> str:
        """Gera prompt offline"""
        return f"Crie uma música {faixa.genero} com clima {faixa.clima} para a marca {marca.nome}, direcionada ao público {publico.faixa_etaria}. Inclua elementos de {', '.join(marca.personalidade_sonora)}."