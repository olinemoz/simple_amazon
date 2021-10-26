const express = require('express');
const app = express();
const cors = require('cors');
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

// Port
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json());

// Database Integration
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-practice.upqpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
    try {
        await client.connect();
        const database = client.db("onlineShop");
        const productCollection = database.collection("products");

        // GET PRODUCTS API
       app.get('/products',async (req, res) => {
           const cursor = productCollection.find({});
           const page = req.query.page
           const size = req.query.size
           let products;
           const count = await cursor.count();
           if(page){
              products = await cursor.skip(page*size).limit(parseInt(size)).toArray()
           }else {
               products = await cursor.toArray()
           }
           // console.log("Products: ",products)
           res.send({
               count,
               products
           })
       })

    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

// Server Listen
app.listen(PORT, (req, res) => {
    console.log("Server listening on port", PORT)
})