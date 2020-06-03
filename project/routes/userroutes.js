const router = require("express").Router();
const userservices = require("../services/userservices");
const passport = require("../passport");
const bcrypt = require("../bcrypt");
const User = require("../models/user");
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
    res.sendStatus(405);
};

router.route("/users")
    .get(userservices.list)
    .post(userservices.create)
    .all(rejectMethod);

router.route("/user")
    .get(userservices.loggeduser)
    .all(rejectMethod);

router.route("/users/:id")
    .all(userservices.validateId)
    .get(userservices.read)
    .put(userservices.update)
    .delete(userservices.delete)
    .all(rejectMethod);

//TODO : methods below in userservices. Yep i have problems with that.

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

//TODO: register in userservices : tried before, didnt work
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
                res.status(422).json(model.processErrors(err));
            }
        }
    })
    .all(rejectMethod);

module.exports = router;
