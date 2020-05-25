const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");

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

let MessageSchema = new Schema({
    sender: UserSchema,
    recipent: UserSchema,
    content: {
        type: String,
        required: true,
        max: 255
    },
    timestamps: { 
        createdAt: "created_at"
    }
});

const errorHandler = {};
errorHandler.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

// bez poniższej wtyczki nie dostaniemy sensownego sygnału
// błędu przy naruszeniu „unikatowości” nazwy użytkownika
const uniqueValidator = require("mongoose-unique-validator");
// ale z nią – już wszystko będzie jak należy
UserSchema.plugin(uniqueValidator);

UserSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports.user = mongoose.model("user", UserSchema);
module.exports.biditem = mongoose.model("biditem", BidItemSchema);
module.exports.message = mongoose.model("message", MessageSchema);