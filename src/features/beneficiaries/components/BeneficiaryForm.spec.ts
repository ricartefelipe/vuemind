import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/app/i18n'
import BeneficiaryForm from './BeneficiaryForm.vue'

function render() {
  return mount(BeneficiaryForm, { global: { plugins: [i18n] } })
}

async function preencher(wrapper: ReturnType<typeof render>, tipo: string, chave: string) {
  await wrapper.get('#beneficiary-name').setValue('Mercado Central')
  await wrapper.get('[data-testid="beneficiary-type"]').setValue(tipo)
  await wrapper.get('#beneficiary-pix').setValue(chave)
  await wrapper.get('form').trigger('submit')
}

describe('BeneficiaryForm', () => {
  it('oferece o tipo CNPJ', () => {
    const opcoes = render()
      .findAll('[data-testid="beneficiary-type"] option')
      .map((o) => o.attributes('value'))
    expect(opcoes).toEqual(['EMAIL', 'CPF', 'CNPJ', 'PHONE', 'RANDOM'])
  })

  it('CNPJ válido é enviado com o tipo CNPJ', async () => {
    const wrapper = render()
    await preencher(wrapper, 'CNPJ', '11222333000181')

    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { name: 'Mercado Central', pixKey: '11222333000181', pixKeyType: 'CNPJ' },
    ])
  })

  it('CNPJ com dígito verificador errado não é enviado', async () => {
    const wrapper = render()
    await preencher(wrapper, 'CNPJ', '11222333000182')

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('CNPJ cadastrado como chave aleatória é recusado', async () => {
    const wrapper = render()
    await preencher(wrapper, 'RANDOM', '11222333000181')

    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
