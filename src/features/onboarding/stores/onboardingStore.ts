import { defineStore } from 'pinia'
import { computed } from 'vue'
import { onboardingApi } from '@/features/onboarding/api/onboardingApi'
import { useAsyncState } from '@/shared/composables/useAsyncState'
import type { OnboardingState } from '@/features/onboarding/types'

export const useOnboardingStore = defineStore('onboarding', () => {
  const state = useAsyncState<OnboardingState>()

  const steps = computed(() => state.data.value?.steps ?? [])
  const completed = computed(() => state.data.value?.completed ?? false)
  const doneCount = computed(() => steps.value.filter((step) => step.done).length)

  async function load(): Promise<void> {
    try {
      await state.run(() => onboardingApi.getState())
    } catch {
    }
  }

  return {
    steps,
    completed,
    doneCount,
    loading: state.loading,
    error: state.error,
    load,
  }
})
