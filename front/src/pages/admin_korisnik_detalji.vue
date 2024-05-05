<!-- Stranica gdje admin ima pristup podacima o korisnicima i može ih mijenjati. Do ove stranice ce se dolaziti kroz
admin_korisnici -> gumb Izmijeni pokraj pojedinog korisnika. -->

<template>
    <q-page style="margin-left: 2%; margin-right: 2%" window-height window-width>
        <div class="row">
            <h5 class="text-h3 text-primary q-my-md">Ažuriranje korisnika</h5>
        </div>
        <q-form @submit="provjeraPolja()" class="q-gutter-md">
            <q-input v-model="korisnik_novo.korisnicko_ime" label="Korisničko ime" outlined dense type="text" />
            <p ref="p_ime" style="font-weight: bold;"></p>
            <q-input v-model="korisnik_novo.email_korisnika" label="E-mail adresa" outlined dense type="email" />
            <p ref="p_email" style="font-weight: bold;"></p>
            <q-input v-model="lozinka_korisnika" label="Nova lozinka" outlined dense type="password" />
            <q-input v-model="provjera_lozinke" label="Ponovite novu lozinku" outlined dense type="password" />
            <q-checkbox v-model="korisnik_novo.prima_newsletter" label="Primati će newsletter" />
            <p ref="p_newsletter" style="font-weight: bold;"></p>
            <div class="text-center q-py-xl">
                <q-btn size="lg" type="submit" label="Izmijeni korisnika" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue"
export default {
    data() {
        return {
            korisnik_trenutno: {
                korisnicko_ime: "",
                email_korisnika: "",
                lozinka_korisnika: "",
                prima_newsletter: false

            },
            korisnik_novo: {
                _id: this.$route.params._id,
                korisnicko_ime: "",
                email_korisnika: "",
                lozinka_korisnika: "",
                prima_newsletter: false
            },
            lozinka_korisnika: "",
            provjera_lozinke: ""
        };
    },
    async mounted() {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const id = this.$route.params.id;

        await this.dohvatiKorisnika(id, headers);
        this.ispisiPodatke();
    },

    methods: {
        async dohvatiKorisnika(id, headers) {
            try {
                const response = await axios.get("http://localhost:3000/api/korisnik/" + id, { headers });

                this.korisnik_trenutno = response.data;
                this.korisnik_novo = this.korisnik_trenutno;


            } catch (error) {
                console.error("Greška pri dohvatu korisnika", error);
            }
        },

        async ispisiPodatke() {
            try {
                this.$refs.p_ime.textContent = "Trenutno korisničko ime: " + this.korisnik_trenutno.korisnicko_ime;
                this.$refs.p_email.textContent = "Trenutni e-mail: " + this.korisnik_trenutno.email_korisnika;
                //linija ispod - ako je newsletter true, ispiše se prvi string, inače drugi
                this.korisnik_trenutno.prima_newsletter ? this.$refs.p_newsletter.textContent = "Korisnik trenutno prima newsletter." : this.$refs.p_newsletter.textContent = 'Korisnik trenutno ne prima newsletter.';
            } catch (error) {
                console.error("Greška pri upisivanju podataka ref", error);
            }
        },

        ocistiPolja() {
            this.korisnik_novo = "";
        },

        previosPage() {
            setTimeout(() => {
                window.history.back();
            }, 500);
        },

        provjeraPolja() {
            if (this.korisnik_novo.korisnicko_ime == "" && this.korisnik_novo.email_korisnika == ""
                && this.lozinka_korisnika == "" && this.provjera_lozinke == "") {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Nisu unesena sva potrebna polja.",
                    icon: "warning",
                });
            } else if (this.lozinka_korisnika != this.provjera_lozinke) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Lozinke nisu iste!",
                    icon: "warning",
                });
            } else {
                this.izmjenaKorisnika();
            }
        },

        async izmjenaKorisnika() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                this.korisnik_novo.lozinka_korisnika = this.lozinka_korisnika;

                const response = await axios.put("http://localhost:3000/api/izmjenaKorisnika/" + this.korisnik_novo._id, this.korisnik_novo, { headers });
                this.$q.notify({
                    color: "positive",
                    position: "top",
                    message: "Izmjena podataka uspješna!",
                });

                await this.dohvatiKorisnika(this.korisnik_novo._id, headers);
                this.ocistiPolja();

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
    }
}
</script>