/**
 * "Banco de dados" do mock: um objeto mutável em memória, vivo enquanto a aba
 * do navegador (ou o processo de teste) estiver aberto. Não é Redux/Vuex —
 * é só o estado que o MSW lê e escreve para simular persistência real.
 *
 * `getDb()` sempre devolve a MESMA referência (não uma cópia), então qualquer
 * handler pode mutar `db.availableCents` ou dar `push` num array e o próximo
 * request já vê a mudança — exatamente como um banco faria entre requisições.
 *
 * `resetDb()` existe para os testes: cada `it()` pode chamar `resetDb()` no
 * `beforeEach` e começar sempre do mesmo saldo/extrato, sem vazar estado
 * entre casos (o clássico bug de "passa isolado, falha em bateria").
 */

export type MockUser = {
  id: string
  name: string
  email: string
  password: string
}

export type Beneficiary = {
  id: string
  name: string
  pixKey: string
}

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

export type Db = {
  user: MockUser
  availableCents: number
  beneficiaries: Beneficiary[]
  transactions: Transaction[]
  transfers: Transfer[]
  /**
   * Chave de idempotência → comprovante já emitido. Se o cliente reenviar o
   * mesmo `Idempotency-Key` (retry de rede, duplo clique), devolvemos o MESMO
   * `Transfer` em vez de debitar o saldo de novo.
   */
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
