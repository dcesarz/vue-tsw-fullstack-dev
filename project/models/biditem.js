const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = require("./User").schema;

let BidItemSchema = new Schema({
    seller:{ 
        type: String,
        required: true,
        max: 20
    },
    name: {
        type: String,
        required: true,
        max: 20
    },
    price: {
        type: Number,
        required: true,
        max: 20
    },
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
module.exports = global.UserSchema;
//module.exports = BidItem;