import json
import os
from dotenv import load_dotenv
import google.generativeai as genai
try:
    import requests
    import base64
except ImportError:
    requests = None
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from datetime import datetime

# Importar gerador musical local
try:
    from gerador_audio import GeradorAudioSimples
    GERADOR_DISPONIVEL = True
except ImportError:
    GERADOR_DISPONIVEL = False
    print("Gerador de áudio não disponível")

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
        self.gerador_local = None
        
        # Configurar Gemini
        key = api_key or os.getenv('GEMINI_API_KEY')
        if key:
            genai.configure(api_key=key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Configurar API de música
        self.music_api_key = elevenlabs_key or os.getenv('ELEVENLABS_API_KEY')
        if not self.music_api_key:
            self.music_api_key = "4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf"
        self.music_client = requests if requests else None
        
        # Inicializar gerador local se disponível
        if GERADOR_DISPONIVEL:
            try:
                self.gerador_local = GeradorAudioSimples()
                print("Gerador de áudio inicializado")
            except Exception as e:
                print(f"Erro ao inicializar gerador local: {e}")

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
    
    def _processar_resposta_json(self, nome_marca: str, setor: str, resposta: str) -> IdentidadeMarca:
        """Processa resposta JSON da IA"""
        try:
            import re
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
        return self._mapear_publico_offline(None)
    
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

    def criar_album_conceitual(self, marca: IdentidadeMarca, publico: PublicoAlvo) -> AlbumConceitual:
        """Cria um álbum conceitual baseado na marca e público"""
        titulo_album = f"{marca.essencia[0].title()} by {marca.nome}"
        narrativa = f"Uma jornada sonora que captura a essência de {marca.nome}"
        
        generos = publico.generos_preferidos if publico.generos_preferidos else ["eletrônico", "pop"]
        
        faixas = [
            FaixaMusical("Abertura", generos[0], "inspirador", "Faixa de abertura energética", 1),
            FaixaMusical("Essência", generos[1] if len(generos) > 1 else "pop", "reflexivo", "Captura a essência da marca", 2),
            FaixaMusical("Conexão", "pop", "emotivo", "Conecta marca e público", 3),
            FaixaMusical("Transformação", "eletrônico", "dinâmico", "Representa mudança e inovação", 4),
            FaixaMusical("Futuro", generos[0], "otimista", "Visão de futuro da marca", 5)
        ]
        
        return AlbumConceitual(
            titulo=titulo_album,
            narrativa=narrativa,
            faixas=faixas,
            duracao_total=len(faixas) * 180
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
                1. Especificações técnicas específicas (BPM, tonalidade, estrutura)
                2. Instrumentação detalhada e criativa
                3. Direção vocal específica (se aplicável)
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
    
    def _gerar_prompt_offline(self, faixa: FaixaMusical, marca: IdentidadeMarca, publico: PublicoAlvo) -> str:
        """Gera prompt detalhado offline"""
        
        # Mapear gêneros para especificações técnicas
        specs_tecnicas = {
            "eletrônico": "BPM: 120-128, Tonalidade: Dm ou Am, Estrutura: Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro",
            "pop": "BPM: 100-120, Tonalidade: C major ou G major, Estrutura: Verse-Chorus-Verse-Chorus-Bridge-Chorus",
            "indie": "BPM: 90-110, Tonalidade: F major ou D major, Estrutura: Intro-Verse-Chorus-Verse-Chorus-Outro"
        }
        
        # Mapear clima para atmosfera
        atmosferas = {
            "inspirador": "atmosfera elevada e motivacional, com crescendos emocionais",
            "reflexivo": "atmosfera contemplativa e introspectiva, com espaços e reverb",
            "emotivo": "atmosfera calorosa e envolvente, com harmonias ricas",
            "dinâmico": "atmosfera energética com contrastes e mudanças de intensidade",
            "otimista": "atmosfera brilhante e positiva, com elementos ascendentes"
        }
        
        # Instrumentação baseada na paleta sonora
        instrumentos = []
        if "eletrônicos" in marca.paleta_sonora:
            instrumentos.extend(marca.paleta_sonora["eletrônicos"])
        if "orgânicos" in marca.paleta_sonora:
            instrumentos.extend(marca.paleta_sonora["orgânicos"])
        if "rítmicos" in marca.paleta_sonora:
            instrumentos.extend(marca.paleta_sonora["rítmicos"])
        
        spec_tecnica = specs_tecnicas.get(faixa.genero, "BPM: 110, Tonalidade: C major")
        atmosfera = atmosferas.get(faixa.clima, "atmosfera equilibrada")
        
        prompt = f"""PROMPT PARA CRIAÇÃO MUSICAL - {faixa.titulo.upper()}

🎵 ESPECIFICAÇÕES TÉCNICAS:
{spec_tecnica}
Duração: 3 minutos

🎨 IDENTIDADE SONORA:
Marca: {marca.nome}
Essência: {', '.join(marca.essencia)}
Personalidade: {', '.join(marca.personalidade_sonora)}
Valores: {', '.join(marca.valores)}

🎯 PÚBLICO-ALVO:
Faixa etária: {publico.faixa_etaria}
Comportamento: {', '.join(publico.comportamento)}
Estilo de vida: {', '.join(publico.estilo_vida)}

🎼 DIREÇÃO MUSICAL:
Gênero: {faixa.genero}
Clima: {faixa.clima}
Atmosfera: {atmosfera}

🎹 INSTRUMENTAÇÃO:
Instrumentos principais: {', '.join(instrumentos[:4]) if instrumentos else 'piano, sintetizador, bateria, baixo'}
Texturas: Camadas harmônicas ricas, com foco em {marca.personalidade_sonora[0] if marca.personalidade_sonora else 'modernidade'}

🎤 DIREÇÃO VOCAL:
{marca.paleta_sonora.get('vocais', ['vocal limpo', 'harmonias'])[0] if 'vocais' in marca.paleta_sonora else 'Instrumental ou vocal sutil'}

🎨 MOOD E REFERÊNCIAS:
Inspire-se em artistas que combinam {faixa.genero} com elementos {marca.personalidade_sonora[0] if marca.personalidade_sonora else 'modernos'}
Crie uma jornada emocional que represente {faixa.descricao.lower()}

📝 INSTRUÇÕES ESPECÍFICAS:
- Inicie com elementos que capturem a atenção do público {publico.faixa_etaria}
- Desenvolva a música com progressões que reflitam {', '.join(marca.essencia[:2])}
- Inclua momentos de {faixa.clima} que conectem com os valores de {', '.join(marca.valores[:2])}
- Finalize de forma memorável, deixando uma impressão duradoura da marca {marca.nome}
"""
        
        return prompt

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

    def gerar_musica(self, prompt: str, titulo: str, duracao: int = 180, com_vocal: bool = False, letra: str = None) -> Optional[str]:
        """Gera música usando MusicGen+Bark (gratuito) ou ElevenLabs (pago)"""
        
        # Tentar primeiro com gerador de áudio (gratuito)
        if GERADOR_DISPONIVEL:
            try:
                print(f"Gerando áudio para '{titulo}'...")
                gerador = GeradorAudioSimples()
                
                # Gerar música real
                resultado = gerador.gerar_musica_completa(
                    prompt=prompt,
                    titulo=titulo,
                    duracao=min(duracao, 30)  # Máximo 30s
                )
                
                if resultado:
                    print(f"Áudio gerado para '{titulo}': {resultado}")
                    return resultado
                else:
                    print("Falha no gerador de áudio, tentando ElevenLabs...")
            except Exception as e:
                print(f"Erro no gerador de áudio: {e}, tentando ElevenLabs...")
        
        # Fallback para ElevenLabs (pago)
        return self._gerar_com_elevenlabs(prompt, titulo, duracao)
    
    def _gerar_com_elevenlabs(self, prompt: str, titulo: str, duracao: int = 180) -> Optional[str]:
        """Gera música usando ElevenLabs Music API"""
        
        if not self.music_api_key:
            print("API key da ElevenLabs não configurada")
            return self._salvar_prompt_apenas(prompt, titulo)
        
        # Verificar se é a API key padrão (demo)
        if self.music_api_key == "4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf":
            print(f"Usando API key padrão - salvando apenas prompt para '{titulo}'")
            return self._salvar_prompt_apenas(prompt, titulo)
        
        try:
            # Usar ElevenLabs Music API
            from elevenlabs.client import ElevenLabs
            from io import BytesIO
            
            client = ElevenLabs(api_key=self.music_api_key)
            
            # Converter duração para milissegundos (máximo 30 segundos para teste)
            duracao_ms = min(duracao * 1000, 30000)
            
            print(f"Gerando música '{titulo}' com ElevenLabs...")
            
            # Tentar primeiro com streaming (mais eficiente)
            try:
                stream = client.music.stream(
                    prompt=prompt,
                    music_length_ms=duracao_ms
                )
                
                # Criar BytesIO para armazenar o áudio
                audio_stream = BytesIO()
                
                # Escrever chunks do stream
                for chunk in stream:
                    if chunk:
                        audio_stream.write(chunk)
                
                # Reset para o início
                audio_stream.seek(0)
                audio_data = audio_stream.getvalue()
                
            except Exception as stream_error:
                print(f"Erro no streaming, tentando compose: {stream_error}")
                # Fallback para compose
                audio_data = client.music.compose(
                    prompt=prompt,
                    music_length_ms=duracao_ms
                )
            
            # Salvar arquivo
            filename = f"{titulo.replace(' ', '_').lower()}.mp3"
            filepath = os.path.join("musicas_geradas", filename)
            os.makedirs("musicas_geradas", exist_ok=True)
            
            # Salvar o áudio
            with open(filepath, "wb") as f:
                f.write(audio_data)
            
            print(f"Música '{titulo}' gerada com sucesso: {filepath}")
            
            # Salvar prompt detalhado
            prompt_file = filepath.replace('.mp3', '_prompt.txt')
            with open(prompt_file, "w", encoding="utf-8") as f:
                f.write(f"PROMPT DETALHADO - {titulo.upper()}\n\n{prompt}")
            
            return filepath
            
        except ImportError:
            print("Biblioteca elevenlabs não instalada")
            return self._salvar_prompt_apenas(prompt, titulo)
        except Exception as e:
            error_msg = str(e)
            
            # Tratar erros específicos da API
            if "bad_prompt" in error_msg.lower():
                print(f"Prompt rejeitado (copyright): {error_msg}")
                # Tentar extrair sugestão de prompt
                try:
                    if hasattr(e, 'body') and 'prompt_suggestion' in str(e.body):
                        suggestion = e.body['detail']['data']['prompt_suggestion']
                        print(f"Sugestão da API: {suggestion}")
                        # Tentar novamente com a sugestão
                        return self._gerar_com_elevenlabs(suggestion, titulo, duracao)
                except:
                    pass
            elif "rate_limit" in error_msg.lower():
                print("Limite de requisições atingido - aguarde alguns minutos")
            elif "unauthorized" in error_msg.lower() or "401" in error_msg:
                print("API key inválida ou sem permissões")
            elif "payment" in error_msg.lower() or "subscription" in error_msg.lower():
                print("Conta ElevenLabs sem plano pago ativo")
            elif "quota" in error_msg.lower() or "limit" in error_msg.lower():
                print("Cota de uso esgotada")
            else:
                print(f"Erro na API ElevenLabs: {error_msg}")
            
            return self._salvar_prompt_apenas(prompt, titulo)
    
    def _salvar_prompt_apenas(self, prompt: str, titulo: str) -> str:
        """Salva apenas o prompt quando não consegue gerar áudio"""
        filename = f"{titulo.replace(' ', '_').lower()}.txt"
        filepath = os.path.join("musicas_geradas", filename)
        os.makedirs("musicas_geradas", exist_ok=True)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"Prompt para música '{titulo}':\n\n")
            f.write(prompt)
            f.write("\n\n" + "=" * 50 + "\n")
            f.write("INSTRUÇÕES DE USO:\n")
            f.write("1. Copie este prompt\n")
            f.write("2. Cole em uma IA musical como:\n")
            f.write("   - Suno AI (suno.com)\n")
            f.write("   - Udio (udio.com)\n")
            f.write("   - ElevenLabs Music (elevenlabs.io)\n")
            f.write("   - MusicGen (huggingface.co)\n")
            f.write("   - OU instale MusicGen+Bark: pip install -r requirements.txt\n")
            f.write("3. Configure sua própria API key ElevenLabs\n")
            f.write("4. Ajuste os parâmetros conforme necessário\n")
        
        print(f"Prompt salvo: {filepath}")
        return filepath

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
            
            # Gerar música (com vocal para algumas faixas)
            com_vocal = faixa.posicao_album in [2, 3]  # Faixas 2 e 3 com vocal
            arquivo_musica = self.gerar_musica(prompt, faixa.titulo, com_vocal=com_vocal)
            if arquivo_musica:
                tipo_arquivo = "audio" if arquivo_musica.endswith(('.mp3', '.wav')) else "prompt"
                resultados["musicas_geradas"].append({
                    "faixa": faixa.titulo,
                    "arquivo": arquivo_musica,
                    "tipo": tipo_arquivo,
                    "com_vocal": com_vocal
                })
        
        return resultados

    def gerar_relatorio_completo(self, nome_marca: str, setor: str) -> Dict[str, Any]:
        """Gera relatório completo de curadoria musical"""
        marca = self.analisar_marca(nome_marca, setor)
        publico = self.mapear_publico(marca)
        album = self.criar_album_conceitual(marca, publico)
        
        prompts = []
        for faixa in album.faixas:
            prompt = self.gerar_prompt_criacao(faixa, marca, publico)
            prompts.append({
                "faixa": faixa.titulo,
                "prompt": prompt
            })
        
        album_dict = album.__dict__.copy()
        album_dict['faixas'] = [faixa.__dict__ for faixa in album.faixas]
        
        return {
            "timestamp": datetime.now().isoformat(),
            "marca": marca.__dict__,
            "publico": publico.__dict__,
            "album": album_dict,
            "prompts_criacao": prompts,
            "resumo_executivo": f"Curadoria musical para {marca.nome} - Álbum {album.titulo} com {len(album.faixas)} faixas.",
            "gerador_disponivel": GERADOR_DISPONIVEL,
            "status_geracao": "Áudio procedural (gratuito)" if GERADOR_DISPONIVEL else "Apenas prompts básicos"
        }