# Banco `dashboardhml` + branch `hml` do dashboard

## 1. Banco de dados

O script `create-homolog-db.ps1` (já existe em `seven-club-api/scripts/`)
já aceita nome customizado — não precisei mudar nada nele:

```powershell
cd seven-club-api
.\scripts\create-homolog-db.ps1 -DbName dashboardhml
```

⚠️ **Nome vira minúsculo**: o Postgres normaliza identificador sem aspas
pra minúsculo — `Dashboardhml` que você pediu vira `dashboardhml` no
banco de verdade. Usei minúsculo direto no comando acima pra já bater
com o que vai existir de fato (evita confusão no pgAdmin depois).

Depois, atualize `seven-club-api/.env.homolog`:
```
DATABASE_URL=postgres://postgres:SUASENHA@localhost:5432/dashboardhml
```

E rode as migrations do zero nesse banco novo:
```powershell
npm run migrate:homolog
```

**Isso é um banco vazio** — como é novo, não tem a conta que você já
tinha criado no app. Duas opções:
- Cadastre de novo pelo app (rápido, e testa o fluxo de cadastro de
  quebra)
- Ou, se preferir manter os dados que já tinha, não troque o
  `DATABASE_URL` e siga usando `sevenclub_homolog` — o `dashboardhml` fica
  disponível pra quando quiser um ambiente limpo

## 2. Branch `hml` do dashboard

Pasta `dashboard/` neste zip tem os arquivos que mudaram. Como não tenho
permissão de push no seu GitHub, prepara a branch você mesmo — é rápido:

```powershell
cd DashboardSevenClub
git checkout -b hml
```

Copie os 5 arquivos de `dashboard/` deste zip por cima dos seus (mesmos
nomes: `.gitignore`, `.env.example`, `.env.hml`, `README.md`,
`package.json`).

```powershell
git add .
git commit -m "hml: ambientes por mode (dev:hml/build:hml), VITE_API_URL configurado"
git push -u origin hml
```

## O que mudou

- **`package.json`** — `npm run dev:hml` e `npm run build:hml` novos,
  usando o sistema de *modes* nativo do Vite (`--mode hml` carrega
  `.env.hml` automaticamente).
- **`.env.hml`** (novo, versionado) — `VITE_API_URL=http://localhost:3333`.
  Funciona se você abrir o dashboard no navegador da mesma máquina que
  roda o backend. De outro computador na rede, troca pelo IP local do PC
  (mesmo já usado no `.env` do app mobile).
- **`.env.example`** (novo) — documenta o padrão: `.env.hml` versionado,
  `.env.production` **não** deve ser criado local (vai direto nas
  Environment Variables do Vercel quando isso existir).
- **`.gitignore`** — passou a ignorar `.env` genérico e `.env.production`,
  pra ninguém commitar URL de produção sem querer.
- **`README.md`** — tabela explicando cada comando/ambiente.

## ⚠️ Achei 2 bugs pré-existentes (não são meus, já estavam lá)

`npm run build` falha por dois motivos, **nenhum relacionado a esta
mudança** (confirmei rodando `tsc -b` na branch original, antes de
qualquer alteração minha, e os erros já apareciam):

1. `src/features/home/index.tsx` passa uma prop `dark` pro `RegionMap`
   que o componente não declara.
2. `src/features/payments/mocks.ts` usa um campo `user` que não existe no
   tipo `Payment` (o tipo tem `userName`, não `user`).

Isso **não impede `npm run dev`/`dev:hml`** (Vite não type-checa em modo
dev), só bloqueia builds de produção. Como payments/home ainda não têm
API real (é o que discutimos, fica pra depois), não mexi nisso agora —
mas avisa se quiser que eu corrija já.
