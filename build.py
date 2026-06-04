css = open('css/style.css').read()
js = open('js/app.js').read()
html = open('index.html').read()
login_html = """
  <div class="screen login-screen" id="screen-login">
    <div class="login-card">
      <div class="login-logo">Karaoke<span>Live</span></div>
      <p class="login-subtitle">Area do Organizador</p>
      <div class="login-form">
        <div class="input-group">
          <label>Usuario</label>
          <div class="input-icon-wrap">
            <i class="ti ti-user"></i>
            <input type="text" id="loginUser" placeholder="seu usuario" onkeydown="if(event.key==='Enter')document.getElementById('loginPass').focus()" />
          </div>
        </div>
        <div class="input-group">
          <label>Senha</label>
          <div class="input-icon-wrap">
            <i class="ti ti-lock"></i>
            <input type="password" id="loginPass" placeholder="sua senha" onkeydown="if(event.key==='Enter')doLogin()" />
            <button class="password-toggle" onclick="togglePassword()" type="button"><i class="ti ti-eye" id="toggleIcon"></i></button>
          </div>
        </div>
        <div class="login-error" id="loginError"></div>
        <button class="btn-primary" id="loginBtn" onclick="doLogin()"><i class="ti ti-lock-open"></i> Entrar</button>
      </div>
      <div class="login-footer">Acesso restrito ao organizador.<br>Participantes entram pelo QR Code.</div>
    </div>
  </div>
"""
html = html.replace('<div class="screen host-screen', login_html + '\n  <div class="screen host-screen')
html = html.replace('class="screen host-screen active"', 'class="screen host-screen"')
open('index.html','w').write(html)
print('OK login adicionado, tamanho:', len(html))
