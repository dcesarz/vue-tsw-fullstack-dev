// konfiguracja aplikacji – dostęp przez zmienne środowiskowe
require("dotenv").config();

// jako „bazy” używamy Express.js
const express = require("express");
const app = express();
//const socketio = require("socket.io");
//const passportSocketIo = require("passport.socketio");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//app.set("view engine", "ejs");
app.use("/public",express.static(__dirname + "/public"));

// wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

// machnaizm sesji – z wykorzystaniem ciasteczek
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const expressSession = require("express-session");


//socket config
const MongoStore = require("connect-mongo")(expressSession);

const sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

app.use(expressSession({
    secret: process.env.APP_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// do obsługi autoryzacji używamy Passport.js
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// routing aplikacji
const routes = require("../routes/api");
app.use("/",routes);
//const auction_routes = require("./routes/api");
//app.use("/auction",auction_routes);
// wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = 5000;


server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});