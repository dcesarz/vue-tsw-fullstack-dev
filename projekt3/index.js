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
const Auction = require("./models/Auction");
const axios = require("axios");
const path = require("path");
const userRoutes = require("./routes/userroutes");
const AuctionRoutes = require("./routes/Auctionroutes");
const messageRoutes = require("./routes/messageroutes");
const auctionServices = require("./services/auctionservices");
const roomRoutes = require("./routes/roomroutes");

// Wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//app.use(cors({credentials: true, origin: 'https://localhost:8080'}));

app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
// Sesja z wykorzystaniem ciasteczek
app.use(cookieParser());

// Session store
const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: "sessions"
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


// Routing
app.use("/api/users", userRoutes);
app.use("/api/auctions", AuctionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);

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

const isAuthenticated = (socket) => {
    return socket.request.isAuthenticated;
};  

let lock = false;

const socketio = require("socket.io");
const passportSocketIo = require("passport.socketio");
const { Console } = require("console");
const io = socketio(server);

let list = [];

function containsObject(obj, list) {
    for (var i = 0; i < list.length; i++){
        if (obj.sender === list[i].sender && obj.recipent === list[i].recipent) return list[i].sid;
    }
    return "";
}

io.use(passportSocketIo.authorize({
    key: "connect.sid",
    secret: process.env.APP_SECRET,
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
}));

io.on("connection", (socket) => {
    console.log(`Made socket connection: ${socket.id}`);
    const username = socket.request.user.username;

    socket.on("join", (data) => {
        if (socket.request.user.logged_in) {
            console.log("Joined room " + data._id);
            socket.join(data._id);
        }
    });
    socket.on("chatMessage",(data) => {
        let obj = {
            sender: data.sender,
            recipent: data.recipent,
            content: data.content
        };
        io.sockets.in(data._id).emit("chatMessage", obj);
    })
    socket.on("start", (data) => {
        if (socket.request.user.logged_in) {
        }
    });
    socket.on('leave', (data) => {
        console.log("emitting leave")
        console.log(data);
        console.log("Socket disconnecting");
        socket.leave(data._id);
        socket.disconnect();
    });
    //io.emit('message', 'Hello!');
    socket.on("new-buy", async (data) => {
        if (isAuthenticated(socket) && lock === false) {
          lock = true;

          console.log("look2");
          console.log(data);

          const filter = data._id;
          const update = {
            latestBidder: data.latestBidder,
            status: 'sold',
            price: data.price
          }

          Auction.findByIdAndUpdate(filter, update,
            (err, doc) => {
                if (err) {
                    console.log(err);
                    io.sockets.in(data._id).emit("server-error");
                } else {
                    io.sockets.in(data._id).emit("new-buy", update);
                    console.log(`Socket: New buy from user: ${update.latestBidder}`);
                    console.log("Buy successfully posted!");
                }
            }
        );
          await auctionServices.partialUpdate(body, (error) => {
            lock = false;
            console.dir(data);
            if (error) {
              io.sockets.in(data._id).emit("error");
            } else {
              io.sockets.in(data._id).emit("new-buy", data);
              console.log(`[Socket]: New transaction from user: ${data.latestBidder}`);
            }
          });
        }
      });
    socket.on("new-bid", async (data) => {
        if (socket.request.user.logged_in) {
            let price = "";
            console.log("look3");
            console.log(data);
            const filter = data._id;
            let oldBidders;
            try {
                const doc = await Auction.findById(filter);
                console.log(filter);
                oldBidders = doc.bidders;
                price = doc.price;
            } catch (err) {
                console.log(err);
                return io.sockets.in(data._id).emit("server-error");// todo wyswietlanie bledu
            }
            const update = {
                price: data.price,
                latestBidder: data.latestBidder
            };

            const newBidders = data.latestBidder;
            if(data.price > price){
            if (!oldBidders.includes(newBidders)) {
                oldBidders.push(newBidders);
                const updatedBidders = oldBidders;
                update.bidders = updatedBidders;
            };
            }

            Auction.findByIdAndUpdate(filter, update,
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        io.sockets.in(data._id).emit("server-error");
                    } else {
                        io.sockets.in(data._id).emit("new-bid", update);
                        console.log(`Socket: New bid from user: ${update.latestBidder}`);
                        console.log(`Socket: Price on the bid raised to..: ${update.price}`);
                        console.log("Bid successfully posted!");
                    }
                }
            );
        }
    });
    // socket.on('establish', obj => {
    //     console.log("Estabilishing connection...");
    //     let record = {
    //         sender: obj.sender,
    //         recipent: obj.recipent,
    //         content: obj.content,
    //     };
    //     list.push(record);
    // });
    // socket.on('chatMessage', msg => {
    //     console.log("Emitting chat message...");
    //     let check = {
    //         sender: msg.sender,
    //         recipent: msg.recipent
    //     };
    //     let test = containsObject(check, list);
    //     let obj = {
    //         sender: msg.sender,
    //         recipent: msg.recipent,
    //         content: msg.content
    //     };
    //     if (test !== "") {
    //         io.to(test).emit('chatMessage', obj);
    //     }
    //     io.to(msg.sid).emit('chatMessage', obj);
    // })
});


server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});

//app.use(cors({credentials: true, origin: 'https://localhost:8080'}));