import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import { router } from './app/router'
import { i18n } from './app/i18n'
import { applyTheme } from './app/theme/applyTheme'
import { useSettingsStore } from './features/settings/stores/settingsStore'

/**
 * `bootstrap` é `async` só por causa do MSW: em dev, importamos o worker
 * dinamicamente (`await import(...)`) para que o código do mock nunca entre
 * no bundle de produção — `import.meta.env.DEV` é eliminado pelo Vite no
 * build, então o `import()` inteiro é removido por tree-shaking.
 * O `mount` só acontece DEPOIS do `worker.start()` para garantir que a
 * primeira requisição da tela de login já encontre o mock de pé.
 *
 * Ordem do bootstrap importa: primeiro Pinia (+ persist), para que
 * `useSettingsStore()` já leia o tema/idioma salvos de uma sessão
 * anterior; só então aplicamos esses valores ao DOM (`applyTheme`) e ao
 * i18n global — assim a tela nunca "pisca" no tema/idioma padrão antes de
 * trocar para o preferido.
 */
async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  const app = createApp(App)

  const pinia = createPinia()
  pinia.use(createPersistedState())
  app.use(pinia)
  app.use(router)
  app.use(i18n)

  // Store lida fora de um componente: passar `pinia` explicitamente evita
  // depender da "pinia ativa" global, que só existe dentro do ciclo de vida
  // de um componente montado.
  const settings = useSettingsStore(pinia)
  applyTheme(settings.theme)
  i18n.global.locale.value = settings.locale

  app.mount('#app')
}

bootstrap()
