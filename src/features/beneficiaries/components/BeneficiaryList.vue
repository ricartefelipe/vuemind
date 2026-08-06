<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Beneficiary } from '@/features/beneficiaries/types'
import AppButton from '@/shared/ui/AppButton.vue'

defineProps<{
  items: Beneficiary[]
  busy?: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const { t } = useI18n()
</script>

<template>
  <ul class="beneficiary-list" data-testid="beneficiary-list">
    <li v-for="item in items" :key="item.id" class="beneficiary-list__item">
      <div>
        <strong>{{ item.name }}</strong>
        <p>{{ t(`beneficiaries.types.${item.pixKeyType}`) }} · {{ item.pixKey }}</p>
      </div>
      <AppButton variant="ghost" :disabled="busy" @click="emit('remove', item.id)">
        {{ t('beneficiaries.remove') }}
      </AppButton>
    </li>
  </ul>
</template>

<style scoped>
.beneficiary-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.beneficiary-list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.beneficiary-list__item p {
  margin: 0.15rem 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
