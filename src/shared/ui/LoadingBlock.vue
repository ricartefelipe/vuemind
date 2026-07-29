<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="loading-block" role="status">
    <span class="loading-block__spinner" aria-hidden="true" />
    <span v-if="label" class="loading-block__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.loading-block {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  padding: var(--space-4);
}

.loading-block__spinner {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: loading-block-spin 0.7s linear infinite;
}

.loading-block__label {
  font-size: var(--font-size-sm);
}

@keyframes loading-block-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
