const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

//mongodb config
const uri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASENAME;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//server
const run = async () => {
  try {
    const itemsCollection = client.db(databaseName).collection("items");
    //create
    app.post("/items", async (req, res) => {
      const items = req.body;
      const result = await itemsCollection.insertOne(items);
      console.log(result);
      res.send(result);
    });
    //read
    app.get("/items", async (req, res) => {
      const query = {};
      const cursor = itemsCollection.find(query);
      const items = await cursor.toArray();
      console.log(items);
      res.send(items);
    });
    //update
    app.patch("/items/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const updateDocument = { $set: req.body }; //use $set operator to update fields

      try {
        const result = await itemsCollection.updateOne(query, updateDocument);
        console.log(result);

        //check if any documents were modified
        if (result.matchedCount === 0) {
          return res.status(404).send("No document found for the provided ID.");
        }
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the document.");
      }
    });
    //delete
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
};

//catch any error while running server
run().catch((error) => console.log(error));

//base url response
app.get("/", (res) => {
  res.send("Simple CRUD Template");
});

//listen to the defined port for any event
app.listen(port, () => {
  console.log(`CRUD SERVER RUNNING ON PORT: ${port}!`);
});
