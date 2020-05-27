const express = require("express");
const router = new express.Router();
//const User = require("../model/user");
//const Message = require("../model/message");
//const BidItem = require("../model/biditem");

//const passport = require("../passport");
//const bcrypt = require("../bcrypt");

const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

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

module.exports = router;