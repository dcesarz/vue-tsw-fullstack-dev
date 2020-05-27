const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BidItemSchema = new Schema({
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
});

const BidItem = mongoose.model("BidItem", BidItemSchema);

BidItem.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = BidItem;