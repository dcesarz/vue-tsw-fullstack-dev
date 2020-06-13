const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

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
        min: 1,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["bid", "buy"]
    },
    bidders: [{ type: String }],
    latestBidder: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        enum: ["new", "onSale", "sold", "notSold"]
    }
},{timestamps: true});

delete mongoose.connection.models['Auction'];
AuctionSchema.plugin(aggregatePaginate);
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