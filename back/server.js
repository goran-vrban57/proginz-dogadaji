const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI =
  "mongodb://localhost:27017";
const dbName = "dogadajDB";

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
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

app.get("/api/data", async (req, res) => {
  try {
    const collection = db.collection("data");
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
