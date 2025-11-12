import subprocess
import sys
import os

def instalar_musicgen():
    """Instala dependências do MusicGen"""
    
    print("=== INSTALAÇÃO DO MUSICGEN ===")
    print("Instalando dependências para geração real de música...")
    
    # Lista de pacotes necessários
    pacotes = [
        "torch",
        "torchaudio", 
        "transformers",
        "accelerate",
        "scipy",
        "librosa"
    ]
    
    for pacote in pacotes:
        try:
            print(f"\nInstalando {pacote}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pacote])
            print(f"✓ {pacote} instalado com sucesso")
        except subprocess.CalledProcessError as e:
            print(f"✗ Erro ao instalar {pacote}: {e}")
            return False
    
    print("\n=== TESTANDO MUSICGEN ===")
    
    # Testar importação
    try:
        import torch
        import transformers
        print(f"✓ PyTorch: {torch.__version__}")
        print(f"✓ Transformers: {transformers.__version__}")
        
        # Testar MusicGen
        from transformers import AutoProcessor, MusicgenForConditionalGeneration
        print("✓ MusicGen importado com sucesso")
        
        # Verificar dispositivo
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"✓ Dispositivo: {device}")
        
        if device == "cuda":
            print(f"✓ GPU detectada: {torch.cuda.get_device_name()}")
        else:
            print("⚠ Usando CPU (mais lento)")
        
        print("\n🎵 MusicGen instalado e pronto para uso!")
        return True
        
    except ImportError as e:
        print(f"✗ Erro na importação: {e}")
        return False

if __name__ == "__main__":
    if instalar_musicgen():
        print("\n🚀 Execute novamente a aplicação para usar MusicGen!")
    else:
        print("\n❌ Falha na instalação. Verifique os erros acima.")