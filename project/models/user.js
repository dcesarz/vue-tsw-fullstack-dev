const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");
const BidItemSchema = require("../models/biditem");
const MessageSchema = require("../models/message");

let UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        max: 20
    },
    password: {
        type: String,
        required: true,
        max: 20
    },
    biditems: [BidItemSchema],
    messages: [MessageSchema]
});

// bez poniższej wtyczki nie dostaniemy sensownego sygnału
// błędu przy naruszeniu „unikatowości” nazwy użytkownika
const uniqueValidator = require("mongoose-unique-validator");
// ale z nią – już wszystko będzie jak należy
UserSchema.plugin(uniqueValidator);

UserSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);

User.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = User;