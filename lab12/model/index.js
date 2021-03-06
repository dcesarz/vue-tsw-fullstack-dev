const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");
const errorHandler = {};

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    },
});

const messageSchema = new Schema({
    usrname: {
        type: String,
        required: true,
        minlength: 1
    },
    content: {
        type: String,
        required: true
    },
});

const chatRoomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    messages: [messageSchema]
});


// bez poniższej wtyczki nie dostaniemy sensownego sygnału
// błędu przy naruszeniu „unikatowości” nazwy użytkownika
const uniqueValidator = require("mongoose-unique-validator");
// ale z nią – już wszystko będzie jak należy
userSchema.plugin(uniqueValidator);

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const Message = mongoose.model("Message", messageSchema);
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema, "chatRooms");
const User = mongoose.model("User", userSchema);


// mały „postprocessing” błędów mongoosowych
errorhandler.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports.message = Message;
module.exports.chatRoom = ChatRoom;
module.exports.user = User;
module.exports.errorHandler = errorHandler;