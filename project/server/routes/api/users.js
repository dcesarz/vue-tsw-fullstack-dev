const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

//get add del upd
router.get("/", async (req, res) =>{
    const users = await loadUsersCollection();
    res.send(await users.find({}).toArray());
})

router.post("/", async (req, res)=>
{
    const users = await loadUsersCollection();
    await users.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
})

router.delete("/:id", async (req, res) =>{
    const users = await loadUsersCollection();
    await postMessage.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

router.delete("/:id", async (req, res) =>{
    const users = await loadUsersCollection();
    await postMessage.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

async function loadUsersCollection(){
    const client = await mongodb.MongoClient.connect
    ("", {
        userNewUrlParser: true
    })

    return client.db("dbname").collection("users");
}

module.exports = router;