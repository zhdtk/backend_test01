const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Start service')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

app.post('/products/create', async(req, res) => {
  const product = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('mydb').collection('products').insertOne({
    id: parseInt(product.id),
    name: product.name,
    description: product.description,
    price: product.price,
    unit: product.unit
  });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "Product with ID = "+product.id+" is created",
    "product": product
  });
})

app.post('/shops/create', async(req, res) => {
    const shop = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('mydb').collection('shops').insertOne({
      id: parseInt(shop.id),
      name: shop.name,
      description: shop.description,
      phone: shop.phone,
      address: shop.address
    });
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "shop with ID = "+shop.id+" is created",
      "shop": shop
    });
  })


app.get('/products', async(req, res) => {
    const id = parseInt(req.params.id);
    const client = new MongoClient(uri);
    await client.connect();
    const products = await client.db('mydb').collection('products').find({}).toArray();
    await client.close();
    res.status(200).send(products);
  })


  app.get('/products/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const product = await client.db('mydb').collection('products').findOne({"id": id});
  await client.close();
  res.status(200).send({
    "status": "ok",
    "product": product
  });
})


app.put('/products/update', async(req, res) => {
    const product = req.body;
    const id = parseInt(product.id);
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('mydb').collection('products').updateOne({'id': id}, {"$set": {
      id: parseInt(product.id),
      name: product.name,
    description: product.description,
    price: product.price,
    unit: product.unit
    }});
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "Product with ID = "+id+" is updated",
      "product": product
    });
  })

  app.delete('/products/delete', async(req, res) => {
    const id = parseInt(req.body.id);
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('mydb').collection('products').deleteOne({'id': id});
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "Product with ID = "+id+" is deleted"
    });
  })  

