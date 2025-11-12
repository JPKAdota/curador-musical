import torch
import torchaudio
from transformers import AutoProcessor, MusicgenForConditionalGeneration
import numpy as np
import os
from typing import Optional

class GeradorMusicGen:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.processor = None
        self.sample_rate = 32000
        
    def _carregar_modelo(self):
        """Carrega o modelo MusicGen"""
        if self.model is None:
            try:
                print("Carregando MusicGen...")
                self.processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
                self.model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")
                self.model = self.model.to(self.device)
                print(f"MusicGen carregado no {self.device}")
            except Exception as e:
                print(f"Erro ao carregar MusicGen: {e}")
                return False
        return True
    
    def gerar_musica(self, prompt: str, titulo: str, duracao: int = 30) -> Optional[str]:
        """Gera música usando MusicGen"""
        if not self._carregar_modelo():
            return None
            
        try:
            print(f"Gerando música '{titulo}' com MusicGen...")
            
            # Preparar prompt
            inputs = self.processor(
                text=[prompt],
                padding=True,
                return_tensors="pt",
            ).to(self.device)
            
            # Gerar áudio (máximo 30 segundos)
            max_length = min(duracao * self.sample_rate // self.model.config.audio_encoder.hop_length, 1503)
            
            with torch.no_grad():
                audio_values = self.model.generate(
                    **inputs,
                    max_new_tokens=max_length,
                    do_sample=True,
                    guidance_scale=3.0
                )
            
            # Converter para numpy
            audio_np = audio_values[0, 0].cpu().numpy()
            
            # Salvar arquivo
            filename = f"{titulo.replace(' ', '_').lower()}_musicgen.wav"
            filepath = os.path.join("musicas_geradas", filename)
            os.makedirs("musicas_geradas", exist_ok=True)
            
            # Salvar usando torchaudio
            torchaudio.save(
                filepath,
                torch.tensor(audio_np).unsqueeze(0),
                self.sample_rate
            )
            
            print(f"Música gerada com MusicGen: {filepath}")
            return filepath
            
        except Exception as e:
            print(f"Erro no MusicGen: {e}")
            return None