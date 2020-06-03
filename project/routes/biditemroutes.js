const router = require("express").Router();
const userservices = require("../services/userservices");
const biditemservices = require("../services/biditemservices");
const messageservices = require("../services/messageservices");
const passport = require("../passport");
const bcrypt = require("../bcrypt");
const User = require("../models/user");
// Uwierzytelnianie
//not deleting unused imports as i may need them yet

// Wyłapywanie odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({
        message: "Not authenticated"
    });
};

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

module.exports = router;