/**
 * Ponto único de agregação dos handlers MSW: `browser.ts` (dev) e qualquer
 * `server.ts` de teste de integração futuro importam só este array, sem
 * precisar conhecer os módulos internos de cada feature de mock.
 */
import { authHandlers } from '@/mocks/handlers/authHandlers'
import { walletHandlers } from '@/mocks/handlers/walletHandlers'
import { beneficiariesHandlers } from '@/mocks/handlers/beneficiariesHandlers'
import { transfersHandlers } from '@/mocks/handlers/transfersHandlers'

export const handlers = [
  ...authHandlers,
  ...walletHandlers,
  ...beneficiariesHandlers,
  ...transfersHandlers,
]
