import { mount } from '@vue/test-utils'
import prijava from '../src/pages/prijava.vue' 

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: 'mocked token' }))
}))
jest.mock('vue3-recaptcha2', () => ({
  install: jest.fn(),
  data() {
    return { response: null };
  },
  template: '<div class="mock-recaptcha"></div>'
}));
describe('prijava', () => {
  it('ispravno učita formu za prijavu', () => {
    const wrapper = mount(prijava)
    expect(wrapper.find('h5').text()).toBe('Prijava')
    expect(wrapper.find('[label="Korisničko ime"]').exists()).toBe(true)
    expect(wrapper.find('[label="Lozinka"]').exists()).toBe(true)
    expect(wrapper.find('.captcha').exists()).toBe(true)
    expect(wrapper.find('router-link[to="registracija"]').exists()).toBe(true)
  })

  it('uspješno unese podatke i prijavi se', async () => {
    const wrapper = mount(prijava)
    wrapper.setData({
      podaci: {
        korisnicko_ime: 'testuser',
        lozinka_korisnika: 'testpassword'
      },
      captchaProsla: true 
    })
    await wrapper.vm.$nextTick()
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$route.path).toBe('/')
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mocked token')
  })

  it('prikaže grešku ako su nepravilno uneseni podaci', async () => {
    const wrapper = mount(prijava)
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.q-notification__content').text()).toContain('Niste unijeli sve podatke!')
  })
})