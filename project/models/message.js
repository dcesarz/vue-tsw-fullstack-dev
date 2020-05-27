const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = require("../models/user");

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

const Message = mongoose.model("Message", MessageSchema);

// mały „postprocessing” błędów mongoosowych
Message.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Message;