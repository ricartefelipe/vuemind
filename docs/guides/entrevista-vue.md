# VueMind — o que estudar na entrevista (rápido)

## Como falar do projeto em 60s

> “Montei uma carteira digital em Vue 3 + TypeScript: login com guard, saldo/extrato, favorecidos e PIX. A API é mockada com MSW no mesmo contrato `/api/v1` que depois pluga no Spring. Usei Pinia, Vue Router, i18n, tema e testes Vitest.”

## Conceitos que costumam cair

1. **Composition API / `<script setup>`** — estado local com `ref`/`computed`; lógica reutilizável em composables (`useAsyncState`).
2. **Pinia** — store por feature; persistência de token/tema; setup store vs options.
3. **Vue Router + guards** — `meta.requiresAuth`; redirect login ↔ dashboard.
4. **Camada HTTP** — um client (`shared/http`) + APIs por feature; fácil trocar mock → Spring.
5. **MSW** — intercepta `fetch` no browser; regra de PIX pura (`executePix`) testável sem rede.
6. **Dinheiro em centavos** — evita float; formata na UI com `Intl`.
7. **Idempotency-Key** — no confirm do PIX (não a cada keystroke).
8. **Estados de UI** — loading / error / empty / success (extrato e favorecidos).

## Fluxo demo ao vivo (2–3 min)

1. Login com `demo@vuemind.dev` / `demo123`
2. Ver saldo no dashboard
3. Abrir Extrato (filtrar tipo)
4. Favorecidos → adicionar um
5. PIX → escolher favorecido → valor → confirmar → comprovante
6. Voltar ao Extrato / saldo (saldo caiu)
7. Settings → tema escuro + inglês

## Perguntas prontas (respostas curtas)

**Por que MSW e não json-server?**  
Mesma camada `fetch`/client que a API real; handlers no mesmo repo; fácil nos testes.

**Por que feature-first?**  
Cada domínio (auth, wallet, transfers) fica isolado — espelha microsserviços e facilita Angular/React no mesmo contrato.

**Como liga o Spring depois?**  
Desliga MSW (`VITE_ENABLE_MSW=false` ou só em DEV), aponta `baseURL` para o gateway, mantém OpenAPI.

**O que testa?**  
Utils de dinheiro, client HTTP, stores (auth/wallet/transfers/beneficiaries) e regra `executePix` (saldo insuficiente).

## Arquivos “abra na entrevista”

- `src/shared/http/client.ts`
- `src/features/auth/stores/authStore.ts`
- `src/app/router/index.ts`
- `src/mocks/handlers/transfersHandlers.ts` (`executePix`)
- `src/features/transfers/views/TransferPixView.vue`
