<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>Promo</q-toolbar-title>
        <template v-if="!imaToken()">
          <router-link to="prijava" class="link-style">
            <q-btn flat label="Prijava" class="q-px-lg" style="color: white" />
          </router-link>
          <router-link to="/registracija" class="link-style">
            <q-btn flat label="Registracija" class="q-pa-sm" style="color: white" />
          </router-link>
        </template>
        <template v-if="imaToken()">
          <router-link to="/" class="link-style">
            <q-btn flat label="Odjava" class="q-pa-sm" style="color: white" @click="odjava()" />
          </router-link>
        </template>
      </q-toolbar>
      <q-tabs inline-label class="bg-primary text-white">
        <router-link to="dogadaji" style="text-decoration: none; color: inherit">
          <q-tab name="dogadaj">
            <span style="font-size: 14px">Događaj</span>
            <!--izgled je kao link nazalost, mozda CSS stil da bude cisti tekst-->
          </q-tab>
        </router-link>
        <router-link to="objave" style="text-decoration: none; color: inherit">
          <q-tab name="objave">
            <span style="font-size: 14px">Objave</span>
          </q-tab>
        </router-link>

        <template v-if="imaAdmin()">
          <q-tab name="admin">
            <q-btn-dropdown color="primary" class="btn--no-hover" :ripple="false" flat text-color="white"
              label="Administrator">
              <q-list>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <router-link to="admindogadaji" style="text-decoration: none; color: inherit">
                      <q-item-label>Događaji</q-item-label>
                    </router-link>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section>
                    <router-link to='adminobjave' style="text-decoration: none; color: inherit;">
                      <q-item-label>Objave</q-item-label>
                    </router-link>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section>
                    <router-link to="" style="text-decoration: none; color: inherit;">
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
</style>
