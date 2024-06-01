<template>
    <q-page style="margin-left: 2%; margin-right: 2%" window-height window-width>
        <div class="row">
            <h5 class="text-h3 text-primary q-my-md">Ažuriranje podataka</h5>
        </div>
        <q-form @submit="provjeraPolja()" class="q-gutter-md">
            <q-input v-model="korisnik.korisnicko_ime" label="Korisničko ime" outlined dense type="text" />
            <q-input v-model="korisnik.email_korisnika" label="E-mail adresa" outlined dense type="email" />
            <q-checkbox v-model="promjenaLozinke" label="Želim promjeniti lozinku" color="primary" />
            <q-checkbox v-model="korisnik.prima_newsletter" label="Želim primati newsletter" />
            <template v-if="promjenaLozinke">
                <q-input v-model="lozinka_korisnika" label="Nova lozinka" outlined dense type="password" />
                <q-input v-model="provjera_lozinke" label="Ponovite novu lozinku" outlined dense type="password" />
            </template>
            <div class="text-left q-py-md">
                <q-btn size="lg" type="submit" label="Izmijeni podatke" color="primary" style="margin-right: 1.5%;" />
                <q-btn size="lg" label="Obriši moj račun" color="negative" @click="brisanje(korisnik._id)" />
            </div>
        </q-form>
    </q-page>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ref } from "vue"
export default {
    data() {
        return {
            korisnik: {
                _id: "",
                korisnicko_ime: "",
                email_korisnika: "",
                lozinka_korisnika: "",
                prima_newsletter: null,
            },
            promjenaLozinke: false,
            lozinka_korisnika: "",
            provjera_lozinke: ""
        };
    },
    async mounted() {
        const token = localStorage.getItem("token");
        const userId = this.getUserIdFromToken(token);

        await this.dohvatiKorisnika(userId);
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

        previosPage() {
            setTimeout(() => {
                window.history.back();
            }, 500);
        },

        provjeraPolja() {
            if (this.korisnik.korisnicko_ime == "" && this.korisnik.email_korisnika == ""
                && this.lozinka_korisnika == "" && this.provjera_lozinke == "" && this.promjenaLozinke == true) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Nisu unesena sva potrebna polja.",
                    icon: "warning",
                });
            } else if (this.lozinka_korisnika != this.provjera_lozinke && this.promjenaLozinke == true) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Lozinke nisu iste!",
                    icon: "warning",
                });
            } else if (this.promjenaLozinke == false) {
                this.korisnik.lozinka_korisnika = "";
                this.lozinka_korisnika = "";
                this.provjera_lozinke = "";
                this.izmjenaKorisnika();
            } else {
                this.izmjenaKorisnika();
            }
        },

        async izmjenaKorisnika() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                this.korisnik.lozinka_korisnika = this.lozinka_korisnika;

                const response = await axios.put("http://localhost:3000/api/izmjenaKorisnikaSelf/" + this.korisnik._id, this.korisnik, { headers });
                this.$q.notify({
                    color: "positive",
                    position: "top",
                    message: "Izmjena podataka uspješna!",
                });

                this.previosPage();
            } catch (error) {
                console.error(error)
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Unos podataka neuspješan.",
                });
                console.log(error);
            }
        },

        async obrisiRacun(userId) {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.delete("http://localhost:3000/api/brisanjeKorisnika/" + userId, { headers });
                const response2 = await axios.delete("http://localhost:3000/api/brisanjeKorisnikaSKomentara/" + userId, {headers});

                localStorage.removeItem("token");
                await this.$router.push({ path: '/' });
                window.location.reload();


                this.$q.notify({
                    color: "positive",
                    position: "top",
                    message: "Uspješno brisanje računa."
                });
            } catch (error) {
                console.log(error);
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Greška pri brisanju računa!",
                    icon: "warning",
                });
            }
        },

        brisanje(userId) {
            if (window.confirm("Jeste li sigurni da želite obrisati Vaš račun?\nOva akcija ne može biti poništena!")) {
                this.obrisiRacun(userId);
                return;
            }
        },
    }
}
</script>