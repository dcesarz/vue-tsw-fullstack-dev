// Configuration file
require("dotenv").config();

// Server initialization
const express = require("express");
const app = express();
const server = require("./https")(app);

// Parsers configs
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(require("cookie-parser")());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Services config
const auctionService = require("./services/auctionservices");
const Message = require("./models/Message");

// Session config
const session = require("express-session");
const mongoose = require("./mongoose");
const MongoStore = require("connect-mongo")(session);

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: "sessions"
});

const port = process.env.PORT;

app.use(session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUnintialized: false,
  store: sessionStore
}));

// Passport config
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// SocketIO config
const socketio = require("socket.io");
const io = socketio(server);
const passportSocketIo = require("passport.socketio");

io.use(passportSocketIo.authorize({
  key: "connect.sid",
  secret: process.env.APP_SECRET,
  store: sessionStore,
  passport: passport,
  cookieParser: cookieParser
}));

const isAuthenticated = (socket) => {
  return socket.request.isAuthenticated;
};

let lock = false;

io.on("connection", (socket) => {
    console.log(`Made socket connection: ${socket.id}`);
    const username = socket.request.user.username;
    socket.on("join", (data) => {
        if (socket.request.user.logged_in) {
            socket.join(data.id);
        }
    });
    socket.on("start", (data) => {
        if (socket.request.user.logged_in) {
        }
    });
    socket.on("leave", (data) => {
        if (socket.request.user.logged_in) {
            socket.leave(data.socketId);
        }
    });
    socket.on("new-buy", async (data) => {
        if (isAuthenticated(socket) && lock === false) {
          lock = true;
        //   const body = {
        //     _id: data._id,
        //     $set: {
        //       latestBidder: data.latestBidder,
        //       status: data.status
        //     }
        //   };
          const filter = data.id;
          const update = {
            price: data.price,
            latestBidder: data.latestBidder,
            status: 'sold'
          }

          Auction.findByIdAndUpdate(filter, update,
            (err, doc) => {
                if (err) {
                    console.log(err);
                    io.sockets.in(data.id).emit("server-error");
                } else {
                    io.sockets.in(data.id).emit("new-buy", update);
                    console.log(`Socket: New buy from user: ${update.latestBidder}`);
                    console.log("Buy successfully posted!");
                }
            }
        );
          await auctionService.partialUpdate(body, (error) => {
            lock = false;
            console.dir(data);
            if (error) {
              io.sockets.in(data._id).emit("error");
            } else {
              io.sockets.in(data._id).emit("new-buy", data);
              console.log(`[Socket]: New transaction from user: ${data.highest_bidder}`);
            }
          });
        }
      });
    socket.on("new-bid", async (data) => {
        if (socket.request.user.logged_in) {
            const price = "";
            const filter = data.id;
            let oldBidders;
            try {
                const doc = await Auction.findById(filter);
                oldBidders = doc.bidders;
                price = doc.price;
            } catch (err) {
                console.log(err);
                return io.sockets.in(data.id).emit("server-error");// todo wyswietlanie bledu
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
                        io.sockets.in(data.id).emit("server-error");
                    } else {
                        io.sockets.in(data.id).emit("new-bid", update);
                        console.log(`Socket: New bid from user: ${update.highestBidder}`);
                        console.log(`Socket: Price on the bid raised to..: ${update.price}`);
                        console.log("Bid successfully posted!");
                    }
                }
            );
        }
    });
});

server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});

//app.use(cors({credentials: true, origin: 'https://localhost:8080'}));