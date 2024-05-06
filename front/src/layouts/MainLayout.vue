<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <router-link to="/" class="link-color">Promo</router-link>
        </q-toolbar-title>
        <template v-if="!imaToken()">
          <router-link to="/prijava" class="link-style">
            <q-btn flat label="Prijava" class="q-px-lg" style="color: white" />
          </router-link>
          <router-link to="/registracija" class="link-style">
            <q-btn flat label="Registracija" class="q-pa-sm" style="color: white" />
          </router-link>
        </template>
        <template v-if="imaToken()">

          <q-btn-dropdown color="primary" class="btn--no-hover" :ripple="false" stretch flat text-color="white"
            label="Moj profil">
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <router-link to="/mojipodaci" class="link-color">
                    <q-item-label>Moji podaci</q-item-label>
                  </router-link>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="odjava()">
                <q-item-section>
                  <q-item-label>Odjava</q-item-label>
                </q-item-section>
              </q-item>


            </q-list>
          </q-btn-dropdown>

          <!--  <router-link to="/" class="link-style">
            <q-btn flat label="Odjava" class="q-pa-sm" style="color: white" @click="odjava()" />
          </router-link> -->
        </template>
      </q-toolbar>
      <q-tabs inline-label class="bg-primary text-white">
        <router-link to="/dogadaji" class="link-color">
          <q-tab name="dogadaj">
            <span style="font-size: 14px">Događaji</span>
            <!--izgled je kao link nazalost, mozda CSS stil da bude cisti tekst-->
          </q-tab>
        </router-link>
        <router-link to="/objave" class="link-color">
          <q-tab name="objave">
            <span style="font-size: 14px">Objave</span>
          </q-tab>
        </router-link>

        <template v-if="imaAdmin()">
          <q-tab name="admin">
            <q-btn-dropdown color="primary" class="btn--no-hover" :ripple="false" auto-close stretch flat
              text-color="white" label="Administrator">
              <q-list>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <router-link to="/admindogadaji" class="link-color">
                      <q-item-label>Događaji</q-item-label>
                    </router-link>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section>
                    <router-link to='/adminobjave' class="link-color">
                      <q-item-label>Objave</q-item-label>
                    </router-link>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section>
                    <router-link to="/adminkorisnici" class="link-color">
                      <q-item-label>Korisnici</q-item-label>
                    </router-link>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-tab>
        </template>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

const imaToken = () => {
  return !!token;
};

const imaAdmin = () => {
  try {
    if (imaToken) {
      const decoded = jwtDecode(token);
      if (decoded.uloga === 0) {
        //ako je uloga 0 - admin
        return true;
      }
    }
    return false;
  } catch (error) {
    if (error.name !== "InvalidTokenError") {
      //da ne logga grešku za nepostojeći token bzvz
      console.log("Greška pri određivanju uloge: " + error);
    }
  }
};

const odjava = () => {
  if (window.confirm("Jeste li sigurni da se želite odjaviti?")) {
    localStorage.removeItem("token");
    window.location.reload();
    return;
  }
};

const tab = ref("dogadaj");

defineOptions({
  name: "MainLayout",
});
</script>

<style>
.btn--no-hover .q-focus-helper {
  display: none;
}

.link-color {
  text-decoration: none;
  color: inherit;
}
</style>
