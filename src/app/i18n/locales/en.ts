/**
 * English dictionary, mirroring `pt-BR.ts` key by key. Keep both files in
 * sync manually — with this few keys, a build-time key-check tool would be
 * overkill for a study project.
 */
export default {
  app: {
    name: 'VueMind Wallet',
  },
  nav: {
    dashboard: 'Home',
    transactions: 'Transactions',
    transferPix: 'PIX transfer',
    beneficiaries: 'Beneficiaries',
    settings: 'Settings',
    logout: 'Log out',
  },
  login: {
    title: 'Sign in',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
  },
  wallet: {
    balance: 'Balance',
    transactions: 'Transactions',
  },
  transfers: {
    pix: 'PIX transfer',
  },
  settings: {
    title: 'Settings',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    locale: 'Language',
    localePtBr: 'Portuguese (Brazil)',
    localeEn: 'English',
  },
  common: {
    loading: 'Loading…',
    error: 'Something went wrong.',
    retry: 'Try again',
    save: 'Save',
    cancel: 'Cancel',
  },
}
