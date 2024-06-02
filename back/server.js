const express = require("express");
const cors = require("cors");
const http = require('http');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../back/auth.config.js");
const authJwt = require("../back/authJwt.js");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require('dotenv')
const socketIo = require('socket.io');
const sgMail = require('@sendgrid/mail');



const app = express();
const server = http.createServer(app);

dotenv.config();
sgMail.setApiKey(process.env.SendGrid_API_KEY);

app.use(cors({
  origin: 'http://localhost:9000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));

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

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    const io = socketIo(server);
    io.on('connection', (socket) => {
      //console.log('Korisnik se spojio');

      socket.on('disconnect', () => {
        //console.log('Korisnik se odspojio');
      });
    })

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

    //korisnik
    app.get("/api/korisnik", authJwt.verifyTokenAdmin, async (req, res) => {
      try {
        const data = await kolekcije.korisnik.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/korisnik/:id", authJwt.verifyTokenAdmin, async (req, res) => {
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
    app.get("/api/korisnikSelf/:id", authJwt.verifyTokenUser, async (req, res) => {
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


    app.get("/api/korisnikNewsletter", authJwt.verifyTokenAdmin, async (req, res) => {
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
              try {
                const token = jwt.sign({ id_korisnika: rezultat._id, korisnicko_ime: rezultat.korisnicko_ime, uloga: rezultat.uloga }, config.secret);
                res.status(200).json(token);
              } catch (error) {
                console.log("Puknuo JWT: " + error);
              }
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

    app.post("/api/dodavanjeDogadaja", authJwt.verifyTokenAdmin, async (req, res) => {
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

    app.post("/api/dodavanjeObjava", authJwt.verifyTokenAdmin, async (req, res) => {
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

    app.post("/api/objava/komentiranje/:objavaId", authJwt.verifyTokenUser, async (req, res) => { //objavaId u URLu zbog ne-cacheanja
      try {
        const podaci = req.body;
        const rezultat = await kolekcije.objava.findOneAndUpdate(
          { _id: new ObjectId(req.params.objavaId) },
          {
            $push: {
              komentari: {
                id_komentara: podaci.id_komentara, id_korisnika: new ObjectId(podaci.id_korisnika), ime_korisnika: podaci.ime_korisnika,
                sadrzaj_komentara: podaci.sadrzaj_komentara, datum_komentara: podaci.datum_komentara
              }
            }
          },
        );

        const emitano = io.emit('objavljenKomentar', { objavaId: req.params.objavaId, komentar: req.body })

        res.status(201).json(rezultat);

      } catch (error) {
        console.error("Greška u komentiranju: ", error);
        res.status(500).json({ error: "Greška u komentiranju!" });
      }
    });

    app.put("/api/izmjenaKorisnika/:korisnikId", authJwt.verifyTokenAdmin, async (req, res) => {
      try {

        const podaci = req.body;
        const saltRounds = 10;

        if (podaci.lozinka_korisnika != "") { //ako je lozinka unesena
          console.log("Nova lozinka JE unesena");
          bcrypt.hash(podaci.lozinka_korisnika, saltRounds, async function (err, hash) {
            if (err) {
              console.error("Greška pri hashanju lozinke:", err);
              return response.status(500).json({ error: true, message: "Greška pri hashanju lozinke." });
            }
            const rezultat = await kolekcije.korisnik.findOneAndUpdate(
              { _id: new ObjectId(req.params.korisnikId) },
              {
                $set: {
                  korisnicko_ime: podaci.korisnicko_ime, email_korisnika: podaci.email_korisnika,
                  lozinka_korisnika: hash, prima_newsletter: podaci.prima_newsletter, uloga: podaci.uloga
                }
              }
            );
            res.status(200).json(rezultat);
          })
        } else { //ako nema nove lozinke
          const rezultat = await kolekcije.korisnik.findOneAndUpdate(
            { _id: new ObjectId(req.params.korisnikId) },
            {
              $set: {
                korisnicko_ime: podaci.korisnicko_ime, email_korisnika: podaci.email_korisnika, prima_newsletter: podaci.prima_newsletter,
                uloga: podaci.uloga
              }
            }
          );
          res.status(200).json(rezultat);
        }

      } catch (error) {
        console.error("Greška u izmjeni korisničkih podataka: ", error);
        res.status(500).json({ error: "Greška u izmjeni korisničkih podataka!" });
      }
    });

    app.put("/api/izmjenaKorisnikaSelf/:korisnikId", authJwt.verifyTokenPosebno, async (req, res) => {
      try {

        const podaci = req.body;
        const saltRounds = 10;

        if (podaci.lozinka_korisnika != "") { //ako je lozinka unesena
          console.log("Nova lozinka JE unesena");
          bcrypt.hash(podaci.lozinka_korisnika, saltRounds, async function (err, hash) {
            if (err) {
              console.error("Greška pri hashanju lozinke:", err);
              return response.status(500).json({ error: true, message: "Greška pri hashanju lozinke." });
            }
            const rezultat = await kolekcije.korisnik.findOneAndUpdate(
              { _id: new ObjectId(req.params.korisnikId) },
              {
                $set: {
                  korisnicko_ime: podaci.korisnicko_ime, email_korisnika: podaci.email_korisnika,
                  lozinka_korisnika: hash, prima_newsletter: podaci.prima_newsletter
                }
              }
            );
            res.status(200).json(rezultat);
          })
        } else { //ako nema nove lozinke
          const rezultat = await kolekcije.korisnik.findOneAndUpdate(
            { _id: new ObjectId(req.params.korisnikId) },
            {
              $set: {
                korisnicko_ime: podaci.korisnicko_ime, email_korisnika: podaci.email_korisnika, prima_newsletter: podaci.prima_newsletter
              }
            }
          );
          res.status(200).json(rezultat);
        }

      } catch (error) {
        console.error("Greška u izmjeni korisničkih podataka: ", error);
        res.status(500).json({ error: "Greška u izmjeni korisničkih podataka!" });
      }
    });

    app.put("/api/izmjenaDogadaja/:dogadajId", authJwt.verifyTokenAdmin, async (req, res) => {
      try {
        const podaci = req.body;
        const rezultat = await kolekcije.dogadaj.findOneAndUpdate(
          { _id: new ObjectId(req.params.dogadajId) },
          {
            $set: {
              naziv_dogadaja: podaci.naziv_dogadaja, opis_dogadaja: podaci.opis_dogadaja,
              lokacija_dogadaja: podaci.lokacija_dogadaja, datum_odrzavanja: podaci.datum_odrzavanja,
              datum_zavrsetka: podaci.datum_zavrsetka, datum_objave: podaci.datum_objave, slika_dogadaja: podaci.slika_dogadaja
            }
          }
        );

        res.status(200).json(rezultat);

      } catch (error) {
        console.error("Greška u izmjeni događaja: ", error);
        res.status(500).json({ error: "Greška u izmjeni događaja!" });
      }
    });

    app.put("/api/izmjenaObjave/:objavaId", authJwt.verifyTokenAdmin, async (req, res) => {
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

    app.delete("/api/brisanjeKorisnika/:korisnikId", authJwt.verifyTokenPosebno, async (req, res) => {
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

    app.delete("/api/brisanjeObjave/:objavaId", authJwt.verifyTokenAdmin, async (req, res) => {
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

    app.delete("/api/brisanjeDogadaja/:dogadajId", authJwt.verifyTokenAdmin, async (req, res) => {
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

    app.delete("/api/objava/:objavaId/brisanjeKomentara/:komentarId", authJwt.verifyTokenPosebno, async (req, res) => {
      try {
        const rezultat = await kolekcije.objava.findOneAndUpdate(
          { _id: new ObjectId(req.params.objavaId) },
          { $pull: { "komentari": { id_komentara: parseInt(req.params.komentarId) } } }
        );

        const emitano = io.emit('obrisanKomentar', { objavaId: req.params.objavaId, id_komentara: req.params.komentarId })

        res.status(200).json(rezultat);

      } catch (error) {
        console.error("Greška u brisanju komentara: ", error);
        res.status(500).json({ error: "Greška u brisanju komentara!" });
      }
    });

    app.put("/api/objava/:objavaId/izmjenaKomentara/:komentarId", authJwt.verifyTokenPosebno, async (req, res) => {
      try {
        const podaci = req.body;
        const rezultat = await kolekcije.objava.findOneAndUpdate(
          { _id: new ObjectId(req.params.objavaId), "komentari.id_komentara": parseInt(req.params.komentarId) },
          {
            $set: {
              "komentari.$.sadrzaj_komentara": podaci.sadrzaj_komentara
            }
          }
        );

        const emitano = io.emit('promijenjenKomentar', { objavaId: req.params.objavaId, komentar: req.body })

        res.status(200).json(rezultat);

      } catch (error) {
        console.error("Greška u izmjeni objave: ", error);
        res.status(500).json({ error: "Greška u izmjeni objave!" });
      }
    });

    app.delete("/api/brisanjeKorisnikaSKomentara/:korisnikId", authJwt.verifyTokenPosebno, async (req, res) => {
      try {
        const rezultat = await kolekcije.objava.updateMany(
          { 'komentari.id_korisnika': new ObjectId(req.params.korisnikId) }, //ovaj traži za objave koji imaju barem jedan komentar koji ispunjava uvjet
          { $set: { 'komentari.$[elem].ime_korisnika': 'uklonjen_korisnik' } },
          { arrayFilters: [{ 'elem.id_korisnika': new ObjectId(req.params.korisnikId) }] } //ovaj onda dodatno lovi sve koji ispunjavaju uvjet
        );

        res.status(200).json(rezultat);
      } catch (error) {
        console.error("Greška u brisanju korisnika s komentara: ", error);
        res.status(500).json({ error: "Greška u brisanju korisnika s komentara!" });
      }
    });

    app.put("/api/izmjenaKorisnikaNaKomentaru/:korisnikId", authJwt.verifyTokenPosebno, async (req, res) => {
      const podaci = req.body;
      try {
        const rezultat = await kolekcije.objava.updateMany(
          { 'komentari.id_korisnika': new ObjectId(req.params.korisnikId) },
          { $set: { 'komentari.$[elem].ime_korisnika': podaci.korisnicko_ime } },
          { arrayFilters: [{ 'elem.id_korisnika': new ObjectId(req.params.korisnikId) }] }
        );

        res.status(200).json(rezultat);
      } catch (error) {
        console.error("Greška u izmjeni korisnika na komentaru: ", error);
        res.status(500).json({ error: "Greška u izmjeni korisnika na komentaru!" });
      }
    });

    // za slanje mailova    

    app.post('/api/sendEmail', authJwt.verifyTokenAdmin, (req, res) => {
      const { to, subject, naziv, opis, id } = req.body;

      const msg = {
        to: to,
        from: process.env.SendGrid_FROM,
        templateId: process.env.SendGrid_TEMPLATE_ID,
        dynamic_template_data: {
          subject: subject,
          naziv: naziv,
          opis: opis,
          veza: 'http://localhost:9000/#/dogadaj_detalji?_id=' + id,
        },
      };

      sgMail.send(msg)
        .then(() => {
          res.send('Email uspješno poslan');
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('Greška pri slanju emaila.');
        });
    });

  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });


