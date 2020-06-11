const router = require("express").Router();
const auctionservices = require("../services/auctionservices");

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({
        message: "Not authenticated"
    });
}

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
    .get(isAuth, auctionservices.list)
    .put(isAuth,auctionservices.update)
    .post(isAuth,auctionservices.create)
    .all(rejectMethod);
    

router.route("/auction/:id")
    .all(isAuth,auctionservices.validateId)
    .delete(isAuth,auctionservices.delete)
    .all(rejectMethod);


module.exports = router;