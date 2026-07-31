import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import { router } from './app/router'
import { i18n } from './app/i18n'
import { applyTheme } from './app/theme/applyTheme'
import { useSettingsStore } from './features/settings/stores/settingsStore'
import { useAuthStore } from './features/auth/stores/authStore'
import { setAuthTokenAccessor } from './shared/http/client'

async function bootstrap(): Promise<void> {
  const app = createApp(App)

  const pinia = createPinia()
  pinia.use(createPersistedState())
  app.use(pinia)
  app.use(router)
  app.use(i18n)

  const settings = useSettingsStore(pinia)
  applyTheme(settings.theme)
  i18n.global.locale.value = settings.locale

  const auth = useAuthStore(pinia)
  setAuthTokenAccessor(() => auth.accessToken)

  const { shouldEnableMsw } = await import('./shared/http/apiConfig')
  const enableMsw = shouldEnableMsw()
  if (enableMsw) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    })
  }

  app.mount('#app')
}

bootstrap()
