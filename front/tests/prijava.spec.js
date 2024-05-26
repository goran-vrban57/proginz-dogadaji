// Import necessary modules and components
import { mount } from '@vue/test-utils'
import prijava from '../src/pages/prijava.vue' // Adjust the path as needed

// Mock axios to simulate API requests
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: 'mocked token' }))
}))

describe('prijava', () => {
  it('renders login form correctly', () => {
    const wrapper = mount(prijava)
    expect(wrapper.find('h5').text()).toBe('Prijava')
    expect(wrapper.find('[label="Korisničko ime"]').exists()).toBe(true)
    expect(wrapper.find('[label="Lozinka"]').exists()).toBe(true)
    expect(wrapper.find('vue-recaptcha').exists()).toBe(true)
    expect(wrapper.find('router-link[to="registracija"]').exists()).toBe(true)
  })

  it('submits form with valid data and logs in successfully', async () => {
    const wrapper = mount(prijava)
    wrapper.setData({
      podaci: {
        korisnicko_ime: 'testuser',
        lozinka_korisnika: 'testpassword'
      },
      captchaProsla: true // Mock passing captcha
    })
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$route.path).toBe('/')
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mocked token')
  })

  it('displays error message on form submission with invalid data', async () => {
    const wrapper = mount(prijava)
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.q-notification__content').text()).toContain('Niste unijeli sve podatke!')
  })

  // Additional tests for reCAPTCHA component behavior
})