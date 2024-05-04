<!-- Stranica na kojoj admin vidi popis svih korisnika i njihovih osnovnih informacija. Uz
svakog korisnika ce se nalaziti gumbovi Izmijeni i Obrisi. -->

<template>
    <div class="q-pa-md">
      <q-table flat bordered title="Korisnici" rows-per-page-label="Broj prikazanih redova:" :rows="korisnici" :col-props="colProps" :columns="stupci">
        <template v-slot:body-cell-korisnicko_ime="props">
          {{ props.row.korisnicko_ime }}
        </template>
        <template v-slot:body-cell-email_korisnika="props">
          {{ props.row.email_korisnika }}
        </template>
        <template v-slot:body-cell-datum_registracija="props">
          {{ props.row.datum_registracije }}
        </template>
        <template v-slot:body-cell-uloga="props">
          {{ props.row.uloga }}
        </template>
        <template v-slot:body-cell-gumbovi="props">
          <q-btn-group spread>
            <q-btn color="primary" label="Izmijeni" @click="odiNaDetalje(props.row._id)" />
            <q-btn color="red" label="Obriši" @click="brisanje(props.row._id)" />
          </q-btn-group>
        </template>
      </q-table>
    </div>
  </template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      korisnici: [],
      stupci: [
        {
          name: "korisnickoIme",
          required: true,
          label: "Korisničko ime",
          align: "left",
          field: "korisnicko_ime",
          sortable: true,
        },
        {
          name: "emailKorisnika",
          required: true,  
          label: "Email", 
          align: "left",
          field: "email_korisnika",
          sortable: true,
        },
        {
          name: "datumRegistracije",
          required: true,
          label: "Datum registracije",
          align: "left",
          field: "datum_registracije",
          sortable: true,
        },
        {
          name: "ulogaKorisnika",
          required: true,
          label: "Uloga",
          align: "left",
          field: "uloga",
          sortable: true,
        },
        {
          name: "gumbovi",
          label: "Dodatne mogućnosti",
          align: "center",
        },
      ],
    };
  },

  async mounted(){
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    this.dohvatiKorisnike();
  },

  computed: {
    displayedUloge() {
      return this.korisnici.map(korisnik => this.mapUloga(korisnik.uloga));
    }
  },

  methods: {
    async dohvatiKorisnike() {
      try {
        const response = await axios.get("http://localhost:3000/api/korisnik");
       //    console.log("Response podaci:", response.data);

        this.korisnici = response.data;
      } catch (error) {
        console.error("Greška pri dohvatu korisnika", error);
      }
    },
  },
};
</script>