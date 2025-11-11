#!/usr/bin/env python3
"""
Teste do MusicGen + Bark
Verifica se a integração está funcionando
"""

import os
import sys

def testar_dependencias():
    """Testa se as dependências estão instaladas"""
    print("🔍 Testando dependências...")
    
    dependencias = {
        "torch": "PyTorch",
        "transformers": "Transformers (Hugging Face)",
        "audiocraft": "AudioCraft (MusicGen)",
        "bark": "Suno Bark",
        "scipy": "SciPy",
        "pydub": "PyDub"
    }
    
    instaladas = []
    faltando = []
    
    for dep, nome in dependencias.items():
        try:
            __import__(dep)
            instaladas.append(f"✅ {nome}")
        except ImportError:
            faltando.append(f"❌ {nome}")
    
    print("\nDependências instaladas:")
    for dep in instaladas:
        print(f"  {dep}")
    
    if faltando:
        print("\nDependências faltando:")
        for dep in faltando:
            print(f"  {dep}")
        print("\n💡 Execute: pip install -r requirements.txt")
        return False
    
    print("\n✅ Todas as dependências estão instaladas!")
    return True

def testar_gerador():
    """Testa o gerador musical"""
    print("\n🎵 Testando gerador musical...")
    
    try:
        from gerador_musical import GeradorMusicalIA
        
        gerador = GeradorMusicalIA()
        status = gerador.verificar_disponibilidade()
        
        print("Status do gerador:")
        for key, value in status.items():
            emoji = "✅" if value else "❌"
            print(f"  {emoji} {key}: {value}")
        
        if status["dependencias_instaladas"]:
            print("\n🧪 Testando geração de música...")
            
            # Teste básico
            resultado = gerador.gerar_musica_completa(
                prompt_instrumental="happy upbeat pop song",
                letra="Hello world, this is a test",
                duracao=10  # 10 segundos apenas
            )
            
            if resultado:
                print(f"✅ Teste bem-sucedido! Arquivo: {resultado}")
                return True
            else:
                print("❌ Falha no teste de geração")
                return False
        else:
            print("❌ Dependências não disponíveis")
            return False
            
    except Exception as e:
        print(f"❌ Erro no teste: {e}")
        return False

def testar_curador():
    """Testa o curador musical integrado"""
    print("\n🎯 Testando curador musical...")
    
    try:
        from curador_musical_fixed import CuradorMusical
        
        curador = CuradorMusical()
        
        # Teste básico de análise
        marca = curador.analisar_marca("TesteCorp", "tecnologia")
        print(f"✅ Análise de marca: {marca.nome}")
        
        publico = curador.mapear_publico(marca)
        print(f"✅ Mapeamento de público: {publico.faixa_etaria}")
        
        album = curador.criar_album_conceitual(marca, publico)
        print(f"✅ Álbum criado: {album.titulo} ({len(album.faixas)} faixas)")
        
        # Teste de prompt
        prompt = curador.gerar_prompt_criacao(album.faixas[0], marca, publico)
        print(f"✅ Prompt gerado: {len(prompt)} caracteres")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro no curador: {e}")
        return False

def main():
    """Função principal de teste"""
    print("🎵 TESTE DO SISTEMA MUSICGEN + BARK")
    print("=" * 50)
    
    # Teste 1: Dependências
    deps_ok = testar_dependencias()
    
    # Teste 2: Gerador (só se dependências OK)
    if deps_ok:
        gerador_ok = testar_gerador()
    else:
        gerador_ok = False
    
    # Teste 3: Curador
    curador_ok = testar_curador()
    
    # Resumo
    print("\n" + "=" * 50)
    print("📊 RESUMO DOS TESTES")
    print("=" * 50)
    
    print(f"Dependências: {'✅ OK' if deps_ok else '❌ FALHA'}")
    print(f"Gerador Musical: {'✅ OK' if gerador_ok else '❌ FALHA'}")
    print(f"Curador Musical: {'✅ OK' if curador_ok else '❌ FALHA'}")
    
    if deps_ok and gerador_ok and curador_ok:
        print("\n🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!")
        print("Execute: streamlit run interface_curador.py")
    elif curador_ok:
        print("\n⚠️ Sistema funcionando em modo PROMPT")
        print("Para gerar músicas reais, instale as dependências:")
        print("pip install -r requirements.txt")
    else:
        print("\n❌ Sistema com problemas")
        print("Verifique as dependências e configurações")

if __name__ == "__main__":
    main()