<!-- Stranica na kojoj ce se nalaziti popis dogadaja, sortirane od najnovijih prema najstarijim.
Od svakog dogadaja ce biti prikazane neke osnovne informacije, a do slozenijih ce se doci klikom na njih. -->


<template>
    <q-page>
      <h4>Citanje iz baze bez uvjeta</h4>
      <h3>Događaji</h3>
      <div v-if="dogadaji.length > 0">
        <p v-for="dogadaj in dogadaji" :key="dogadaj.id">Naziv: {{ dogadaj.naziv_dogadaja }} <br>Datum: {{ dogadaj.datum_odrzavanja }} <br>Lokacija: {{ dogadaj.lokacija_dogadaja }} <br> <br></p>
      </div>
      <p v-else>Nije evidentiran niti jedan događaj.</p>
    </q-page>
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
      this.dohvatiBooks();
    },
    methods: {
      async dohvatiBooks() {
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
  