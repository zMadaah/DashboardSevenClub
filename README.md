# Seven Club — Dashboard de Suporte

Painel interno de suporte ao cliente para o Seven Club. React + Vite + TypeScript + TailwindCSS + React Router.

## Rodando localmente
```
npm install
npm run dev
```

## Estrutura
- `src/components/layout` — Sidebar, Header, DashboardLayout (casca do app)
- `src/components/ui` — Card, Table, Badge, EmptyState, Skeleton (componentes genéricos)
- `src/features/*` — uma pasta por aba (home, payments, users, chat, events, anticheat), cada uma com `index.tsx`, `types.ts` e `mocks.ts`
- `src/theme/colors.ts` — espelha a paleta do app mobile (pear, richBlack, laurelLeaf, celeste, ceilingWhite)
- `src/router` — definição das rotas
- `src/types` — tipos compartilhados entre features

## Próximos passos
- Substituir os mocks de cada feature por chamadas reais a `services/api.ts`
- Implementar o mapa real de trajeto GPS e gráfico de velocidade na aba anti-cheat
- Adicionar autenticação de operador (login do time de suporte)
