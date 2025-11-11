#!/usr/bin/env python3
"""
Setup script para o Curador Musical IA
"""

import os
import subprocess
import sys

def install_requirements():
    """Instala as dependências necessárias"""
    print("Instalando dependencias...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("Dependencias instaladas com sucesso!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Erro ao instalar dependencias: {e}")
        return False

def setup_env_file():
    """Configura o arquivo .env"""
    if not os.path.exists('.env'):
        print("Configurando arquivo .env...")
        
        # Copiar do exemplo
        if os.path.exists('.env.example'):
            with open('.env.example', 'r') as f:
                content = f.read()
            
            with open('.env', 'w') as f:
                f.write(content)
            
            print("Arquivo .env criado!")
            print("IMPORTANTE: Configure suas API keys no arquivo .env")
            print("   - GEMINI_API_KEY: https://makersuite.google.com/app/apikey")
            print("   - ELEVENLABS_API_KEY: https://elevenlabs.io/app/settings/api-keys")
        else:
            print("Arquivo .env.example nao encontrado")
            return False
    else:
        print("Arquivo .env ja existe")
    
    return True

def create_directories():
    """Cria diretórios necessários"""
    print("Criando diretorios...")
    
    directories = ['musicas_geradas']
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Diretorio '{directory}' criado")
        else:
            print(f"Diretorio '{directory}' ja existe")
    
    return True

def test_apis():
    """Testa as APIs configuradas"""
    print("Testando configuracao das APIs...")
    
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        gemini_key = os.getenv('GEMINI_API_KEY')
        elevenlabs_key = os.getenv('ELEVENLABS_API_KEY')
        
        if gemini_key and gemini_key != 'sua_chave_gemini_aqui':
            print("API Key Gemini configurada")
        else:
            print("API Key Gemini nao configurada")
        
        if elevenlabs_key and elevenlabs_key != '4d3ee3668207b03ab82c46e171a0f1081470d988e67d5e8993925323724991cf':
            print("API Key ElevenLabs configurada")
        else:
            print("Usando API Key ElevenLabs padrao (pode ter limitacoes)")
        
        return True
        
    except ImportError as e:
        print(f"Erro ao importar dependencias: {e}")
        return False

def main():
    """Função principal do setup"""
    print("Configurando Curador Musical IA")
    print("=" * 40)
    
    steps = [
        ("Instalando dependências", install_requirements),
        ("Configurando ambiente", setup_env_file),
        ("Criando diretórios", create_directories),
        ("Testando APIs", test_apis)
    ]
    
    for step_name, step_func in steps:
        print(f"\n{step_name}...")
        if not step_func():
            print(f"Falha em: {step_name}")
            return False
    
    print("\n" + "=" * 40)
    print("Setup concluido com sucesso!")
    print("\nProximos passos:")
    print("1. Configure suas API keys no arquivo .env")
    print("2. Execute: streamlit run interface_curador.py")
    print("3. Acesse http://localhost:8501 no seu navegador")
    
    return True

if __name__ == "__main__":
    main()