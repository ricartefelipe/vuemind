<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  type?: string
  id?: string
  error?: string
  disabled?: boolean
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
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="app-input__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.app-input__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
}

.app-input__field {
  font-family: var(--font-ui);
  font-size: var(--font-size-md);
  color: var(--color-text);
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.75rem 0.9rem;
  transition: border-color var(--motion-fast), box-shadow var(--motion-fast);
}

.app-input__field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent);
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
