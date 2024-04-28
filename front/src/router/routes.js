const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/IndexPage.vue') },
      { path: 'dogadaji', component: () => import('pages/dogadaji.vue') },
      { path: 'objave', component: () => import('pages/objave.vue') },
      { path: 'registracija', component: () => import('pages/registracija.vue') },
      { path: 'prijava', component: () => import('pages/prijava.vue') },
      { path: 'admindogadaji', component: () => import('pages/admin_dogadaji.vue') },
      { path: 'dodajdogadaj', component: () => import('pages/admin_dogadaj_dodavanje.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
