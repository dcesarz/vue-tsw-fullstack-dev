const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AuctionSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: 0.01,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Bid", "Buy"]
    },
    bidders: [{ type: String }],
    latestBidder: {
        type: String
    },
    duration: {
        type: Number
    },
    status: {
        type: String,
        enum: ["New", "OnSale", "Sold", "NotSold"]
    }
},{timestamps: true});

delete mongoose.connection.models['Auction'];
const Auction = mongoose.model("Auction", AuctionSchema);

Auction.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

global.AuctionSchema = global.AuctionSchema || Auction;
module.exports = global.AuctionSchema;
//module.exports = Auction;