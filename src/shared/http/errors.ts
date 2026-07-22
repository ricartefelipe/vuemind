/**
 * ApiError carrega code, status e correlationId porque cada um resolve um problema distinto:
 * `code` — regra de negócio legível pela máquina (i18n, branch na UI);
 * `status` — semântica HTTP (401 → logout, 409 → conflito, 5xx → retry);
 * `correlationId` — amarra o erro exibido ao log do servidor (MSW ou Spring).
 */
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
