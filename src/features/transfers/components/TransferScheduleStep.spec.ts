import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/app/i18n'
import TransferScheduleStep from './TransferScheduleStep.vue'

const AGORA = new Date('2026-11-04T12:00:00')

function render() {
  return mount(TransferScheduleStep, { global: { plugins: [i18n] } })
}

describe('TransferScheduleStep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(AGORA)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('limita o campo à janela da API: a partir do próximo minuto e até 365 dias', () => {
    const input = render().get('[data-testid="pix-schedule-input"]')

    expect(input.attributes('min')).toBe('2026-11-04T12:01')
    expect(input.attributes('max')).toBe('2027-11-04T12:00')
    // A mensagem do passo substitui a nativa do navegador, que barraria o envio antes dela.
    expect(render().get('form').attributes()).toHaveProperty('novalidate')
  })

  it('data no futuro envia o horário em ISO', async () => {
    const wrapper = render()
    await wrapper.get('[data-testid="pix-schedule-input"]').setValue('2026-11-04T12:30')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')?.[0]).toEqual([new Date('2026-11-04T12:30').toISOString()])
    expect(wrapper.find('[data-testid="pix-schedule-error"]').exists()).toBe(false)
  })

  it('data no passado mostra o erro, ligado ao campo, e não envia', async () => {
    const wrapper = render()
    const input = wrapper.get('[data-testid="pix-schedule-input"]')
    await input.setValue('2026-11-04T11:59')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
    const erro = wrapper.get('[data-testid="pix-schedule-error"]')
    expect(erro.attributes('role')).toBe('alert')
    expect(erro.text()).toBe('Escolha uma data e hora no futuro.')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toContain('pix-schedule-error')
  })

  it('além de 365 dias mostra o erro e não envia', async () => {
    const wrapper = render()
    await wrapper.get('[data-testid="pix-schedule-input"]').setValue('2027-11-05T12:00')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('[data-testid="pix-schedule-error"]').text()).toContain('365 dias')
  })

  it('sem data, segue como envio imediato', async () => {
    const wrapper = render()
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('skip')).toHaveLength(1)
  })
})
