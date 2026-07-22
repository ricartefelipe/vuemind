<script setup lang="ts">
/**
 * Botão único do app: 3 variantes cobrem os casos previstos no plano
 * (ação principal, ação secundária, ação discreta em linha). Preferimos
 * isso a puxar uma lib de UI só por um botão.
 */
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
  },
)
</script>

<template>
  <button :type="type" :disabled="disabled" class="app-button" :class="`app-button--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  padding: 0.6rem 1.1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-button--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.app-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-strong);
}

.app-button--secondary {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text);
}

.app-button--secondary:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary-strong);
}

.app-button--ghost {
  background-color: transparent;
  color: var(--color-accent-strong);
  padding: 0.4rem 0.6rem;
}

.app-button--ghost:hover:not(:disabled) {
  text-decoration: underline;
}
</style>
