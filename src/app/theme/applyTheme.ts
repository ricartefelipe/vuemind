/**
 * O "tema" da VueMind não é uma lib: é um único atributo no `<html>`.
 * `tokens.css` declara duas árvores de variáveis, uma por
 * `[data-theme="light"]` e outra por `[data-theme="dark"]` — trocar o
 * atributo troca a árvore inteira sem re-render de componentes, sem FOUC
 * (é chamado no bootstrap, antes do `app.mount`) e sem custo de bundle.
 */
export type Theme = 'light' | 'dark'

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}
