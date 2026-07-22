import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/**
 * `bootstrap` é `async` só por causa do MSW: em dev, importamos o worker
 * dinamicamente (`await import(...)`) para que o código do mock nunca entre
 * no bundle de produção — `import.meta.env.DEV` é eliminado pelo Vite no
 * build, então o `import()` inteiro é removido por tree-shaking.
 * O `mount` só acontece DEPOIS do `worker.start()` para garantir que a
 * primeira requisição da tela de login já encontre o mock de pé.
 */
async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  createApp(App).mount('#app')
}

bootstrap()
