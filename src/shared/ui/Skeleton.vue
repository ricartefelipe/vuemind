<script setup lang="ts">
defineProps<{
  lines?: number
}>()
</script>

<template>
  <div class="skeleton" role="status" aria-busy="true" data-testid="skeleton">
    <div
      v-for="index in lines ?? 3"
      :key="index"
      class="skeleton__line"
      :style="{ width: `${88 - (index - 1) * 12}%` }"
    />
  </div>
</template>

<style scoped>
.skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) 0;
}

.skeleton__line {
  height: 0.85rem;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-border) 70%, transparent),
    color-mix(in srgb, var(--color-surface-elevated) 80%, var(--color-border)),
    color-mix(in srgb, var(--color-border) 70%, transparent)
  );
  background-size: 200% 100%;
  animation: skeleton-shine 1.2s ease-in-out infinite;
}

@keyframes skeleton-shine {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
