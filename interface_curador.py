import streamlit as st
import json
import os
from dotenv import load_dotenv
from curador_musical_fixed import CuradorMusical, IdentidadeMarca, PublicoAlvo, FaixaMusical
import pandas as pd

# Carregar variáveis de ambiente
load_dotenv()

def main():
    st.set_page_config(
        page_title="🎵 Curador Musical IA",
        page_icon="🎵",
        layout="wide"
    )
    
    st.title("🎵 Curador Musical IA")
    st.markdown("*Criação de identidade sonora e álbuns conceituais para marcas*")
    
    # Sidebar para configurações
    with st.sidebar:
        st.header("⚙️ Configurações")
        
        # APIs
        default_gemini_key = os.getenv('GEMINI_API_KEY', '')
        default_elevenlabs_key = os.getenv('ELEVENLABS_API_KEY', '4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf')
        
        if default_gemini_key:
            st.success("✓ API Key Gemini carregada")
            api_key = default_gemini_key
        else:
            api_key = st.text_input("Google Gemini API Key", type="password")
        
        if default_elevenlabs_key and default_elevenlabs_key != '4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf':
            st.success("✓ API Key ElevenLabs carregada")
            elevenlabs_key = default_elevenlabs_key
            
            # Botão para testar API
            if st.button("🧪 Testar API"):
                with st.spinner("Testando ElevenLabs API..."):
                    try:
                        from elevenlabs.client import ElevenLabs
                        client = ElevenLabs(api_key=elevenlabs_key)
                        # Teste rápido
                        test_track = client.music.compose(
                            prompt="A simple test tone",
                            music_length_ms=2000
                        )
                        st.success("✅ API funcionando!")
                    except Exception as e:
                        st.error(f"❌ Erro na API: {str(e)[:100]}...")
        else:
            if default_elevenlabs_key == '4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf':
                st.warning("⚠️ Usando chave padrão (apenas prompts)")
                st.info("💳 Para gerar músicas reais, configure sua API key paga")
            elevenlabs_key = st.text_input("ElevenLabs API Key", type="password", value=default_elevenlabs_key if default_elevenlabs_key != '4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf' else '')
        
        # Status do gerador local
        try:
            from gerador_simples import GeradorMusicalSimples
            gerador_test = GeradorMusicalSimples()
            status = gerador_test.verificar_disponibilidade()
            
            st.header("🎵 Geração Musical")
            st.success("✅ Gerador de Prompts Otimizados (GRATUITO)")
            st.info("🎵 Suporte: Suno AI, Udio, ElevenLabs")
        except ImportError:
            st.error("❌ Gerador não disponível")
            st.info("💡 Execute: pip install -r requirements.txt")
        
        st.header("📊 Setores Disponíveis")
        st.info("""
        • Fintech
        • Moda & Lifestyle  
        • Tecnologia
        • Saúde & Bem-estar
        • Alimentação
        • Educação
        • Cosméticos & Beleza
        """)
        
        st.header("💡 Dicas")
        st.success("""
        ✅ Configure sua própria API key ElevenLabs
        ✅ Seja específico com o nome da marca
        ✅ Use o feedback para melhorar prompts
        ✅ Salve os JSONs para reutilizar
        """)
        
        st.header("🔗 Links Úteis")
        st.markdown("""
        - [ElevenLabs API Keys](https://elevenlabs.io/app/settings/api-keys)
        - [Gemini API Keys](https://makersuite.google.com/app/apikey)
        - [Suno AI](https://suno.com) (alternativa)
        - [Udio](https://udio.com) (alternativa)
        """)
    
    # Interface principal
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.header("🎯 Análise da Marca")
        
        nome_marca = st.text_input(
            "Nome da Marca", 
            placeholder="Ex: Natura, NuBank, Magazine Luiza...",
            help="Digite o nome exato da marca para melhor análise"
        )
        
        setor = st.selectbox(
            "Setor da Empresa",
            ["fintech", "moda", "tecnologia", "saude", "alimentacao", "educacao", "cosmeticos"],
            help="Selecione o setor que melhor representa sua marca"
        )
        
        # Status da configuração
        if api_key:
            st.success("✅ Gemini configurado")
        else:
            st.warning("⚠️ Configure a API do Gemini")
            
        if elevenlabs_key and elevenlabs_key != '4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf':
            st.success("✅ ElevenLabs configurado (músicas reais)")
        else:
            st.info("📝 Modo prompts (configure ElevenLabs para músicas)")
        
        st.info("🤖 A IA irá analisar automaticamente a marca com base no nome e setor fornecidos.")
        
        col_btn1, col_btn2 = st.columns(2)
        
        with col_btn1:
            if st.button("🎼 Gerar Curadoria", type="primary"):
                if nome_marca:
                    with st.spinner("Analisando marca e criando curadoria..."):
                        curador = CuradorMusical(api_key, elevenlabs_key)
                        relatorio = curador.gerar_relatorio_completo(nome_marca, setor)
                        st.session_state.relatorio = relatorio
                        st.session_state.curador = curador
                        st.success("✅ Curadoria gerada!")
                else:
                    st.error("Preencha o nome da marca.")
        
        with col_btn2:
            if st.button("🎵 Gerar Músicas", type="secondary"):
                if 'relatorio' in st.session_state and 'curador' in st.session_state:
                    with st.spinner("Gerando músicas com IA..."):
                        relatorio = st.session_state.relatorio
                        curador = st.session_state.curador
                        
                        # Verificar métodos disponíveis
                        try:
                            from gerador_simples import GeradorMusicalSimples
                            st.info("🎵 Gerando prompts otimizados para múltiplas plataformas")
                        except ImportError:
                            st.warning("⚠️ Gerador simples não disponível - usando apenas ElevenLabs")
                            if not curador.music_api_key or curador.music_api_key == '4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf':
                                st.warning("⚠️ API key padrão - apenas prompts serão gerados")
                                st.info("💳 Configure ElevenLabs")
                        
                        marca_obj = IdentidadeMarca(**relatorio['marca'])
                        publico_obj = PublicoAlvo(**relatorio['publico'])
                        
                        resultado = curador.gerar_album_completo(marca_obj, publico_obj)
                        st.session_state.musicas_geradas = resultado
                        
                        # Contar músicas vs prompts
                        musicas_reais = sum(1 for m in resultado['musicas_geradas'] if m.get('tipo') == 'audio')
                        prompts_salvos = len(resultado['musicas_geradas']) - musicas_reais
                        
                        if musicas_reais > 0:
                            st.success(f"✅ {musicas_reais} músicas geradas com sucesso!")
                        if prompts_salvos > 0:
                            st.info(f"📝 {prompts_salvos} prompts salvos")
                            st.markdown("🎵 **Use os prompts em:**")
                            st.markdown("- [Suno AI](https://suno.com)")
                            st.markdown("- [Udio](https://udio.com)")
                            st.markdown("- [ElevenLabs](https://elevenlabs.io) (com API key paga)")
                else:
                    st.error("Gere a curadoria primeiro.")
    
    with col2:
        st.header("📋 Preview dos Resultados")
        
        if 'relatorio' in st.session_state:
            relatorio = st.session_state.relatorio
            
            # Resumo executivo
            st.subheader("📊 Resumo Executivo")
            st.info(relatorio['resumo_executivo'])
            
            # Identidade da marca
            st.subheader("🎯 Identidade Sonora")
            marca = relatorio['marca']
            
            col_a, col_b = st.columns(2)
            with col_a:
                st.write("**Essência:**")
                for item in marca['essencia']:
                    st.write(f"• {item}")
            
            with col_b:
                st.write("**Personalidade Sonora:**")
                for item in marca['personalidade_sonora']:
                    st.write(f"• {item}")
            
            # Público-alvo
            st.subheader("👥 Público-Alvo")
            publico = relatorio['publico']
            
            dados_publico = {
                "Aspecto": ["Faixa Etária", "Classe Social", "Estilo de Vida", "Regiões"],
                "Descrição": [
                    publico['faixa_etaria'],
                    publico['classe_social'],
                    ", ".join(publico['estilo_vida']),
                    ", ".join(publico['regioes'])
                ]
            }
            
            df_publico = pd.DataFrame(dados_publico)
            st.table(df_publico)
        else:
            st.info("👆 Preencha os dados da marca e clique em 'Gerar Curadoria Musical' para ver os resultados.")
    
    # Seção de resultados detalhados
    if 'relatorio' in st.session_state:
        st.markdown("---")
        
        relatorio = st.session_state.relatorio
        album = relatorio['album']
        
        st.header(f"💿 Álbum Conceitual: {album['titulo']}")
        st.markdown(f"**Narrativa:** {album['narrativa']}")
        
        # Faixas do álbum
        st.subheader("🎵 Tracklist")
        
        for i, faixa_dict in enumerate(album['faixas'], 1):
            with st.expander(f"Track {i}: {faixa_dict['titulo']} ({faixa_dict['genero']})"):
                col_x, col_y = st.columns([2, 1])
                
                with col_x:
                    st.write(f"**Gênero:** {faixa_dict['genero']}")
                    st.write(f"**Clima:** {faixa_dict['clima']}")
                    st.write(f"**Descrição:** {faixa_dict['descricao']}")
                
                with col_y:
                    st.write(f"**Posição:** {faixa_dict['posicao_album']}")
                    st.write("**Duração:** 3:00")
        
        # Prompts para criação
        st.header("🤖 Prompts para Criação Musical")
        
        for i, prompt_data in enumerate(relatorio['prompts_criacao']):
            with st.expander(f"📝 Prompt: {prompt_data['faixa']}"):
                # Mostrar prompt atual
                prompt_key = f"prompt_{i}"
                if prompt_key not in st.session_state:
                    st.session_state[prompt_key] = prompt_data['prompt']
                
                st.code(st.session_state[prompt_key], language="text")
                
                # Seção de melhoria
                st.markdown("**🔧 Melhorar este prompt:**")
                feedback = st.text_area(
                    "Descreva como quer melhorar:", 
                    placeholder="Ex: Mais eletrônico, menos vocal, adicionar guitarra...",
                    key=f"feedback_{i}"
                )
                
                col_improve, col_copy = st.columns(2)
                
                with col_improve:
                    if st.button(f"✨ Melhorar Prompt", key=f"improve_{i}"):
                        if feedback:
                            with st.spinner("Melhorando prompt..."):
                                curador = CuradorMusical()
                                # Buscar dados da faixa
                                faixa_data = album['faixas'][i]
                                faixa = FaixaMusical(
                                    titulo=faixa_data['titulo'],
                                    genero=faixa_data['genero'],
                                    clima=faixa_data['clima'],
                                    descricao=faixa_data['descricao'],
                                    posicao_album=faixa_data['posicao_album']
                                )
                                marca_obj = IdentidadeMarca(**relatorio['marca'])
                                publico_obj = PublicoAlvo(**relatorio['publico'])
                                
                                prompt_melhorado = curador.melhorar_prompt(
                                    st.session_state[prompt_key], 
                                    feedback, 
                                    faixa, 
                                    marca_obj, 
                                    publico_obj
                                )
                                st.session_state[prompt_key] = prompt_melhorado
                                st.success("✓ Prompt melhorado!")
                                st.rerun()
                        else:
                            st.warning("Digite um feedback para melhorar o prompt")
                
                with col_copy:
                    if st.button(f"🎵 Gerar Música", key=f"generate_{i}"):
                        if 'curador' in st.session_state:
                            with st.spinner(f"Gerando música '{prompt_data['faixa']}'..."):
                                curador = st.session_state.curador
                                # Adicionar vocal para algumas faixas
                                com_vocal = i in [1, 2]  # Faixas 2 e 3 com vocal
                                arquivo = curador.gerar_musica(
                                    st.session_state[prompt_key], 
                                    prompt_data['faixa'],
                                    com_vocal=com_vocal
                                )
                                if arquivo:
                                    if arquivo.endswith(('.mp3', '.wav')):
                                        st.success(f"✅ Música gerada: {arquivo}")
                                        if com_vocal:
                                            st.info("🎤 Música com vocal gerada")
                                        if os.path.exists(arquivo):
                                            with open(arquivo, 'rb') as audio_file:
                                                format_type = 'audio/wav' if arquivo.endswith('.wav') else 'audio/mp3'
                                                st.audio(audio_file.read(), format=format_type)
                                        else:
                                            st.error("Arquivo não encontrado")
                                    else:
                                        st.warning(f"⚠️ Prompt salvo: {arquivo}")
                                        st.info("🎵 Use este prompt em uma IA musical como Suno, Udio ou ElevenLabs")
                                        
                                        # Mostrar conteúdo do prompt
                                        if os.path.exists(arquivo):
                                            with open(arquivo, 'r', encoding='utf-8') as f:
                                                prompt_preview = f.read()[:200] + "..."
                                            st.code(prompt_preview, language='text')
                                else:
                                    st.error("❌ Erro ao gerar música")
                                    st.info("🔧 Configure ElevenLabs ou use os prompts gerados")
                        else:
                            st.error("Configure as APIs primeiro")
        
        # Download do relatório
        st.markdown("---")
        st.subheader("💾 Download do Relatório")
        
        col_down1, col_down2 = st.columns(2)
        
        with col_down1:
            # JSON completo
            json_data = json.dumps(relatorio, indent=2, ensure_ascii=False)
            st.download_button(
                label="📄 Download JSON Completo",
                data=json_data,
                file_name=f"curadoria_{nome_marca.lower().replace(' ', '_')}.json",
                mime="application/json"
            )
        
        with col_down2:
            # Apenas prompts limpos
            prompts_text = "\n\n" + ("="*50 + "\n\n").join([
                f"FAIXA: {p['faixa']}\n\n{p['prompt']}" 
                for p in relatorio['prompts_criacao']
            ])
            
            prompts_text += "\n\n" + "="*50 + "\n\n"
            prompts_text += "INSTRUÇÕES DE USO:\n"
            prompts_text += "1. Copie cada prompt\n"
            prompts_text += "2. Cole em uma IA musical:\n"
            prompts_text += "   - Suno AI: https://suno.com\n"
            prompts_text += "   - Udio: https://udio.com\n"
            prompts_text += "   - ElevenLabs: https://elevenlabs.io\n"
            prompts_text += "3. Ajuste parâmetros conforme necessário\n"
            
            st.download_button(
                label="🎼 Download Prompts para IAs Musicais",
                data=prompts_text,
                file_name=f"prompts_{nome_marca.lower().replace(' ', '_')}.txt",
                mime="text/plain",
                help="Prompts otimizados para Suno AI, Udio e ElevenLabs"
            )
        
        # Seção de músicas geradas
        if 'musicas_geradas' in st.session_state:
            st.markdown("---")
            st.header("🎵 Músicas Geradas")
            
            musicas = st.session_state.musicas_geradas['musicas_geradas']
            
            for musica in musicas:
                with st.expander(f"🎵 {musica['faixa']}"):
                    if os.path.exists(musica['arquivo']):
                        if musica['arquivo'].endswith(('.mp3', '.wav')):
                            with open(musica['arquivo'], 'rb') as audio_file:
                                format_type = 'audio/wav' if musica['arquivo'].endswith('.wav') else 'audio/mp3'
                                st.audio(audio_file.read(), format=format_type)
                            st.info(f"📁 Arquivo: {musica['arquivo']}")
                            if musica.get('com_vocal'):
                                st.success("🎤 Música com vocal")
                            else:
                                st.info("🎼 Música instrumental")
                        else:
                            # É um arquivo de prompt
                            with open(musica['arquivo'], 'r', encoding='utf-8') as f:
                                prompt_content = f.read()
                            
                            # Mostrar apenas o prompt principal (sem instruções)
                            prompt_lines = prompt_content.split('\n')
                            main_prompt = []
                            for line in prompt_lines:
                                if '=' in line and len(line) > 20:  # Linha separadora
                                    break
                                main_prompt.append(line)
                            
                            st.code('\n'.join(main_prompt), language='text')
                            st.info(f"📝 Prompt salvo: {musica['arquivo']}")
                            
                            # Botões para copiar
                            col1, col2, col3 = st.columns(3)
                            with col1:
                                st.link_button("🎵 Suno AI", "https://suno.com")
                            with col2:
                                st.link_button("🎵 Udio", "https://udio.com")
                            with col3:
                                st.link_button("🎵 ElevenLabs", "https://elevenlabs.io")
                    else:
                        st.error("❌ Arquivo não encontrado")

if __name__ == "__main__":
    main()