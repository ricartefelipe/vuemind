export default {
  app: {
    name: 'VueMind',
  },
  nav: {
    dashboard: 'Início',
    transactions: 'Extrato',
    transferPix: 'PIX',
    beneficiaries: 'Favorecidos',
    settings: 'Ajustes',
    logout: 'Sair',
  },
  login: {
    title: 'VueMind',
    subtitle: 'Sua carteira digital — saldo, PIX e favorecidos em um fluxo limpo.',
    email: 'E-mail',
    password: 'Senha',
    submit: 'Entrar na carteira',
  },
  wallet: {
    balance: 'Saldo disponível',
    greeting: 'Olá',
    transactions: 'Extrato',
    shortcutsTitle: 'Movimentar',
    filters: {
      from: 'De',
      to: 'Até',
      type: 'Tipo',
      apply: 'Filtrar',
    },
    types: {
      ALL: 'Todos',
      PIX_OUT: 'PIX enviado',
      PIX_IN: 'PIX recebido',
      TED: 'TED',
    },
    empty: {
      title: 'Nenhuma transação encontrada',
      description: 'Ajuste os filtros ou volte mais tarde.',
    },
  },
  transfers: {
    pix: 'Transferência PIX',
    form: {
      beneficiary: 'Favorecido',
      chooseBeneficiary: 'Selecione um favorecido',
      amount: 'Valor (R$)',
      continue: 'Continuar',
    },
    confirm: {
      to: 'Para',
      amount: 'Valor',
      submit: 'Confirmar PIX',
    },
    receipt: {
      title: 'Comprovante',
      id: 'ID',
      when: 'Data',
      again: 'Nova transferência',
    },
    validation: {
      beneficiary: 'Selecione um favorecido',
      amount: 'Informe um valor válido (ex.: 10,50)',
    },
    errors: {
      insufficientFunds: 'Saldo insuficiente para completar essa transferência.',
    },
  },
  beneficiaries: {
    title: 'Favorecidos',
    remove: 'Remover',
    form: {
      name: 'Nome',
      pixKey: 'Chave PIX',
      submit: 'Adicionar',
    },
    validation: {
      name: 'Nome é obrigatório',
      pixKey: 'Chave PIX é obrigatória',
    },
    empty: {
      title: 'Nenhum favorecido',
      description: 'Cadastre alguém para enviar PIX.',
    },
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
