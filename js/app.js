/* ===== KaraokêLive — app.js ===== */

/* ─── Constantes ─── */

const COLORS = [
  '#ff3c6e', '#ffb800', '#00e5c4', '#a78bfa',
  '#fb923c', '#34d399', '#60a5fa', '#f472b6',
];

/* ─── Estado global ─── */

const state = {
  partyName:      '',
  partyCode:      '',
  queue:          [],
  currentSinging: 0,
  myIndex:        -1,
  myName:         '',
  mySong:         '',
  demoCount:      0,
  qrGenerated:    false,
};

/* ─── Autenticação ─── */
/* USERS é carregado pelo js/users.js, antes deste arquivo */

let loggedUser = null;

function checkAuth() {
  const saved = sessionStorage.getItem('kl_auth');
  if (saved) {
    const found = USERS.find(u => u.user === saved);
    if (found) { loggedUser = found; return true; }
  }
  return false;
}

function doLogin() {
  const user  = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPass').value;
  const err   = document.getElementById('loginError');
  const found = USERS.find(u => u.user === user && u.pass === pass);

  if (found) {
    loggedUser = found;
    sessionStorage.setItem('kl_auth', found.user);
    err.classList.remove('show');
    showScreen('host');
  } else {
    err.textContent = 'Usuário ou senha incorretos.';
    err.classList.add('show');
  }
}

function doLogout() {
  loggedUser = null;
  sessionStorage.removeItem('kl_auth');
  showScreen('login');
}

function togglePassword() {
  const input = document.getElementById('loginPass');
  const icon  = document.getElementById('toggleIcon');
  const isPass = input.type === 'password';
  input.type   = isPass ? 'text' : 'password';
  icon.className = isPass ? 'ti ti-eye-off' : 'ti ti-eye';
}

/* ─── Navegação ─── */

function showScreen(s) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById('screen-' + s).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    btn.classList.toggle('active', ['host', 'join', 'queue'][i] === s);
  });
  if (s === 'queue') renderQueue();
}

/* ─── Host: criar festa ─── */

function generateParty() {
  const name = document.getElementById('partyName').value.trim() || 'Minha Festa';

  Object.assign(state, {
    partyName:      name,
    partyCode:      Math.random().toString(36).substring(2, 7).toUpperCase(),
    queue:          [],
    currentSinging: 0,
    demoCount:      0,
    myIndex:        -1,
    qrGenerated:    true,
  });

  document.getElementById('setup-section').style.display   = 'none';
  document.getElementById('qr-section').style.display      = 'flex';
  document.getElementById('monitor-section').style.display = 'block';
  document.getElementById('partyCodeDisplay').textContent  = state.partyCode;
  document.getElementById('joinPartyLabel').textContent    = 'Festa: ' + name;
  document.getElementById('queuePartyBadge').textContent   = name;

  const link = 'karaokelive.app/festa/' + state.partyCode;
  document.getElementById('partyLinkDisplay').textContent = link;

  drawQR(link);
  updateHostMonitor();
}

function resetParty() {
  Object.assign(state, {
    partyName: '', partyCode: '', queue: [], currentSinging: 0,
    myIndex: -1, myName: '', mySong: '', demoCount: 0, qrGenerated: false,
  });
  document.getElementById('setup-section').style.display   = '';
  document.getElementById('qr-section').style.display      = 'none';
  document.getElementById('monitor-section').style.display = 'none';
}

/* ─── Host: ações de demo ─── */

const SONGS_DEMO = [
  ['Carlos',   'Evidências — Chitãozinho & Xororó'],
  ['Juliana',  'Bohemian Rhapsody — Queen'],
  ['Roberto',  'Ai Se Eu Te Pego — Michel Teló'],
  ['Fernanda', 'Shallow — Lady Gaga'],
  ['Marcos',   'Garota de Ipanema — Tom Jobim'],
  ['Larissa',  'Rolling in the Deep — Adele'],
  ['Paulo',    'Você Não Vale Nada — Gusttavo Lima'],
  ['Taís',     'My Way — Frank Sinatra'],
];

function simJoin() {
  if (!state.qrGenerated) { generateParty(); return; }
  if (state.demoCount >= SONGS_DEMO.length) return;
  const [name, song] = SONGS_DEMO[state.demoCount++];
  addToQueue(name, song);
}

function advanceQueue() {
  if (state.queue.length === 0) return;
  state.currentSinging = Math.min(state.currentSinging + 1, state.queue.length);
  updateHostMonitor();
  if (document.getElementById('screen-queue').classList.contains('active')) renderQueue();
}

function copyLink() {
  const link = 'https://' + document.getElementById('partyLinkDisplay').textContent;
  navigator.clipboard.writeText(link).catch(() => {});
  const btn  = document.querySelector('[onclick="copyLink()"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="ti ti-check"></i> Copiado!';
  setTimeout(() => { btn.innerHTML = orig; }, 2000);
}

/* ─── Fila: helpers ─── */

function addToQueue(name, song) {
  state.queue.push({
    name,
    song,
    color: COLORS[state.queue.length % COLORS.length],
    id:    Date.now() + Math.random(),
  });
  updateHostMonitor();
}

function updateHostMonitor() {
  const list  = document.getElementById('hostQueueList');
  const count = document.getElementById('queueCount');
  count.textContent = state.queue.length;

  if (state.queue.length === 0) {
    list.innerHTML = '<div class="empty-queue"><i class="ti ti-music-off"></i><br>Nenhum participante ainda.<br>Compartilhe o QR Code!</div>';
    return;
  }

  list.innerHTML = state.queue.map((p, i) => {
    const singing = i === state.currentSinging - 1;
    const next    = i === state.currentSinging;
    const cls     = singing ? 'singing' : next ? 'next' : '';
    const tag     = singing
      ? '<span class="status-tag singing">🎤 Cantando</span>'
      : next ? '<span class="status-tag next">⚡ Próximo</span>' : '';

    return `<div class="queue-item-mini ${cls}">
      <span class="pos-badge ${cls}">${i + 1}</span>
      <div class="item-info">
        <div class="item-name">${p.name}</div>
        <div class="item-song">${p.song}</div>
      </div>
      ${tag}
    </div>`;
  }).join('');
}

/* ─── Participante: entrar na fila ─── */

function joinQueue() {
  const nameEl = document.getElementById('participantName');
  const songEl = document.getElementById('participantSong');
  const name   = nameEl.value.trim();
  const song   = songEl.value.trim();

  nameEl.style.borderColor = name ? '' : 'var(--accent)';
  songEl.style.borderColor = song ? '' : 'var(--accent)';
  if (!name || !song) return;

  if (!state.qrGenerated) {
    state.partyName   = 'Aniversário da Ana 🎉';
    state.partyCode   = 'ANI25';
    state.qrGenerated = true;
    document.getElementById('queuePartyBadge').textContent = state.partyName;

    if (state.queue.length === 0) {
      ['Carlos', 'Juliana', 'Roberto'].forEach((n, i) => addToQueue(n, SONGS_DEMO[i][1]));
      state.currentSinging = 1;
    }
  }

  state.myName = name;
  state.mySong = song;
  addToQueue(name, song);
  state.myIndex = state.queue.length - 1;

  showScreen('queue');
  renderQueue();
}

/* ─── Participante: renderizar fila ─── */

function renderQueue() {
  const list            = document.getElementById('mainQueueList');
  const myPosDisplay    = document.getElementById('myPosDisplay');
  const bottomName      = document.getElementById('bottomName');
  const waitTimeDisplay = document.getElementById('waitTimeDisplay');
  const myTurnBanner    = document.getElementById('myTurnBanner');
  const nextBanner      = document.getElementById('nextBanner');

  const q   = state.queue;
  const cur = state.currentSinging;
  const mi  = state.myIndex;

  if (q.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:48px 0;color:var(--muted)"><i class="ti ti-music-off" style="font-size:40px"></i><br><br>Fila vazia</div>';
    return;
  }

  const isSinging = mi === cur - 1;
  const isNext    = mi === cur;
  const myPos     = mi - cur + 1;

  myTurnBanner.classList.toggle('show', isSinging);
  nextBanner.classList.toggle('show', isNext && !isSinging);

  if (mi < 0) {
    myPosDisplay.textContent    = '#–';
    bottomName.textContent      = '–';
    waitTimeDisplay.textContent = 'Você não está na fila';
  } else if (isSinging) {
    myPosDisplay.textContent    = '🎤';
    bottomName.textContent      = state.myName;
    waitTimeDisplay.textContent = 'Cantando agora!';
  } else {
    myPosDisplay.textContent    = '#' + Math.max(1, myPos);
    bottomName.textContent      = state.myName + ' — ' + state.mySong;
    const wait = Math.max(0, myPos - 1);
    waitTimeDisplay.textContent = wait === 0 ? 'Próximo a cantar!' : `~${wait * 4} min de espera`;
  }

  list.innerHTML = q.map((p, i) => {
    const singing = i === cur - 1;
    const nextUp  = i === cur;
    const isMe    = i === mi;
    const isPast  = i < cur - 1;

    let entryClass = '';
    if (isMe && singing)     entryClass = 'is-singing is-me';
    else if (singing)        entryClass = 'is-singing';
    else if (isMe && nextUp) entryClass = 'is-next is-me';
    else if (nextUp)         entryClass = 'is-next';
    else if (isMe)           entryClass = 'is-me';

    const numClass   = singing ? 'singing' : nextUp ? 'next' : isMe ? 'me' : '';
    const statusHtml = singing
      ? '<span class="entry-status singing">🎤 Cantando</span>'
      : nextUp ? '<span class="entry-status next">⚡ Próximo</span>' : '';
    const meTag    = isMe ? '<div class="me-tag">Você</div>' : '';
    const initials = p.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const opacity  = (isPast && !isMe) ? 'opacity:0.4' : '';

    return `<div class="queue-entry ${entryClass}" style="${opacity}">
      ${meTag}
      <span class="entry-num ${numClass}">${i + 1}</span>
      <div class="entry-avatar" style="background:${p.color}22;color:${p.color}">${initials}</div>
      <div class="entry-details">
        <div class="entry-name">${p.name}</div>
        <div class="entry-song">🎵 ${p.song}</div>
      </div>
      ${statusHtml}
    </div>`;
  }).join('');

  if (mi >= 0 && list.children[mi]) {
    setTimeout(() => list.children[mi].scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }
}

/* ─── QR Code (canvas) ─── */

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawQR(text) {
  const canvas   = document.getElementById('qrCanvas');
  const ctx      = canvas.getContext('2d');
  const size     = 200, modules = 21;
  const cellSize = Math.floor((size - 24) / modules);
  const offset   = Math.floor((size - modules * cellSize) / 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const cornerPattern = [
    [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,0],[1,6],[2,0],[2,2],[2,3],[2,4],[2,6],
    [3,0],[3,2],[3,3],[3,4],[3,6],[4,0],[4,2],
    [4,3],[4,4],[4,6],[5,0],[5,6],[6,0],[6,1],
    [6,2],[6,3],[6,4],[6,5],[6,6],
    [14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],
    [15,0],[15,6],[16,0],[16,2],[16,3],[16,4],[16,6],
    [17,0],[17,2],[17,3],[17,4],[17,6],[18,0],[18,2],
    [18,3],[18,4],[18,6],[19,0],[19,6],
    [20,0],[20,1],[20,2],[20,3],[20,4],[20,5],[20,6],
    [0,14],[0,15],[0,16],[0,17],[0,18],[0,19],[0,20],
    [1,14],[1,20],[2,14],[2,16],[2,17],[2,18],[2,20],
    [3,14],[3,16],[3,17],[3,18],[3,20],[4,14],[4,16],
    [4,17],[4,18],[4,20],[5,14],[5,20],
    [6,14],[6,15],[6,16],[6,17],[6,18],[6,19],[6,20],
  ];

  const rng = mulberry32(hashStr(text));
  ctx.fillStyle = '#0d0d1a';

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      const isCorner = cornerPattern.some(([pr, pc]) => pr === r && pc === c);
      if (isCorner || rng() > 0.5) {
        ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  const cx = size / 2, cy = size / 2;
  ctx.fillStyle = '#ff3c6e';
  ctx.beginPath();
  ctx.arc(cx, cy, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎤', cx, cy);
}

/* ─── Init ─── */

if (checkAuth()) {
  showScreen('host');
} else {
  showScreen('login');
}