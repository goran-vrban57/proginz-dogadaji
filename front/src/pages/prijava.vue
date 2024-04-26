<!-- Stranica za prijavu obicnog korisnika kroz korisnicko ime i lozinku-->

<template>
    <q-page class="justify-center items-center">
        <div class="q-pa-lg q-mx-xl">
            <h5 class="text-h3 text-primary text-center">Prijava</h5>
            <q-form class="q-gutter-md" @submit="provjeriPodatke">
                <q-input square filled v-model="podaci.korisnicko_ime" type="text" label="Korisničko ime" />
                <q-input square filled v-model="podaci.lozinka_korisnika" type="password" label="Lozinka" />
                <div class="text-center q-pt-xl"><q-btn size="lg" type="submit" label="Prijavi se" color="primary" />
                </div>
                <router-link to="registracija" class="link-style">
                    <p class="text-accent text-center">Niste registrirani?</p>
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
                lozinka_korisnika: '',
            }
        }
    },
    methods: {

        async prijava() {
            try {
                const response = await axios.post("http://localhost:3000/api/login", this.podaci);
                if (response.data) {
                    localStorage.setItem("token", response.data); //response.data je sam token! ako se doda još neki info u response, onda ide response.data.token
                    this.$q.notify({
                        color: "positive",
                        position: "top",
                        message: "Prijava uspješna.",
                    });
                    this.$router.push("/pocetna").then(() => {
                window.location.reload(); });

                } else {
                    throw new Error("Token nije zaprimljen!"); //neš nije dobro
                }
            } catch (error) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Prijava neuspješna! Provjerite korisničko ime i lozinku.",
                    icon: "warning",
                });
                console.log("Greška pri prijavi: " + error);
            }
        },

        provjeriPodatke() {
            if (this.podaci.korisnicko_ime.trim() === '' || this.podaci.lozinka_korisnika == '') {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Niste unijeli sve podatke!",
                    icon: "warning",
                });
            } else {
                this.prijava();
            }
        }
    }
}


</script>