/**
 * Dinheiro no VueMind: o contrato HTTP fala em CENTAVOS (integer).
 * A UI formata para o humano. Isso evita erro de ponto flutuante
 * (0.1 + 0.2) e alinha com o futuro backend Spring.
 */
export function formatCents(
  cents: number,
  locale: string,
  currency = 'BRL',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

export function parseReaisToCents(input: string): number {
  const normalized = input.trim().replace(/\s/g, '').replace(',', '.')
  if (!/^-?\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error('INVALID_MONEY')
  }
  const [reais, frac = ''] = normalized.split('.')
  const cents = Number(reais) * 100 + Number(frac.padEnd(2, '0').slice(0, 2))
  return cents
}
