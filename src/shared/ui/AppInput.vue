<script setup lang="ts">
/**
 * Input controlado via `v-model` (evento `update:modelValue`) com label e
 * mensagem de erro embutidos — os formulários de login/PIX das próximas
 * tasks só precisam passar `error` para ligar a mensagem ao campo.
 */
defineProps<{
  modelValue: string
  label?: string
  type?: string
  id?: string
  error?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="app-input">
    <label v-if="label" :for="id" class="app-input__label">{{ label }}</label>
    <input
      :id="id"
      :type="type ?? 'text'"
      :value="modelValue"
      class="app-input__field"
      :class="{ 'app-input__field--invalid': !!error }"
      :aria-invalid="!!error"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="app-input__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.app-input__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.app-input__field {
  font-family: var(--font-ui);
  font-size: var(--font-size-md);
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
}

.app-input__field:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.app-input__field--invalid {
  border-color: var(--color-danger);
}

.app-input__error {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}
</style>
