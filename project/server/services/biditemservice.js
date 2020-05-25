const BidItem = require("../models");

const processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].biditem;
    }
    return msg;
};

const saveBidItem = (biditem, res) => {
    biditem.save( (err, doc) => {
        if (err) {
            // Unprocessable Entity
            res.status(422).json(processErrors(err));
        } else {
            res.json(doc);
        }
    });
};

module.exports.create = (req, res) => {
    let biditem = new BidItem(req.body);
    saveBidItem(biditem, res);
};

module.exports.read = (req, res, next) => {
    BidItem.findById(req.params.id, (err, biditem) => {
        if (err) {
            next(err);
        } else {
            if (biditem) {
                res.json(biditem);
            } else {
                // Not Found
                res.sendStatus(404);
            }
        }
    });
};

module.exports.list = (req, res, next) => {
    BidItem.find({}, (err, biditem) => {
        if (err) {
            next(err);
        } else {
            res.json(biditem);
        }
    });
};

// let BidItemSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//         max: 20
//     },
//     price: {
//         type: Number,
//         required: true,
//         max: 20
//     },
// });



module.exports.update = (req, res, next) => {
    BidItem.findById(req.params.id, (err, biditem) => {
        if (err) {
            next(err);
        } else {
            if (biditem) {
                biditem.name = req.body.name;
                biditem.price = req.body.price;
                saveBidItem(biditem, res);
            } else {
                // Not Found
                res.sendStatus(404);
            }
        }
    });
};

module.exports.delete = (req, res, next) => {
    BidItem.findByIdAndRemove(req.params.id, err => {
        if (err) {
            return next(err);
        } else {
            // No Content
            res.sendStatus(204);
        }
    });
};

module.exports.validateId = (req, res, next) => {
    let idRegExp = /^[0-9a-fA-F]{24}$/;
    if (!req.params.id.match(idRegExp)) {
        // Bad Request
        return res.sendStatus(400);
    }
    next();
};
