import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/app/i18n'
import TransferReceipt from './TransferReceipt.vue'
import type { PixTransfer } from '@/features/transfers/types'

const base: PixTransfer = {
  id: 'tr-1',
  beneficiaryId: 'b1',
  amountCents: 1050,
  status: 'COMPLETED',
  createdAt: '2026-11-03T12:00:00Z',
}

function render(receipt: PixTransfer) {
  return mount(TransferReceipt, {
    props: { receipt },
    global: {
      plugins: [i18n, createPinia()],
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })
}

describe('TransferReceipt', () => {
  it('mostra o end-to-end e a correlação devolvidos pela API', () => {
    const wrapper = render({
      ...base,
      endToEndId: 'E99999999202611031200aB3dE5gH7jK',
      correlationId: 'corr-1',
    })

    expect(wrapper.get('[data-testid="pix-end-to-end"]').text()).toBe('E99999999202611031200aB3dE5gH7jK')
    expect(wrapper.get('[data-testid="pix-correlation-id"]').text()).toBe('corr-1')
    expect(wrapper.text()).toContain('End-to-end: E99999999202611031200aB3dE5gH7jK')
    expect(wrapper.text()).toContain('Correlation ID: corr-1')
  })

  it('sem o end-to-end, diz que não está disponível em vez de ficar vazio', () => {
    const wrapper = render(base)

    expect(wrapper.get('[data-testid="pix-end-to-end"]').text()).toBe('Não disponível')
    expect(wrapper.get('[data-testid="pix-correlation-id"]').text()).toBe('Não disponível')
  })

  it('avisa que o PIX é simulado', () => {
    expect(render(base).get('[data-testid="pix-simulated-note"]').text()).toContain('PIX simulado')
  })
})
