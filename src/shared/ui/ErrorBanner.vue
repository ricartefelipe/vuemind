<script setup lang="ts">
/**
 * Erro recuperável (ex.: falha de rede numa listagem) — deliberadamente
 * sem texto de ação embutido: quem chama decide o rótulo (`t('common.retry')`)
 * via slot `action`, mantendo este componente livre de i18n.
 */
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="error-banner" role="alert">
    <p class="error-banner__message">{{ message }}</p>
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

.error-banner__message {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-sm);
}
</style>
