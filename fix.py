import os
css=open('css/style.css').read()
js=open('js/app.js').read()
print('css:',len(css),'js:',len(js))

import urllib.request as u

# Lê css e js locais
css = open('css/style.css').read()
js  = open('js/app.js').read()

# HTML estrutural base
html_base = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0d0d1a" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="KaraokeLive" />
  <link rel="manifest" href="manifest.json" />
  <title>KaraokeLive - Fila Inteligente</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Boogaloo&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
  <style>
CSS_PLACEHOLDER
  </style>
</head>
<body>

  <nav class="demo-nav" id="navBar">
    <button class="nav-btn active" onclick="showScreen('host')"><i class="ti ti-device-tv"></i> Organizador</button>
    <button class="nav-btn" onclick="showScreen('join')"><i class="ti ti-qrcode"></i> Participante (Entrada)</button>
    <button class="nav-btn" onclick="showScreen('queue')"><i class="ti ti-list-numbers"></i> Participante (Fila)</button>
  </nav>

  <div class="screen host-screen active" id="screen-host">
    <div class="logo">&#127908; Karaoke<span>Live</span></div>
    <div id="setup-section" class="host-card">
      <h2><i class="ti ti-confetti"></i> Nova Festa</h2>
      <div class="input-group">
        <label>Nome da Festa</label>
        <input type="text" id="partyName" placeholder="Ex: Aniversario da Ana" value="Aniversario da Ana" />
      </div>
      <div class="input-group">
        <label>Local / Endereco (opcional)</label>
        <input type="text" id="partyPlace" placeholder="Ex: Salao do Clube" value="Salao do Clube" />
      </div>
      <button class="btn-primary" onclick="generateParty()"><i class="ti ti-qrcode"></i> Gerar QR Code da Festa</button>
    </div>
    <div id="qr-section" class="qr-wrapper" style="display:none;">
      <h3><i class="ti ti-qrcode"></i> QR Code da Festa</h3>
      <canvas id="qrCanvas" width="200" height="200"></canvas>
      <div class="party-code" id="partyCodeDisplay">----</div>
      <div class="party-link" id="partyLinkDisplay"></div>
      <div class="btn-row">
        <button class="btn-secondary" onclick="copyLink()"><i class="ti ti-copy"></i> Copiar link</button>
        <button class="btn-secondary" onclick="simJoin()"><i class="ti ti-user-plus"></i> Simular entrada</button>
        <button class="btn-secondary" onclick="advanceQueue()"><i class="ti ti-player-skip-forward"></i> Proximo</button>
        <button class="btn-secondary btn-danger" onclick="resetParty()"><i class="ti ti-refresh"></i> Nova festa</button>
      </div>
    </div>
    <div id="monitor-section" class="live-monitor" style="display:none;">
      <h2>
        <span>Fila ao vivo</span>
        <span><span class="pulse-dot"></span> <span id="queueCount">0</span> na fila</span>
      </h2>
      <div class="legend">
        <div class="legend-item"><span class="color-dot teal"></span> Cantando</div>
        <div class="legend-item"><span class="color-dot yellow"></span> Proximo</div>
        <div class="legend-item"><span class="color-dot gray"></span> Aguardando</div>
      </div>
      <div class="queue-mini" id="hostQueueList">
        <div class="empty-queue"><i class="ti ti-music-off"></i><br>Nenhum participante ainda.<br>Compartilhe o QR Code!</div>
      </div>
    </div>
  </div>

  <div class="screen join-screen" id="screen-join">
    <div class="join-card">
      <div class="mic-icon">&#127908;</div>
      <div class="join-title">Hora de cantar!</div>
      <div class="join-party-name" id="joinPartyLabel">Festa: Aniversario da Ana</div>
      <div class="divider"></div>
      <div class="join-form">
        <div class="input-group">
          <label>Seu nome</label>
          <input type="text" id="participantName" placeholder="Como te chamamos?" />
        </div>
        <div class="input-group">
          <label>Musica escolhida</label>
          <input type="text" id="participantSong" placeholder="Nome da musica e artista" />
        </div>
        <button class="btn-primary" onclick="joinQueue()"><i class="ti ti-arrow-right"></i> Entrar na fila</button>
      </div>
      <p class="join-hint">Voce podera acompanhar sua posicao em tempo real apos entrar.</p>
    </div>
  </div>

  <div class="screen queue-screen" id="screen-queue">
    <div class="queue-header">
      <div class="logo">&#127908; KaraokeLive</div>
      <div class="party-badge" id="queuePartyBadge">Festa</div>
    </div>
    <div class="my-turn-banner" id="myTurnBanner">&#127908; E A SUA VEZ! Vai la!</div>
    <div class="next-banner" id="nextBanner">Voce e o proximo! Prepare-se!</div>
    <div class="queue-list" id="mainQueueList"></div>
    <div class="bottom-bar">
      <div class="my-position-info">
        <span class="my-pos-label">Sua posicao</span>
        <span class="my-pos-num" id="myPosDisplay">#-</span>
      </div>
      <div class="bottom-details">
        <div class="bottom-name" id="bottomName">-</div>
        <div class="wait-time" id="waitTimeDisplay">Aguardando...</div>
      </div>
      <button class="btn-secondary" onclick="showScreen('host')"><i class="ti ti-home"></i></button>
    </div>
  </div>

  <script>
JS_PLACEHOLDER
  </script>
  <script>
    if('serviceWorker' in navigator){
      window.addEventListener('load', function(){
        navigator.serviceWorker.register('sw.js');
      });
    }
  </script>
</body>
</html>"""

result = html_base.replace('CSS_PLACEHOLDER', css).replace('JS_PLACEHOLDER', js)
open('index.html', 'w').write(result)
print('OK! index.html gerado com', len(result), 'chars')