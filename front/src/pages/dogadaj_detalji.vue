<!-- Stranica na kojoj ce se prikazati potpuni detalji o odredenom dogadanju.
Komentiranje na dogadanja nije moguce. -->

<template>
            <div class="q-px-xl q-py-md flex flex-center">
            <q-img v-if="dogadaj.slika_dogadaja" :src="dogadaj.slika_dogadaja" no-native-menu style="height:500px"/>
        </div>
        <div class="q-px-xl q-py-md flex flex-center">
            <q-item-section class="row">
                <q-item class="q-pa-sm text-bold text-orange">{{ dogadaj.naziv_dogadaja }} </q-item>
                <q-item class="q-pa-sm text-bold text-accent">{{ dogadaj.lokacija_dogadaja }} </q-item>
                <q-item class="q-pa-sm text-bold text-accent">{{ dogadaj.datum_odrzavanja }}</q-item>
                <q-item v-if="dogadaj.datum_odrzavanja !== dogadaj.datum_zavrsetka"
                    class="q-pa-sm text-bold text-accent">Traje do: {{ dogadaj.datum_zavrsetka }}</q-item>
                <q-item>{{ dogadaj.opis_dogadaja }}</q-item>
            </q-item-section>
        </div>
</template>

<script>

import axios from 'axios';
export default {
    computed: {
        id_dogadaja() {
            return this.$route.query._id;
        },
    },
    data() {
        return {
            dogadaj: {}
        }
    },

    async mounted() {
        try {
            const response = await axios.get("http://localhost:3000/api/dogadaj/" + this.id_dogadaja);
            this.dogadaj = response.data;
        } catch (error) {
            console.log("Greška pri dohvaćanju podataka.", error);
        }
    }
}

</script>