# 🚀 Passo a passo: subir no GitHub e publicar com GitHub Pages

## Pré-requisitos

- Conta no [github.com](https://github.com)
- Git instalado ([download](https://git-scm.com/downloads))
- Terminal (macOS/Linux) ou Git Bash (Windows)

---

## Passo 1 — Criar o repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name:** `karaoke-live`
   - **Description:** Sistema de fila para karaokê com QR Code
   - Deixe marcado como **Public** (necessário para GitHub Pages gratuito)
3. **NÃO** marque "Add a README file" (já temos um)
4. Clique em **Create repository**

---

## Passo 2 — Configurar o Git localmente

Abra o terminal dentro da pasta `karaoke-live` e rode:

```bash
# Inicializar repositório Git
git init

# Configurar seu nome e e-mail (só precisa fazer uma vez)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

## Passo 3 — Conectar ao GitHub e enviar os arquivos

```bash
# Adicionar todos os arquivos
git add .

# Criar o primeiro commit
git commit -m "feat: sistema de fila para karaokê com QR Code"

# Definir branch principal como 'main'
git branch -M main

# Conectar ao repositório remoto
# (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/karaoke-live.git

# Enviar para o GitHub
git push -u origin main
```

> Se pedir login, use seu usuário e um **Personal Access Token** (não a senha).  
> Para criar um token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → marque `repo` → Generate.

---

## Passo 4 — Ativar o GitHub Pages

1. No seu repositório, clique em **Settings** (aba no topo)
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione **Deploy from a branch**
4. Em **Branch**, escolha `main` e pasta `/ (root)`
5. Clique em **Save**

Aguarde ~1 minuto. A URL do site aparecerá em:

```
https://SEU_USUARIO.github.io/karaoke-live/
```

---

## Passo 5 — Atualizar o site depois de mudanças

Sempre que fizer alterações nos arquivos:

```bash
git add .
git commit -m "fix: descrição do que mudou"
git push
```

O GitHub Pages atualiza automaticamente em até 1 minuto.

---

## Dicas extras

### Ver o site funcionando localmente antes de publicar

```bash
# Python 3
python3 -m http.server 8080

# Node.js (se tiver instalado)
npx serve .
```

Acesse `http://localhost:8080` no navegador.

### Estrutura de commits recomendada

| Prefixo | Uso |
|---------|-----|
| `feat:` | nova funcionalidade |
| `fix:`  | correção de bug |
| `style:` | ajuste visual / CSS |
| `docs:` | alteração no README |

---

## Resumo dos comandos essenciais

```bash
git init                          # inicia o repositório
git add .                         # prepara todos os arquivos
git commit -m "mensagem"          # salva um ponto de histórico
git push                          # envia para o GitHub
git pull                          # baixa atualizações do GitHub
git status                        # vê o que mudou
git log --oneline                 # histórico resumido
```
