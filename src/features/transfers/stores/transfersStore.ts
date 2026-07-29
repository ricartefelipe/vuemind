import { defineStore } from 'pinia'
import { ref } from 'vue'
import { transfersApi } from '@/features/transfers/api/transfersApi'
import { createIdempotencyKey } from '@/shared/utils/id'
import type { CreatePixInput, PixTransfer } from '@/features/transfers/types'
import { ApiError } from '@/shared/http/errors'

export type TransferStep = 'form' | 'confirm' | 'receipt'

export const useTransfersStore = defineStore('transfers', () => {
  const step = ref<TransferStep>('form')
  const draft = ref<CreatePixInput | null>(null)
  const lastReceipt = ref<PixTransfer | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  function setDraft(input: CreatePixInput): void {
    draft.value = input
    error.value = null
    step.value = 'confirm'
  }

  function backToForm(): void {
    step.value = 'form'
    error.value = null
  }

  async function confirmPix(): Promise<void> {
    if (!draft.value) return
    loading.value = true
    error.value = null
    try {
      const key = createIdempotencyKey()
      lastReceipt.value = await transfersApi.createPix(draft.value, key)
      step.value = 'receipt'
    } catch (err) {
      error.value = err as Error
      if (!(err instanceof ApiError) || err.code !== 'INSUFFICIENT_FUNDS') {
      }
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    step.value = 'form'
    draft.value = null
    lastReceipt.value = null
    error.value = null
    loading.value = false
  }

  return {
    step,
    draft,
    lastReceipt,
    loading,
    error,
    setDraft,
    backToForm,
    confirmPix,
    reset,
  }
})
