const router = require("express").Router();
const userservices = require("../services/userservices");
const passport = require("../passport");

const rejectMethod = (_req, res) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router.route("/")
    .get(userservices.list)
    .post(userservices.create)
    .all(rejectMethod);


router.route("/currentuser")
    .get(userservices.loggeduser)
    .all(rejectMethod);

router
    .route("/login")
    .post(passport.authenticate("local"), userservices.login)
    .all(rejectMethod);

router
    .route("/logout")
    .get(userservices.logout)
    .all(rejectMethod);

router
    .route("/register")
    .post(userservices.register)
    .all(rejectMethod);

    
router.route("/user/:id")
    .all(userservices.validateId)
    .get(userservices.read)
    .put(userservices.update)
    .delete(userservices.delete)
    .all(rejectMethod);


module.exports = router;
