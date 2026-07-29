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
