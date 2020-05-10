"use strict";

const uuid = require("uuidv4").uuid;
const rtng = require("./rating");
const express = require("express");
const router = express.Router();

const passport = require("../user");
const bcrypt = require("../bcrypt");
const User = require("../model");

// „wyłapywanie”  odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router.route("/")
    .post((req, res) => {
        let params = req.body;
        req.session.id = uuid();
        let answer = "";
        let rated = [];
        for (let i = 0; i < params.size; i++) {
            answer += getRandomInt(params.dim).toString();
            rated[i] = false;
        }
        req.session.answer = answer;
        req.session.rated = rated;
        res.json({
            msg: "new game",
            params
        });
    })
    .patch((req, res) => {
        let move = rtng.rating(
            req.body.guess,
            req.session.rated,
            req.session.answer
        );
        req.session.rated = move[0];
        // oceniamy ruch
        res.json({
            black: move[1],
            white: move[2]
        });
    });

module.exports = router;

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
  

router
    .route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post(passport.authenticate("local"), async (req, res) => {
        await res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get((req, res) => {
        req.logout();
        res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/register")
    // „dla treningu”, inaczej niż w przykładzie z wykładu
    // (tsw-mongo-crud) użyjemy tutaj async/await
    .post(async (req, res) => {
        try {
            let passwordHash = bcrypt.hash(req.body.password);
            let user = new User({
                username: req.body.username,
                password: passwordHash
            });
            let doc = await user.save();
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

// przykładowe „API” – oczwiście musi być serwowane przez HTTPS!
router
    .route("/api/users")
    // tutaj uwierzytelniamy się przez HTTP – metodą Basic
    .get(passport.authenticate("basic", {
        session: false
    }), (req, res) => {
        User.find({}, (err, data) => {
            if (err) {
                res.code(500);
            } else {
                res.json(data);
            }
        });
    })
    .all(rejectMethod);

module.exports = router;
