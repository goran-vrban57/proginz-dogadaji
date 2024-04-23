<!-- Stranica za registraciju obicnog korisnika kako bi se mogao prijaviti. 
Korisnicko ime, e-mail adresa, lozinka/potvrdi lozinku.-->

<template>
    <q-page class="justify-center items-center">
        <div class="q-pa-lg q-mx-xl">
            <h5 class="text-h3 text-primary text-center">Registracija</h5>
            <q-form class="q-gutter-md" @submit="provjeriPodatke">
                <q-input square filled v-model="podaci.korisnicko_ime" type="text" label="Vaše korisničko ime" />
                <q-input square filled v-model="podaci.email_korisnika" type="email" label="Vaš email" />
                <q-input square filled v-model="podaci.lozinka_korisnika" type="password" label="Lozinka" />
                <q-input square filled v-model="provjera_lozinke" type="password" label="Ponovite lozinku" />
                <q-checkbox v-model="podaci.prima_newsletter" label="Želim primati newsletter" />
                <div class="text-center q-pt-xl"><q-btn size="lg" type="submit" label="Registriraj se"
                        color="primary" /></div>
                <router-link to="prijava" class="link-style">
                    <p class="text-accent text-center">Već ste registrirani?</p>
                </router-link>
            </q-form>
        </div>
    </q-page>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            podaci: {
                korisnicko_ime: '',
                email_korisnika: '',
                lozinka_korisnika: '',
                datum_registracije: '',
                prima_newsletter: true
            },
            provjera_lozinke: ''

        }
    },
    methods: {

        async registracija() {
            try {
                this.podaci.datum_registracije = new Date();
                const response = await axios.post("http://localhost:3000/api/registracija", this.podaci);

                this.$q.notify({
                    color: "positive",
                    position: "top",
                    message: "Registracija uspješna.",
                });
            } catch (error) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Registracija neuspješna!",
                    icon: "warning",
                });
                console.log("Greška pri registraciji: " + error);
            }
        },

        provjeriPodatke() {
            if (this.podaci.korisnicko_ime.trim() === '' || this.podaci.email_korisnika.trim() === ''
                || this.podaci.lozinka_korisnika == '' || this.provjera_lozinke == '') { //provjerava sve stavke od 'podaci'
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Niste unijeli sve podatke!",
                    icon: "warning",
                });
            } else if (this.podaci.lozinka_korisnika !== this.provjera_lozinke) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Lozinke nisu iste!",
                    icon: "warning",
                });
            } else {
                this.registracija();
            }
        }
    }
}


</script>