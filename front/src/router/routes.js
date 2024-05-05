const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/IndexPage.vue') },
      { path: 'dogadaji', component: () => import('pages/dogadaji.vue') },
      { path: 'dogadaj_detalji', component: () => import('pages/dogadaj_detalji.vue') },
      { path: 'objave', component: () => import('pages/objave.vue') },
      { path: 'registracija', component: () => import('pages/registracija.vue') },
      { path: 'prijava', component: () => import('pages/prijava.vue') },
      { path: 'admindogadaji', component: () => import('pages/admin_dogadaji.vue'), meta: { requiresAdmin: true } },
      { path: 'dodajdogadaj', component: () => import('pages/admin_dogadaj_dodavanje.vue'), meta: { requiresAdmin: true } },
      { name: 'izmjenadogadaj', path: 'izmjenadogadaj/:id', component: () => import('pages/admin_dogadaj_detalji.vue'), meta: { requiresAdmin: true } }, //korisiti name ili samo path?
      { path: 'adminobjave', component: () => import('pages/admin_objave.vue'), meta: { requiresAdmin: true } },
      { path: 'adminkorisnici', component: () => import('pages/admin_korisnici.vue'), meta: { requiresAdmin: true } },
      { path: 'mojipodaci', component: () => import('pages/korisnik_podaci.vue') },
      { name: 'adminkorisnikdetalji', path: 'adminkorisnikdetalji/:id', component: () => import('pages/admin_korisnik_detalji.vue'), meta: { requiresAdmin: true } },
      { path: 'zabranjenpristup', component: () => import('pages/zabranjen_pristup.vue') }

      //na kraju, ako je potreban Admin token, dodati ovo, ali UNUTAR glavne zagrade: "meta: { requiresAdmin: true }"
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
