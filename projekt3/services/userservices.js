const User = require("../models/user.js");
//const passport = require("../passport");
const bcrypt = require("../bcrypt");
//t
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({
        message: "Not authenticated"
    });
};

const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(401).send('You are not authenticated')
    } else {
      return next()
    }
  }

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

module.exports.saveUser = saveUser;

module.exports.create = (req, res) => {
    const passwordHash = bcrypt.hash(req.body.password);
    const user = new User({
        username: req.body.username,
        password: passwordHash
    });
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


module.exports.update = (req, res, next) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            next(err);
        } else {
            if (user) {
                user.username = req.body.username;
                user.password = req.body.password;
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

// module.exports.login = (passport.authenticate("local"), async (req, res) => {
//     await res.json({
//         message: "success"
//     });
// })

module.exports.logout = (isAuthenticated, (req, res) => {
    console.log("Logging out");
    req.logout();
    res.status(200).json({
        isAuth: req.isAuthenticated()
    });
})


module.exports.login = async (req, res) => {
    res.status(200).send({ isAuthenticated: true, user: req.user });
  };
  
module.exports.loggeduser = (req, res) => {
    if (req.isAuthenticated()) {
      res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user
      });
    } else {
      res.json({
        isAuthenticated: req.isAuthenticated(),
        user: {}
      });
    }
  };

module.exports.authMiddleware = authMiddleware;

module.exports.processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

// module.exports.loggeduser = (req, res) => {
//         console.log(req.isAuthenticated());
//         if (req.isAuthenticated()) {
//             console.log("auth");
//             res.send({
//                 username: req.user.username,
//                 isAuth: req.isAuthenticated()
//             });
//         } else {
//             res.send({
//                 message: "Not logged in!"
//             });
//         }
// };

module.exports.register = (async (req, res) => {
    try {
        const passwordHash = bcrypt.hash(req.body.password);
        const user = new User({
            username: req.body.username,
            password: passwordHash
        });
        console.log(req.body);
        console.log(user);
        const doc = await user.save();
        return res.json(doc);
    } catch (err) {
        if (!req.body.password) {
            // Unprocessable Entity
            return res.status(422).json({
                password: "Error – password must not be empty!"
            });
        } else {
            return res.status(422).json(User.processErrors(err));
        }
    }
});