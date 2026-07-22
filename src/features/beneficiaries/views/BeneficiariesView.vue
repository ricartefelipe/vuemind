<script setup lang="ts">
/**
 * Tela de favorecidos: carrega a lista, cria e remove.
 * Estados loading/erro/vazio seguem o mesmo padrão do extrato.
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBeneficiariesStore } from '@/features/beneficiaries/stores/beneficiariesStore'
import BeneficiaryForm from '@/features/beneficiaries/components/BeneficiaryForm.vue'
import BeneficiaryList from '@/features/beneficiaries/components/BeneficiaryList.vue'
import LoadingBlock from '@/shared/ui/LoadingBlock.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const { t } = useI18n()
const store = useBeneficiariesStore()

onMounted(() => {
  store.load()
})

async function onCreate(payload: { name: string; pixKey: string }): Promise<void> {
  try {
    await store.create(payload)
  } catch {
    /* mutateError já preenchido */
  }
}

async function onRemove(id: string): Promise<void> {
  try {
    await store.remove(id)
  } catch {
    /* mutateError já preenchido */
  }
}
</script>

<template>
  <section class="beneficiaries-view">
    <h1>{{ t('beneficiaries.title') }}</h1>

    <BeneficiaryForm :loading="store.mutating" @submit="onCreate" />

    <ErrorBanner
      v-if="store.mutateError"
      :message="store.mutateError.message || t('common.error')"
    />

    <LoadingBlock
      v-if="store.loading || (store.items === null && !store.error)"
      :label="t('common.loading')"
    />
    <ErrorBanner v-else-if="store.error" :message="t('common.error')">
      <template #action>
        <AppButton variant="secondary" @click="store.load()">{{ t('common.retry') }}</AppButton>
      </template>
    </ErrorBanner>
    <EmptyState
      v-else-if="store.items !== null && store.items.length === 0"
      :title="t('beneficiaries.empty.title')"
      :description="t('beneficiaries.empty.description')"
    />
    <BeneficiaryList
      v-else-if="store.items !== null"
      :items="store.items"
      :busy="store.mutating"
      @remove="onRemove"
    />
  </section>
</template>

<style scoped>
.beneficiaries-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.beneficiaries-view h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
}
</style>
