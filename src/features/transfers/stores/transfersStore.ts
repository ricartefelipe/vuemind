import { defineStore } from 'pinia'
import { ref } from 'vue'
import { transfersApi } from '@/features/transfers/api/transfersApi'
import { createIdempotencyKey } from '@/shared/utils/id'
import type {
  CreatePixInput,
  PixDestination,
  PixTransfer,
} from '@/features/transfers/types'

export type TransferStep = 'destination' | 'amount' | 'schedule' | 'confirm' | 'receipt'

export const useTransfersStore = defineStore('transfers', () => {
  const step = ref<TransferStep>('destination')
  const destination = ref<PixDestination | null>(null)
  const amountCents = ref<number | null>(null)
  const scheduledFor = ref<string>('')
  const draft = ref<CreatePixInput | null>(null)
  const idempotencyKey = ref<string | null>(null)
  const lastReceipt = ref<PixTransfer | null>(null)
  const qrPayload = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  function setDestination(next: PixDestination): void {
    destination.value = next
    error.value = null
    step.value = 'amount'
  }

  function setAmount(cents: number): void {
    amountCents.value = cents
    error.value = null
    step.value = 'schedule'
  }

  function setSchedule(iso: string): void {
    scheduledFor.value = iso
    error.value = null
    goToConfirm()
  }

  function skipSchedule(): void {
    scheduledFor.value = ''
    error.value = null
    goToConfirm()
  }

  function goToConfirm(): void {
    if (!destination.value || amountCents.value === null) return
    const base: CreatePixInput = { amountCents: amountCents.value }
    if (destination.value.mode === 'beneficiary') {
      base.beneficiaryId = destination.value.beneficiaryId
    } else {
      base.pixKey = destination.value.pixKey
      base.pixKeyType = destination.value.pixKeyType
    }
    if (scheduledFor.value) {
      base.scheduledFor = scheduledFor.value
    }
    draft.value = base
    if (!idempotencyKey.value) {
      idempotencyKey.value = createIdempotencyKey()
    }
    step.value = 'confirm'
  }

  function backFromAmount(): void {
    step.value = 'destination'
    error.value = null
  }

  function backFromSchedule(): void {
    step.value = 'amount'
    error.value = null
  }

  function backToForm(): void {
    step.value = 'schedule'
    error.value = null
  }

  async function confirmPix(): Promise<void> {
    if (!draft.value || !idempotencyKey.value) return
    loading.value = true
    error.value = null
    try {
      lastReceipt.value = await transfersApi.createPix(draft.value, idempotencyKey.value)
      step.value = 'receipt'
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  async function loadQrPayload(cents: number, pixKey: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const response = await transfersApi.getQrPayload(cents, pixKey)
      qrPayload.value = response.payload
    } catch (err) {
      error.value = err as Error
      qrPayload.value = null
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    step.value = 'destination'
    destination.value = null
    amountCents.value = null
    scheduledFor.value = ''
    draft.value = null
    idempotencyKey.value = null
    lastReceipt.value = null
    qrPayload.value = null
    error.value = null
    loading.value = false
  }

  return {
    step,
    destination,
    amountCents,
    scheduledFor,
    draft,
    idempotencyKey,
    lastReceipt,
    qrPayload,
    loading,
    error,
    setDestination,
    setAmount,
    setSchedule,
    skipSchedule,
    backFromAmount,
    backFromSchedule,
    backToForm,
    confirmPix,
    loadQrPayload,
    reset,
  }
})
