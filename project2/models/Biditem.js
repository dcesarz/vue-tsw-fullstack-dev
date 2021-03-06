const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BidItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
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

delete mongoose.connection.models['BidItem'];
const BidItem = mongoose.model("BidItem", BidItemSchema);

BidItem.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

global.BidItemSchema = global.BidItemSchema || BidItem;
module.exports = global.BidItemSchema;
//module.exports = BidItem;