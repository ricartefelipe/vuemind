export default {
  app: {
    name: 'VueMind',
  },
  nav: {
    dashboard: 'Home',
    transactions: 'Activity',
    transferPix: 'PIX',
    beneficiaries: 'Payees',
    settings: 'Settings',
    logout: 'Log out',
  },
  login: {
    title: 'VueMind',
    subtitle: 'Your digital wallet — balance, PIX and payees in a clean flow.',
    email: 'Email',
    password: 'Password',
    submit: 'Enter wallet',
  },
  wallet: {
    balance: 'Available balance',
    greeting: 'Hello',
    transactions: 'Activity',
    shortcutsTitle: 'Move money',
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
