# VueMind Wallet

Carteira digital de estudo em **Vue 3** (Composition API + TypeScript) — primeiro projeto da trilha de entrevista.

## Como rodar

```bash
npm install
npm run dev
```

Abra a URL do Vite (geralmente `http://localhost:5173`).

**Login demo:** `demo@vuemind.dev` / `demo123`

```bash
npm test          # testes unitários
npm run build     # build de produção
npm run typecheck
```

## O que o app cobre

| Fluxo | Onde estudar |
|-------|----------------|
| Login + guard de rota | `src/features/auth/`, `src/app/router/` |
| Saldo + extrato com filtros | `src/features/wallet/` |
| Favorecidos (CRUD) | `src/features/beneficiaries/` |
| PIX (form → confirma → comprovante) | `src/features/transfers/` |
| Tema + i18n (pt-BR/en) | `src/features/settings/`, `src/app/i18n/` |
| API mock (MSW) | `src/mocks/`, contrato `docs/contracts/` |
| HTTP tipado + correlation id | `src/shared/http/` |

## Guia rápido para entrevista

Leia: [docs/guides/entrevista-vue.md](docs/guides/entrevista-vue.md)

## Trilha (próximos projetos)

