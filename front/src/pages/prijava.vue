<!-- Stranica za prijavu obicnog korisnika kroz korisnicko ime i lozinku-->

<template>
    <q-page class="justify-center items-center">
        <div class="q-pa-lg q-mx-xl">
            <h5 class="text-h3 text-primary text-center">Prijava</h5>
            <q-form class="q-gutter-md" @submit="provjeriPodatke">
                <q-input square filled v-model="podaci.korisnicko_ime" type="text" label="Korisničko ime" />
                <q-input square filled v-model="podaci.lozinka_korisnika" type="password" label="Lozinka" />
                <vue-recaptcha class="captcha" v-show="true" sitekey="6Ld7P9ApAAAAAICvGeO-n5OaqDoeolIcNE5j7an8" size="normal"
                    theme="light" hl="en" :loading-timeout="loadingTimeout" @verify="recaptchaVerified"
                    @expire="recaptchaExpired" @fail="recaptchaFailed" @error="recaptchaError" ref="vueRecaptcha">
                </vue-recaptcha>
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
import vueRecaptcha from 'vue3-recaptcha2';
export default {
    components: {
        vueRecaptcha
    },
    data() {
        return {
            podaci: {
                korisnicko_ime: '',
                lozinka_korisnika: '',
            },
            loadingTimeout: 30000,
            captchaProsla: false
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
                    setTimeout(() => {
                        this.$router.push("/").then(() => {
                            window.location.reload();
                        });
                    }, 1000); //pričeka jednu sek prije nego ode na iduću str, da se vidi notify

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
            if (this.captchaProsla === false) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Niste riješili captchu!",
                    icon: "warning",
                });
            } else { //ako je captcha riješena, ide se dalje s provjerama
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
        },

        //captcha

        recaptchaVerified(response) {
            this.captchaProsla = true;
        },
        recaptchaExpired() {
            this.$refs.vueRecaptcha.reset();
            this.captchaProsla = false;
        },
        recaptchaFailed() {
            this.$q.notify({
                color: "negative",
                position: "top",
                message: "Captcha je došla do problema. Molimo provjerite internetsku vezu.",
                icon: "warning",
            });
        },
        recaptchaError(reason) {
            this.$q.notify({
                color: "negative",
                position: "top",
                message: "Captcha je došla do problema. Molimo osvježite stranicu.",
                icon: "warning",
            });
        }
    }
}


</script>

<style>
.captcha{
    margin: 0 auto; 
    display: block; 
    width: fit-content; 
    padding-top: 3%;
}
</style>