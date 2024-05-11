<!-- Stranica na kojoj admin vidi popis svih korisnika i njihovih osnovnih informacija. Uz
svakog korisnika ce se nalaziti gumbovi Izmijeni i Obrisi. -->

<template>
  <div class="q-pa-md">
    <q-table flat bordered title="Korisnici" rows-per-page-label="Broj prikazanih redova:" :rows="korisnici"
      :col-props="colProps" :columns="stupci">
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
          <q-btn color="accent" label="Izmijeni" icon-right="edit" @click="odiNaDetalje(props.row._id)" />
          <q-btn color="red" label="Obriši" icon-right="delete" @click="brisanje(props.row._id)" />
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

  async mounted() {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    this.dohvatiKorisnike();
  },

  methods: {
    async dohvatiKorisnike() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get("http://localhost:3000/api/korisnik", {headers});
        //    console.log("Response podaci:", response.data);

        this.korisnici = response.data.map(korisnik => { //ovo je za prikaz naziva umjesto 0 i 1
          return {
            ...korisnik,
            uloga: korisnik.uloga === 0 ? 'admin' : 'korisnik'
          }
        });
      } catch (error) {
        console.error("Greška pri dohvatu korisnika", error);
      }
    },

    odiNaDetalje(idKorisnika) {
      this.$router.push({ name: 'adminkorisnikdetalji', params: { id: idKorisnika } });
    },

    async obrisiKorisnika(idKorisnika) {
      try{
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.delete("http://localhost:3000/api/brisanjeKorisnika/"+ idKorisnika, {headers});
        const response2 = await axios.delete("http://localhost:3000/api/brisanjeKorisnikaSKomentara/" + idKorisnika, {headers});
        console.log(response);

        this.$q.notify({
          color: "positive",
          position: "top",
          message: "Uspješno brisanje korisnika."
        });

        this.dohvatiKorisnike();

      }catch (error){
        console.log(error);
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Greška pri brisanju korisnika!",
          icon: "warning",
        });
      }
    },

    brisanje(idKorisnika) {
            if (window.confirm("Jeste li sigurni da želite obrisati korisnika?")) {
                this.obrisiKorisnika(idKorisnika);
                //window.location.reload();
                return;
            }
        },

  },
};
</script>