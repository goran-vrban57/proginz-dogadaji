<!-- Stranica na kojoj ce se prikazati potpuni detalji o odredenoj objavi.
Takoder ce biti omoguceno i komentiranje u slucaju da je korisnik prijavljen. -->

<template>
    <div class="q-px-xl q-py-md flex flex-center">
        <q-img v-if="objava.slika_objave" :src="objava.slika_objave" no-native-menu class="q-mt-lg"
        style="border-radius: 50px; height: 500px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.35);"/>
    </div>
    <div class="q-px-xl q-py-md flex flex-center">
        <q-item-section class="row">
            <q-item class="q-pa-sm text-bold text-orange">{{ objava.naziv_objave }} </q-item>
            <q-item class="q-pa-sm text-bold text-accent">{{ objava.datum_objave }}</q-item>
            <q-item>{{ objava.opis_objave }}</q-item>
        </q-item-section>
    </div>
 </template>

<script>

import axios from 'axios';
export default {
computed: {
    id_objave() {
        return this.$route.query._id;
    },
},
data() {
    return {
        objava: {}
    }
},

async mounted() {
    try {
        const response = await axios.get("http://localhost:3000/api/objava/" + this.id_objave);
        this.objava = response.data;
    } catch (error) {
        console.log("Greška pri dohvaćanju podataka.", error);
    }
}
}

</script>