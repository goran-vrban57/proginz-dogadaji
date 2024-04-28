<!-- Stranica na kojoj ce se nalaziti popis dogadaja, sortirane od najnovijih prema najstarijim.
Od svakog dogadaja ce biti prikazane neke osnovne informacije, a do slozenijih ce se doci klikom na njih. -->

<template>
    <div class="q-pa-sm row flex flex-center">
      <div v-for="dogadaj in dogadaji" :key="dogadaj.id_dogadaja" class="q-pa-lg" style="width: 30%">
        <q-card> <!--@click="navigateToItem(item.id_dogadaja)-->
          <q-img v-if="dogadaj.slika_dogadaja" :src="dogadaj.slika_dogadaja" no-native-menu />
          <q-item-section>
            <q-item class="q-pa-sm text-bold text-orange">{{ dogadaj.naziv_dogadaja }} </q-item>
            <q-item class="q-pa-sm text-bold text-accent">{{ dogadaj.lokacija_dogadaja }} </q-item>
            <q-item>Datum i vrijeme održavanja: {{ dogadaj.datum_odrzavanja }}</q-item>
            <q-item>Datum i vrijeme završetka: {{ dogadaj.datum_zavrsetka }}</q-item> <!--staviti da je ovo sakriveno ako je dat. održ = završ? ili čisto ne imati?-->
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
          dogadaji: []
      }
    },
  
    mounted() {
      this.dohvatiDogadaje();
    },
    methods: {
      async dohvatiDogadaje() {
        try {
          const response = await axios.get("http://localhost:3000/api/dogadaj");
          this.dogadaji = response.data;
        } catch (error) {
          console.log("Greška pri dohvaćanju podataka.", error);
        }
      },
    },
  };
  </script>
  