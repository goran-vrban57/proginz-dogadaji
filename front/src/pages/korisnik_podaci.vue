<template>
  <div class="q-pa-xl">
    <div class="">
      <div class="row">
        <h5 class="text-h3 text-primary q-mt-md q-mb-md">Vaši podaci</h5>
      </div>
      <div class="q-mx-xl background-container" >
        <p>Korisničko ime: {{ korisnik.korisnicko_ime }}</p>
        <p>Email: {{ korisnik.email_korisnika }}</p>
        <p>Datum registracije: {{ korisnik.datum_registracije }}</p>
        <p>Primate newsletter: {{ primaNewsLetter(korisnik.prima_newsletter) }}</p>
      </div>
    </div>
    <q-btn class="q-mx-md q-mt-md" size="" color="primary" label="Izmjena podataka" @click="odiNaDetalje" />
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export default {
  data() {
    return {
      korisnik: {
        _id: "",
        korisnicko_ime: "",
        email_korisnika: "",
        lozinka_korisnika: "",
        datum_registracije: "",
        prima_newsletter: null,
      },
      vrijednostNews: null,

    };
  },

  async mounted() {
    try {
      const token = localStorage.getItem("token");
      const userId = this.getUserIdFromToken(token);

      await this.dohvatiKorisnika(userId);
      this.primaNewsLetter(this.korisnik.prima_newsletter)

    } catch (error) {
      console.error("Greška prilikom dohvaćanja podataka.", error);
    }
  },

  methods: {
    getUserIdFromToken(token) {
      var dekodiraniToken = jwtDecode(token);
      var id_korisnika = dekodiraniToken["id_korisnika"]
      return id_korisnika
    },

    async dohvatiKorisnika(userId) {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get("http://localhost:3000/api/korisnikSelf/" + userId, { headers });
        this.korisnik = response.data;
      } catch (error) {
        console.error("Greška pri čitanju podataka korisnika:", error);
        throw error;
      }
    },

    primaNewsLetter(newsLetter) {
      if (newsLetter == true) {
        return 'da';
      } else {
        return 'ne';
      }
    },

    odiNaDetalje() {
      this.$router.push({ path: 'mojipodacidetalji' })
    }
  }
}


</script>

<style>
.podaci{
  text-size-adjust: 30px;
}

.background-container {
  background-color: rgb(246, 243, 239);
  padding: 3% 3% 1% 3%;
  display: inline-block;
  border-radius: 30px;
}

.q-mt-md {
  margin-top: 20px;
}
</style>