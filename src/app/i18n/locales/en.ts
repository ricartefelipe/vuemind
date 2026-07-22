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
    shortcutsTitle: 'Shortcuts',
    filters: {
      from: 'From',
      to: 'To',
      type: 'Type',
      apply: 'Filter',
    },
    types: {
      ALL: 'All',
      PIX_OUT: 'PIX sent',
      PIX_IN: 'PIX received',
      TED: 'Wire transfer',
    },
    empty: {
      title: 'No transactions found',
      description: 'Adjust the filters or check back later.',
    },
  },
  transfers: {
    pix: 'PIX transfer',
    form: {
      beneficiary: 'Beneficiary',
      chooseBeneficiary: 'Select a beneficiary',
      amount: 'Amount (BRL)',
      continue: 'Continue',
    },
    confirm: {
      to: 'To',
      amount: 'Amount',
      submit: 'Confirm PIX',
    },
    receipt: {
      title: 'Receipt',
      id: 'ID',
      when: 'Date',
      again: 'New transfer',
    },
    validation: {
      beneficiary: 'Select a beneficiary',
      amount: 'Enter a valid amount (e.g. 10.50)',
    },
    errors: {
      insufficientFunds: 'Insufficient funds for this transfer.',
    },
  },
  beneficiaries: {
    title: 'Beneficiaries',
    remove: 'Remove',
    form: {
      name: 'Name',
      pixKey: 'PIX key',
      submit: 'Add',
    },
    validation: {
      name: 'Name is required',
      pixKey: 'PIX key is required',
    },
    empty: {
      title: 'No beneficiaries',
      description: 'Add someone to send PIX.',
    },
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
