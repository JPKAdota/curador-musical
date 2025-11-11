# 🎵 Curador Musical IA

Sistema inteligente para criação de identidade sonora e álbuns conceituais para marcas usando IA.

## 🚀 Funcionalidades

- **Análise Automática de Marca**: IA analisa a marca e cria perfil musical único
- **Mapeamento de Público**: Identifica público-alvo e preferências musicais
- **Álbum Conceitual**: Gera álbum completo com 5 faixas temáticas
- **Prompts Inteligentes**: Cria prompts detalhados para geração musical
- **Geração de Música**: Integração com ElevenLabs Music API
- **Interface Web**: Interface amigável com Streamlit

## 📋 Pré-requisitos

- Python 3.8+
- Conta Google (para Gemini API)
- Conta ElevenLabs (para Music API)

## ⚡ Instalação Rápida

1. **Clone/baixe o projeto**
2. **Execute o setup automático**:
   ```bash
   python setup.py
   ```

3. **Configure as API keys no arquivo `.env`**:
   ```env
   GEMINI_API_KEY=sua_chave_gemini_aqui
   ELEVENLABS_API_KEY=sua_chave_elevenlabs_aqui
   ```

4. **Execute a aplicação**:
   ```bash
   streamlit run interface_curador.py
   ```

## 🔑 Configuração das APIs

### Google Gemini API
1. Acesse: https://makersuite.google.com/app/apikey
2. Crie uma nova API key
3. Cole no arquivo `.env`

### ElevenLabs Music API
1. Acesse: https://elevenlabs.io/app/settings/api-keys
2. Crie uma nova API key
3. Cole no arquivo `.env`

**⚠️ Importante**: A ElevenLabs Music API é paga. Verifique os preços em: https://elevenlabs.io/pricing

## 🎯 Como Usar

1. **Abra a aplicação** no navegador (http://localhost:8501)
2. **Insira o nome da marca** e selecione o setor
3. **Clique em "Gerar Curadoria"** para análise completa
4. **Revise os resultados**:
   - Identidade sonora da marca
   - Perfil do público-alvo
   - Álbum conceitual com 5 faixas
5. **Gere as músicas** clicando em "Gerar Músicas"
6. **Baixe os resultados** em JSON ou TXT

## 📁 Estrutura do Projeto

```
AI Musica/
├── curador_musical_fixed.py    # Lógica principal
├── interface_curador.py        # Interface Streamlit
├── setup.py                   # Script de configuração
├── requirements.txt           # Dependências
├── .env                      # Variáveis de ambiente
├── .env.example             # Exemplo de configuração
└── musicas_geradas/         # Músicas e prompts gerados
```

## 🎼 Exemplo de Uso

### Entrada:
- **Marca**: Natura
- **Setor**: Cosméticos

### Saída:
- **Identidade Sonora**: Sustentável, natural, brasileira
- **Público**: 25-40 anos, classe A/B, consciente
- **Álbum**: "Essência by Natura" com 5 faixas
- **Músicas**: Arquivos MP3 gerados pela IA

## 🔧 Solução de Problemas

### Erro: "API key não configurada"
- Verifique se o arquivo `.env` existe
- Confirme se as chaves estão corretas

### Erro: "Biblioteca elevenlabs não instalada"
- Execute: `pip install elevenlabs`

### Erro: "bad_prompt" (ElevenLabs)
- O prompt contém material protegido por direitos autorais
- A IA tentará automaticamente uma versão alternativa

### Erro: "rate_limit"
- Você atingiu o limite de requisições
- Aguarde alguns minutos ou upgrade sua conta

## 💡 Dicas de Uso

1. **Seja específico** com o nome da marca para melhor análise
2. **Use o feedback** para melhorar prompts específicos
3. **Teste diferentes setores** para ver variações criativas
4. **Salve os JSONs** para reutilizar configurações

## 🆘 Suporte

Para problemas técnicos:
1. Verifique se todas as dependências estão instaladas
2. Confirme se as API keys estão válidas
3. Consulte os logs de erro na interface

## 📄 Licença

Este projeto é para uso educacional e demonstração de integração com APIs de IA.

---

**Desenvolvido com ❤️ usando Python, Streamlit, Google Gemini e ElevenLabs**