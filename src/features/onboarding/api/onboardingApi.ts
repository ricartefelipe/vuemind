import { http } from '@/shared/http/client'
import type { OnboardingState } from '@/features/onboarding/types'

export const onboardingApi = {
  getState: (): Promise<OnboardingState> => http.get<OnboardingState>('/me/onboarding'),
}
