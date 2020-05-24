const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

require("dotenv").config();

const mongoose = require("mongoose");
const opts = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
};

mongoose.connect(process.env.DATABASE, opts).then(() => {

    let db = mongoose.connection;
    db.on("error", (err) => {
        console.error(`Problem z połączeniem: ${err}`);
    });

    app.use(express.json());
    app.use(cors());
    // Routing
    const router = require("./routes");
    app.use("/posts", router);
    // wyłapujemy odwołania do nieobsługiwanych adresów
    app.use((_req, res) => {
        // Not Found
        res.sendStatus(404);
    });

    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Serwer działa na porcie ${port}`);
    });

}).catch( err => {
    if (err) {
        console.error(`Błąd: ${err}`);
    }
});

/* app.use(bodyParser.json());
app.use(cors());

const users = require('.routes/api/users');

app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log('Server started on port ${port}'));
*/