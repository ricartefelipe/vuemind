<script setup lang="ts">
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
  font-weight: 600;
  font-size: var(--font-size-sm);
  border-radius: 999px;
  padding: 0.7rem 1.25rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background-color var(--motion-fast),
    border-color var(--motion-fast),
    transform var(--motion-fast),
    opacity var(--motion-fast);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-button--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-sm);
}

.app-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-strong);
  transform: translateY(-1px);
}

.app-button--secondary {
  background-color: var(--color-surface-elevated);
  border-color: var(--color-border);
  color: var(--color-text);
}

.app-button--secondary:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary-strong);
}

.app-button--ghost {
  background-color: transparent;
  color: var(--color-text-muted);
  padding: 0.45rem 0.75rem;
}

.app-button--ghost:hover:not(:disabled) {
  color: var(--color-primary-strong);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}
</style>
