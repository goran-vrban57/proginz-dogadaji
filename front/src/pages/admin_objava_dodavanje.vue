<!-- Stranica kojom se omogucava adminu dodavanje novih objava. Osim sto mora 
zapisati osnovne informacije o objavi, moze ubaciti i sliku. -->

<template>
    <q-page style="margin-left: 2%; margin-right: 2%" window-height window-width>
        <div class="row">
            <h5 class="text-h3 text-primary q-my-md">Dodaj objavu</h5>
        </div>
        <q-form @submit="provjeraPolja()" class="q-gutter-md">
            <q-input v-model="objava.naziv_objave" label="Naziv objave" outlined dense type="text" />
            <q-input v-model="objava.opis_objave" outlined dense autogrow clearable label="Opis objave"/>
            <q-checkbox v-model="objava.dozvoljeno_komentiranje" label="Događaj traje više dana?" color="primary"/> <br>
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
                <q-btn size="lg" type="submit" label="Dodaj objavu" color="primary" />
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
            objava: {
                naziv_objave: "",
                opis_objave: "",
                datum_objave: "",
                slika_objave: "",
                dozvoljeno_komentiranje: false
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
        this.objava.datum_objave = formattedDate;

    },

    methods: {
        provjeraPolja() {
            if (this.objava.naziv_objave == "" || this.objava.opis_objave == ""
               ) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Nisu unesena sva potrebna polja.",
                    icon: "warning",
                });
            } else {
                this.dodajObjavu();
            }
        },

        async dodajObjavu() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.post("http://localhost:3000/api/dodavanjeObjava", this.objava, { headers });
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

                this.objava.slika_objave = this.base64String;
            } catch (error) {
                console.error(error);
                alert("Došlo je do pogreške prilikom kompresije slika.");
            }
        },

    },
};
</script>