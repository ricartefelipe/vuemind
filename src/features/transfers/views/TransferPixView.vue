<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransfersStore } from '@/features/transfers/stores/transfersStore'
import { useWalletStore } from '@/features/wallet/stores/walletStore'
import { useBeneficiariesStore } from '@/features/beneficiaries/stores/beneficiariesStore'
import { useOnboardingStore } from '@/features/onboarding/stores/onboardingStore'
import { useNotificationsStore } from '@/features/notifications/stores/notificationsStore'
import type { PixDestination } from '@/features/transfers/types'
import TransferDestinationStep from '@/features/transfers/components/TransferDestinationStep.vue'
import TransferAmountStep from '@/features/transfers/components/TransferAmountStep.vue'
import TransferScheduleStep from '@/features/transfers/components/TransferScheduleStep.vue'
import TransferConfirm from '@/features/transfers/components/TransferConfirm.vue'
import TransferReceipt from '@/features/transfers/components/TransferReceipt.vue'
import TransferQrSection from '@/features/transfers/components/TransferQrSection.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import { ApiError } from '@/shared/http/errors'

const { t } = useI18n()
const transfers = useTransfersStore()
const wallet = useWalletStore()
const beneficiaries = useBeneficiariesStore()
const onboarding = useOnboardingStore()
const notifications = useNotificationsStore()

onMounted(() => {
  transfers.reset()
  if (beneficiaries.items === null) beneficiaries.load()
})

function onDestination(payload: PixDestination): void {
  transfers.setDestination(payload)
}

async function onConfirm(): Promise<void> {
  await transfers.confirmPix()
  if (transfers.step === 'receipt') {
    await Promise.all([wallet.loadBalance(), onboarding.load(), notifications.load()])
  }
}

function errorMessage(): string {
  const err = transfers.error
  if (err instanceof ApiError) {
    switch (err.code) {
      case 'INSUFFICIENT_FUNDS':
        return t('transfers.errors.insufficientFunds')
      case 'DAILY_LIMIT_EXCEEDED':
        return t('transfers.errors.dailyLimitExceeded')
      case 'INVALID_PIX_KEY':
        return t('transfers.errors.invalidPixKey')
      default:
        return err.message || t('common.error')
    }
  }
  return err?.message || t('common.error')
}

function correlationFrom(error: Error | null): string | undefined {
  return error instanceof ApiError ? error.correlationId : undefined
}
</script>

<template>
  <section class="transfer-pix-view">
    <h1>{{ t('transfers.pix') }}</h1>

    <ErrorBanner
      v-if="transfers.error && transfers.step === 'confirm'"
      :message="errorMessage()"
      :correlation-id="correlationFrom(transfers.error)"
    />

    <TransferDestinationStep
      v-if="transfers.step === 'destination'"
      @submit="onDestination"
    />
    <TransferAmountStep
      v-else-if="transfers.step === 'amount'"
      @submit="transfers.setAmount"
      @back="transfers.backFromAmount()"
    />
    <TransferScheduleStep
      v-else-if="transfers.step === 'schedule'"
      @skip="transfers.skipSchedule()"
      @submit="transfers.setSchedule"
      @back="transfers.backFromSchedule()"
    />
    <TransferConfirm
      v-else-if="transfers.step === 'confirm' && transfers.draft"
      :draft="transfers.draft"
      :loading="transfers.loading"
      :has-error="Boolean(transfers.error)"
      @confirm="onConfirm"
      @back="transfers.backToForm()"
    />
    <TransferReceipt
      v-else-if="transfers.step === 'receipt' && transfers.lastReceipt"
      :receipt="transfers.lastReceipt"
      @again="transfers.reset()"
    />

    <TransferQrSection v-if="transfers.step === 'destination'" />
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
