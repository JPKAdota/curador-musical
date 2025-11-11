#!/usr/bin/env python3
"""
Gerador Musical Simplificado
Gera prompts otimizados para APIs externas sem dependências pesadas
"""

import os
import json
import random
from typing import Optional, Dict, List

class GeradorMusicalSimples:
    """Gerador de prompts musicais otimizados para APIs externas"""
    
    def __init__(self):
        self.templates_vocais = {
            "pop": "Clear vocals, catchy melody, modern production",
            "electronic": "Synthesized vocals, auto-tuned, futuristic",
            "indie": "Raw vocals, authentic feel, intimate delivery",
            "corporate": "Professional vocals, clear diction, confident tone"
        }
        
        self.estilos_instrumentais = {
            "energetic": "upbeat, driving rhythm, high energy",
            "calm": "peaceful, ambient, relaxing atmosphere", 
            "uplifting": "inspiring, motivational, positive vibes",
            "professional": "polished, corporate, sophisticated"
        }
    
    def gerar_letra_simples(self, tema: str, marca: str) -> str:
        """Gera letra básica para teste"""
        
        letras = {
            "energetic": f"Moving forward with {marca}, energy flows, innovation grows, the future shows",
            "calm": f"Peaceful moments with {marca}, gentle and true, quality shines through",
            "uplifting": f"Rise up high with {marca}, reaching for the sky, dreams that never die",
            "professional": f"{marca} leading the way, excellence every day, trust that's here to stay"
        }
        
        return letras.get(tema, f"{marca} - quality and trust, innovation is a must")
    
    def gerar_prompt_completo(self, prompt_base: str, com_vocal: bool = False, 
                             estilo_vocal: str = "professional", marca: str = "") -> Dict[str, str]:
        """Gera prompt completo otimizado para diferentes APIs"""
        
        # Prompt base instrumental
        instrumental = prompt_base
        
        # Adicionar vocal se solicitado
        if com_vocal:
            vocal_style = self.templates_vocais.get(estilo_vocal, "clear vocals")
            letra = self.gerar_letra_simples(estilo_vocal, marca)
            
            prompt_com_vocal = f"{instrumental}, {vocal_style}, lyrics: {letra}"
        else:
            prompt_com_vocal = f"{instrumental}, instrumental"
            letra = ""
        
        return {
            "prompt_suno": self._otimizar_para_suno(prompt_com_vocal, letra),
            "prompt_udio": self._otimizar_para_udio(prompt_com_vocal),
            "prompt_elevenlabs": self._otimizar_para_elevenlabs(prompt_com_vocal),
            "letra": letra,
            "instrumental_base": instrumental
        }
    
    def _otimizar_para_suno(self, prompt: str, letra: str) -> str:
        """Otimiza prompt para Suno AI"""
        if letra:
            return f"[Verse]\n{letra}\n\n[Chorus]\n{letra}\n\nStyle: {prompt}"
        return prompt
    
    def _otimizar_para_udio(self, prompt: str) -> str:
        """Otimiza prompt para Udio"""
        return f"{prompt}, high quality, professional production"
    
    def _otimizar_para_elevenlabs(self, prompt: str) -> str:
        """Otimiza prompt para ElevenLabs"""
        return prompt
    
    def salvar_prompts_multiplos(self, titulo: str, prompts: Dict[str, str]) -> str:
        """Salva prompts para múltiplas plataformas"""
        
        filename = f"{titulo.replace(' ', '_').lower()}_prompts.txt"
        filepath = os.path.join("musicas_geradas", filename)
        os.makedirs("musicas_geradas", exist_ok=True)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"PROMPTS PARA: {titulo.upper()}\n")
            f.write("=" * 50 + "\n\n")
            
            f.write("🎵 SUNO AI (suno.com)\n")
            f.write("-" * 30 + "\n")
            f.write(prompts["prompt_suno"] + "\n\n")
            
            f.write("🎵 UDIO (udio.com)\n")
            f.write("-" * 30 + "\n")
            f.write(prompts["prompt_udio"] + "\n\n")
            
            f.write("🎵 ELEVENLABS (elevenlabs.io)\n")
            f.write("-" * 30 + "\n")
            f.write(prompts["prompt_elevenlabs"] + "\n\n")
            
            if prompts["letra"]:
                f.write("🎤 LETRA\n")
                f.write("-" * 30 + "\n")
                f.write(prompts["letra"] + "\n\n")
            
            f.write("📋 INSTRUÇÕES\n")
            f.write("-" * 30 + "\n")
            f.write("1. Copie o prompt da plataforma desejada\n")
            f.write("2. Cole na IA musical escolhida\n")
            f.write("3. Ajuste parâmetros se necessário\n")
            f.write("4. Gere sua música!\n")
        
        return filepath
    
    def gerar_musica_completa(self, prompt_instrumental: str, titulo: str, 
                             com_vocal: bool = False, marca: str = "") -> str:
        """Gera arquivo com prompts para todas as plataformas"""
        
        estilo = "professional" if "corporate" in prompt_instrumental.lower() else "pop"
        
        prompts = self.gerar_prompt_completo(
            prompt_instrumental, 
            com_vocal=com_vocal, 
            estilo_vocal=estilo,
            marca=marca
        )
        
        return self.salvar_prompts_multiplos(titulo, prompts)
    
    def verificar_disponibilidade(self) -> Dict[str, bool]:
        """Verifica disponibilidade do gerador"""
        return {
            "dependencias_instaladas": True,
            "gerador_carregado": True,
            "modo": "prompts_otimizados",
            "plataformas_suportadas": ["Suno AI", "Udio", "ElevenLabs"]
        }

# Função de conveniência
def criar_gerador_simples() -> GeradorMusicalSimples:
    """Cria instância do gerador simples"""
    return GeradorMusicalSimples()

if __name__ == "__main__":
    # Teste básico
    gerador = criar_gerador_simples()
    
    resultado = gerador.gerar_musica_completa(
        prompt_instrumental="upbeat corporate pop song with guitar and piano",
        titulo="Teste Corporativo",
        com_vocal=True,
        marca="TesteCorp"
    )
    
    print(f"Prompts gerados: {resultado}")