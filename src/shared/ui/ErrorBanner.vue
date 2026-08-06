<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const props = defineProps<{
  message: string
  correlationId?: string
}>()

const { t } = useI18n()
const copied = ref(false)

async function copyCorrelationId(): Promise<void> {
  if (!props.correlationId) return
  try {
    await navigator.clipboard.writeText(props.correlationId)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
  }
}
</script>

<template>
  <div class="error-banner" role="alert" data-testid="error-banner">
    <div class="error-banner__body">
      <p class="error-banner__message">{{ message }}</p>
      <p v-if="correlationId" class="error-banner__correlation">
        <span>{{ t('common.correlationId') }}: {{ correlationId }}</span>
        <button type="button" class="error-banner__copy" @click="copyCorrelationId">
          {{ copied ? t('common.copied') : t('common.copy') }}
        </button>
      </p>
    </div>
    <div v-if="$slots.action" class="error-banner__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  background-color: var(--color-danger-soft);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
}

.error-banner__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.error-banner__message {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.error-banner__correlation {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  word-break: break-all;
}

.error-banner__copy {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  padding: 0.15rem 0.5rem;
  font: inherit;
  font-size: var(--font-size-sm);
  cursor: pointer;
}
</style>
