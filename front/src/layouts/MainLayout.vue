<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>Promo</q-toolbar-title>
        <router-link to="prijava" class="link-style">
          <q-btn flat label="Prijava" class="q-px-lg" style="color: white;"/>
        </router-link>
        <router-link to="/registracija" class="link-style">
          <q-btn flat label="Registracija" class="q-pa-sm" style="color: white;"/>
        </router-link>
        <q-btn flat label="Odjava" class="q-pa-sm" style="color:white;" @click="odjava()"/>
      </q-toolbar>
      <q-tabs v-model="tab" inline-label class="bg-primary text-white">
        <q-tab name="dogadaj">
          <span style="font-size: 14px">Događaj</span>
        </q-tab>
        <q-tab name="objave">
          <span style="font-size: 14px">Objave</span>
        </q-tab>
        <q-tab name="admin">
          <q-btn-dropdown
            color="primary"
            flat
            text-color="white"
            label="Administrator"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="onItemClick('dogadajiAdmin')"
              >
                <q-item-section>
                  <q-item-label>Događaji</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="onItemClick('objaveAdmin')"
              >
                <q-item-section>
                  <q-item-label>Objave</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="onItemClick('korisniciAdmin')"
              >
                <q-item-section>
                  <q-item-label>Korisnici</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-tab>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const tab = ref("dogadaj");

defineOptions({
  name: "MainLayout",
});
</script>
 
