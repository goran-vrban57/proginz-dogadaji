const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");


const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const mongoURI = "mongodb://localhost:27017";
const dbName = "baza";

MongoClient.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db(dbName);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    //administrator
    app.get("/api/administrator", async (req, res) => {
      try {
        const collection = db.collection("administrator");
        const data = await collection.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/administrator/:id", async (req,res)=> {
      try {
        const id= req.params.id;
        const collection = db.collection("administrator");
        const data = await collection.findOne({"_id": new ObjectId(id)});

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
        const collection = db.collection("dogadaj");
        const data = await collection.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/dogadaj/:id", async (req,res)=> {
      try {
        const id= req.params.id;
        const collection = db.collection("dogadaj");
        const data = await collection.findOne({"_id": new ObjectId(id)});

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
        const collection = db.collection("korisnik");
        const data = await collection.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/korisnik/:id", async (req,res)=> {
      try {
        const id= req.params.id;
        const collection = db.collection("korisnik");
        const data = await collection.findOne({"_id": new ObjectId(id)});

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
        const collection = db.collection("objava");
        const data = await collection.find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Interna greška poslužitelja." });
      }
    });

    app.get("/api/objava/:id", async (req,res)=> {
      try {
        const id= req.params.id;
        const collection = db.collection("objava");
        const data = await collection.findOne({"_id": new ObjectId(id)});

        if(!data){
          return res.status(404).json({message: 'Nema rezultata.'});
        }

        res.json(data);
      } catch (error) {
        console.error("Error: ", error)
        res.status(500).json({error:"Interna greška poslužitelja."});
      }
    });

  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });


//get dogadaji
//get dogadaj by id
//post dogadaj
//put dogadaj
//delete dogadaj

//get objave
//get objava by id w/ comment
//post objava
//post/put? komentar na objavu
//delete komentar
//put objava
//delete objava

//get korisnici
//get korisnik (login)
//get korisnik by id
//post korisnik (registracija)
//put korisnik
//delete korisnik
