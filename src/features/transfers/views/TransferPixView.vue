<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransfersStore } from '@/features/transfers/stores/transfersStore'
import { useWalletStore } from '@/features/wallet/stores/walletStore'
import { useBeneficiariesStore } from '@/features/beneficiaries/stores/beneficiariesStore'
import TransferForm from '@/features/transfers/components/TransferForm.vue'
import TransferConfirm from '@/features/transfers/components/TransferConfirm.vue'
import TransferReceipt from '@/features/transfers/components/TransferReceipt.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import { ApiError } from '@/shared/http/errors'

const { t } = useI18n()
const transfers = useTransfersStore()
const wallet = useWalletStore()
const beneficiaries = useBeneficiariesStore()

onMounted(() => {
  transfers.reset()
  if (beneficiaries.items === null) beneficiaries.load()
})

function onFormSubmit(payload: { beneficiaryId: string; amountCents: number }): void {
  transfers.setDraft(payload)
}

async function onConfirm(): Promise<void> {
  await transfers.confirmPix()
  if (transfers.step === 'receipt') {
    await wallet.loadBalance()
  }
}

function errorMessage(): string {
  const err = transfers.error
  if (err instanceof ApiError && err.code === 'INSUFFICIENT_FUNDS') {
    return t('transfers.errors.insufficientFunds')
  }
  return err?.message || t('common.error')
}
</script>

<template>
  <section class="transfer-pix-view">
    <h1>{{ t('transfers.pix') }}</h1>

    <ErrorBanner v-if="transfers.error" :message="errorMessage()" />

    <TransferForm v-if="transfers.step === 'form'" @submit="onFormSubmit" />
    <TransferConfirm
      v-else-if="transfers.step === 'confirm' && transfers.draft"
      :beneficiary-id="transfers.draft.beneficiaryId"
      :amount-cents="transfers.draft.amountCents"
      :loading="transfers.loading"
      @confirm="onConfirm"
      @back="transfers.backToForm()"
    />
    <TransferReceipt
      v-else-if="transfers.step === 'receipt' && transfers.lastReceipt"
      :receipt="transfers.lastReceipt"
      @again="transfers.reset()"
    />
  </section>
</template>

<style scoped>
.transfer-pix-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.transfer-pix-view h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
}
</style>
