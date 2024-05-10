<!-- Stranica na kojoj ce se prikazati potpuni detalji o odredenom dogadanju.
Komentiranje na dogadanja nije moguce. -->

<template>
        <div class="q-px-xl q-py-md flex flex-center">
            <q-img v-if="dogadaj.slika_dogadaja" :src="dogadaj.slika_dogadaja" no-native-menu class="q-mt-lg"
            style="border-radius: 50px; height: 500px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.35);"/>
        </div>
        <div class="q-px-xl q-py-md flex flex-center">
            <q-item-section class="row">
                <q-item class="q-pa-sm text-bold text-orange text-h4">{{ dogadaj.naziv_dogadaja }} </q-item>
                <q-item class="q-pa-sm text-bold text-accent">{{ dogadaj.lokacija_dogadaja }} - {{ dogadaj.datum_odrzavanja }}, u {{ dogadaj.vrijeme_odrzavanja }}</q-item>
                <q-item v-if="dogadaj.datum_odrzavanja!==dogadaj.datum_zavrsetka && dogadaj.datum_zavrsetka != ''"
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