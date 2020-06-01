const router = require("express").Router();
const userservices = require("../services/userservices");
const biditemservices = require("../services/biditemservices");
const messageservices = require("../services/messageservices");
const passport = require("../passport");
const bcrypt = require("../bcrypt");
const User = require("../models/User");
// Uwierzytelnianie

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({
        message: "Not authenticated"
    });
};

// Wyłapywanie odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    console.log(_next);
    res.sendStatus(405);
};

router.route("/users")
    .get(userservices.list)
    .post(userservices.create)
    .all(rejectMethod);

router
    .route("/user")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.send({
                username: req.user.username,
                isAuth: req.isAuthenticated()
            });
        } else {
            res.send({
                message: "Not logged in"
            });
        }
    });


router.route("/users/:id")
    .all(userservices.validateId)
    .get(userservices.read)
    .put(userservices.update)
    .delete(userservices.delete)
    .all(rejectMethod);

router
    .route("/login")
    .post(passport.authenticate("local"), async (req, res) => {
        await res.json({
            message: "success"
        });
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get(isAuth, (req, res) => {
        console.log("Logging out");
        req.logout();
        res.status(200).json({
            isAuth: req.isAuthenticated()
        });
    })
    .all(rejectMethod);

router.route("/biditems")
    .get(biditemservices.list)
    .post(biditemservices.create)
    .all(rejectMethod);

router.route("/biditems/:id")
    .all(biditemservices.validateId)
    .get(biditemservices.read)
    .put(biditemservices.update)
    .delete(biditemservices.delete)
    .all(rejectMethod);

router.route("/messages")
    .get(messageservices.list)
    .post(messageservices.create)
    .all(rejectMethod);

router.route("/messages/:id")
    .all(messageservices.validateId)
    .get(messageservices.read)
    .put(messageservices.update)
    .delete(messageservices.delete)
    .all(rejectMethod);

router
    .route("/")
    .get((req, res) => {
        
        res.send("Home Page");
        //if(req.isAuthenticated())
        //    res.send("Home page");
        //else
        //    res.redirect("/login");
    })
    .all(rejectMethod);

router
    .route("/register")
    .post(async (req, res) => {
        try {
            const passwordHash = bcrypt.hash(req.body.password);
            const user = new User({
                username: req.body.username,
                password: passwordHash
            });
            const doc = await user.save();
            res.json(doc);
        } catch (err) {
            if (!req.body.password) {
                // Unprocessable Entity
                res.status(422).json({
                    password: "Error – password must not be empty!"
                });
            } else {
                res.status(422).json(User.processErrors(err));
            }
        }
    })
    .all(rejectMethod);

module.exports = router;
