<!-- Stranica na kojoj ce se nalaziti popis dogadaja, sortirane od najnovijih prema najstarijim.
Od svakog dogadaja ce biti prikazane neke osnovne informacije, a do slozenijih ce se doci klikom na njih. -->

<template>
  <div class="q-pa-sm row flex flex-center">
    <div v-for="dogadaj in dogadaji" :key="dogadaj._id" class="q-pa-lg" style="width: 30%">
      <q-card @click="pregledDogadaja(dogadaj._id)">
        <q-img v-if="dogadaj.slika_dogadaja" :src="dogadaj.slika_dogadaja" no-native-menu />
        <q-item-section>
          <q-item class="q-pa-sm text-bold text-orange">{{ dogadaj.naziv_dogadaja }} </q-item>
          <q-item class="q-pa-sm text-bold text-accent">{{ dogadaj.lokacija_dogadaja }} - {{ dogadaj.datum_odrzavanja }}, u {{ dogadaj.vrijeme_odrzavanja }}</q-item>
          <q-item v-if="dogadaj.datum_odrzavanja!==dogadaj.datum_zavrsetka && dogadaj.datum_zavrsetka != ''" class="q-pa-sm text-bold text-accent">Traje do: {{ dogadaj.datum_zavrsetka }}</q-item>
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

    pregledDogadaja(_id) {
      this.$router.push({ path: "dogadaj_detalji", query: { _id } });
    }
  },
};
</script>