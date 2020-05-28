const router = require("express").Router();
const userservices = require("../services/userservices");
const biditemservices = require("../services/biditemservices");
const messageservices = require("../services/messageservices");

const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router.route("/api/users")
    .get(userservices.list)
    .post(userservices.create)
    .all(rejectMethod);

router.route("api/users/:id")
    .all(userservices.validateId)
    .get(userservices.read)
    .put(userservices.update)
    .delete(userservices.delete)
    .all(rejectMethod);

router.route("/api/biditems")
    .get(biditemservices.list)
    .post(biditemservices.create)
    .all(rejectMethod);

router.route("api/biditems/:id")
    .all(biditemservices.validateId)
    .get(biditemservices.read)
    .put(biditemservices.update)
    .delete(biditemservices.delete)
    .all(rejectMethod);

router.route("/api/users")
    .get(userservices.list)
    .post(userservices.create)
    .all(rejectMethod);

router.route("api/messages/:id")
    .all(messageservices.validateId)
    .get(messageservices.read)
    .put(messageservices.update)
    .delete(messageservices.delete)
    .all(rejectMethod);

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
