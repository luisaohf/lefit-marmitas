# 🥗 LefitMarmitas - Loja Online

Loja de marmitas fitness com carrinho, checkout e integração com Supabase.

---

## 🚀 Setup Rápido no Windows

### Passo 1: Preparar o diretório

1. Abra **PowerShell** ou **CMD**
2. Navegue até a pasta:
```powershell
cd C:\Users\Luis\Desktop\GEOVANA\Lefitmarmitas
```

### Passo 2: Executar o script de setup

Você deve ter recebido o arquivo `setup-lefitmarmitas.bat`

Duplo clique nele E EXECUTE (ou no PowerShell):

```powershell
.\setup-lefitmarmitas.bat
```

Isso vai criar **toda a estrutura** automaticamente! ⚡

### Passo 3: Copiar o App.jsx

Você recebeu `App-LefitMarmitas.jsx`

1. Copie o conteúdo deste arquivo
2. Em `src\App.jsx`, **apague tudo** e **cole** o novo conteúdo

### Passo 4: Instalar dependências

```powershell
npm install
```

Aguarde terminar (pode levar 2-3 minutos)

### Passo 5: Testar localmente

```powershell
npm run dev
```

Abre o navegador em: **http://localhost:5173**

---

## 🎨 Customizações

### Trocar produtos

Em `src\App.jsx`, encontre este array:

```javascript
const products = [
  { id: 1, name: 'Frango com Brócolis', price: 18.90, emoji: '🍗', desc: 'Peito de frango + brócolis + arroz' },
  // ... adicione mais aqui
];
```

### Trocar cores

Em `src\index.css`, procure por `:root` e mude:

```css
--fill-accent: #22c55e;  /* cor principal (atualmente verde) */
--text-primary: #1a1a1a; /* texto preto */
```

### Trocar título

Em `src\App.jsx`, trocar:

```javascript
<h1>🥗 LefitMarmitas</h1>
```

---

## 🔧 Configurar Supabase (Opcional)

Se quiser **salvar pedidos** no banco de dados:

### 1. Criar projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique "New Project"
3. Preencha nome e senha
4. Aguarde a criação

### 2. Criar tabela

Na dashboard do Supabase, vá em **SQL Editor** e rode:

```sql
create table pedidos (
  id bigint primary key generated always as identity,
  numero_pedido text unique not null,
  cliente_nome text not null,
  cliente_email text not null,
  cliente_telefone text,
  endereco text not null,
  cidade text not null,
  cep text,
  itens jsonb not null,
  total numeric not null,
  metodo_pagamento text not null,
  status text default 'pendente',
  criado_em timestamp default now()
);

alter table pedidos enable row level security;

create policy "Anyone can insert" on pedidos for insert with check (true);
create policy "Anyone can read" on pedidos for select using (true);
```

### 3. Pegar credenciais

1. Vá em **Settings → API**
2. Copia `Project URL` (ex: https://seu-projeto.supabase.co)
3. Copia `anon public key`

### 4. Configurar no projeto

Crie arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-aqui
```

Salve e reinicie o servidor (`npm run dev`)

---

## 📱 Deploy no GitHub Pages

### 1. Criar repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique "New repository"
3. Nome: `lefit-marmitas` (ou outro)
4. **Não adicione README** (deixa vazio)
5. Cria

### 2. Fazer push local

No PowerShell, na pasta do projeto:

```powershell
git config user.name "Seu Nome"
git config user.email "seu@email.com"

git init
git add .
git commit -m "Initial commit"

git remote add origin https://github.com/seu-usuario/lefit-marmitas.git
git branch -M main
git push -u origin main
```

### 3. Ativar GitHub Pages

1. Vai em **Settings → Pages**
2. Em "Build and deployment", seleciona **GitHub Actions**
3. Salva

### 4. Aguarde deploy

Vai levar uns 2-3 minutos. Depois seu site estará em:

```
https://seu-usuario.github.io/lefit-marmitas
```

---

## 📁 Estrutura do Projeto

```
Lefitmarmitas/
├── src/
│   ├── App.jsx           ← EDITAR AQUI (produtos, cores, etc)
│   ├── main.jsx
│   └── index.css         ← Cores em :root
├── index.html
├── package.json
├── vite.config.js
├── .env                  ← Variáveis Supabase (git ignora)
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml    ← Deploy automático
└── README.md
```

---

## 🐛 Troubleshooting

### "npm command not found"
Instale [Node.js](https://nodejs.org) (versão 18+)

### Porta 5173 já está em uso
```powershell
npm run dev -- --port 3000
```

### Erros ao rodar setup.bat
1. Abra PowerShell como **Administrador**
2. Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Tente novamente

### GitHub Pages mostra 404
1. Verifique se a branch `gh-pages` foi criada
2. Em Settings → Pages, confirme que está apontando pra `gh-pages`
3. Verifique se `base` em `vite.config.js` está correto

---

## ✅ Checklist

- [x] Estrutura criada
- [x] App.jsx customizado para marmitas
- [x] Cores em verde (LefitMarmitas)
- [x] Métodos de pagamento com PIX
- [x] Suporte a Supabase
- [x] Deploy automático GitHub Pages

---

## 📞 Próximos passos

1. **Email de confirmação** - integrar SendGrid
2. **Integração PIX real** - Mercado Pago ou Stripe
3. **WhatsApp notificação** - Twilio
4. **Integração Instagram** - feed de fotos

Quer ajuda com algum desses?

---

## 📄 Licença

MIT - Use livremente! 🚀
