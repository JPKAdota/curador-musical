import numpy as np
import wave
import os

def testar_geracao_audio():
    try:
        # Parâmetros do áudio
        sample_rate = 44100
        duration = 5  # 5 segundos
        
        # Gerar tons
        t = np.linspace(0, duration, int(sample_rate * duration))
        freq1, freq2 = 440, 554  # A4 e C#5
        
        # Gerar ondas senoidais
        wave1 = 0.3 * np.sin(2 * np.pi * freq1 * t)
        wave2 = 0.2 * np.sin(2 * np.pi * freq2 * t)
        
        # Adicionar envelope
        envelope = np.ones_like(t)
        fade_samples = int(0.1 * sample_rate)
        envelope[:fade_samples] = np.linspace(0, 1, fade_samples)
        envelope[-fade_samples:] = np.linspace(1, 0, fade_samples)
        
        # Combinar ondas
        audio = (wave1 + wave2) * envelope
        audio = np.int16(audio * 32767)
        
        # Salvar como WAV
        os.makedirs("musicas_geradas", exist_ok=True)
        filepath = "musicas_geradas/teste_audio.wav"
        
        with wave.open(filepath, 'w') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(audio.tobytes())
        
        print(f"Audio de teste gerado: {filepath}")
        return True
        
    except Exception as e:
        print(f"Erro: {e}")
        return False

if __name__ == "__main__":
    testar_geracao_audio()