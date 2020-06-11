const router = require("express").Router();
const messageservices = require("../services/messageservices");
// Uwierzytelnianie

// Wyłapywanie odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res) => {
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

router.route("/")
    .get(isAuth, messageservices.list)
    .post(isAuth, messageservices.create)
    .all(rejectMethod);

router.route("/message/:id")
    .all(messageservices.validateId)
    .get(isAuth, messageservices.read)
    .put(isAuth, messageservices.update)
    .delete(isAuth, messageservices.delete)
    .all(rejectMethod);

module.exports = router;
