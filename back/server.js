const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");


const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

const mongoURI = "mongodb://localhost:27017";
const dbName = "baza";

MongoClient.connect(mongoURI)
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db(dbName);

    const kolekcije = {
      korisnik: db.collection("korisnik"),
      administrator: db.collection ("administrator"),
      objava: db.collection("objava"),
      dogadaj: db.collection("dogadaj")
    };

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    //administrator
    app.get("/api/administrator", async (req, res) => {
      try {
        const data = await kolekcije.administrator.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/administrator/:id", async (req,res)=> {
      try {
        const id= req.params.id;
        const data = await kolekcije.administrator.findOne({"_id": new ObjectId(id)});

        if(!data){
          return res.status(404).json({message: 'Nema rezultata.'});
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({error:"Interna greška poslužitelja."});
      }
    });

    //dogadaj
    app.get("/api/dogadaj", async (req, res) => {
      try {
        const data = await kolekcije.dogadaj.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/dogadaj/:id", async (req,res)=> {
      try {
        const id= req.params.id;
        const data = await kolekcije.dogadaj.findOne({"_id": new ObjectId(id)});

        if(!data){
          return res.status(404).json({message: 'Nema rezultata.'});
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({error:"Interna greška poslužitelja."});
      }
    });
    
    //korisnik
    app.get("/api/korisnik", async (req, res) => {
      try {
        const data = await kolekcije.korisnik.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/korisnik/:id", async (req,res)=> {
      try {
        const id= req.params.id;
        const data = await kolekcije.korisnik.findOne({"_id": new ObjectId(id)});

        if(!data){
          return res.status(404).json({message: 'Nema rezultata.'});
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({error:"Interna greška poslužitelja."});
      }
    });

    //objava
    app.get("/api/objava", async (req, res) => {
      try {
        const data = await kolekcije.objava.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/objava/:id", async (req,res)=> {
      try {
        const id= req.params.id;
        const data = await kolekcije.objava.findOne({"_id": new ObjectId(id)});

        if(!data){
          return res.status(404).json({message: 'Nema rezultata.'});
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({error:"Interna greška poslužitelja."});
      }
    });

    app.post("/api/registracija", async (req, res) => {
      try{
        const podaci = req.body;
        const rezultat = await kolekcije.korisnik.insertOne(podaci);

        res.status(201).json(rezultat); //rezultat.ops nece, trebalo bi se dohvatit preko rezultat.insertedId ako treba info
      } catch(error) {
        console.error("Greška u registraciji: ", error);
        res.status(500).json({ error: "Greška u registraciji!" });
      }
    });

    app.post("/api/dodavanjeAdmina", async (req, res) => { //za svaki slucaj
      try{
        const podaci = req.body;
        const rezultat = await kolekcije.administrator.insertOne(podaci);

        res.status(201).json(rezultat);
      } catch(error) {
        console.error("Greška u dodavanju admina: ", error);
        res.status(500).json({ error: "Greška u dodavanju admina!" });
      }
    });


    app.post("/api/dodavanjeDogadaja", async (req, res) => {
      try{
        const podaci = req.body;
        podaci.id_admina = new ObjectId(podaci.id_admina);
        const rezultat = await kolekcije.dogadaj.insertOne(podaci);

        res.status(201).json(rezultat);
      } catch(error) {
        console.error("Greška u dodavanju događaja: ", error);
        res.status(500).json({ error: "Greška u dodavanju događaja!" });
      }
    });

    app.post("/api/dodavanjeObjava", async (req, res) => {
      try{
        const podaci = req.body;
        podaci.id_admina = new ObjectId(podaci.id_admina);
        const rezultat = await kolekcije.objava.insertOne(podaci);

        res.status(201).json(rezultat);
      } catch(error) {
        console.error("Greška u dodavanju objava: ", error);
        res.status(500).json({ error: "Greška u dodavanju objava!" });
      }
    });

    app.post("/api/objava/:objavaId/komentiranje", async (req, res) => { //objavaId u URLu zbog ne-cacheanja
      try{
        const podaci = req.body;
        const rezultat = await kolekcije.objava.findOneAndUpdate(
          {_id: new ObjectId(req.params.objavaId)},
          {$push: {komentari: {id: podaci.id, id_korisnika: podaci.id_korisnika, korisnicko_ime: podaci.korisnicko_ime, //sto sa ovim podaci.id?
            sadrzaj_komentara: podaci.sadrzaj_komentara, datum_komentara: podaci.datum_komentara}}},
          //{returnOriginal: true}
        );

        res.status(201).json(rezultat);

      } catch(error) {
        console.error("Greška u komentiranju: ", error);
        res.status(500).json({ error: "Greška u komentiranju!" });
      }
  });
})
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

//put dogadaj
//delete dogadaj

//delete komentar
//put objava
//delete objava


//put korisnik
//delete korisnik

//get nadolazece dogadaje
//get protekle dogadaje
//get korisnike kojima je newsletter true
//get nedavne objave (3-7 dana) --neobavezno
//post korisnik (login)
