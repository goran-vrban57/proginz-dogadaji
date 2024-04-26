<!-- Stranica kojom se omogucava adminu dodavanje novih dogadaja. Osim sto mora 
zapisati osnovne informacije o dogadaju, moze ubaciti i sliku. -->
<template>
    <q-page style="margin-left: 2%; margin-right: 2%" window-height window-width>
        <div class="row">
            <h5 ref="h_korisnik" class="text-h3 text-blue q-my-md">Dodaj događaj</h5>
        </div>
        <q-form @submit="provjeraPolja()">
            <q-input v-model="dogadaj.naziv_dogadaja" label="Naziv događaja" outlined dense type="text" />
            <q-input v-model="dogadaj.opis_dogadaja" label="Opis događaja" outlined dense type="text" />
            <q-input v-model="dogadaj.lokacija_dogadaja" label="Lokacija događaja" outlined dense type="text" />
            <q-input v-model="dogadaj.datum_odrzavanja" label="Datum održavanja" outlined dense type="text" />
            <q-input v-model="dogadaj.datum_zavrsetka" label="Datum završetka" outlined dense type="text" />
            <q-input v-model="dogadaj.datum_objave" label="Datum objave" outlined dense type="text" />
            <q-input v-model="dogadaj.slika_dogadaja" label="Adresa" outlined dense type="text" />
            <q-btn type="submit" label="Dodaj" color="primary" class="q-mt-md" />
        </q-form>
    </q-page>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            dogadaj: {
                naziv_dogadaja: "",
                opis_dogadaja: "",
                lokacija_dogadaja: "",
                datum_odrzavanja: "",
                datum_zavrsetka: "", //neovisan
                datum_objave: "",
                slika_dogadaja: "", //neovisan
            },

        };
    },

    mounted() {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
    },

    methods: {
        provjeraPolja() {
            if (this.dogadaj.naziv_dogadaja == "" && this.dogadaj.opis_dogadaja == ""
                && this.dogadaj.lokacija_dogadaja == "" && this.dogadaj.datum_odrzavanja == ""
                && this.dogadaj.datum_objave == "") {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Nisu unesena sva potrebna polja.",
                    icon: "warning",
                });
            } else {
                this.dodajDogadaj();
            }
        },

        async dodajDogadaj() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.post("http://localhost:3000/api/dodavanjeDogadaja/",this.dogadaj,{ headers }); 
                this.$q.notify({
                    color: "positive",
                    position: "top",
                    message: "Unos uspješan.",
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

        previosPage() {
            setTimeout(() => {
                window.history.back();
            }, 500);
        },

    },
};
</script>