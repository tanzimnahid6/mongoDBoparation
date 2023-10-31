const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

//mongodb connection uri
//pass:I2g8OUnWoLyBhPp6
const uri =
  "mongodb+srv://jubayer:I2g8OUnWoLyBhPp6@cluster0.hzcsu4a.mongodb.net/?retryWrites=true&w=majority"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    //get Database products
    const productsCollection = client.db("productsDB").collection("products")
    const products2Collection = client.db("productsDB").collection("products2")

    //===================================get all products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find()
      const products = await cursor.toArray()
      res.send(products)
    })
    //===================================get products by categories from products2
    app.get("/products2", async (req, res) => {
      const query = { category: "Electronics" }
      const cursor = products2Collection.find(query)
      const products2 = await cursor.toArray()
      res.send(products2)
    })
    //==================================get products with specific field ======projection===with category
    app.get("/productsWithRequireField", async (req, res) => {
      const cursor = products2Collection
        .find({ category: "Electronics" })
        .project({ category: true, name: true })
      const products2 = await cursor.toArray()
      res.send(products2)
    })

    //==================================get products with sorting=================
    //for price high to low use {price:1}
    //for price low to low high {price:-1}

    app.get("/productsSort", async (req, res) => {
      const cursor = products2Collection.find().sort({ price: -1 })
      const products2 = await cursor.toArray()
      res.send(products2)
    })

    //==================================get products by skip,thats use in pagination=================
    app.get("/someProductsSkip", async (req, res) => {
      const cursor = products2Collection.find().skip(5)
      const products2 = await cursor.toArray()
      res.send(products2)
    })
    //==================================get products by limit=================
    app.get("/productsLimit", async (req, res) => {
      const cursor = products2Collection.find().limit(3)
      const products2 = await cursor.toArray()
      res.send(products2)
    })
    //----------------------------------get single product by id ======findOne()====================
    //must use await before products2Collection
    app.get(`/products2/:id`, async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const products2 = await products2Collection.findOne(query)
      res.send(products2)
    })
    //--------------------------------projection on single product and get data ------------------
    app.get(`/productsWithRequireField/:id`, async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const products2 = await products2Collection.findOne(query,{projection:{name:true,category:true}})
        res.send(products2)
      })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 })
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    )
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Product server is running Running.....")
})

app.listen(port, () => {
  console.log("Server is running on port " + port)
})
