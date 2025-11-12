import numpy as np
import wave
import os
from typing import Optional

class GeradorAudioSimples:
    def __init__(self):
        self.sample_rate = 44100
        
    def gerar_musica_completa(self, prompt: str, titulo: str, duracao: int = 30) -> Optional[str]:
        """Gera música sintética baseada no prompt"""
        try:
            # Analisar prompt para determinar características
            genero = self._extrair_genero(prompt)
            clima = self._extrair_clima(prompt)
            
            # Gerar áudio baseado nas características
            audio = self._gerar_audio_por_genero(genero, clima, duracao)
            
            # Salvar arquivo
            filename = f"{titulo.replace(' ', '_').lower()}.wav"
            filepath = os.path.join("musicas_geradas", filename)
            os.makedirs("musicas_geradas", exist_ok=True)
            
            with wave.open(filepath, 'w') as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(self.sample_rate)
                wav_file.writeframes(audio.tobytes())
            
            return filepath
            
        except Exception as e:
            print(f"Erro no gerador: {e}")
            return None
    
    def _extrair_genero(self, prompt: str) -> str:
        """Extrai gênero do prompt"""
        prompt_lower = prompt.lower()
        if "eletrônico" in prompt_lower or "electronic" in prompt_lower:
            return "eletronico"
        elif "pop" in prompt_lower:
            return "pop"
        elif "indie" in prompt_lower:
            return "indie"
        else:
            return "geral"
    
    def _extrair_clima(self, prompt: str) -> str:
        """Extrai clima do prompt"""
        prompt_lower = prompt.lower()
        if "inspirador" in prompt_lower or "energético" in prompt_lower:
            return "energetico"
        elif "reflexivo" in prompt_lower or "contemplativo" in prompt_lower:
            return "calmo"
        elif "emotivo" in prompt_lower:
            return "emotivo"
        else:
            return "neutro"
    
    def _gerar_audio_por_genero(self, genero: str, clima: str, duracao: int) -> np.ndarray:
        """Gera áudio baseado no gênero e clima"""
        t = np.linspace(0, duracao, int(self.sample_rate * duracao))
        
        # Frequências base por gênero
        freq_map = {
            "eletronico": [440, 554, 659],  # A4, C#5, E5
            "pop": [523, 659, 784],         # C5, E5, G5
            "indie": [392, 494, 587],       # G4, B4, D5
            "geral": [440, 523, 659]        # A4, C5, E5
        }
        
        freqs = freq_map.get(genero, freq_map["geral"])
        
        # Gerar ondas
        audio = np.zeros_like(t)
        
        for i, freq in enumerate(freqs):
            amplitude = 0.3 / (i + 1)  # Diminui amplitude para harmônicos
            audio += amplitude * np.sin(2 * np.pi * freq * t)
        
        # Aplicar modulações baseadas no clima
        if clima == "energetico":
            # Adicionar batida
            beat_freq = 2  # 2 Hz
            beat = 0.5 + 0.5 * np.sin(2 * np.pi * beat_freq * t)
            audio *= beat
        elif clima == "calmo":
            # Adicionar reverb simulado
            delay_samples = int(0.1 * self.sample_rate)
            delayed = np.zeros_like(audio)
            delayed[delay_samples:] = audio[:-delay_samples] * 0.3
            audio += delayed
        
        # Envelope (fade in/out)
        envelope = np.ones_like(t)
        fade_samples = int(0.5 * self.sample_rate)
        envelope[:fade_samples] = np.linspace(0, 1, fade_samples)
        envelope[-fade_samples:] = np.linspace(1, 0, fade_samples)
        
        audio *= envelope
        
        # Normalizar
        audio = np.int16(audio * 16383)  # Reduzir volume para evitar clipping
        
        return audio