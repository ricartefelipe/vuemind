/**
 * Store de favorecidos: lista em memória da sessão + create/remove.
 * `items` fica `null` até o primeiro load (evita flash de empty state).
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { beneficiariesApi } from '@/features/beneficiaries/api/beneficiariesApi'
import { useAsyncState } from '@/shared/composables/useAsyncState'
import type { Beneficiary, CreateBeneficiaryInput } from '@/features/beneficiaries/types'

export const useBeneficiariesStore = defineStore('beneficiaries', () => {
  const listState = useAsyncState<Beneficiary[]>()
  const mutating = ref(false)
  const mutateError = ref<Error | null>(null)

  const items = computed(() => listState.data.value)

  async function load(): Promise<void> {
    try {
      await listState.run(async () => (await beneficiariesApi.list()).items)
    } catch {
      /* já em listState.error */
    }
  }

  async function create(input: CreateBeneficiaryInput): Promise<void> {
    mutating.value = true
    mutateError.value = null
    try {
      const created = await beneficiariesApi.create(input)
      const current = listState.data.value ?? []
      listState.data.value = [...current, created]
    } catch (err) {
      mutateError.value = err as Error
      throw err
    } finally {
      mutating.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    mutating.value = true
    mutateError.value = null
    try {
      await beneficiariesApi.remove(id)
      const current = listState.data.value ?? []
      listState.data.value = current.filter((item) => item.id !== id)
    } catch (err) {
      mutateError.value = err as Error
      throw err
    } finally {
      mutating.value = false
    }
  }

  return {
    items,
    loading: listState.loading,
    error: listState.error,
    mutating,
    mutateError,
    load,
    create,
    remove,
  }
})
