const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();


const app = express()
app.use(bodyParser.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sioj4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookCollection = client.db("bookTool").collection("books");

    // Create
    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log(newBook);
        bookCollection.insertOne(newBook)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    //Read
    app.get('/books', (req, res) => {
        bookCollection.find()
            .toArray((err, result) => {
                res.send(result)
            })
    })

    // Read by id
    app.get('/book/:id', (req, res) => {
        const id = req.params.id;
        bookCollection.find({ _id: ObjectID(id) })
            .toArray((err, documents) => {
                res.send(documents[0])
                console.log(err);
            })
    })

    //Delete


});



app.get('/', function (req, res) {
    res.send('hello world')
})
app.listen(process.env.PORT || 5000);

