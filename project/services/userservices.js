const User = require("../models/user.js");
const passport = require("passport");

const processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].user;
    }
    return msg;
};

const saveUser = (user, res) => {
    user.save( (err, doc) => {
        if (err) {
            // Unprocessable Entity
            res.status(422).json(processErrors(err));
        } else {
            res.json(doc);
        }
    });
};

module.exports.create = (req, res) => {
    let user = new User(req.body);
    saveUser(user, res);
};

module.exports.read = (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            next(err);
        } else {
            if (user) {
                res.json(user);
            } else {
                // Not Found
                res.sendStatus(404);
            }
        }
    });
};

module.exports.list = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) {
            next(err);
        } else {
            res.json(users);
        }
    });
};

// let UserSchema = new Schema({
//     username: {
//         type: String,
//         required: true,
//         max: 20
//     },
//     password: {
//         type: String,
//         required: true,
//         max: 20
//     },
//     biditems: [BidItemSchema],
//     messages: [MessageSchema]
// });

module.exports.update = (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            next(err);
        } else {
            if (user) {
                user.username = req.body.username;
                user.password = req.body.password;
                user.biditems = req.body.biditems;
                user.messages = req.body.messages;
                saveUser(user, res);
            } else {
                // Not Found
                res.sendStatus(404);
            }
        }
    });
};

module.exports.delete = (req, res, next) => {
    User.findByIdAndRemove(req.params.id, err => {
        if (err) {
            return next(err);
        } else {
            // No Content
            res.sendStatus(204);
        }
    });
};

module.exports.validateId = (req, res, next) => {
    let idRegExp = /^[0-9a-fA-F]{24}$/;
    if (!req.params.id.match(idRegExp)) {
        // Bad Request
        return res.sendStatus(400);
    }
    next();
};

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        return res.status(400).send([user, "Cannot log in", info]);
      }
  
      req.login(user, err => {
        res.send("Logged in");
      });
    })(req, res, next);
  };

  module.exports.logout = (req, res, next) => {
    req.logout();
    console.log("logged out")
    return res.send();
  };

  module.exports.authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(401).send('You are not authenticated')
    } else {
      return next()
    }
  }