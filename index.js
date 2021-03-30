var express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
var app = express();
const bodyParser =  require("body-parser");

const uri ="mongodb+srv://organicUser:raddrums123@cluster0.e0z6a.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true,useUnifiedTopology: true,});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

client.connect((err) => {
  const productCollection = client.db("organicdb").collection("products");

  app.get('/products', (req, res) =>{
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  app.get('/product/:id', (req, res) =>{
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })
  app.post('/addProduct',(req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log("product added");
      res.redirect('/')
    })
    .then(result => {
      console.log(result)
    })
  })
  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({_id:ObjectId(req.params.id)},
    { $set: { price: req.body.price, quantity: req.body.quantity},
    $currentDate: { lastModified: true } 
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
});



app.listen(3000);
