<!-- Pocetna stranica aplikacije. Sadrzavati ce osnovne informacije ili nekakvu dobrodoslicu. -->

<template>
    <section class="">
        <h4 class="q-mx-xl background-container flex flex-center">Nadolazeći događaji</h4>
        <div class="q-ma-sm row flex flex-center">
            <div v-for="dogadaj in dogadaji.slice(0, 3)" :key="dogadaj._id" class="q-pa-lg" style="width: 30%" >
                <q-card @click="pregledDogadaja(dogadaj._id)">
                    <q-img v-if="dogadaj.slika_dogadaja" :src="dogadaj.slika_dogadaja" no-native-menu />
                    <q-item-section>
                        <q-item class="q-pa-sm text-bold text-orange">{{ dogadaj.naziv_dogadaja }} </q-item>
                        <q-item class="q-pa-sm text-bold text-accent">{{ dogadaj.lokacija_dogadaja }} - {{ dogadaj.datum_odrzavanja }}, u {{ dogadaj.vrijeme_odrzavanja }}</q-item>
                        <q-item v-if="dogadaj.datum_odrzavanja!==dogadaj.datum_zavrsetka && dogadaj.datum_zavrsetka != ''" class="q-pa-sm text-bold text-accent">Traje do: {{ dogadaj.datum_zavrsetka }}</q-item>
                    </q-item-section>
                </q-card>
            </div>
        </div>
        <h6 class="text-right q-mx-xl">Za više kliknite <router-link to="dogadaji" style="color: orange">ovdje</router-link></h6>
    </section>
    <div class="q-mt-lg">
    <section class="q-mt-lg">
    <h4 class="q-mx-xl background-container flex flex-center">Objave</h4>
        <div class="q-pa-sm row flex flex-center">
      <div v-for="objava in objave.slice(0, 3)" :key="objava._id" class="q-pa-lg" style="width: 30%">
        <q-card @click="pregledObjava(objava._id)">
          <q-img v-if="objava.slika_objave" :src="objava.slika_objave" no-native-menu />
          <q-item-section>
            <q-item class="q-pa-sm text-bold text-orange">{{ objava.naziv_objave }} </q-item>
            <q-item class="q-pa-sm text-bold text-accent">{{ objava.datum_objave }} </q-item>
          </q-item-section>
        </q-card>
      </div>
    </div>
    <h6 class="text-right q-mx-xl">Za više kliknite <router-link to="objave" style="color: orange">ovdje</router-link></h6>
    </section>
</div>
  </template>
  <script>
  import axios from "axios";
  import { date } from "quasar";
  
  export default {
    data() {
      return {
        dogadaji: [],
        objave: [], 
        currentDate: date.formatDate(new Date(), "DD.MM.YYYY"),
      }
    },
  
    mounted() {
      this.dohvatiDogadaje();
      this.dohvatiObjave();

    },
    
    methods: {
      async dohvatiDogadaje() {
        try {
          const response = await axios.get("http://localhost:3000/api/dogadaj");
          
          response.data.forEach(dogadaj => {
            if (this.usporedbaDatuma(this.currentDate, dogadaj.datum_odrzavanja)) {
              this.dogadaji.push(dogadaj); //dodavanje onih događaja koji su nadolazeci (nisu vec odrzani (po datumu))
            }
          });


          this.dogadaji.sort((a, b) => {
            return this.usporedbaDatuma(a.datum_odrzavanja, b.datum_odrzavanja) ? -1 : 1; //rastuce, zaokrenuti 1 i -1 za padajuce
          });
          
        } catch (error) {
          console.log("Greška pri dohvaćanju podataka.", error);
        }

        console.log(this.dogadaji);
      },
  
      pregledDogadaja(_id) {
        this.$router.push({ path: "dogadaj_detalji", query: { _id } });
      },

      async dohvatiObjave() {
        try {
          const response = await axios.get("http://localhost:3000/api/objava");
          this.objave = response.data;  
          
          this.objave.sort((a, b) => {
            return this.usporedbaDatuma(a.datum_objave, b.datum_objave) ? 1 : -1; //padajuce
          });

        } catch (error) {
          console.log("Greška pri dohvaćanju podataka.", error);
        }
      },
  
      pregledObjava(_id) {
        this.$router.push({ path: "objavedetalji", query: { _id } });
      },
      
      usporedbaDatuma(array1, array2) {
        var elementiPolja1 = array1.split('.');
        var elementiPolja2 = array2.split('.');

        if (elementiPolja1.length !== elementiPolja2.length) {
          console.log("Polja imaju različiti broj elemenata.");
          return false;
        } else {
          if (elementiPolja1[2] < elementiPolja2[2]) {
            return true;
          } else if (elementiPolja1[2] === elementiPolja2[2]) {
            if (elementiPolja1[1] < elementiPolja2[1]) {
              return true;
            } else if (elementiPolja1[1] === elementiPolja2[1]) {
              if (elementiPolja1[0] <= elementiPolja2[0]) {
                return true;
              }
            }
          }
          return false;
        }
      },
    },
  };
</script>

<style>
.background-container {
  background-color: rgb(246, 243, 239);
  margin: 1% 3%;
  padding: 1% 3%;
  border-radius: 30px;
}
</style>