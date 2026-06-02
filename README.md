# 🎤 KaraokêLive — Fila Inteligente

Sistema de fila para karaokê com QR Code. O organizador gera um código da festa e os participantes entram pela câmera do celular, escolhem nome e música, e acompanham a posição em tempo real.

## Funcionalidades

- **Organizador** — cria a festa, gera QR Code e monitora a fila ao vivo
- **Participante (Entrada)** — acessa via QR Code, digita nome e música
- **Participante (Fila)** — vê a fila completa com sua posição em destaque, banners de aviso quando é a sua vez

## Estrutura do projeto

```
karaoke-live/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

## Como rodar localmente

Basta abrir o `index.html` no navegador. Não precisa de servidor.

```bash
# Opção 1: abrir direto
open index.html

# Opção 2: servidor local simples (Python)
python3 -m http.server 8080
# depois acesse: http://localhost:8080
```

## Deploy no GitHub Pages

Veja as instruções completas no arquivo [DEPLOY.md](DEPLOY.md).

## Tecnologias

- HTML5, CSS3 puro, JavaScript vanilla
- Fontes: [Boogaloo](https://fonts.google.com/specimen/Boogaloo) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts
- Ícones: [Tabler Icons](https://tabler.io/icons) via jsDelivr CDN
- QR Code: desenhado no canvas com algoritmo próprio (sem dependências externas)

---

> Para versão com backend em tempo real (múltiplos dispositivos simultâneos), integre com Firebase Realtime Database ou Supabase.
