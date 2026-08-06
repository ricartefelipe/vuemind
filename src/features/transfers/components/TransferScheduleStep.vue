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

function onSchedule(): void {
  if (!scheduledLocal.value) {
    emit('skip')
    return
  }
  emit('submit', new Date(scheduledLocal.value).toISOString())
}
</script>

<template>
  <form class="transfer-step" data-testid="pix-schedule" @submit.prevent="onSchedule">
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
    />
    <p class="transfer-step__hint">{{ t('transfers.form.scheduleHint') }}</p>
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

.transfer-step__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-3);
}
</style>
