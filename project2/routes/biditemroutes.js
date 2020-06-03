const router = require("express").Router();
const biditemservices = require("../services/biditemservices");
// Uwierzytelnianie

// Wyłapywanie odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res) => {
    // Method Not Allowed
    res.sendStatus(405);
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