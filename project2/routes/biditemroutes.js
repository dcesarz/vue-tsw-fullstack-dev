const router = require("express").Router();
const biditemservices = require("../services/biditemservices");
// Uwierzytelnianie
// const BidItem = require('../models/biditem');

// Wyłapywanie odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router.route("/startauction")
    .patch(biditemservices.startAuction)
    .all(rejectMethod);

router.route("/auction/:id")
    .get(biditemservices.read)
    .all(rejectMethod);

router.route("/auction")
    .post(biditemservices.newAuction)
    .patch(biditemservices.patchAuction)
    .delete(biditemservices.deleteAuction)
    .all(rejectMethod);

router
    .route("/auctions/page/:page")
    .get(biditemservices.auctionPage)
    .all(rejectMethod);

router.route("/my-bids/page/:page")
    .get(biditemservices.mybidsPage)
    .all(rejectMethod);

router.route("/my-auctions/page/:page")
    .get(biditemservices.myauctionsPage)
    .all(rejectMethod);

router.route("/my-history/page/:page")
    .get(biditemservices.myhistoryPage)
    .all(rejectMethod);

router.route("/")
    .get(biditemservices.list)
    .post(biditemservices.create)
    .all(rejectMethod);
    

router.route("/biditem/:id")
    .all(biditemservices.validateId)
    .put(biditemservices.update)
    .delete(biditemservices.delete)
    .all(rejectMethod);

module.exports = router;