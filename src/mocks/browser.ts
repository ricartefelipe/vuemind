/**
 * Bootstrap do MSW no navegador: `setupWorker` registra um Service Worker
 * (`public/mockServiceWorker.js`, gerado via `npx msw init`) que intercepta
 * `fetch`/`XHR` no nível de rede — o app não sabe que não existe backend.
 * Só é importado em dev (`import.meta.env.DEV`), então nunca entra no bundle
 * de produção.
 */
import { setupWorker } from 'msw/browser'
import { handlers } from '@/mocks/handlers'

export const worker = setupWorker(...handlers)
