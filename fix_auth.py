html = open('index.html').read()

old = "const found=USERS.find(x=>x.user===user&&x.pass===pass);if(found){loggedUser=found;sessionStorage.setItem('kl_auth',found.user);err.classList.remove('show');showScreen('host');}else{err.textContent='Usuario ou senha incorretos.';err.classList.add('show');}"

new = "const found=USERS.find(x=>x.user===user&&x.pass===pass);if(found){loggedUser=found;sessionStorage.setItem('kl_auth',found.user);if(err){err.style.display='none';}document.querySelectorAll('.screen').forEach(e=>e.style.display='none');const h=document.getElementById('screen-host');h.style.display='flex';}else{if(err){err.style.display='block';err.textContent='Usuario ou senha incorretos.';}}"

html = html.replace(old, new)
open('index.html','w').write(html)
print('OK' if 'screen-host' in html else 'ERRO')
