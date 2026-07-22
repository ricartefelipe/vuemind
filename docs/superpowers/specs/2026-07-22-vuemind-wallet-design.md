# VueMind Wallet — Design Spec (Vue 3)

**Data:** 2026-07-22  
**Status:** aprovado para plano de implementação  
**Repositório:** `vuemind`  
**Produto:** carteira digital de estudo (login, saldo, extrato, PIX, favorecidos)

---

## 1. Contexto e objetivo

Este é o **primeiro projeto** de uma trilha de preparação técnica. O mesmo domínio e contrato de API serão reutilizados depois em:

- Angular, React (web)
- Ionic, React Native, Flutter (mobile)
- Backend Spring (Boot / WebFlux, mensageria, cloud, etc.)

### Objetivos didáticos do Vue v1

1. Consolidar Vue 3 moderno (Composition API + `<script setup>` + TypeScript).
2. Praticar arquitetura front feature-first alinhada a microsserviços / contrato estável.
3. Deixar o código e a documentação no tom de **professor**: explicar o *porquê*, não só o *o quê*.
4. Simular rede real com MSW até existir o backend Spring.

### Fora de escopo (Vue v1)

- Backend Spring, Kafka, cloud deploy, banco real
- Apps Angular / React / Ionic / RN / Flutter (repositórios futuros)
- SSR / Nuxt
- Pagamentos reais, compliance bancário, PCI

---

## 2. Decisões travadas

| Tema | Decisão |
|------|---------|
| Domínio | Carteira digital / conta |
| Estratégia da trilha | Full stack progressivo: Vue + mock → Spring depois |
| Frontends futuros | Mesmo domínio e mesmo contrato OpenAPI |
| Escopo Vue v1 | Completo-estudo (auth, saldo, extrato, PIX, favorecidos, tema, i18n, testes) |
| Mock de API | MSW (Mock Service Worker) |
| Arquitetura | Feature-first |
| UI kit | Sem lib pesada; CSS variables + componentes próprios enxutos |
| Linguagem | TypeScript estrito |
| Build | Vite |
| Estado | Pinia (+ persistência do tema/idioma/token mock) |
| Rotas | Vue Router com guards |
| Testes | Vitest + Vue Testing Library |
| Didática | Comentários instrutivos no código + guias em `docs/guides/` |

---

## 3. Personas e fluxos principais

**Usuário de estudo:** operador da carteira (dados mock).

### Fluxos

1. **Login** — credenciais mock → token → redireciona ao dashboard.
2. **Dashboard** — exibe saldo e atalhos (PIX, extrato, favorecidos).
3. **Extrato** — lista transações com filtros (período, tipo) e estados loading/error/empty.
4. **Transferência PIX** — escolhe/informa favorecido + valor → confirma → comprovante.
5. **Favorecidos** — listar / criar / remover.
6. **Settings** — alternar tema (claro/escuro) e idioma (pt-BR / en).

Credenciais mock (fixas no guia de auth; não são segredo real):

- `demo@vuemind.dev` / `demo123`

---

## 4. Arquitetura

### 4.1 Visão geral

```
Browser (Vue SPA)
    │
    ▼
features/*  →  shared/http  →  fetch
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
                 MSW (dev/test)          Spring (futuro)
                    │
                    ▼
              fixtures in-memory
```

A camada `shared/http` e os módulos `features/*/api` **não sabem** se a resposta veio do MSW ou do Spring. Troca futura = apontar `baseURL` + desligar MSW.

### 4.2 Estrutura de pastas

```
vuemind/
  docs/
    contracts/           # OpenAPI do contrato compartilhado
    guides/              # guias de ensino por tópico
    superpowers/specs/   # specs de design
  src/
    app/
      main.ts
      App.vue
      router/
      i18n/
      theme/
      styles/
    shared/
      ui/                # Button, Input, Card layout, EmptyState, etc.
      http/              # client fetch, interceptors, erros tipados
      types/
      utils/
      composables/       # useAsyncState, useLocaleFormat, etc.
    features/
      auth/
      wallet/
      transfers/
      beneficiaries/
      settings/
    mocks/
      browser.ts
      handlers/
      fixtures/
  tests/                 # ou colocalizados *.spec.ts
```

Cada feature tipicamente contém:

- `api/` — chamadas HTTP
- `stores/` — Pinia
- `components/` — UI da feature
- `composables/` — lógica reutilizável da feature
- `views/` — páginas roteadas
- `types.ts` — tipos do domínio da feature

### 4.3 Fronteiras e responsabilidades

| Unidade | Faz | Depende de |
|---------|-----|------------|
| `shared/http` | baseURL, headers, parse de erro, correlation id mock | nada de feature |
| `features/*/api` | endpoints e DTOs da feature | `shared/http`, types |
| `features/*/stores` | estado de tela + cache leve | api da feature |
| `features/*/composables` | orquestração de UX (form, steps) | store/api |
| `views` | composição de página | components + composables |
| `mocks` | handlers MSW + fixtures | contrato OpenAPI |

Regra: **views não chamam `fetch` direto**; sempre passam por api/store/composable.

---

## 5. Contrato de API (rascunho estável)

Base path: `/api/v1`  
Formato: JSON · erros: `{ "code": string, "message": string, "correlationId": string }`

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/auth/login` | Login → `{ accessToken, user }` |
| `GET` | `/wallet/balance` | Saldo da conta |
| `GET` | `/wallet/transactions` | Extrato (`from`, `to`, `type` query) |
| `GET` | `/beneficiaries` | Lista favorecidos |
| `POST` | `/beneficiaries` | Cria favorecido |
| `DELETE` | `/beneficiaries/{id}` | Remove favorecido |
| `POST` | `/transfers/pix` | Executa PIX → comprovante |
| `GET` | `/transfers/{id}` | Detalhe/comprovante |

O documento OpenAPI canônico ficará em `docs/contracts/vuemind-wallet-openapi.yaml` durante a implementação (fonte da verdade para Angular/React/Spring).

### Regras de domínio (simplificadas)

- Valores monetários em **centavos** (`integer`) no contrato; formatação na UI.
- PIX exige favorecido existente **ou** chave PIX inline (MVP: favorecido existente obrigatório para reduzir escopo de validação).
- Transferência gera item no extrato e atualiza saldo (fixture MSW mutável em memória na sessão).
- Operações de escrita são **idempotentes** via header opcional `Idempotency-Key` (preparação para discurso de microsserviços).

---

## 6. UI / UX

### Princípios

- Uma composição clara por tela (não “dashboard genérico” lotado).
- Marca **VueMind** como sinal forte na autenticação e no shell logado.
- Tema via CSS variables; dark mode sem depender de lib.
- Estados explícitos: loading, erro recuperável, empty, sucesso.
- Acessibilidade básica: labels, foco, contraste, mensagens de erro ligadas aos campos.

### Telas

1. Login  
2. Dashboard (saldo + atalhos)  
3. Extrato  
4. Nova transferência PIX (steps: dados → confirmação → comprovante)  
5. Favorecidos  
6. Settings  

---

## 7. Estado, auth e cross-cutting

### Auth

- Token JWT mock (string opaca basta) no `localStorage` via Pinia persist.
- Router guard: rotas `meta.requiresAuth` redirecionam para `/login`.
- Header `Authorization: Bearer <token>` no client HTTP.

### Settings

- `theme`: `light` | `dark` (classe no `<html>`).
- `locale`: `pt-BR` | `en`.
- Persistidos.

### Observabilidade didática (leve)

- `correlationId` gerado no client por request (UUID) e ecoado nos erros MSW.
- Logs de erro de API no console em dev (sem lib externa no v1).

---

## 8. Testes

| Tipo | Ferramenta | O que cobre |
|------|------------|-------------|
| Unitário | Vitest | utils, formatadores, guards puros |
| Componente | Vue Testing Library | forms, empty/error states |
| Integração leve | Vitest + MSW | store/api com rede mockada |

Meta mínima: cobertura dos fluxos críticos — login, PIX feliz, erro de saldo insuficiente, lista vazia de extrato.

---

## 9. Didática (comentários + guias)

### Comentários no código

- Explicar **decisões** (por que Pinia aqui, por que MSW, por que centavos).
- Evitar narrar o óbvio (`// incrementa i`).
- Preferir blocos curtos no topo de arquivos/módulos + comentários pontuais em trechos não óbvios.

### Guias obrigatórios (`docs/guides/`)

1. `00-visao-geral.md` — mapa da trilha e do app  
2. `01-composition-api.md`  
3. `02-vue-router-e-guards.md`  
4. `03-pinia-e-estado.md`  
5. `04-http-e-msw.md`  
6. `05-formularios-e-validacao.md`  
7. `06-i18n-e-tema.md`  
8. `07-testes.md`  
9. `08-do-mock-ao-spring.md` — como plugar o backend depois  

O README raiz aponta para esses guias e para o contrato OpenAPI.

---

## 10. Stack e scripts

- Node LTS atual do ambiente
- Gerenciador de pacotes: **npm** (lockfile `package-lock.json`)
- Scripts: `dev`, `build`, `preview`, `test`, `test:coverage`, `typecheck`

Dependências principais: `vue`, `vue-router`, `pinia`, `pinia-plugin-persistedstate`, `vue-i18n`, `msw`, `vitest`, `@vue/test-utils` / `@testing-library/vue`.

---

## 11. Critérios de pronto (Vue v1)

1. App sobe com `npm run dev` e todos os fluxos da seção 3 funcionam com MSW.  
2. Tema e i18n persistem após reload.  
3. Testes críticos passam (`npm test`).  
4. OpenAPI versionado em `docs/contracts/`.  
5. Guias 00–08 publicados e linkados no README.  
6. Código das features principais com comentários instrutivos.  
7. Troca para API real documentada (baseURL + desligar MSW) sem reescrever features.

---

## 12. Próximo passo

Após aprovação desta spec pelo usuário → criar **plano de implementação** (`writing-plans`) e executar por etapas (scaffold → shared → features → mocks → testes → docs).
