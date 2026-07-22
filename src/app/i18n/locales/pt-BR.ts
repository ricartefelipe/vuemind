/**
 * Dicionário pt-BR: chaves mínimas para o shell e as telas já previstas no
 * plano (login, saldo, transferências). Telas ainda não implementadas usam
 * essas chaves desde já para não haver retrabalho de i18n depois.
 */
export default {
  app: {
    name: 'VueMind Wallet',
  },
  nav: {
    dashboard: 'Início',
    transactions: 'Extrato',
    transferPix: 'Transferir PIX',
    beneficiaries: 'Favorecidos',
    settings: 'Configurações',
    logout: 'Sair',
  },
  login: {
    title: 'Entrar',
    email: 'E-mail',
    password: 'Senha',
    submit: 'Entrar',
  },
  wallet: {
    balance: 'Saldo',
    transactions: 'Extrato',
  },
  transfers: {
    pix: 'Transferência PIX',
  },
  settings: {
    title: 'Configurações',
    theme: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    locale: 'Idioma',
    localePtBr: 'Português (Brasil)',
    localeEn: 'Inglês',
  },
  common: {
    loading: 'Carregando…',
    error: 'Algo deu errado.',
    retry: 'Tentar novamente',
    save: 'Salvar',
    cancel: 'Cancelar',
  },
}
