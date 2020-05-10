// ładujemy wykorzystywane moduły:
// konfiguracja aplikacji – dostęp przez zmienne środowiskowe
require("dotenv").config();

// express – jako „podstawa aplikacji”
const express = require("express");
const app = express();
app.set("view engine", "ejs");
// cookie-session – w sesji zapamiętamy identyfikator rozgrywki
const cookieSession = require("cookie-session");
// drobiazgi do sprawnego i czytelnego logowania
const logger = require("morgan");
const errorHandler = require("errorhandler");

// parametry – ewentualnie przekazywane poprzez zmienne środowiskowe
const secret = process.env.SECRET || "$uper $ecret";
const env = process.env.NODE_ENV || "development";


// obsługa danych typu application/json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// obsługa sesji za pomocą ciasteczek
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const expressSession = require("express-session");
app.use(expressSession({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false
}));

const path = require("path");
app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));

// middleware do kompilacji SCSS -> CSS
const sass = require("node-sass-middleware");
app.use(sass({
    src: path.join(__dirname, "/src"),
    dest: path.join(__dirname, "/public"),
    debug: true,
    outputStyle: "compressed",
}));

// główny „serwer statyczny”
app.use(express.static(path.join(__dirname, "public")));

// w zależności od trybu działania wybieramy odpowiedni poziom logowania
if ("development" === env) {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

// importujemy obsługę zapytań
const routes = require("./routes");

// i „podłączamy” ją pod adres „/mmind”
app.use("/mmind", routes);

// przechwytujemy niepoprawne odwołania do serwera
app.use((req, res) => {
    res.status(404).json({
        error: `Niepoprawne żądanie: ${req.method} ${req.originalUrl}`
    });
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = process.env.port;

// uruchamiamy serwer z aplikacją
server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});
