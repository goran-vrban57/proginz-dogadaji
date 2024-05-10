<!-- Stranica na kojoj admin vidi popis svih objava i njihovih osnovnih informacija.
Uz svaku od stavki koje ce biti u sklopu tablice nalaziti ce se i gumbovi - izmjena i brisanje. -->

<template>
  <div class="q-pa-md">
    <q-table flat bordered title="Objave" rows-per-page-label="Broj prikazanih redova:" :rows="objave"
      :col-props="colProps" :columns="stupci">
      <template v-slot:body-cell-naziv_objave="props">
        {{ props.row.naziv_objave }}
      </template>
      <template v-slot:body-cell-datum_objave="props">
        {{ props.row.datum_objave }}
      </template>
      <template v-slot:body-cell-dozvoljeno_komentiranje="props">
        {{ props.row.dozvoljeno_komentiranje }}
      </template>
      <template v-slot:body-cell-gumbovi="props">
        <q-btn-group spread>
          <q-btn color="accent" label="Izmijeni" icon-right="edit" @click="odiNaDetalje(props.row._id)" />
          <q-btn color="red" label="Obriši" icon-right="delete" @click="brisanje(props.row._id)" />
        </q-btn-group>
      </template>
    </q-table>
    <q-btn class="q-my-md" icon-right="add" color="primary" label="Dodaj novu objavu" @click="dodajObjavu()" />
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      objave: [],
      stupci: [
        {
          name: "nazivObjave",
          required: true,
          label: "Naziv objave",
          align: "left",
          field: "naziv_objave",
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
          name: "dozvoljenoKomentiranje",
          required: true,
          label: "Komentiranje",
          align: "left",
          field: "dozvoljeno_komentiranje",
          sortable: true,
        },
        {
          name: "gumbovi",
          label: "Dodatne mogućnosti",
          align: "center",
        },
      ],
    };
  },

  async mounted() {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    this.dohvatiObjave();
    this.komentiranje(this.objava.dozvoljeno_komentiranje);
  },

  methods: {
    async dohvatiObjave() {
      try {
        const response = await axios.get("http://localhost:3000/api/objava");
        console.log("Response podaci:", response.data);
        
        //this.objave = response.data;
        this.objave = response.data.map(objava => { //ovo je za prikaz naziva umjesto 0 i 1
          return {
            ...objava,
            dozvoljeno_komentiranje: objava.dozvoljeno_komentiranje === true ? 'da' : 'ne'
          }
        });
      } catch (error) {
        console.error("Greška pri dohvatu objave", error);
      }
    },

    odiNaDetalje(idObjave) {
      this.$router.push({ name: 'adminobjavadetalji', params: { id: idObjave } });
    },

    dodajObjavu() {
      this.$router.push({ path: 'dodajobjavu' });
    },

    async obrisiObjavu(idObjave) {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.delete("http://localhost:3000/api/brisanjeObjave/" + idObjave, { headers });

        this.$q.notify({
          color: "positive",
          position: "top",
          message: "Uspješno brisanje objave."
        });

        this.dohvatiObjave();

      } catch (error) {
        console.log(error);
        this.$q.notify({
          color: "negative",
          position: "top",
          message: "Greška pri brisanju objave!",
          icon: "warning",
        });
      }
    },

    brisanje(id) {
      if (window.confirm("Jeste li sigurni da želite obrisati objavu?")) {
        this.obrisiObjavu(id);
        return;
      }
    },
  },
};
</script>