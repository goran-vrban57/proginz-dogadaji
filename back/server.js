const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URL
const mongoURI = 'mongodb+srv://app:11@dogadaji0.ijqxjrt.mongodb.net/?retryWrites=true&w=majority&appName=Dogadaji0';
const dbName = 'admin';

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit with failure
  });

    // Define routes here

    // Example route
    app.get('/api/data', async (req, res) => {
      try {
        const collection = db.collection('data'); // Specify collection name
        const data = await collection.find().toArray();
        res.json(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    