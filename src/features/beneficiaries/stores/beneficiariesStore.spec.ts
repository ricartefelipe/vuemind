import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBeneficiariesStore } from './beneficiariesStore'

vi.mock('@/features/beneficiaries/api/beneficiariesApi', () => ({
  beneficiariesApi: {
    list: vi.fn(async () => ({
      items: [{ id: 'b1', name: 'Ana Silva', pixKey: 'ana@email.com', pixKeyType: 'EMAIL' }],
    })),
    create: vi.fn(async (input: { name: string; pixKey: string; pixKeyType: string }) => ({
      id: 'b-new',
      name: input.name,
      pixKey: input.pixKey,
      pixKeyType: input.pixKeyType,
    })),
    remove: vi.fn(async () => undefined),
  },
}))

describe('useBeneficiariesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('após create, a lista contém o novo item', async () => {
    const store = useBeneficiariesStore()
    await store.load()

    await store.create({ name: 'Novo Favorecido', pixKey: 'novo@pix.com', pixKeyType: 'EMAIL' })

    expect(store.items?.some((item) => item.id === 'b-new')).toBe(true)
    expect(store.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Novo Favorecido',
          pixKey: 'novo@pix.com',
          pixKeyType: 'EMAIL',
        }),
      ]),
    )
  })
})
