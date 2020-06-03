const router = require("express").Router();
const messageservices = require("../services/messageservices");
// Uwierzytelnianie

// Wyłapywanie odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res) => {
    // Method Not Allowed
    res.sendStatus(405);
};

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

module.exports = router;
