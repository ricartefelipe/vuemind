<script setup lang="ts">
/**
 * Estado "sem dados" (extrato vazio, sem favorecidos etc.) — um dos
 * estados explícitos exigidos pela spec, para não deixar telas em branco.
 */
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state">
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
  padding: var(--space-6) var(--space-4);
  color: var(--color-text-muted);
}

.empty-state__title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin: 0;
}

.empty-state__description {
  margin: 0;
  font-size: var(--font-size-sm);
}
</style>
