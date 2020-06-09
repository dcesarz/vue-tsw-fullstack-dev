const router = require("express").Router();
const auctionservices = require("../services/auctionservices");

const rejectMethod = (_req, res) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router.route("/startauction")
    .patch(auctionservices.startAuction)
    .all(rejectMethod);

router.route("/auction/:id")
    .get(auctionservices.read)
    .all(rejectMethod);

router.route("/auction")
    .post(auctionservices.newAuction)
    .patch(auctionservices.patchAuction)
    .delete(auctionservices.deleteAuction)
    .all(rejectMethod);

// TODO: PAGINATION !

router
    .route("/auctions/page/:page")
    .get(auctionservices.auctionPage)
    .all(rejectMethod);

// TODO: those below

//router.route("/my-bids/page/:page")
//    .get(auctionservices.mybidsPage)
//     .all(rejectMethod);

// router.route("/my-auctions/page/:page")
//     .get(auctionservices.myauctionsPage)
//     .all(rejectMethod);

// router.route("/my-history/page/:page")
//     .get(auctionservices.myhistoryPage)
//     .all(rejectMethod);

// TODO : implement pagination heeere.


// router
//     .route("/auctions/page/:page")
//     .get(auctionservices.auctionPage)
//     .all(rejectMethod);

// router.route("/my-bids/page/:page")
//     .get(auctionservices.mybidsPage)
//     .all(rejectMethod);

// router.route("/my-auctions/page/:page")
//     .get(auctionservices.myauctionsPage)
//     .all(rejectMethod);

// router.route("/my-history/page/:page")
//     .get(auctionservices.myhistoryPage)
//     .all(rejectMethod);

router.route("/")
    .get(auctionservices.list)
    .post(auctionservices.create)
    .all(rejectMethod);
    

router.route("/auction/:id")
    .all(auctionservices.validateId)
    .put(auctionservices.update)
    .delete(auctionservices.delete)
    .all(rejectMethod);

module.exports = router;