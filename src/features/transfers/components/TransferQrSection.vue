<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'
import { parseReaisToCents } from '@/shared/utils/money'
import { useTransfersStore } from '@/features/transfers/stores/transfersStore'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import { ApiError } from '@/shared/http/errors'

const { t } = useI18n()
const transfers = useTransfersStore()
const amount = ref('10,00')
const pixKey = ref('demo@vuemind.dev')
const amountError = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)

async function renderQr(payload: string): Promise<void> {
  await nextTick()
  if (!canvasRef.value) return
  await QRCode.toCanvas(canvasRef.value, payload, { width: 180, margin: 1 })
}

async function generate(): Promise<void> {
  amountError.value = ''
  let cents = 0
  try {
    cents = parseReaisToCents(amount.value)
    if (cents <= 0) throw new Error('INVALID_MONEY')
  } catch {
    amountError.value = t('transfers.validation.amount')
    return
  }
  await transfers.loadQrPayload(cents, pixKey.value.trim())
  if (transfers.qrPayload) await renderQr(transfers.qrPayload)
}

watch(
  () => transfers.qrPayload,
  async (payload) => {
    if (payload) await renderQr(payload)
  },
)

function correlationFrom(error: Error | null): string | undefined {
  return error instanceof ApiError ? error.correlationId : undefined
}
</script>

<template>
  <section class="transfer-qr" data-testid="pix-qr-section">
    <h2>{{ t('transfers.qr.title') }}</h2>
    <AppInput id="qr-amount" v-model="amount" :label="t('transfers.qr.amount')" :error="amountError" />
    <AppInput id="qr-key" v-model="pixKey" :label="t('transfers.qr.pixKey')" />
    <AppButton :disabled="transfers.loading" data-testid="pix-qr-generate" @click="generate">
      {{ t('transfers.qr.generate') }}
    </AppButton>
    <ErrorBanner
      v-if="transfers.error && transfers.step !== 'confirm'"
      :message="transfers.error.message || t('common.error')"
      :correlation-id="correlationFrom(transfers.error)"
    />
    <div v-if="transfers.qrPayload" class="transfer-qr__result">
      <canvas ref="canvasRef" data-testid="pix-qr-canvas" />
      <p data-testid="pix-qr-payload">
        <strong>{{ t('transfers.qr.payload') }}:</strong> {{ transfers.qrPayload }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.transfer-qr {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px dashed color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-accent-soft) 45%, var(--color-surface));
}

.transfer-qr h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.transfer-qr__result {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
}

.transfer-qr__result p {
  margin: 0;
  font-size: var(--font-size-sm);
  word-break: break-all;
  color: var(--color-text-muted);
}
</style>
