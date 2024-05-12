<!-- Stranica na kojoj ce se nalaziti popis objava, sortirane od najnovijih prema najstarijim.
Od svake objave ce biti prikazane neke osnovne informacije, a do slozenijih ce se doci klikom na njih. -->

<template>
  <h4 class="q-mx-xl background-container flex flex-center">Objave</h4>
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
  import { date } from "quasar";
  export default {
    data() {
      return {
        objave: [],
        currentDate: date.formatDate(new Date(), "DD.MM.YYYY"),
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
          this.objave.sort((a, b) => {
            return this.usporedbaDatuma(a.datum_objave, b.datum_objave) ? 1 : -1; //padajuce sortiranje
          });
        } catch (error) {
          console.log("Greška pri dohvaćanju podataka.", error);
        }
      },
  
      pregledObjava(_id) {
        this.$router.push({ path: "objavedetalji", query: { _id } });
      },

      usporedbaDatuma(array1, array2) {
        var elementiPolja1 = array1.split('.');
        var elementiPolja2 = array2.split('.');

        if (elementiPolja1.length !== elementiPolja2.length) {
          console.log("Polja imaju različiti broj elemenata.");
          return false;
        } else {
          if (elementiPolja1[2] < elementiPolja2[2]) {
            return true;
          } else if (elementiPolja1[2] === elementiPolja2[2]) {
            if (elementiPolja1[1] < elementiPolja2[1]) {
              return true;
            } else if (elementiPolja1[1] === elementiPolja2[1]) {
              if (elementiPolja1[0] <= elementiPolja2[0]) {
                return true;
              }
            }
          }
          return false;
        }
      },
    },
  };
  </script>

<style>
.background-container {
  background-color: rgb(246, 243, 239);
  margin: 1% 3%;
  padding: 1% 3%;
  border-radius: 30px;
}
</style>