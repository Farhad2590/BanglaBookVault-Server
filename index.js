const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion , ObjectId } = require('mongodb');

const port = process.env.PORT || 8000

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
// 
// 



const uri = "mongodb+srv://BanglaBookVault:mYmM9IOTnl04NIUC@cluster0.cd6vky8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    const booksCollection = client.db("banglaBookVault").collection("books");


    app.get('/book', async (req, res) => {
      const size = parseInt(req.query.size)
      const page = parseInt(req.query.page)-1
      console.log(size,page);
      const filter = req.query.filter
      // const sort = req.query.sort
      // const search = req.query.search
      // console.log(size, page)

      let query = {}
      if (filter) query = {categoryName : filter}
      // let options = {}
      // if (sort) options = { sort: { priceRange: sort === 'asc' ? 1 : -1 } }
      console.log(filter);
      
      const result = await booksCollection.find(query).skip(page * size).limit(size).toArray()

      res.send(result)
    })

    // Get all books data count from db
    app.get('/books-count', async (req, res) => {
      // const filter = req.query.filter
      // const search = req.query.search
      // let query = {
      //   job_title: { $regex: search, $options: 'i' },
      // }
      // if (filter) query.category = filter
      const count = await booksCollection.countDocuments()

      res.send({ count })
    })




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello from BanglaBookVault Server..')
})

app.listen(port, () => {
  console.log(`BanglaBookVault is running on port ${port}`)
})