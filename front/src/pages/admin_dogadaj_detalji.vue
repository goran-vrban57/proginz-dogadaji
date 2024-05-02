<!-- Stranica kojom admin dolazi do detalja pojedinog dogadaja. Do ove stranice ce se dolaziti kroz
admin_dogadaji -> gumb Izmijeni pokraj pojedinog dogadaja. Podaci o dogadaju su izmjenjivi.-->
<template>
    <q-page style="margin-left: 2%; margin-right: 2%" window-height window-width>
        <div class="row">
            <h5 class="text-h3 text-primary q-my-md">Ažuriranje događaja</h5>
        </div>
        <q-form @submit="provjeraPolja()" class="q-gutter-md">
            <q-input v-model="dogadaj_novo.naziv_dogadaja" label="Naziv događaja" outlined dense type="text" />
            <p ref="p_naziv" style="font-weight: bold;"></p>
            <q-input v-model="dogadaj_novo.opis_dogadaja" outlined dense autogrow clearable label="Opis događaja" />
            <p ref="p_opis" style="font-weight: bold;"></p>
            <q-input v-model="dogadaj_novo.lokacija_dogadaja" label="Lokacija događaja" outlined dense type="text" />
            <p ref="p_lokacija" style="font-weight: bold;"></p>
            <q-checkbox v-model="viseDana" label="Događaj traje više dana?" color="primary" true-value="yes"
                false-value="no" /> <br>

            <p ref="p_datum_objave" style="font-weight: bold;"></p>
            <p ref="p_datum_odrzavanja" style="font-weight: bold;"></p>
            <p ref="p_datum_zavrsetka" :style="{ fontWeight: 'bold', display: viseDana === 'yes' ? 'block' : 'none' }"></p>           

            <q-date v-model="dogadaj_novo.datum_odrzavanja" title="Datum održavanja" setToday
                mask="DD.MM.YYYY"></q-date>
            <template v-if="viseDana == 'yes'">
                <q-date v-model="dogadaj_novo.datum_zavrsetka" title="Datum završetka" setToday
                    mask="DD.MM.YYYY"></q-date>
            </template>
            <q-input v-model="dogadaj_novo.vrijeme_odrzavanja" label="Vrijeme održavanja" outlined dense
                style="width: 300px;" type="time">
            </q-input>
            <p ref="p_vrijeme_odrzavanja" style="font-weight: bold;"></p>

            <!--slika pocinje ovdje-->
            <div>
                <label for="file-upload" class="custom-file-upload">
                    <input type="file" name="file" accept="image/*" @change="convertImage($event)" />
                </label>
                <div v-if="base64String" class="q-py-lg">
                    <q-img :src="base64String"/>
                </div>
                <p>Ograničenje veličine slike je 3 MB.</p>
            </div>

            <div class="text-center q-py-xl">
                <q-btn size="lg" type="submit" label="Izmijeni događaj" color="primary" />
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
            dogadaj_trenutno: {
                naziv_dogadaja: "",
                opis_dogadaja: "",
                lokacija_dogadaja: "",
                datum_odrzavanja: "",
                datum_zavrsetka: "", //neovisan
                datum_objave: "", //automatski dodjeljen
                vrijeme_odrzavanja: "",
                slika_dogadaja: "", //neovisan
            },
            dogadaj_novo: {
                _id: this.$route.params._id,
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
    async mounted() {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const id = this.$route.params.id;

        await this.dohvatiDogadaj(id, headers);
        this.ispisiPodatke();
    },

    methods: {
        async dohvatiDogadaj(id, headers) {
            try {
                const response = await axios.get("http://localhost:3000/api/dogadaj/" + id, { headers });

                this.dogadaj_trenutno = response.data;
                this.dogadaj_novo = this.dogadaj_trenutno;
                this.base64String = this.dogadaj_trenutno.slika_dogadaja;
                if (this.dogadaj_novo.datum_zavrsetka != "") {
                    this.viseDana = 'yes';
                }
                else {
                    this.viseDana = 'no';
                }
            } catch (error) {
                console.error("Greška pri dohvatu događaja", error);
            }
        },

        async ispisiPodatke() {
            try {
                this.$refs.p_naziv.textContent = "Trenutni naziv: " + this.dogadaj_trenutno.naziv_dogadaja;
                this.$refs.p_opis.textContent = "Trenutni opis: " + this.dogadaj_trenutno.opis_dogadaja;
                this.$refs.p_lokacija.textContent = "Trenutna lokacija: " + this.dogadaj_trenutno.lokacija_dogadaja;
                this.$refs.p_datum_objave.textContent = "Datum objave: " + this.dogadaj_trenutno.datum_objave;
                this.$refs.p_datum_odrzavanja.textContent = "Trenutni datum održavanja: " + this.dogadaj_trenutno.datum_odrzavanja;
                this.$refs.p_datum_zavrsetka.textContent = "Trenutni datum završetka: " + this.dogadaj_trenutno.datum_zavrsetka;
                this.$refs.p_vrijeme_odrzavanja.textContent = "Trenutno vrijeme održavanja: " + this.dogadaj_trenutno.vrijeme_odrzavanja;

            } catch (error) {
                console.error("Greška pri upisivanju podataka ref", error);
            }
        },

        ocistiPolja() {
            this.dogadaj_novo = "";
        },

        previosPage() {
            setTimeout(() => {
                window.history.back();
            }, 500);
        },

        provjeraPolja() {
            if (this.dogadaj_novo.naziv_dogadaja == "" || this.dogadaj_novo.opis_dogadaja == ""
                || this.dogadaj_novo.lokacija_dogadaja == "" || this.dogadaj_novo.datum_odrzavanja == ""
                || this.dogadaj_novo.datum_objave == "" || this.dogadaj_novo.vrijeme_odrzavanja == ""
                || (this.viseDana == 'yes' && this.dogadaj_novo.datum_zavrsetka == "")) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Nisu unesena sva potrebna polja.",
                    icon: "warning",
                });
            } else {
                var brojeviDatumaObjave = this.dogadaj_novo.datum_objave.split('.');
                var brojeviDatumaOdrzavanja = this.dogadaj_novo.datum_odrzavanja.split('.');
                var brojeviDatumaZavrsetka = this.dogadaj_novo.datum_zavrsetka.split('.');
                var brojeviTrenutnogDatuma = date.formatDate(this.currentDate, 'DD.MM.YYYY').split('.');

                console.log(brojeviTrenutnogDatuma);

                /* console.log("Brojevi datuma objave: " + brojeviDatumaObjave);
                console.log("Brojevi datuma odrzavanja: " + brojeviDatumaOdrzavanja);
                console.log("Brojevi datuma zavrsetka: " + brojeviDatumaZavrsetka); */

                if (this.usporedbaDatuma(brojeviDatumaOdrzavanja, brojeviTrenutnogDatuma)) { //ako je datum odrzavanja prije od današnjeg datuma
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
                        this.dogadaj_novo.datum_zavrsetka = "";
                    }
                    else if (this.viseDana == 'yes' && this.dogadaj_novo.datum_odrzavanja == this.dogadaj_novo.datum_zavrsetka) {
                        this.dogadaj_novo.datum_zavrsetka = "";
                    }
                    this.izmjenaDogadaja();
                }
            }
        },

        async izmjenaDogadaja() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.put("http://localhost:3000/api/izmjenaDogadaja/" + this.dogadaj_novo._id, this.dogadaj_novo, { headers });
                this.$q.notify({
                    color: "positive",
                    position: "top",
                    message: "Izmjena podataka uspješna!",
                });

                await this.dohvatiDogadaj(this.dogadaj_novo._id, headers);
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
                maxSizeMB: 3,
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

                this.dogadaj_novo.slika_dogadaja = this.base64String;
            } catch (error) {
                console.error(error);
                alert("Došlo je do pogreške prilikom kompresije slika.");
            }
        },
    },
};
</script>