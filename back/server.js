const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
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
      administrator: db.collection("administrator"),
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

    app.get("/api/administrator/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = await kolekcije.administrator.findOne({ "_id": new ObjectId(id) });

        if (!data) {
          return res.status(404).json({ message: 'Nema rezultata.' });
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({ error: "Interna greška poslužitelja." });
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

    app.get("/api/dogadaj/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = await kolekcije.dogadaj.findOne({ "_id": new ObjectId(id) });

        if (!data) {
          return res.status(404).json({ message: 'Nema rezultata.' });
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/nadolazeciDogadaji", async (req, res) => {
      try {
        const data = await kolekcije.dogadaj.find({ datum_odrzavanja: { $gte: new Date() } }).sort({ datum_odrzavanja: 1 }).toArray(); //1 rastuce
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/protekliDogadaji", async (req, res) => {
      try {
        const data = await kolekcije.dogadaj.find({ datum_odrzavanja: { $lt: new Date() } }).sort({ datum_odrzavanja: -1 }).toArray(); //-1 padajuce
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
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

    app.get("/api/korisnik/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = await kolekcije.korisnik.findOne({ "_id": new ObjectId(id) });

        if (!data) {
          return res.status(404).json({ message: 'Nema rezultata.' });
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/korisnikNewsletter", async (req, res) => {
      try {
        const data = await kolekcije.korisnik.find({ "prima_newsletter": true }).toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
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

    app.get("/api/objava/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = await kolekcije.objava.findOne({ "_id": new ObjectId(id) });

        if (!data) {
          return res.status(404).json({ message: 'Nema rezultata.' });
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.post("/api/registracija", async (req, res) => {

      const podaci = req.body;
      const saltRounds = 10;
      bcrypt.hash(podaci.lozinka_korisnika, saltRounds, async function (err, hash) {
        if (err) {
          console.error("Greška pri hashanju lozinke:", err);
          return response.status(500).json({ error: true, message: "Greška pri hashanju lozinke." });
        }
        try {
          podaci.lozinka_korisnika = hash;
          const rezultat = await kolekcije.korisnik.insertOne(podaci);
          res.status(201).json(rezultat);
        } catch (error) {
          console.error("Greška u registraciji: ", error);
          res.status(500).json({ error: "Greška u registraciji!" });
        }
      })

    });

    app.post("/api/login", async (req, res) => {
      const podaci = req.body;
      try {
        const rezultat = await kolekcije.korisnik.findOne(
          { korisnicko_ime: podaci.korisnicko_ime }
        );

        if (rezultat) {
          bcrypt.compare(podaci.lozinka_korisnika, rezultat.lozinka_korisnika, async function (err, bcryptRes) {
            if (bcryptRes) {
              res.status(200).json(rezultat);
            } else {
              res.status(401).json(rezultat); //nije dobra lozinka
            }
          })
        } else {
          res.status(401).json(rezultat); //nije dobar username
        }
      } catch (error) {
        console.error("Greška u prijavi: ", error);
        res.status(500).json({ error: "Greška u prijavi!" });
      }
    });

    app.post("/api/dodavanjeAdmina", async (req, res) => { //za svaki slucaj
      try {
        const podaci = req.body;
        const rezultat = await kolekcije.administrator.insertOne(podaci);

        res.status(201).json(rezultat);
      } catch (error) {
        console.error("Greška u dodavanju admina: ", error);
        res.status(500).json({ error: "Greška u dodavanju admina!" });
      }
    });


    app.post("/api/dodavanjeDogadaja", async (req, res) => {
      try {
        const podaci = req.body;
        podaci.id_admina = new ObjectId(podaci.id_admina);
        const rezultat = await kolekcije.dogadaj.insertOne(podaci);

        res.status(201).json(rezultat);
      } catch (error) {
        console.error("Greška u dodavanju događaja: ", error);
        res.status(500).json({ error: "Greška u dodavanju događaja!" });
      }
    });

    app.post("/api/dodavanjeObjava", async (req, res) => {
      try {
        const podaci = req.body;
        podaci.id_admina = new ObjectId(podaci.id_admina);
        const rezultat = await kolekcije.objava.insertOne(podaci);

        res.status(201).json(rezultat);
      } catch (error) {
        console.error("Greška u dodavanju objava: ", error);
        res.status(500).json({ error: "Greška u dodavanju objava!" });
      }
    });

    app.post("/api/objava/:objavaId/komentiranje", async (req, res) => { //objavaId u URLu zbog ne-cacheanja
      try {
        const podaci = req.body;
        const rezultat = await kolekcije.objava.findOneAndUpdate(
          { _id: new ObjectId(req.params.objavaId) },
          {
            $push: {
              komentari: {
                id: podaci.id, id_korisnika: podaci.id_korisnika, korisnicko_ime: podaci.korisnicko_ime, //sto sa ovim podaci.id?
                sadrzaj_komentara: podaci.sadrzaj_komentara, datum_komentara: podaci.datum_komentara
              }
            }
          },
          //{returnOriginal: true}
        );

        res.status(201).json(rezultat);

      } catch (error) {
        console.error("Greška u komentiranju: ", error);
        res.status(500).json({ error: "Greška u komentiranju!" });
      }
    });

    app.put("/api/izmjenaKorisnika/:korisnikId", async (req, res) => {
      try {
        const podaci = req.body;
        const rezultat = await kolekcije.korisnik.findOneAndUpdate(
          { _id: new ObjectId(req.params.korisnikId) },
          {
            $set: {
              korisnicko_ime: podaci.korisnicko_ime, email_adresa: podaci.email_adresa,
              lozinka: podaci.lozinka, prima_newsletter: podaci.prima_newsletter
            }
          }
        );

        res.status(200).json(rezultat);

      } catch (error) {
        console.error("Greška u izmjeni korisničkih podataka: ", error);
        res.status(500).json({ error: "Greška u izmjeni korisničkih podataka!" });
      }
    });

    app.put("/api/izmjenaDogadaja/:dogadajId", async (req, res) => {
      try {
        const podaci = req.body;
        const rezultat = await kolekcije.dogadaj.findOneAndUpdate(
          { _id: new ObjectId(req.params.dogadajId) },
          {
            $set: {
              naziv_dogadaja: podaci.naziv_dogadaja, opis_dogadaja: podaci.opis_dogadaja,
              lokacija_dogadaja: podaci.lokacija_dogadaja, datum_odrzavanja: podaci.datum_odrzavanja,
              datum_zavrsetka: podaci.datum_zavrsetka, datum_objave: podaci.datum_objave, slika_objave: podaci.slika_objave
            }
          }
        );

        res.status(200).json(rezultat);

      } catch (error) {
        console.error("Greška u izmjeni događaja: ", error);
        res.status(500).json({ error: "Greška u izmjeni događaja!" });
      }
    });

    app.put("/api/izmjenaObjave/:objavaId", async (req, res) => {
      try {
        const podaci = req.body;
        const rezultat = await kolekcije.objava.findOneAndUpdate(
          { _id: new ObjectId(req.params.objavaId) },
          {
            $set: {
              naziv_objave: podaci.naziv_objave, opis_objave: podaci.opis_objave,
              datum_objave: podaci.datum_objave, slika_objave: podaci.slika_objave,
              dozvoljeno_komentiranje: podaci.dozvoljeno_komentiranje
            }
          }
        );

        res.status(200).json(rezultat);

      } catch (error) {
        console.error("Greška u izmjeni objave: ", error);
        res.status(500).json({ error: "Greška u izmjeni objave!" });
      }
    });

    app.delete("/api/brisanjeKorisnika/:korisnikId", async (req, res) => {
      try {
        const rezultat = await kolekcije.korisnik.deleteOne({
          _id: new ObjectId(req.params.korisnikId)
        });

        res.status(200).json(rezultat);
      } catch (error) {
        console.error("Greška u brisanju korisnika: ", error);
        res.status(500).json({ error: "Greška u brisanju korisnika!" });
      }
    });

    app.delete("/api/brisanjeObjave/:objavaId", async (req, res) => {
      try {
        const rezultat = await kolekcije.objava.deleteOne({
          _id: new ObjectId(req.params.objavaId)
        });

        res.status(200).json(rezultat);
      } catch (error) {
        console.error("Greška u brisanju objave: ", error);
        res.status(500).json({ error: "Greška u brisanju objave!" });
      }
    });

    app.delete("/api/brisanjeDogadaja/:dogadajId", async (req, res) => {
      try {
        const rezultat = await kolekcije.dogadaj.deleteOne({
          _id: new ObjectId(req.params.dogadajId)
        });

        res.status(200).json(rezultat);
      } catch (error) {
        console.error("Greška u brisanju događaja: ", error);
        res.status(500).json({ error: "Greška u brisanju događaja!" });
      }
    });

    app.delete("/api/objava/:objavaId/brisanjeKomentara/:komentarId", async (req, res) => {
      try {
        const rezultat = await kolekcije.objava.findOneAndUpdate(
          { _id: new ObjectId(req.params.objavaId) },
          { $pull: { komentari: { id: req.params.komentarId } } }
        );

        res.status(200).json(rezultat);

      } catch (error) {
        console.error("Greška u brisanju komentara: ", error);
        res.status(500).json({ error: "Greška u brisanju komentara!" });
      }
    });


  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });


//delete dogadaj
//delete komentar
//delete objava
//delete korisnik

//get nedavne objave (3-7 dana) --neobavezno
