/**
 * Padroniza o trio "carregando / deu erro / tenho dado" que toda tela que
 * chama a API precisa representar — sem isso, cada store reinventaria seu
 * próprio `loading.value = true` espalhado pelas actions, com chance real
 * de esquecer o `finally` e travar o spinner num erro.
 *
 * `run` NÃO engole a exceção: ela é guardada em `error` (para a UI ler de
 * forma reativa) e também relançada, para quem chamou decidir se quer um
 * `try/catch` próprio (ex.: logar, mostrar toast) sem duplicar o estado.
 */
import { ref } from 'vue'

export function useAsyncState<T>() {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function run(fn: () => Promise<T>): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const result = await fn()
      data.value = result
      return result
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, run }
}
