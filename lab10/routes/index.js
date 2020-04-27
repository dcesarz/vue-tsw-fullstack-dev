"use strict";

const uuid = require("uuidv4").uuid;
const rtng = require("./rating");
const express = require("express");
const router = express.Router();

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
  