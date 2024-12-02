var express = require("express");
var MongoClient = require("mongodb").MongoClient;

const app = express();

app.use(express.json())

// logger middleware
app.use((req, res, next) => {
    console.log("Request IP: " + req.url);
    console.log("Request Date: " + new Date());
    next();
})

// CORS headers to allow cross-origin requests 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");  
    next();  
})

// Connect to the MongoDB database
let db;
MongoClient.connect('mongodb+srv://vk425:5euTYXb6kxOq4kRz@cluster0.rq7px.mongodb.net/', (err, client) => {
    if (err) return console.log(err)
    db = client.db('AfterSchoolClasses')
    console.log("Connected to MongoDB");
})

// display a message for root path to show that API is working
app.get('/', (req, res) => {
    res.send('Select a collection, e.g., /collection/messages')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

// retrieve all the objects from a collection
app.get('/collection/:collectionName', (req, res) => {
    req.collection.find({}).toArray((e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})

// post data to the collection
app.post('/collection/:collectionName', (req, res) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})

// update data in the collection
app.put('/collection/:collectionName', (req, res, next) => {
    const updatedClasses = req.body;
    // Update the 'availableInventory'

    updatedClasses.forEach(classData => {
        req.collection.updateOne(
            { id: classData.id },
            { $set: { availableInventory: classData.availableInventory } },
            { safe: true },
            (e, result) => {
                if (e) return next(e);
                res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
            }
        );
    });

    res.send({ msg: 'Availability updated successfully' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});