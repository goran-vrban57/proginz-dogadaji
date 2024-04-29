<!-- Stranica kojom se omogucava adminu dodavanje novih dogadaja. Osim sto mora 
zapisati osnovne informacije o dogadaju, moze ubaciti i sliku. -->
<template>
    <q-page style="margin-left: 2%; margin-right: 2%" window-height window-width>
        <div class="row">
            <h5 class="text-h3 text-primary q-my-md">Dodaj događaj</h5>
        </div>
        <q-form @submit="provjeraPolja()" class="q-gutter-md">
            <q-input v-model="dogadaj.naziv_dogadaja" label="Naziv događaja" outlined dense type="text" />
            <q-input v-model="dogadaj.opis_dogadaja" outlined dense autogrow clearable label="Opis događaja"
                />
            <q-input v-model="dogadaj.lokacija_dogadaja" label="Lokacija događaja" outlined dense type="text" />
            <q-checkbox v-model="viseDana" label="Događaj traje više dana?" color="primary" true-value="yes"
                false-value="no" /> <br>
            <q-date v-model="dogadaj.datum_odrzavanja" title="Datum održavanja" setToday mask="DD.MM.YYYY"></q-date>
            <template v-if="viseDana == 'yes'">
                <q-date v-model="dogadaj.datum_zavrsetka" title="Datum završetka" setToday mask="DD.MM.YYYY"></q-date>
            </template>
            <q-input v-model="dogadaj.vrijeme_odrzavanja" label="Vrijeme održavanja" outlined dense
                style="width: 300px;" type="time">
            </q-input>
            <div>
                <label for="file-upload" class="custom-file-upload">
                    <input type="file" name="file" accept="image/*" @change="convertImage($event)" />
                </label>
                <div v-if="base64String" class="q-py-lg">
                    <q-img :src="base64String"/>
                </div>
                <p>Ograničenje veličine slike je 2 MB.</p>
            </div>
            <div class="text-center q-py-xl">
                <q-btn size="lg" type="submit" label="Dodaj događaj" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>

<script>
import axios from "axios";
import imageCompression from "browser-image-compression";
import { date } from "quasar";
import { ref } from "vue"
export default {
    data() {
        return {
            viseDana: ref('no'),
            dogadaj: {
                naziv_dogadaja: "",
                opis_dogadaja: "",
                lokacija_dogadaja: "",
                datum_odrzavanja: "",
                datum_zavrsetka: "", //neovisan
                datum_objave: "", //automatski dodjeljen
                vrijeme_odrzavanja: "",
                slika_dogadaja: "", //neovisan
            },
            file: null,
            base64String: null,
            currentDate: new Date(),

        };
    },

    mounted() {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const formattedDate = date.formatDate(new Date(), "DD.MM.YYYY");
        this.dogadaj.datum_objave = formattedDate;

    },

    methods: {
        provjeraPolja() {
            if (this.dogadaj.naziv_dogadaja == "" || this.dogadaj.opis_dogadaja == ""
                || this.dogadaj.lokacija_dogadaja == "" || this.dogadaj.datum_odrzavanja == ""
                || this.dogadaj.datum_objave == "" || this.dogadaj.vrijeme_odrzavanja == "" 
                || (this.viseDana=='yes' && this.dogadaj.datum_zavrsetka=="")) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Nisu unesena sva potrebna polja.",
                    icon: "warning",
                });
            } else {

                var brojeviDatumaObjave = this.dogadaj.datum_objave.split('.');
                var brojeviDatumaOdrzavanja = this.dogadaj.datum_odrzavanja.split('.');
                var brojeviDatumaZavrsetka = this.dogadaj.datum_zavrsetka.split('.');

                /* console.log("Brojevi datuma objave: " + brojeviDatumaObjave);
                console.log("Brojevi datuma odrzavanja: " + brojeviDatumaOdrzavanja);
                console.log("Brojevi datuma zavrsetka: " + brojeviDatumaZavrsetka); */

                if (this.usporedbaDatuma(brojeviDatumaOdrzavanja, brojeviDatumaObjave)) { //ako je datum odrzavanja prije od datuma objave
                    this.$q.notify({
                        color: "negative",
                        position: "top",
                        message: "Datum održavanja ne može biti manji od današnjeg datuma.",
                        icon: "warning",
                    });
                } else if ((this.usporedbaDatuma(brojeviDatumaZavrsetka, brojeviDatumaOdrzavanja)) && this.viseDana == 'yes') {
                    //ako je datum zavrsetka prije datuma odrzavanja ^
                    this.$q.notify({
                        color: "negative",
                        position: "top",
                        message: "Datum početka održavanja ne može biti veći od datuma završetka događaja.",
                        icon: "warning",
                    });
                } else {
                    if (this.viseDana == 'no') {
                        this.dogadaj.datum_zavrsetka = "";
                    }
                    else if (this.viseDana == 'yes' && this.dogadaj.datum_odrzavanja == this.dogadaj.datum_zavrsetka) {
                        this.dogadaj.datum_zavrsetka = "";
                    }

                    this.dodajDogadaj();
                }
            }
        },

        async dodajDogadaj() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.post("http://localhost:3000/api/dodavanjeDogadaja/", this.dogadaj, { headers });
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

        usporedbaDatuma(array1, array2) {
            //[0] dani
            //[1] mjeseci
            //[2] godine
            if (array1.length !== array2.length) {
                console.log("Polja imaju različiti broj elemenata.");
                return false;
            } else {
                if (array1[2] < array2[2]) { // provjera godina
                    return true;
                } else if (array1[2] === array2[2]) { // ako su godine jednake provjeri mjesece
                    if (array1[1] < array2[1]) {
                        return true;
                    } else if (array1[1] === array2[1]) { // ako su mjeseci jednaki provjeri dane
                        if (array1[0] < array2[0]) {
                            return true;
                        }
                    }
                }
                return false;
            }


        },

        //od tu nadalje za SLIKU kod

        async convertImage(e) {
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };
            this.file = e.target.files[0];

            try {
                const compressedFile = await imageCompression(this.file, options);
                const reader = new FileReader();

                const promise = new Promise((resolve, reject) => {
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = (error) => reject(error);
                });

                reader.readAsDataURL(compressedFile);
                this.base64String = await promise;

                this.dogadaj.slika_dogadaja = this.base64String;
            } catch (error) {
                console.error(error);
                alert("Došlo je do pogreške prilikom kompresije slika.");
            }
        },

    },
};
</script>