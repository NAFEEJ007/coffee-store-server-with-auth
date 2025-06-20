// follow express js documentation to do this, but dont memorize
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// to give permission to access from a separate port we need to use cors
app.use(cors());
// when we send data, we need to access it as json
app.use(express.json());





// cluster



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.relh2ba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection



    // connect with db which is mongo db
    const coffeesCollection = client.db("coffeeDB").collection('coffees');
    // connect usersCollection with mongodb
    const usersCollection = client.db("coffeeDB").collection('users');


    // client side theke ashbe, data db te rakhar agay we are creating api
    //  It acts like: "Hey server, here’s some coffee data. Please receive it and maybe save it."
    app.post('/coffees',async(req, res)=>{
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    })

    // from db to viewing in page
    app.get('/coffees', async(req, res)=>{
      const result = await coffeesCollection.find().toArray();
      res.send(result);
    })

    // viewing specific coffee
    app.get('/coffees/:id',async(req, res)=>{
      const id = req.params.id;
       const query = {_id:new ObjectId(id)}
       const result = await coffeesCollection.findOne(query);
       res.send(result);
    })

    app.put('/coffees/:id',async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedCoffee = req.body;
      const updatedDoc = {
        $set: updatedCoffee
      }
      const result = await coffeesCollection.updateOne(filter, updatedDoc, options)
      res.send(result);
      
    })

    // for deleting
    app.delete('/coffees/:id',async(req, res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    })


    // user related APIs
    app.post('/users',async(req, res)=>{
      const userProfile = req.body;
      console.log(userProfile)
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    })

    app.get('/users',async(req, res)=>{
      const result = await usersCollection.find().toArray();
      res.send(result); 
    })

    //we will update only one field so we will use patch
    app.patch('/users', async(req, res)=>{
      console.log(req.body);
      const {email,lastSignInTime} = req.body;
      const filter = {email:email}
      const updatedDoc = {
        $set: {
          lastSignInTime: lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    app.delete('/users/:id',async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result); 
    })



 
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// cluster


// making an api

app.get('/', (req, res)=>{
    res.send("Coffee server is getting hotter. ")
});

// ass we had created a port, now we need to listen it
app.listen(port, ()=>{
    console.log(`Coffee server is running on port ${port}`)
})


