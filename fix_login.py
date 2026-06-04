html = open('index.html').read()

# 1. Centralizar login - adicionar estilo flex ao login-screen
html = html.replace(
    '<div class="screen login-screen" id="screen-login">',
    '<div class="screen login-screen" id="screen-login" style="display:none;min-height:100vh;align-items:center;justify-content:center;background:#0d0d1a">'
)

# 2. Corrigir o show do login para usar flex
html = html.replace(
    "if(checkAuth()){showScreen('host');}else{showScreen('login');}",
    "if(checkAuth()){showScreen('host');}else{const l=document.getElementById('screen-login');document.querySelectorAll('.screen').forEach(e=>e.style.display='none');l.style.display='flex';}"
)

# 3. Adicionar botão logout no host screen (após o logo)
html = html.replace(
    '<div class="logo">',
    '<div style="display:flex;align-items:center;justify-content:space-between;width:100%;max-width:480px;margin-bottom:-12px"><div style="display:flex;align-items:center;gap:6px;background:#1e1e35;border:1px solid rgba(255,60,110,0.2);border-radius:20px;padding:5px 12px;cursor:pointer" onclick="doLogout()"><i class="ti ti-logout" style="color:#ff3c6e;font-size:15px"></i><span style="font-size:12px;color:#ff3c6e;font-weight:600">Sair</span></div></div><div class="logo">',
    1
)

open('index.html','w').write(html)
print('OK tamanho:', len(html))
