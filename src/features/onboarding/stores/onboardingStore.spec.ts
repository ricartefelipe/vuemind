import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOnboardingStore } from './onboardingStore'

vi.mock('@/features/onboarding/api/onboardingApi', () => ({
  onboardingApi: {
    getState: vi.fn(async () => ({
      steps: [
        { id: 'PROFILE_OK', done: true },
        { id: 'FIRST_BENEFICIARY', done: false },
        { id: 'FIRST_PIX', done: false },
        { id: 'VIEW_STATEMENT', done: false },
      ],
      completed: false,
    })),
  },
}))

describe('useOnboardingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('carrega passos e conta concluídos', async () => {
    const store = useOnboardingStore()
    await store.load()

    expect(store.steps).toHaveLength(4)
    expect(store.doneCount).toBe(1)
    expect(store.completed).toBe(false)
  })
})
