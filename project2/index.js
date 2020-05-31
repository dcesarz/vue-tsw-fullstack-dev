require("dotenv").config();

const express = require("express");

const app = express();

// Wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const cors = require("cors");
app.use(cors({ credentials: true }));

// Sesja z wykorzystaniem ciasteczek
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const mongoose = require("./mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// Session store
const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection
});

app.use(session({
    secret: process.env.APP_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// Inicjalizacja sesji
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// Poziom Logowania
const logger = require("morgan");
const errorHandler = require("error-handler");
if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
    app.use(errorHandler);
} else {
    app.use(logger("short"));
}

// Publiczny folder
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));

// Routing
const routes = require("./routes");
app.use("/", routes);
//const auctionRoutes = require("./routes/auction");
//app.use("/api", auctionRoutes);

// Wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = process.env.PORT;

// Socket.io
// const socketio = require("socket.io");
// const passportSocketIo = require("passport.socketio");
// const io = socketio(server);

// io.use(passportSocketIo.authorize({
//     key: "connect.sid",
//     secret: process.env.APP_SECRET,
//     store: sessionStore,
//     passport: passport,
//     cookieParser: cookieParser
// }));


server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});