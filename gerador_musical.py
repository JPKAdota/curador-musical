#!/usr/bin/env python3
"""
Gerador Musical usando MusicGen + Bark
Combina geração instrumental (MusicGen) com vocais (Bark)
"""

import os
import torch
import numpy as np
from typing import Optional, Tuple
import warnings
warnings.filterwarnings("ignore")

try:
    from audiocraft.models import MusicGen
    from bark import SAMPLE_RATE, generate_audio, preload_models
    from pydub import AudioSegment
    import scipy.io.wavfile as wavfile
    DEPS_AVAILABLE = True
except ImportError as e:
    print(f"Dependências não instaladas: {e}")
    DEPS_AVAILABLE = False

class GeradorMusicalIA:
    """Gerador musical usando MusicGen (instrumental) + Bark (vocal)"""
    
    def __init__(self):
        self.musicgen_model = None
        self.bark_loaded = False
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        if DEPS_AVAILABLE:
            self._inicializar_modelos()
    
    def _inicializar_modelos(self):
        """Inicializa os modelos MusicGen e Bark"""
        try:
            print("Carregando MusicGen...")
            self.musicgen_model = MusicGen.get_pretrained('facebook/musicgen-small')
            self.musicgen_model.set_generation_params(duration=30)
            
            print("Carregando Bark...")
            preload_models()
            self.bark_loaded = True
            
            print("Modelos carregados com sucesso!")
            
        except Exception as e:
            print(f"Erro ao carregar modelos: {e}")
    
    def gerar_instrumental(self, prompt: str, duracao: int = 30) -> Optional[str]:
        """Gera música instrumental usando MusicGen"""
        
        if not self.musicgen_model:
            print("MusicGen não disponível")
            return None
        
        try:
            print(f"Gerando instrumental: {prompt[:50]}...")
            
            self.musicgen_model.set_generation_params(duration=duracao)
            wav = self.musicgen_model.generate([prompt])
            
            # Salvar arquivo
            filename = f"instrumental_{hash(prompt) % 10000}.wav"
            filepath = os.path.join("musicas_geradas", filename)
            os.makedirs("musicas_geradas", exist_ok=True)
            
            # Converter tensor para numpy e salvar
            audio_data = wav[0].cpu().numpy()
            wavfile.write(filepath, self.musicgen_model.sample_rate, audio_data.T)
            
            print(f"Instrumental gerado: {filepath}")
            return filepath
            
        except Exception as e:
            print(f"Erro ao gerar instrumental: {e}")
            return None
    
    def gerar_vocal(self, letra: str, estilo: str = "neutral") -> Optional[str]:
        """Gera vocal usando Bark"""
        
        if not self.bark_loaded:
            print("Bark não disponível")
            return None
        
        try:
            print(f"Gerando vocal: {letra[:30]}...")
            
            # Formatar texto para Bark (com indicadores musicais)
            texto_musical = f"♪ {letra} ♪"
            
            # Adicionar estilo se especificado
            if estilo != "neutral":
                texto_musical = f"[{estilo}] {texto_musical}"
            
            # Gerar áudio
            audio_array = generate_audio(texto_musical)
            
            # Salvar arquivo
            filename = f"vocal_{hash(letra) % 10000}.wav"
            filepath = os.path.join("musicas_geradas", filename)
            
            wavfile.write(filepath, SAMPLE_RATE, audio_array)
            
            print(f"Vocal gerado: {filepath}")
            return filepath
            
        except Exception as e:
            print(f"Erro ao gerar vocal: {e}")
            return None
    
    def mixar_audios(self, instrumental_path: str, vocal_path: str, 
                     volume_instrumental: float = 0.7, volume_vocal: float = 1.0) -> Optional[str]:
        """Mixa instrumental e vocal"""
        
        try:
            print("Mixando áudios...")
            
            # Carregar áudios
            instrumental = AudioSegment.from_wav(instrumental_path)
            vocal = AudioSegment.from_wav(vocal_path)
            
            # Ajustar volumes
            instrumental = instrumental + (20 * np.log10(volume_instrumental))
            vocal = vocal + (20 * np.log10(volume_vocal))
            
            # Ajustar durações (repetir vocal se necessário)
            if len(vocal) < len(instrumental):
                repeticoes = (len(instrumental) // len(vocal)) + 1
                vocal = vocal * repeticoes
            
            vocal = vocal[:len(instrumental)]
            
            # Mixar
            mix_final = instrumental.overlay(vocal)
            
            # Salvar
            filename = f"mix_{hash(instrumental_path + vocal_path) % 10000}.mp3"
            filepath = os.path.join("musicas_geradas", filename)
            
            mix_final.export(filepath, format="mp3")
            
            print(f"Mix finalizado: {filepath}")
            return filepath
            
        except Exception as e:
            print(f"Erro ao mixar: {e}")
            return None
    
    def gerar_musica_completa(self, prompt_instrumental: str, letra: str = None, 
                             duracao: int = 30, estilo_vocal: str = "neutral") -> Optional[str]:
        """Gera música completa (instrumental + vocal se letra fornecida)"""
        
        if not DEPS_AVAILABLE:
            print("Dependências não instaladas. Execute: pip install -r requirements.txt")
            return None
        
        # Gerar instrumental
        instrumental_path = self.gerar_instrumental(prompt_instrumental, duracao)
        if not instrumental_path:
            return None
        
        # Se não tem letra, retorna só o instrumental
        if not letra:
            return instrumental_path
        
        # Gerar vocal
        vocal_path = self.gerar_vocal(letra, estilo_vocal)
        if not vocal_path:
            return instrumental_path
        
        # Mixar
        mix_path = self.mixar_audios(instrumental_path, vocal_path)
        return mix_path if mix_path else instrumental_path
    
    def gerar_letra_automatica(self, tema: str, marca: str) -> str:
        """Gera letra simples baseada no tema (fallback)"""
        
        letras_base = {
            "energetic": f"Feel the energy, {marca} brings the light, Moving forward, everything's alright",
            "calm": f"Peaceful moments, {marca} by your side, Gentle whispers, let your worries slide",
            "uplifting": f"Rise up high, {marca} shows the way, Brighter tomorrow starts today",
            "corporate": f"{marca} leading, innovation strong, Building futures where we all belong"
        }
        
        return letras_base.get(tema, f"{marca} music, feel the sound, Quality and trust all around")
    
    def verificar_disponibilidade(self) -> dict:
        """Verifica quais componentes estão disponíveis"""
        
        return {
            "dependencias_instaladas": DEPS_AVAILABLE,
            "musicgen_carregado": self.musicgen_model is not None,
            "bark_carregado": self.bark_loaded,
            "device": self.device,
            "cuda_disponivel": torch.cuda.is_available()
        }

# Função de conveniência
def criar_gerador() -> GeradorMusicalIA:
    """Cria e retorna uma instância do gerador musical"""
    return GeradorMusicalIA()

if __name__ == "__main__":
    # Teste básico
    gerador = criar_gerador()
    status = gerador.verificar_disponibilidade()
    
    print("Status do Gerador Musical:")
    for key, value in status.items():
        print(f"  {key}: {value}")
    
    if status["dependencias_instaladas"]:
        print("\nTestando geração...")
        resultado = gerador.gerar_musica_completa(
            prompt_instrumental="upbeat pop song with guitar",
            letra="Hello world, this is a test song",
            duracao=15
        )
        
        if resultado:
            print(f"Música gerada: {resultado}")
        else:
            print("Falha na geração")