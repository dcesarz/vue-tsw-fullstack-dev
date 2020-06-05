require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const mongoose = require("./mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("./passport");
const logger = require("morgan");
const errorHandler = require("error-handler");
const server = require("./https")(app);
const port = process.env.PORT;
const socketio = require("socket.io");
const passportSocketIo = require("passport.socketio");
const socket = socketio(server);
const BidItem = require("./models/BidItem");
const axios = require("axios");
const path = require("path");
const userRoutes = require("./routes/userroutes");
const biditemRoutes = require("./routes/biditemroutes");
const messageRoutes = require("./routes/messageroutes");

// Wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

// Sesja z wykorzystaniem ciasteczek
app.use(cookieParser());

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
app.use(passport.initialize());
app.use(passport.session());

// Poziom Logowania
if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
    app.use(errorHandler);
} else {
    app.use(logger("short"));
}

// Publiczny folder

app.use(express.static(path.join(__dirname, "dist")));

// app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));

// Routing
app.use("/api/users", userRoutes);
app.use("/api/biditems", biditemRoutes);
app.use("/api/messages", messageRoutes);

// Wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    res.sendStatus(404);
});

const axiosConfig = {
  withCredentials: true,
};

axios.config = axiosConfig;

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key

socket.use(passportSocketIo.authorize({
    key: "connect.sid",
    secret: process.env.APP_SECRET,
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
}));

socket.on("connection", (socket) => {
    console.log(`Made socket connection: ${socket.id}`);
    const username = socket.request.user.username;
    socket.on("join-auction", (data) => {
        if (socket.request.user.logged_in) {
            socket.join(data.id);
        }
    });
    socket.on("start-auction", (data) => {
        if (socket.request.user.logged_in) {
        }
    });
    socket.on("leave-auction", (data) => {
        if (socket.request.user.logged_in) {
         
            socket.leave(data.socketId);
        }
    });

    socket.on("new-bid", async (data) => {
        if (socket.request.user.logged_in) {
            const filter = data.id;
            let oldBidders;
            try {
                const doc = await BidItem.findById(filter);
                oldBidders = doc.bidders;
            } catch (err) {
                console.log(err);
                return io.sockets.in(data.id).emit("server-error");// todo wyswietlanie bledu
            }
            const update = {
                price: data.price,
                latestBidder: data.latestBidder
            };

            const newBidders = data.latestBidder;

            if (!oldBidders.includes(newBidders)) {
                oldBidders.push(newBidders);
                const updatedBidders = oldBidders;
                update.bidders = updatedBidders;
            };

            BidItem.findByIdAndUpdate(filter, update,
                (err, doc) => {
                    if (err) {
                        io.sockets.in(data.id).emit("server-error");
                    } else {
                        io.sockets.in(data.id).emit("new-bid", update);
                    }
                }
            );
        }
    });
});

server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});