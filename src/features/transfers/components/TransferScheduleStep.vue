<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@/shared/ui/AppButton.vue'

const emit = defineEmits<{
  skip: []
  submit: [iso: string]
  back: []
}>()

const { t } = useI18n()
const scheduledLocal = ref('')
const scheduleError = ref('')

/** Mesmo limite da API: no futuro e até 365 dias. */
const MAX_DAYS_AHEAD = 365

/** Formato de `datetime-local` (hora local, sem fuso), para os limites do campo. */
function toLocalInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const now = new Date()
const minLocal = toLocalInput(new Date(now.getTime() + 60_000))
const maxLocal = toLocalInput(new Date(now.getTime() + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000))

function onSchedule(): void {
  scheduleError.value = ''
  if (!scheduledLocal.value) {
    emit('skip')
    return
  }
  const chosen = new Date(scheduledLocal.value)
  const current = Date.now()
  if (Number.isNaN(chosen.getTime()) || chosen.getTime() <= current) {
    scheduleError.value = t('transfers.form.scheduleInPast')
    return
  }
  if (chosen.getTime() > current + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000) {
    scheduleError.value = t('transfers.form.scheduleTooFar')
    return
  }
  emit('submit', chosen.toISOString())
}
</script>

<template>
  <!-- novalidate: a validação é a do passo, com a mensagem traduzida e anunciada; min e max só guiam o seletor. -->
  <form class="transfer-step" data-testid="pix-schedule" novalidate @submit.prevent="onSchedule">
    <h2>{{ t('transfers.steps.schedule') }}</h2>
    <label class="transfer-step__label" for="pix-schedule-input">
      {{ t('transfers.form.scheduleOptional') }}
    </label>
    <input
      id="pix-schedule-input"
      v-model="scheduledLocal"
      class="transfer-step__input"
      type="datetime-local"
      data-testid="pix-schedule-input"
      :min="minLocal"
      :max="maxLocal"
      :aria-invalid="scheduleError ? 'true' : undefined"
      :aria-describedby="scheduleError ? 'pix-schedule-hint pix-schedule-error' : 'pix-schedule-hint'"
    />
    <p id="pix-schedule-hint" class="transfer-step__hint">{{ t('transfers.form.scheduleHint') }}</p>
    <p
      v-if="scheduleError"
      id="pix-schedule-error"
      class="transfer-step__error"
      role="alert"
      data-testid="pix-schedule-error"
    >
      {{ scheduleError }}
    </p>
    <div class="transfer-step__actions">
      <AppButton variant="secondary" type="button" @click="emit('back')">{{ t('common.back') }}</AppButton>
      <AppButton variant="secondary" type="button" data-testid="pix-skip-schedule" @click="emit('skip')">
        {{ t('transfers.form.skipSchedule') }}
      </AppButton>
      <AppButton type="submit" data-testid="pix-schedule-continue">
        {{ scheduledLocal ? t('transfers.form.scheduleContinue') : t('transfers.form.continue') }}
      </AppButton>
    </div>
  </form>
</template>

<style scoped>
.transfer-step {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.transfer-step h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.transfer-step__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.transfer-step__input {
  font-family: var(--font-ui);
  font-size: var(--font-size-md);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
}

.transfer-step__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.transfer-step__error {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-danger);
}

.transfer-step__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-3);
}
</style>
