<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { OnboardingStep } from '@/features/onboarding/types'

defineProps<{
  steps: OnboardingStep[]
  completed: boolean
  doneCount: number
}>()

const { t } = useI18n()
</script>

<template>
  <section class="onboarding" data-testid="onboarding-checklist">
    <header class="onboarding__header">
      <h2>{{ completed ? t('wallet.onboardingComplete') : t('wallet.onboardingTitle') }}</h2>
      <span data-testid="onboarding-progress">{{ doneCount }}/{{ steps.length }}</span>
    </header>
    <ul class="onboarding__list">
      <li
        v-for="step in steps"
        :key="step.id"
        class="onboarding__item"
        :class="{ 'onboarding__item--done': step.done }"
        :data-testid="`onboarding-step-${step.id}`"
      >
        <span class="onboarding__check" aria-hidden="true">{{ step.done ? '✓' : '○' }}</span>
        <span>{{ t(`wallet.onboarding.${step.id}`) }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.onboarding {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.onboarding__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
}

.onboarding__header h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.onboarding__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.onboarding__item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.onboarding__item--done {
  color: var(--color-success);
}

.onboarding__check {
  width: 1.25rem;
  text-align: center;
  font-weight: 700;
}
</style>
