<!-- Stranica na kojoj ce se prikazati potpuni detalji o odredenoj objavi.
Takoder ce biti omoguceno i komentiranje u slucaju da je korisnik prijavljen. -->

<template>
    <div class="q-px-xl q-py-md flex flex-center">
        <q-img v-if="objava.slika_objave" :src="objava.slika_objave" no-native-menu class="q-mt-lg"
            style="border-radius: 50px; height: 500px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.35);" />
    </div>
    <div class="q-px-xl q-py-md flex flex-center">
        <q-item-section class="row">
            <q-item class="q-pa-sm text-bold text-orange text-h4">{{ objava.naziv_objave }} </q-item>
            <q-item class="q-pa-sm text-bold text-accent">Objavljeno {{ objava.datum_objave }}.</q-item>
            <q-item>{{ objava.opis_objave }}</q-item>
        </q-item-section>
    </div>

    <p v-if="!objava.dozvoljeno_komentiranje" class="q-pa-sm text-bold text-orange q-px-xl q-py-md">Komentari nisu
        dozvoljeni za ovu objavu.</p>
    <div v-if="objava.dozvoljeno_komentiranje" class="q-px-xl q-py-md"> <!--v-if mora svoj div imat-->
        <p class="q-pa-sm text-bold text-orange">Komentari:</p>
        <div v-for="komentar in komentari" :key="komentar.id_komentara" class="q-pa-sm">
            <q-card>
                <q-item class="q-pa-sm text-bold text-accent">{{ komentar.ime_korisnika }} (komentirano {{
                    komentar.datum_komentara }}.) </q-item>
                <q-item class="q-pa-sm">{{ komentar.sadrzaj_komentara }} </q-item>
                <div v-if="token && komentar.izmjenaOtvorena && trenutnoOtvorenZaIzmjenu === komentar.id_komentara"
                    class="q-pa-sm">
                    <q-input v-model="izmijenjen_sadrzaj" outlined dense autogrow clearable
                        label="Izmijenite komentar" />
                    <q-btn color="accent" label="Postavi izmjenu" @click="izmijeniKomentar(komentar)" />
                </div>

                <q-card-actions v-if="imaDozvoluEditing(komentar)">
                    <!--ovo bi smio moci samo onaj ciji je to kom ili admin-->
                    <q-btn color="accent" class="q-mt-sm" icon-right="edit" label="Izmijeni"
                        @click="otvoriZaIzmjenu(komentar)" />
                    <q-btn color="negative" class="q-mt-sm" icon-right="delete" label="Obriši"
                        @click="obrisiKomentar(komentar.id_komentara)" />
                </q-card-actions>
            </q-card>
        </div>
        <p v-if="token==null" style="padding-top: 1%;">Prijavite se kako bi komentirali.</p>
        <q-btn v-if="token && !dodavanjeOtvoreno" class="q-my-md" icon-right="add" color="primary"
            label="Dodaj novi komentar" @click="otvoriZaDodavanje()" />
            <div v-if="dodavanjeOtvoreno">
                <q-input v-model="novi_komentar.sadrzaj_komentara" outlined dense autogrow clearable
                label="Unesite komentar" />
                <q-btn class="q-my-md" color="primary" label="Postavi komentar" @click="dodajKomentar()" />
                </div>
                </div>

</template>

<script>
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { date } from "quasar";
import { io } from 'socket.io-client';
export default {
    computed: {
        id_objave() {
            return this.$route.query._id;
        },
    },
    data() {
        return {
            objava: {},
            dodavanjeOtvoreno: false,
            novi_komentar: {},
            komentari: [],
            token: "",
            trenutnoOtvorenZaIzmjenu: "",
            izmijenjen_sadrzaj: "",
            socket: null,
        }
    },

    

    async mounted() {
        try {
            const response = await axios.get("http://localhost:3000/api/objava/" + this.id_objave);
            this.objava = response.data;
            if (this.objava.komentari) {
                this.komentari = this.objava.komentari;
            }

            this.token = localStorage.getItem("token") || null;

            this.socket = io('http://localhost:3000', { transports: ['websocket'] });
            this.socket.on('objavljenKomentar', (podaci) => {
                if (this.id_objave === podaci.objavaId) {
                    this.prikaziObjavljenKomentar(podaci.komentar);
                }
            })
            this.socket.on('obrisanKomentar', (podaci) => {
                if (this.id_objave === podaci.objavaId) {
                    this.ukloniObrisaniKomentar(podaci.id_komentara);
                }
            })
            this.socket.on('promijenjenKomentar', (podaci) => {
                if (this.id_objave === podaci.objavaId) {
                    this.izmijeniPromijenjeniKomentar(podaci.komentar);
                }
            })
            this.socket.on("connect_error", (err) => {
                //console.log(err.message);
                //console.log(err.description);
            });
        } catch (error) {
            console.log("Greška pri dohvaćanju podataka.", error);
        }
    },

    methods: {

        imaDozvoluEditing(komentar) {
            if (this.token !== null) {
                const dekodiranToken = jwtDecode(this.token);
                if (dekodiranToken.id_korisnika === komentar.id_korisnika || dekodiranToken.uloga === 0) {
                    return true;
                }
            };

            return false;
        },
        otvoriZaDodavanje() {
            this.dodavanjeOtvoreno = true;
        },
        otvoriZaIzmjenu(komentar) {
            if (this.trenutnoOtvorenZaIzmjenu === komentar.id_komentara) { //evidentira se koji je trenutno otvoren da ih ne može biti više
                this.trenutnoOtvorenZaIzmjenu = null;
            } else {
                this.trenutnoOtvorenZaIzmjenu = komentar.id_komentara;
            }
            this.izmijenjen_sadrzaj = komentar.sadrzaj_komentara; //trenutni komentar se priprema za izmjenu
            komentar.izmjenaOtvorena === true ? komentar.izmjenaOtvorena = false : komentar.izmjenaOtvorena = true;
            //ako je polje za izmjenu vec otvoreno, zatvori ga; inace ga otvori     

        },

        resetirajStranicu() {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },

        prikaziObjavljenKomentar(komentar) {
            this.komentari.push(komentar);
        },
        ukloniObrisaniKomentar(id) {
            console.log("ID KOJI DOLAZI: "+id);
            const index = this.komentari.findIndex(komentar => komentar.id_komentara === parseInt(id));
            console.log("INDEKS KOMENTARA?: "+index);
            this.komentari.splice(index, 1);
        },
        izmijeniPromijenjeniKomentar(promijenjenKomentar) {
            const index = this.komentari.findIndex(komentar => komentar.id_komentara === parseInt(promijenjenKomentar.id_komentara));
            this.komentari[index].sadrzaj_komentara = promijenjenKomentar.sadrzaj_komentara;

        },

        async dodajKomentar() {
            if (this.novi_komentar.sadrzaj_komentara === "") {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Niste unijeli komentar!",
                    icon: "warning",
                });
            } else {
                const headers = { Authorization: `Bearer ${this.token}` };
                const dekodiranToken = jwtDecode(this.token);
                if (this.komentari.length >= 1) {
                    this.novi_komentar.id_komentara = this.komentari[this.komentari.length - 1].id_komentara + 1;
                } else {
                    this.novi_komentar.id_komentara = 1; //neka id 1 bude prvi komentar
                }
                this.novi_komentar.id_korisnika = dekodiranToken.id_korisnika; //provjeriti jer id mijenja naziv
                this.novi_komentar.ime_korisnika = dekodiranToken.korisnicko_ime;
                this.novi_komentar.datum_komentara = date.formatDate(new Date(), "DD.MM.YYYY");

                try {
                    const response = await axios.post("http://localhost:3000/api/objava/komentiranje/" + this.id_objave, this.novi_komentar, { headers });

                    this.$q.notify({
                        color: "positive",
                        position: "top",
                        message: "Unos uspješan.",
                    });

                    //zatvori i isprazni
                    this.dodavanjeOtvoreno = false;
                    this.novi_komentar.sadrzaj_komentara = "";


                    //this.resetirajStranicu();
                } catch (error) {
                    console.log("Greška pri slanju komentara:", error);
                    this.$q.notify({
                        color: "negative",
                        position: "top",
                        message: "Greška pri slanju komentara!",
                        icon: "warning",
                    });
                }
            }
        },
        async obrisiKomentar(id_komentara) {
            if (window.confirm("Jeste li sigurni da želite obrisati komentar?")) {
                try {
                    const headers = { Authorization: `Bearer ${this.token}` };
                    const response = await axios.delete("http://localhost:3000/api/objava/" + this.id_objave + "/brisanjeKomentara/" + id_komentara, { headers });

                    this.$q.notify({
                        color: "positive",
                        position: "top",
                        message: "Uspješno brisanje komentara."
                    });

                    //this.resetirajStranicu();

                } catch (error) {
                    console.log(error);
                    this.$q.notify({
                        color: "negative",
                        position: "top",
                        message: "Greška pri brisanju komentara!",
                        icon: "warning",
                    });
                }
            }
        },
        async izmijeniKomentar(komentar) {

            if (this.izmijenjen_sadrzaj === "") {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Unijeli ste prazan komentar!",
                });
            }
            try {
                const headers = { Authorization: `Bearer ${this.token}` };
                delete komentar.izmjenaOtvorena; //višak atribut
                komentar.sadrzaj_komentara = this.izmijenjen_sadrzaj;

                const response = await axios.put("http://localhost:3000/api/objava/" + this.id_objave + "/izmjenaKomentara/" + komentar.id_komentara, komentar, { headers });
                this.$q.notify({
                    color: "positive",
                    position: "top",
                    message: "Izmjena komentara uspješna!",
                });

                //this.resetirajStranicu();

            } catch (error) {
                this.$q.notify({
                    color: "negative",
                    position: "top",
                    message: "Neuspješna izmjena komentara.",
                });
                console.log(error);
            }
        }
    }
}

</script>