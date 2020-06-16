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
    .patch(isAuth, auctionservices.startAuction)
    .all(rejectMethod);


router.route("/auction")
    .post(isAuth, auctionservices.newAuction)
    .patch(isAuth, auctionservices.patchAuction)
    .delete(isAuth, auctionservices.deleteAuction)
    .all(rejectMethod);

// TODO: PAGINATION !

router
    .route("/page/:page")
    .get(auctionservices.auctionsPage)
    .all(rejectMethod);

router
    .route("/my-auctions/page/:page")
    .get(isAuth, auctionservices.myauctionsPage)
    .all(rejectMethod);

router
    .route("/my-bids/page/:page")
    .get(isAuth, auctionservices.mybidsPage)
    .all(rejectMethod);

router
    .route("/my-history/page/:page")
    .get(isAuth, auctionservices.myhistoryPage)
    .all(rejectMethod);

router.route("/")
    .get(isAuth, auctionservices.list)
    .put(isAuth,auctionservices.update)
    .post(isAuth,auctionservices.create)
    .all(rejectMethod);
    

router.route("/auction/:id")
    .delete(isAuth,auctionservices.delete)
    .get(auctionservices.read)
    .all(rejectMethod);



module.exports = router;