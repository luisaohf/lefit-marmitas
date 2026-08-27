@echo off
REM Script de Setup para LefitMarmitas
REM Execute este arquivo na pasta: C:\Users\Luis\Desktop\GEOVANA\Lefitmarmitas

setlocal enabledelayedexpansion

echo.
echo ====================================
echo Setup LefitMarmitas
echo ====================================
echo.

REM Criar estrutura de pastas
echo [1/5] Criando estrutura de pastas...
mkdir src
mkdir .github\workflows
cd /d %cd%

REM Criar package.json
echo [2/5] Criando package.json...
(
echo {
echo   "name": "lefit-marmitas",
echo   "private": true,
echo   "version": "0.0.1",
echo   "type": "module",
echo   "homepage": "https://seu-usuario.github.io/lefit-marmitas",
echo   "scripts": {
echo     "dev": "vite",
echo     "build": "vite build",
echo     "preview": "vite preview"
echo   },
echo   "dependencies": {
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0",
echo     "@supabase/supabase-js": "^2.38.0"
echo   },
echo   "devDependencies": {
echo     "@vitejs/plugin-react": "^4.0.0",
echo     "vite": "^4.3.9"
echo   }
echo }
) > package.json

REM Criar vite.config.js
echo [3/5] Criando vite.config.js...
(
echo import { defineConfig } from 'vite'
echo import react from '@vitejs/plugin-react'
echo.
echo export default defineConfig({
echo   plugins: [react(^)],
echo   base: '/lefit-marmitas/',
echo })
) > vite.config.js

REM Criar index.html
echo [4/5] Criando index.html...
(
echo ^<!doctype html^>
echo ^<html lang="pt-BR"^>
echo   ^<head^>
echo     ^<meta charset="UTF-8" /^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0" /^>
echo     ^<title^>LefitMarmitas - Loja Online^</title^>
echo   ^</head^>
echo   ^<body^>
echo     ^<div id="root"^>^</div^>
echo     ^<script type="module" src="/src/main.jsx"^>^</script^>
echo   ^</body^>
echo ^</html^>
) > index.html

REM Criar .gitignore
echo [5/5] Criando arquivos de configuração...
(
echo node_modules
echo dist
echo .env
echo .env.local
echo .env.*.local
echo *.log
echo .vscode
echo .idea
echo .DS_Store
) > .gitignore

REM Criar .env.example
(
echo VITE_SUPABASE_URL=https://seu-project.supabase.co
echo VITE_SUPABASE_KEY=sua-anon-key-aqui
) > .env.example

REM Criar src\main.jsx
(
echo import React from 'react'
echo import ReactDOM from 'react-dom/client'
echo import App from './App.jsx'
echo import './index.css'
echo.
echo ReactDOM.createRoot(document.getElementById('root'^)^).render(
echo   ^<React.StrictMode^>
echo     ^<App /^>
echo   ^</React.StrictMode^>,
echo ^)
) > src\main.jsx

REM Criar src\index.css
(
echo :root {
echo   --surface-2: #ffffff;
echo   --surface-1: #f5f5f5;
echo   --surface-0: #efefef;
echo   --text-primary: #1a1a1a;
echo   --text-secondary: #666666;
echo   --text-muted: #999999;
echo   --text-danger: #d32f2f;
echo   --text-accent: #ffffff;
echo   --border: #e0e0e0;
echo   --border-strong: #cccccc;
echo   --fill-accent: #22c55e;
echo   --on-accent: #ffffff;
echo   --bg-accent: #e7f5e1;
echo   --radius: 8px;
echo }
echo.
echo @media (prefers-color-scheme: dark^) {
echo   :root {
echo     --surface-2: #1e1e1e;
echo     --surface-1: #2a2a2a;
echo     --surface-0: #121212;
echo     --text-primary: #ffffff;
echo     --text-secondary: #aaaaaa;
echo     --text-muted: #666666;
echo     --text-accent: #ffffff;
echo     --border: #333333;
echo     --border-strong: #444444;
echo   }
echo }
echo.
echo * {
echo   margin: 0;
echo   padding: 0;
echo   box-sizing: border-box;
echo }
echo.
echo body {
echo   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
echo   background: var(--surface-0^);
echo   color: var(--text-primary^);
echo   line-height: 1.6;
echo }
echo.
echo input, select, textarea, button {
echo   font-family: inherit;
echo   font-size: inherit;
echo }
echo.
echo input[type="text"],
echo input[type="email"],
echo input[type="tel"],
echo textarea,
echo select {
echo   width: 100%%;
echo   padding: 10px 12px;
echo   border: 0.5px solid var(--border^);
echo   border-radius: var(--radius^);
echo   background: var(--surface-2^);
echo   color: var(--text-primary^);
echo }
echo.
echo input[type="text"]:focus,
echo input[type="email"]:focus,
echo input[type="tel"]:focus,
echo textarea:focus,
echo select:focus {
echo   outline: none;
echo   border-color: var(--fill-accent^);
echo   box-shadow: 0 0 0 3px var(--bg-accent^);
echo }
) > src\index.css

REM Criar deploy.yml
(
echo name: Deploy to GitHub Pages
echo.
echo on:
echo   push:
echo     branches:
echo       - main
echo.
echo jobs:
echo   build:
echo     runs-on: ubuntu-latest
echo.
echo     steps:
echo       - uses: actions/checkout@v3
echo.
echo       - name: Setup Node.js
echo         uses: actions/setup-node@v3
echo         with:
echo           node-version: 18
echo           cache: 'npm'
echo.
echo       - name: Install dependencies
echo         run: npm install
echo.
echo       - name: Build
echo         run: npm run build
echo.
echo       - name: Deploy to GitHub Pages
echo         if: github.ref == 'refs/heads/main'
echo         uses: peaceiris/actions-gh-pages@v3
echo         with:
echo           github_token: ${{ secrets.GITHUB_TOKEN }}
echo           publish_dir: ./dist
) > .github\workflows\deploy.yml

echo.
echo ====================================
echo Setup Concluido!
echo ====================================
echo.
echo Proximos passos:
echo.
echo 1. Abra PowerShell/CMD neste diretorio
echo 2. Execute: npm install
echo 3. Execute: npm run dev
echo.
echo Para mais informacoes, veja o README.md
echo.
pause
