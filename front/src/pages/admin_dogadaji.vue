<!-- Stranica na kojoj admin vidi popis svih dogadaja i njihovih osnovnih informacija.
Uz svaku od stavki koje ce biti u sklopu tablice nalaziti ce se i gumbovi za izmjenu i brisanje. -->

<template>
    <div class="q-pa-md">
      <q-table flat bordered title="Događaji" rows-per-page-label="Broj prikazanih redova:" :rows="dogadaji" :col-props="colProps" :columns="stupci">
        <template v-slot:body-cell-naziv_dogadaja="props">
          {{ props.row.naziv_dogadaja }}
        </template>
        <template v-slot:body-cell-datum_odrzavanja="props">
          {{ props.row.datum_odrzavanja }}
        </template>
        <template v-slot:body-cell-lokacija_dogadaja="props">
          {{ props.row.lokacija_dogadaja }}
        </template>
        <template v-slot:body-cell-datum_objave="props">
          {{ props.row.datum_objave }}
        </template>
        <template v-slot:body-cell-gumbovi="props">
          <q-btn-group spread>
            <q-btn color="accent" label="Izmijeni" icon-right="edit" @click="odiNaDetalje(props.row._id)" />
            <q-btn color="red" label="Obriši" icon-right="delete" @click="brisanje(props.row._id)" />
          </q-btn-group>
        </template>
        <template v-slot:body-cell-newsletter="props">
        <q-btn color="primary" label="Pošalji" icon-right="mail" @click="dohvatiKorisnikeZaNewsiSend(props.row._id,
        props.row.naziv_dogadaja, props.row.opis_dogadaja)" />
      </template>
      </q-table>
      <q-btn class="q-my-md" icon-right="add" color="primary" label="Dodaj novi događaj" @click="dodajDogadaj()" />
    </div>
  </template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dogadaji: [],
      stupci: [
        {
          name: "nazivDogadaja",
          required: true,
          label: "Naziv događaja",
          align: "left",
          field: "naziv_dogadaja",
          sortable: true,
        },
        {
          name: "datumOdrzavanja",
          required: true,  
          label: "Datum održavanja", 
          align: "left",
          field: "datum_odrzavanja",
          sortable: true,
        },
        {
          name: "lokacija",
          required: true,
          label: "Lokacija",
          align: "left",
          field: "lokacija_dogadaja",
          sortable: true,
        },
        {
          name: "datumObjave",
          required: true,
          label: "Datum objave",
          align: "left",
          field: "datum_objave",
          sortable: true,
        },
        {
          name: "gumbovi",
          label: "Dodatne mogućnosti",
          align: "center",
        },
        {
          name: "newsletter",
          label: "Newsletter",
          align: "center",
        },
      ],
    };
  },

  async mounted(){
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    this.dohvatiDogadaje();
  },

  methods: {
    async dohvatiDogadaje() {
      try {
        const response = await axios.get("http://localhost:3000/api/dogadaj");
        console.log("Response podaci:", response.data);

        this.dogadaji = response.data;
      } catch (error) {
        console.error("Greška pri dohvatu događaja", error);
      }
    },

    async dohvatiKorisnikeZaNewsiSend(id, subject, opis) {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get('http://localhost:3000/api/korisnikNewsletter', { headers });

        this.korisniciZaNews = []; //praznimo polje zbog nakupljanja

        response.data.forEach(korisnik => { //za svaki index polja
          this.korisniciZaNews.push(korisnik.email_korisnika);
        });

        const dataToSend = {
          to: this.korisniciZaNews,
          from: 'efett@veleri.hr',       //promjeniti u odgovarajuci mail**
          subject: "Pozivamo Vas na događaj - " + subject,
          naziv: subject,
          opis: opis,
          id: id,
        };

        //console.log(dataToSend);

        const send = await axios.post('http://localhost:3000/api/sendEmail', dataToSend);

        this.$q.notify({
          color: "positive",
          position: "top",
          message: "Uspješno slanje newsletter-a."
        });

      } catch (error) {
        console.error("Greška pri dohvatu korisnika za newsletter", error);
      }
    },

    odiNaDetalje(idDogadaja){
      this.$router.push({name: 'izmjenadogadaj', params: {id: idDogadaja}});
    },

    dodajDogadaj(){
      this.$router.push({path: 'dodajdogadaj'});
    },

    async obrisiDogadaj(idDogadaja){
      try{
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.delete("http://localhost:3000/api/brisanjeDogadaja/"+ idDogadaja, {headers});

        this.$q.notify({
          color: "positive",
          position: "top",
          message: "Uspješno brisanje događaja."
        });

        this.dohvatiDogadaje();

      }catch (error){
        //console.error("Greška pri brisanju događaja.");
        console.log(error);
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Greška pri brisanju događaja!",
          icon: "warning",
        });
      }
    },

    brisanje(id) {
            if (window.confirm("Jeste li sigurni da želite obrisati događaj?")) {
                this.obrisiDogadaj(id);
                return;
            }
        },

  },
};
</script>