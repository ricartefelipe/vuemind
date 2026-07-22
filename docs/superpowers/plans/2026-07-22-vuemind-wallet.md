# VueMind Wallet (Vue 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a SPA VueMind Wallet (carteira digital de estudo) com Vue 3, MSW, Pinia, i18n, tema e testes — pronta para plugar Spring depois.

**Architecture:** SPA feature-first (`auth`, `wallet`, `transfers`, `beneficiaries`, `settings`) falando com `/api/v1` via `shared/http`. Em dev/test, MSW atende o contrato; em produção futura, a mesma camada aponta para Spring. Comentários didáticos + guias em `docs/guides/`.

**Tech Stack:** Vue 3, Vite, TypeScript, Vue Router, Pinia (+ persistedstate), Vue I18n, MSW, Vitest, Vue Testing Library, CSS variables, npm.

## Global Constraints

- Package manager: **npm** (`package-lock.json`)
- TypeScript estrito; Composition API + `<script setup>`
- Valores monetários no contrato em **centavos** (`integer`)
- Base path API: `/api/v1`
- Erros API: `{ code, message, correlationId }`
- Login mock: `demo@vuemind.dev` / `demo123`
- PIX MVP: favorecido existente obrigatório
- Header opcional `Idempotency-Key` em escritas
- Sem lib de UI pesada; sem Nuxt/SSR
- Comentários instrutivos (tom professor) nos módulos principais
- Sem rastros de IA em commits/código versionado
- Spec de referência: `docs/superpowers/specs/2026-07-22-vuemind-wallet-design.md`

---

## File Structure (mapa)

```
vuemind/
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  index.html
  public/
    mockServiceWorker.js          # gerado por msw init
  docs/
    contracts/vuemind-wallet-openapi.yaml
    guides/00-visao-geral.md … 08-do-mock-ao-spring.md
  src/
    main.ts
    App.vue
    vite-env.d.ts
    app/
      router/index.ts
      i18n/index.ts
      i18n/locales/pt-BR.ts
      i18n/locales/en.ts
      theme/applyTheme.ts
      styles/tokens.css
      styles/base.css
    shared/
      types/api.ts
      types/money.ts
      utils/money.ts
      utils/id.ts
      http/client.ts
      http/errors.ts
      composables/useAsyncState.ts
      ui/AppButton.vue
      ui/AppInput.vue
      ui/AppShell.vue
      ui/EmptyState.vue
      ui/ErrorBanner.vue
      ui/LoadingBlock.vue
    features/
      auth/
        types.ts
        api/authApi.ts
        stores/authStore.ts
        views/LoginView.vue
        components/LoginForm.vue
      wallet/
        types.ts
        api/walletApi.ts
        stores/walletStore.ts
        views/DashboardView.vue
        views/TransactionsView.vue
        components/BalanceCard.vue
        components/TransactionList.vue
        components/TransactionFilters.vue
      beneficiaries/
        types.ts
        api/beneficiariesApi.ts
        stores/beneficiariesStore.ts
        views/BeneficiariesView.vue
        components/BeneficiaryForm.vue
        components/BeneficiaryList.vue
      transfers/
        types.ts
        api/transfersApi.ts
        stores/transfersStore.ts
        views/TransferPixView.vue
        components/TransferForm.vue
        components/TransferConfirm.vue
        components/TransferReceipt.vue
      settings/
        stores/settingsStore.ts
        views/SettingsView.vue
    mocks/
      browser.ts
      data/db.ts
      handlers/authHandlers.ts
      handlers/walletHandlers.ts
      handlers/beneficiariesHandlers.ts
      handlers/transfersHandlers.ts
      handlers/index.ts
  src/**/*.spec.ts                 # testes colocalizados
```

---

### Task 1: Scaffold Vite + Vue 3 + TypeScript + Vitest

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.ts`, `src/App.vue`, `src/vite-env.d.ts`
- Create: `src/shared/utils/money.ts`, `src/shared/utils/money.spec.ts`
- Create: `.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `formatCents(cents: number, locale: string, currency?: string): string`
  - `parseReaisToCents(input: string): number` (lança `Error` se inválido)
  - Scripts npm: `dev`, `build`, `preview`, `test`, `test:coverage`, `typecheck`

- [ ] **Step 1: Criar projeto Vite Vue-TS na raiz do repo**

O repo já tem `docs/` e `.git`. Scaffold na raiz sem apagar docs:

```bash
npm create vite@latest . -- --template vue-ts
```

Se o CLI reclamar de pasta não vazia, criar os arquivos manualmente equivalentes ao template `vue-ts` (Vite 6+/7+ atual) mantendo `docs/`.

Atualizar `.gitignore` para incluir `node_modules`, `dist`, `.env*`, cobertura, e **não** versionar segredos. Manter `docs/` versionado.

- [ ] **Step 2: Instalar deps de app + teste**

```bash
npm install vue-router@4 pinia pinia-plugin-persistedstate vue-i18n@9
npm install -D vitest @vue/test-utils @testing-library/vue @testing-library/jest-dom jsdom @vitest/coverage-v8 msw happy-dom
```

- [ ] **Step 3: Configurar Vitest em `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

Criar `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Em `package.json` scripts:

```json
{
  "dev": "vite",
  "build": "vue-tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:coverage": "vitest run --coverage",
  "typecheck": "vue-tsc -b --noEmit"
}
```

- [ ] **Step 4: Escrever teste falhando de money**

`src/shared/utils/money.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatCents, parseReaisToCents } from './money'

describe('money', () => {
  it('formata centavos em pt-BR', () => {
    expect(formatCents(150051, 'pt-BR')).toMatch(/1\.500,51/)
  })

  it('converte reais digitados em centavos', () => {
    expect(parseReaisToCents('10,50')).toBe(1050)
    expect(parseReaisToCents('10.50')).toBe(1050)
  })

  it('rejeita entrada inválida', () => {
    expect(() => parseReaisToCents('abc')).toThrow()
  })
})
```

- [ ] **Step 5: Rodar teste e confirmar falha**

Run: `npm test -- src/shared/utils/money.spec.ts`  
Expected: FAIL (módulo `./money` inexistente)

- [ ] **Step 6: Implementar `src/shared/utils/money.ts`**

```ts
/**
 * Dinheiro no VueMind: o contrato HTTP fala em CENTAVOS (integer).
 * A UI formata para o humano. Isso evita erro de ponto flutuante
 * (0.1 + 0.2) e alinha com o futuro backend Spring.
 */
export function formatCents(
  cents: number,
  locale: string,
  currency = 'BRL',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

export function parseReaisToCents(input: string): number {
  const normalized = input.trim().replace(/\s/g, '').replace(',', '.')
  if (!/^-?\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error('INVALID_MONEY')
  }
  const [reais, frac = ''] = normalized.split('.')
  const cents = Number(reais) * 100 + Number(frac.padEnd(2, '0').slice(0, 2))
  return cents
}
```

- [ ] **Step 7: Rodar testes e typecheck**

Run: `npm test && npm run typecheck`  
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src .gitignore
git commit -m "$(cat <<'EOF'
chore: scaffold Vue 3 + Vite + Vitest e utilitário de dinheiro

Base do app de estudo com TypeScript, alias @ e testes de centavos.
EOF
)"
```

---

### Task 2: Tipos compartilhados + client HTTP

**Files:**
- Create: `src/shared/types/api.ts`, `src/shared/types/money.ts`
- Create: `src/shared/http/errors.ts`, `src/shared/http/client.ts`
- Create: `src/shared/http/client.spec.ts`
- Create: `src/shared/utils/id.ts`

**Interfaces:**
- Consumes: nothing externa além de `fetch`
- Produces:
  - `type ApiErrorBody = { code: string; message: string; correlationId: string }`
  - `class ApiError extends Error { code; correlationId; status }`
  - `createIdempotencyKey(): string`
  - `createCorrelationId(): string`
  - `http.get/post/delete<T>(path, options?): Promise<T>`
  - `setAuthTokenAccessor(() => string | null): void`

- [ ] **Step 1: Tipos e erros**

`src/shared/types/api.ts`:

```ts
export type ApiErrorBody = {
  code: string
  message: string
  correlationId: string
}
```

`src/shared/types/money.ts`:

```ts
/** Valor monetário em centavos (ex.: R$ 10,50 => 1050). */
export type Cents = number
```

`src/shared/http/errors.ts`:

```ts
export class ApiError extends Error {
  readonly code: string
  readonly correlationId: string
  readonly status: number

  constructor(
    status: number,
    code: string,
    message: string,
    correlationId: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.correlationId = correlationId
  }
}
```

`src/shared/utils/id.ts`:

```ts
export function createCorrelationId(): string {
  return crypto.randomUUID()
}

export function createIdempotencyKey(): string {
  return crypto.randomUUID()
}
```

- [ ] **Step 2: Teste falhando do client**

`src/shared/http/client.spec.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './errors'
import { http, setAuthTokenAccessor } from './client'

describe('http client', () => {
  beforeEach(() => {
    setAuthTokenAccessor(() => 'token-demo')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ code: 'X', message: 'fail', correlationId: 'c1' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )
  })

  it('lança ApiError com correlationId do body', async () => {
    await expect(http.get('/wallet/balance')).rejects.toBeInstanceOf(ApiError)
    await expect(http.get('/wallet/balance')).rejects.toMatchObject({
      code: 'X',
      correlationId: 'c1',
      status: 400,
    })
  })

  it('envia Authorization e X-Correlation-Id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    )
    await http.get('/wallet/balance')
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(init.headers.Authorization).toBe('Bearer token-demo')
    expect(init.headers['X-Correlation-Id']).toBeTruthy()
  })
})
```

- [ ] **Step 3: Rodar e ver falha**

Run: `npm test -- src/shared/http/client.spec.ts`  
Expected: FAIL

- [ ] **Step 4: Implementar client**

`src/shared/http/client.ts`:

```ts
import type { ApiErrorBody } from '@/shared/types/api'
import { ApiError } from '@/shared/http/errors'
import { createCorrelationId } from '@/shared/utils/id'

const BASE = '/api/v1'

let authTokenAccessor: () => string | null = () => null

export function setAuthTokenAccessor(fn: () => string | null): void {
  authTokenAccessor = fn
}

type HttpOptions = {
  body?: unknown
  idempotencyKey?: string
}

async function request<T>(method: string, path: string, options: HttpOptions = {}): Promise<T> {
  const correlationId = createCorrelationId()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Correlation-Id': correlationId,
  }
  const token = authTokenAccessor()
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    let body: ApiErrorBody | undefined
    try {
      body = (await response.json()) as ApiErrorBody
    } catch {
      /* ignore */
    }
    throw new ApiError(
      response.status,
      body?.code ?? 'HTTP_ERROR',
      body?.message ?? response.statusText,
      body?.correlationId ?? correlationId,
    )
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown, idempotencyKey?: string) =>
    request<T>('POST', path, { body, idempotencyKey }),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
```

- [ ] **Step 5: Testes verdes + commit**

Run: `npm test -- src/shared/http/client.spec.ts`  
Expected: PASS

```bash
git add src/shared
git commit -m "$(cat <<'EOF'
feat: adiciona client HTTP tipado com correlation id

Camada única de rede para MSW agora e Spring depois.
EOF
)"
```

---

### Task 3: OpenAPI + MSW + banco em memória

**Files:**
- Create: `docs/contracts/vuemind-wallet-openapi.yaml`
- Create: `src/mocks/data/db.ts`
- Create: `src/mocks/handlers/*.ts`, `src/mocks/handlers/index.ts`, `src/mocks/browser.ts`
- Create: `src/mocks/handlers/transfersHandlers.spec.ts` (regra de saldo)
- Modify: `src/main.ts` (start MSW em dev)
- Create: `public/mockServiceWorker.js` via CLI

**Interfaces:**
- Consumes: contrato da spec (paths `/api/v1/...`)
- Produces:
  - `getDb() / resetDb()` com estado mutável da sessão
  - Handlers MSW para auth, wallet, beneficiaries, transfers
  - Worker: `worker.start()` em `main.ts` antes de montar o app

- [ ] **Step 1: Escrever OpenAPI canônico**

Criar `docs/contracts/vuemind-wallet-openapi.yaml` com:

- `POST /api/v1/auth/login` → `{ accessToken, user: { id, name, email } }`
- `GET /api/v1/wallet/balance` → `{ availableCents, currency }`
- `GET /api/v1/wallet/transactions?from&to&type` → `{ items: Transaction[] }`
- CRUD favorecidos
- `POST /api/v1/transfers/pix` body `{ beneficiaryId, amountCents }` → receipt
- `GET /api/v1/transfers/{id}`
- schemas de erro `ApiError`

- [ ] **Step 2: DB em memória**

`src/mocks/data/db.ts`:

```ts
export type MockUser = { id: string; name: string; email: string; password: string }
export type Beneficiary = { id: string; name: string; pixKey: string }
export type Transaction = {
  id: string
  type: 'PIX_OUT' | 'PIX_IN' | 'TED'
  amountCents: number
  description: string
  createdAt: string
  counterparty: string
}
export type Transfer = {
  id: string
  beneficiaryId: string
  amountCents: number
  status: 'COMPLETED'
  createdAt: string
}

type Db = {
  user: MockUser
  availableCents: number
  beneficiaries: Beneficiary[]
  transactions: Transaction[]
  transfers: Transfer[]
  idempotency: Map<string, Transfer>
}

const seed = (): Db => ({
  user: {
    id: 'u1',
    name: 'Marion Demo',
    email: 'demo@vuemind.dev',
    password: 'demo123',
  },
  availableCents: 250_000,
  beneficiaries: [
    { id: 'b1', name: 'Ana Silva', pixKey: 'ana@email.com' },
    { id: 'b2', name: 'Mercado Central', pixKey: '11222333000181' },
  ],
  transactions: [
    {
      id: 't1',
      type: 'PIX_IN',
      amountCents: 50_000,
      description: 'Recebido',
      createdAt: '2026-07-20T10:00:00.000Z',
      counterparty: 'Carlos',
    },
  ],
  transfers: [],
  idempotency: new Map(),
})

let db = seed()

export function getDb(): Db {
  return db
}

export function resetDb(): void {
  db = seed()
}
```

- [ ] **Step 3: Teste da regra PIX (saldo insuficiente)**

`src/mocks/handlers/transfersHandlers.spec.ts` — extrair função pura `executePix(db, input)` testável (sem HTTP) e cobrir:

```ts
it('recusa quando saldo < valor', () => {
  const db = getDb()
  db.availableCents = 100
  expect(() => executePix(db, { beneficiaryId: 'b1', amountCents: 200, idempotencyKey: 'k1' }))
    .toThrowError(/INSUFFICIENT_FUNDS/)
})

it('debita saldo e cria extrato no caminho feliz', () => {
  resetDb()
  const result = executePix(getDb(), { beneficiaryId: 'b1', amountCents: 1000, idempotencyKey: 'k2' })
  expect(result.amountCents).toBe(1000)
  expect(getDb().availableCents).toBe(249_000)
})
```

Implementar `executePix` em `src/mocks/handlers/transfersHandlers.ts` e usá-la no handler MSW.

- [ ] **Step 4: Handlers MSW**

Implementar handlers com `http` de `msw` apontando para `*/api/v1/...`.

Login: só aceita `demo@vuemind.dev` / `demo123` → token `mock-jwt-demo`.

- [ ] **Step 5: Init worker**

```bash
npx msw init public/ --save
```

`src/mocks/browser.ts`:

```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

`src/main.ts` (trecho):

```ts
async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
  // createApp(...).mount('#app')
}

bootstrap()
```

- [ ] **Step 6: Testes + commit**

Run: `npm test -- src/mocks`  
Expected: PASS

```bash
git add docs/contracts src/mocks public/mockServiceWorker.js src/main.ts package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat: contrato OpenAPI e MSW com banco em memória

Simula /api/v1 para login, saldo, extrato, favorecidos e PIX.
EOF
)"
```

---

### Task 4: Settings (tema + i18n) + UI base + shell

**Files:**
- Create: `src/app/styles/tokens.css`, `src/app/styles/base.css`
- Create: `src/app/theme/applyTheme.ts`, `src/app/i18n/**`
- Create: `src/features/settings/stores/settingsStore.ts`, `views/SettingsView.vue`
- Create: `src/shared/ui/*.vue`
- Create: `src/app/theme/applyTheme.spec.ts`
- Modify: `src/main.ts`, `src/App.vue`

**Interfaces:**
- Consumes: Pinia persist
- Produces:
  - `useSettingsStore()` com `theme: 'light' | 'dark'`, `locale: 'pt-BR' | 'en'`, `setTheme`, `setLocale`
  - `applyTheme(theme)` seta `data-theme` no `<html>`
  - i18n com chaves mínimas: `app.name`, `nav.*`, `login.*`, `wallet.*`, `transfers.*`, `common.*`

- [ ] **Step 1: Teste de tema**

```ts
import { applyTheme } from './applyTheme'

it('aplica data-theme no documentElement', () => {
  applyTheme('dark')
  expect(document.documentElement.dataset.theme).toBe('dark')
})
```

- [ ] **Step 2: Implementar tokens, applyTheme, i18n, settingsStore, UI base**

`tokens.css` com variáveis para light/dark (evitar tema roxo genérico; usar azul petróleo + âmbar sóbrio, tipografia distinta via Google Fonts ou similar — ex. `"DM Sans"` + `"Fraunces"`).

`settingsStore` persistido (`pinia-plugin-persistedstate`) com paths `theme` e `locale`.

Componentes UI mínimos: `AppButton`, `AppInput`, `AppShell` (nav + outlet), `EmptyState`, `ErrorBanner`, `LoadingBlock`.

- [ ] **Step 3: Wire no main**

Registrar Pinia + plugin persist + i18n; ao boot, `applyTheme(settings.theme)` e `i18n.global.locale = settings.locale`.

- [ ] **Step 4: SettingsView**

Toggles de tema e idioma; textos via `t()`.

- [ ] **Step 5: Testes + commit**

Run: `npm test -- src/app/theme src/features/settings`  
Expected: PASS

```bash
git add src/app src/features/settings src/shared/ui src/main.ts src/App.vue
git commit -m "$(cat <<'EOF'
feat: tema, i18n e componentes UI base

Shell visual da VueMind com persistência de preferências.
EOF
)"
```

---

### Task 5: Auth (store, login, guard)

**Files:**
- Create: `src/features/auth/**`
- Create: `src/app/router/index.ts`
- Create: `src/features/auth/stores/authStore.spec.ts`
- Modify: `src/main.ts`, `src/shared/http/client.ts` wiring via `setAuthTokenAccessor`

**Interfaces:**
- Consumes: `http.post`, MSW login
- Produces:
  - `useAuthStore()`: `user`, `accessToken`, `login(email, password)`, `logout()`, `isAuthenticated`
  - Rotas: `/login` (guest), `/` dashboard e demais `requiresAuth`
  - Guard: sem token → `/login`; com token em `/login` → `/`

- [ ] **Step 1: Teste da store (MSW node ou fetch mock)**

Preferir mock de `authApi.login`:

```ts
vi.mock('@/features/auth/api/authApi', () => ({
  authApi: {
    login: vi.fn(async () => ({
      accessToken: 'tok',
      user: { id: 'u1', name: 'Marion', email: 'demo@vuemind.dev' },
    })),
  },
}))

it('guarda token após login', async () => {
  const store = useAuthStore()
  await store.login('demo@vuemind.dev', 'demo123')
  expect(store.isAuthenticated).toBe(true)
  expect(store.accessToken).toBe('tok')
})
```

- [ ] **Step 2: Implementar api + store + LoginForm/LoginView**

`authApi.login` → `POST /auth/login`.

Persistir `accessToken` + `user`.

- [ ] **Step 3: Router + guards**

```ts
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login' }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' }
})
```

Rotas nomeadas: `login`, `dashboard`, `transactions`, `transfer-pix`, `beneficiaries`, `settings`.

- [ ] **Step 4: Ligar token no HTTP**

No boot, após Pinia: `setAuthTokenAccessor(() => useAuthStore().accessToken)`.

- [ ] **Step 5: Teste manual rápido**

Run: `npm run dev`  
Login com demo → deve entrar no shell (mesmo que dashboard ainda seja placeholder).

- [ ] **Step 6: Commit**

```bash
git add src/features/auth src/app/router src/main.ts
git commit -m "$(cat <<'EOF'
feat: autenticação mock com guard de rotas

Login didático com token persistido e proteção das páginas.
EOF
)"
```

---

### Task 6: Wallet — saldo, dashboard e extrato

**Files:**
- Create: `src/features/wallet/**`
- Create: `src/shared/composables/useAsyncState.ts`
- Create: `src/features/wallet/stores/walletStore.spec.ts`

**Interfaces:**
- Consumes: `http.get`, `formatCents`, settings locale
- Produces:
  - `walletApi.getBalance()`, `walletApi.listTransactions(filters)`
  - `useWalletStore()`: `balanceCents`, `transactions`, `filters`, `loadBalance()`, `loadTransactions()`
  - Views: `DashboardView`, `TransactionsView`

- [ ] **Step 1: useAsyncState**

```ts
export function useAsyncState<T>() {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  async function run(fn: () => Promise<T>) {
    loading.value = true
    error.value = null
    try {
      data.value = await fn()
      return data.value
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }
  return { data, error, loading, run }
}
```

- [ ] **Step 2: Teste store saldo**

Mock `walletApi.getBalance` → `{ availableCents: 250000, currency: 'BRL' }` e assert no store.

- [ ] **Step 3: Implementar api, store, BalanceCard, Dashboard**

Dashboard: saldo + atalhos router-link para PIX, extrato, favorecidos. Marca VueMind visível no shell.

- [ ] **Step 4: Extrato com filtros**

`TransactionFilters`: `from`, `to`, `type` (`ALL | PIX_OUT | PIX_IN | TED`).  
Estados: LoadingBlock / ErrorBanner / EmptyState / lista.

- [ ] **Step 5: Testes + commit**

Run: `npm test -- src/features/wallet`  
Expected: PASS

```bash
git add src/features/wallet src/shared/composables src/app/router
git commit -m "$(cat <<'EOF'
feat: dashboard de saldo e extrato com filtros

Estados de loading/erro/vazio e formatação monetária localizada.
EOF
)"
```

---

### Task 7: Favorecidos

**Files:**
- Create: `src/features/beneficiaries/**`
- Create: `src/features/beneficiaries/stores/beneficiariesStore.spec.ts`

**Interfaces:**
- Consumes: `http.get/post/delete`
- Produces:
  - `beneficiariesApi.list/create/remove`
  - Store com `items`, `load`, `create({ name, pixKey })`, `remove(id)`
  - View com lista + form

- [ ] **Step 1: Teste create na store**

Mock api; após `create`, lista contém o novo item.

- [ ] **Step 2: Implementar feature completa**

Validação simples: nome obrigatório, pixKey obrigatória (string não vazia).

- [ ] **Step 3: Testes + commit**

```bash
git add src/features/beneficiaries src/app/router
git commit -m "$(cat <<'EOF'
feat: CRUD de favorecidos PIX

Lista, cria e remove favorecidos via contrato /api/v1.
EOF
)"
```

---

### Task 8: Transferência PIX + comprovante

**Files:**
- Create: `src/features/transfers/**`
- Create: `src/features/transfers/stores/transfersStore.spec.ts`

**Interfaces:**
- Consumes: beneficiaries store/api, `createIdempotencyKey`, wallet reload
- Produces:
  - `transfersApi.createPix({ beneficiaryId, amountCents }, idempotencyKey)`
  - `transfersApi.getById(id)`
  - Store com step machine: `'form' | 'confirm' | 'receipt'`
  - View em 3 passos + tratamento `INSUFFICIENT_FUNDS`

- [ ] **Step 1: Teste caminho feliz da store**

Mock createPix → receipt; store avança para `receipt` e guarda `lastReceipt`.

- [ ] **Step 2: Teste erro de saldo**

Mock rejeita `ApiError` code `INSUFFICIENT_FUNDS`; store expõe mensagem e permanece em `confirm` ou `form`.

- [ ] **Step 3: Implementar UI em steps**

1. Form: select favorecido + valor (parseReaisToCents)  
2. Confirm: resumo  
3. Receipt: id, valor, favorecido, data  

Após sucesso: `walletStore.loadBalance()` + opção de ir ao extrato.

- [ ] **Step 4: Enviar Idempotency-Key**

Sempre gerar chave nova ao confirmar (não a cada keystroke).

- [ ] **Step 5: Testes + commit**

```bash
git add src/features/transfers src/app/router
git commit -m "$(cat <<'EOF'
feat: fluxo PIX com confirmação e comprovante

Inclui idempotency key e erro didático de saldo insuficiente.
EOF
)"
```

---

### Task 9: Testes de integração de UI + polish

**Files:**
- Create: `src/features/auth/views/LoginView.spec.ts`
- Create: `src/features/transfers/views/TransferPixView.spec.ts` (opcional se pesado; mínimo Login + um empty state)
- Modify: estilos/copy conforme gaps

**Interfaces:**
- Consumes: Testing Library + router/pinia/i18n test utils
- Produces: helper `src/test/renderApp.ts` para montar app com plugins

- [ ] **Step 1: Helper de render**

```ts
export function renderWithApp(component: Component, options?: { route?: string }) {
  const pinia = createPinia()
  const router = createRouter(/* mesmas rotas ou subset */)
  return render(component, {
    global: { plugins: [pinia, router, i18n] },
  })
}
```

- [ ] **Step 2: Teste LoginView**

Preencher email/senha demo → submit → `authStore.isAuthenticated === true` (com api mockada).

- [ ] **Step 3: Teste EmptyState no extrato**

Com api retornando `items: []`, assert texto de vazio (chave i18n).

- [ ] **Step 4: Suite completa**

Run: `npm test && npm run typecheck && npm run build`  
Expected: todos PASS / build OK

- [ ] **Step 5: Commit**

```bash
git add src/test src/features
git commit -m "$(cat <<'EOF'
test: cobre login e estados vazios críticos

Garante fluxos de entrevista com Testing Library.
EOF
)"
```

---

### Task 10: Guias didáticos + README

**Files:**
- Create: `docs/guides/00-visao-geral.md`
- Create: `docs/guides/01-composition-api.md`
- Create: `docs/guides/02-vue-router-e-guards.md`
- Create: `docs/guides/03-pinia-e-estado.md`
- Create: `docs/guides/04-http-e-msw.md`
- Create: `docs/guides/05-formularios-e-validacao.md`
- Create: `docs/guides/06-i18n-e-tema.md`
- Create: `docs/guides/07-testes.md`
- Create: `docs/guides/08-do-mock-ao-spring.md`
- Create: `README.md`

**Interfaces:**
- Consumes: código já implementado (citar paths reais)
- Produces: trilha de estudo navegável pelo README

- [ ] **Step 1: Escrever guias 00–08**

Cada guia: objetivo, conceitos, onde está no código, exercício mental de entrevista (1 pergunta + resposta-modelo curta).

Guia 08 deve explicar exatamente:
1. Desligar MSW (`import.meta.env.DEV` / flag `VITE_ENABLE_MSW=false`)
2. Setar `VITE_API_BASE_URL`
3. Manter o mesmo OpenAPI

- [ ] **Step 2: README índice**

Incluir: o que é VueMind, como rodar, credenciais demo, mapa de pastas, links dos guias, posição na trilha (próximos: Angular/React/…/Spring).

- [ ] **Step 3: Passar nos arquivos principais e reforçar comentários professor** onde ainda estiverem fracos (`main.ts`, `http/client.ts`, stores, `executePix`).

- [ ] **Step 4: Verificação final**

Run: `npm test && npm run build`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/guides README.md src
git commit -m "$(cat <<'EOF'
docs: guias de ensino e README da trilha Vue

Material didático alinhado ao código da VueMind Wallet.
EOF
)"
```

---

## Self-Review do plano

**1. Spec coverage**

| Requisito da spec | Task |
|-------------------|------|
| Login mock + guard | 5 |
| Dashboard + saldo | 6 |
| Extrato + filtros + estados | 6, 9 |
| PIX + comprovante | 8 |
| Favorecidos | 7 |
| Tema + i18n persistidos | 4 |
| MSW + OpenAPI | 3 |
| Client HTTP + correlation/idempotency | 2, 8 |
| Testes Vitest/Testing Library | 1, 2, 3, 5–9 |
| Guias 00–08 + README | 10 |
| Feature-first | estrutura global |
| Comentários didáticos | constraints + task 10 |
| Troca futura Spring | task 3/10 + `shared/http` |

**2. Placeholder scan:** sem TBD/TODO; caminhos e assinaturas explícitos.

**3. Type consistency:** centavos como `number`/`Cents`; token em `authStore.accessToken`; erro `INSUFFICIENT_FUNDS`; base `/api/v1`.

---

## Execution Handoff

Plano salvo. Escolha como executar (ver mensagem do assistente).
