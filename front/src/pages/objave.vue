<!-- Stranica na kojoj ce se nalaziti popis objava, sortirane od najnovijih prema najstarijim.
Od svake objave ce biti prikazane neke osnovne informacije, a do slozenijih ce se doci klikom na njih. -->

<template>
    <div class="q-pa-sm row flex flex-center">
      <div v-for="objava in objave" :key="objava._id" class="q-pa-lg" style="width: 30%">
        <q-card @click="pregledObjava(objava._id)">
          <q-img v-if="objava.slika_objave" :src="objava.slika_objave" no-native-menu />
          <q-item-section>
            <q-item class="q-pa-sm text-bold text-orange">{{ objava.naziv_objave }} </q-item>
            <q-item class="q-pa-sm text-bold text-accent">{{ objava.datum_objave }} </q-item>
          </q-item-section>
        </q-card>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    data() {
      return {
        objave: []
      }
    },
  
    mounted() {
      this.dohvatiObjave();
    },
    methods: {
      async dohvatiObjave() {
        try {
          const response = await axios.get("http://localhost:3000/api/objava");
          this.objave = response.data;
        } catch (error) {
          console.log("Greška pri dohvaćanju podataka.", error);
        }
      },
  
      pregledObjava(_id) {
        this.$router.push({ path: "objavedetalji", query: { _id } });
      }
    },
  };
  </script>