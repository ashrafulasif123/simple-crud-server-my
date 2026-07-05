const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

/** client থেকে Server Side অনুমোদন পাওয়ার জন্য CORS Middleware for Express */
const cors = require("cors");
app.use(cors());
/** Client Side থেকে Data JSON stringify হয়ে আসার সময় JSON Parse করতে হয়  */
app.use(express.json());

//simpleDBUserMy
//XPwnrp7R3H7PUjwK
const uri =
  "mongodb+srv://simpleDBUserMy:XPwnrp7R3H7PUjwK@cluster0.mrg0zof.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/* Express Route */
app.get("/", (req, res) => {
  res.send("Hello CRUD");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("simpleDB");
    const productCollection = database.collection("products");
    // POST(Insert Product in Database)
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // GET(Get All Products From Database)
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET(Get Single Product From Database)
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // DELETE(Delete One Product from Database)
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.name,
        },
      };
      const options = {};
      const result = await productCollection.updateOne(query, update, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Simple CRUD Server is running on port ${port}`);
});
