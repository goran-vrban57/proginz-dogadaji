<!-- Stranica kojom admin dolazi do detalja pojedine objave. Do ove stranice ce se dolaziti kroz
admin_objave -> gumb Izmijeni pokraj pojedine objave. Podaci o objavi su izmjenjivi.-->

<template>
    <q-page style="margin-left: 2%; margin-right: 2%" window-height window-width>
        <div class="row">
            <h5 class="text-h3 text-primary q-my-md">Ažuriranje objave</h5>
        </div>
        <q-form @submit="provjeraPolja()" class="q-gutter-md">
            <q-input v-model="objava_novo.naziv_objave" label="Naziv objave" outlined dense type="text" />
            <p ref="p_naziv" style="font-weight: bold;"></p>
            <q-input v-model="objava_novo.opis_objave" outlined dense autogrow clearable label="Opis objave"/>
            <p ref="p_opis" style="font-weight: bold;"></p>
            <q-checkbox v-model="objava_novo.dozvoljeno_komentiranje" label="Događaj traje više dana?" color="primary"/> <br>
            <p style="font-weight: bold;">Trenutno dozvoljeno komentiranje: {{ this.dozvoljeno_komentiranje }}</p>
            <p ref="p_dozvola" style="font-weight: bold;"></p>

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
                <q-btn size="lg" type="submit" label="Izmijeni objavu" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>

<script>
import axios from "axios";
import imageCompression from "browser-image-compression";

export default {
    data() {
        return {
            objava_trenutno: {
                naziv_objave: "",
                opis_objave: "",
                datum_objave: "",
                slika_objave: "",
                dozvoljeno_komentiranje: null
            },

            objava_novo: {
                _id: this.$route.params._id,
                naziv_objave: "",
                opis_objave: "",
                datum_objave: "",
                slika_objave: "",
                dozvoljeno_komentiranje: null,
            },
            dozvoljeno_komentiranje: null,
           
            file: null,
            base64String: null,
            currentDate: new Date(),
        };
    },
    async mounted() {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const id = this.$route.params.id;

        await this.dohvatiObjavu(id, headers);
        this.ispisiPodatke();
    },

    methods: {
        async dohvatiObjavu(id, headers) {
            try {
                const response = await axios.get("http://localhost:3000/api/objava/" + id, { headers });

                this.objava_trenutno = response.data;
                this.objava_novo = this.objava_trenutno;
                this.dozvoljeno_komentiranje = this.objava_trenutno.dozvoljeno_komentiranje == true ? 'da' : 'ne';
                this.base64String = this.objava_trenutno.slika_objave;
            } catch (error) {
                console.error("Greška pri dohvatu objave", error);
            }
        },

        async ispisiPodatke() {
            try {
                this.$refs.p_naziv.textContent = "Trenutni naziv: " + this.objava_trenutno.naziv_objave;
                this.$refs.p_opis.textContent = "Trenutni opis: " + this.objava_trenutno.opis_objave;
               // this.$refs.p_dozvola = "Trenutno dozvoljeno komentiranje: " + this.objava_trenutno.dozvoljeno_komentiranje === true ? 'da' : 'ne';

            } catch (error) {
                console.error("Greška pri upisivanju podataka ref", error);
            }
        },

        ocistiPolja() {
            this.objava_novo = "";
        },

        previosPage() {
            setTimeout(() => {
                window.history.back();
            }, 500);
        },

        provjeraPolja() {
            if (this.objava_novo.naziv_objave == "" || this.objava_novo.opis_objave == ""
               ) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Nisu unesena sva potrebna polja.",
                    icon: "warning",
                });
            } else {
                this.izmjenaObjave();
            }
        },

        async izmjenaObjave() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.put("http://localhost:3000/api/izmjenaObjave/" + this.objava_novo._id, this.objava_novo, { headers });
                this.$q.notify({
                    color: "positive",
                    position: "top",
                    message: "Izmjena podataka uspješna!",
                });

                await this.dohvatiObjavu(this.objava_novo._id, headers);
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

                this.objava_novo.slika_objave = this.base64String;
            } catch (error) {
                console.error(error);
                alert("Došlo je do pogreške prilikom kompresije slika.");
            }
        },
    },
};
</script>