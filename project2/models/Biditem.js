const mongoose = require("../mongoose");
const Schema = mongoose.Schema;

let BidItemSchema = new Schema({
    seller:{ 
        type: String,
        required: true,
        minlength: 3
    },
    highestbidder:{ 
        type: String,
        required: true,
        minlength: 3
    },
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    price: {
        type: Number,
        required: true,
        minlength: 3
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