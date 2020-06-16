const Auction = require("../models/Auction");
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({
        message: "Not authenticated"
    });
};

const processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].Auction;
    }
    return msg;
};

// eslint-disable-next-line
const checkAuctions = (req, res) => {
    let filter = {
        date: { $lte: new Date() },
        status: 'onSale'
    }
    // eslint-disable-next-line
    Auction.update(filter, { "$set": { status: 'sold' } }, { "multi": true }, (err, res) => {
        if (err) {
            console.log("error updating auctions");
            console.log(err);
        } else {
            console.log("auctions updated!");
        }
    });
};

module.exports.auctionsPage = (isAuthenticated, async (req, res) => {
    let page = parseInt(req.params.page);
    // hardcoded 10 because it makes sense  i guess
    let aggregate_options = [];
    let limit = 3;
    const options = {
        page, limit,
    }
    let match = {
        status: "onSale"
    };
    aggregate_options.push({ $match: match });

    const myAggregate = Auction.aggregate(aggregate_options);
    const result = await Auction.aggregatePaginate(myAggregate, options);
    res.status(200).json(result);
});

module.exports.myauctionsPage = (isAuthenticated, async (req, res) => {
    let page = parseInt(req.params.page);

    let aggregate_options = [];

    let limit = 3;
    const options = {
        page, limit,
    }

    let match = {
        $or: [
            { seller: req.user.username, status: "onSale" },
            { seller: req.user.username, status: "new" }
        ]
    };
    aggregate_options.push({ $match: match });

    const myAggregate = Auction.aggregate(aggregate_options);
    const result = await Auction.aggregatePaginate(myAggregate, options);
    res.status(200).json(result);
});

module.exports.mybidsPage = (isAuthenticated, async (req, res) => {
    let page = parseInt(req.params.page);
    let aggregate_options = [];

    let limit = 3;
    const options = {
        page, limit,
    }

    let match = {};
    match.bidders = req.user.username;
    match.status = 'onSale';


    aggregate_options.push({ $match: match });

    const myAggregate = Auction.aggregate(aggregate_options);
    const result = await Auction.aggregatePaginate(myAggregate, options);
    res.status(200).json(result);
});

module.exports.myhistoryPage = (isAuthenticated, async (req, res) => {
    let page = parseInt(req.params.page);
    let aggregate_options = [];

    let limit = 3;
    const options = {
        page, limit,
    }

    let match = {
        $or: [
            { latestBidder: req.user.username, status: "sold" },
            { seller: req.user.username, status: "sold" },
        ]
    };

    aggregate_options.push({ $match: match });

    const myAggregate = Auction.aggregate(aggregate_options);
    const result = await Auction.aggregatePaginate(myAggregate, options);
    res.status(200).json(result);
});

const saveAuction = (Auction, res) => {
    Auction.save((err, doc) => {
        if (err) {
            // Unprocessable Entity
            res.status(422).json(processErrors(err));
        } else {
            res.json(doc);
        }
    });
};

module.exports.create = (req, res) => {
    let Auction = new Auction(req.body);
    saveAuction(Auction, res);
};

module.exports.read = (req, res, next) => {
    Auction.findById(req.params.id, (err, Auction) => {
        if (err) {
            next(err);
        } else {
            if (Auction) {
                res.json(Auction.bids);
            } else {
                // Not Found
                res.sendStatus(404);
            }
        }
    });
};

module.exports.list = (req, res) => {
    Auction.find((error, docs) => {
        if (error) {
            res.json(error);
        } else {
            res.json(docs);
        }
    });
};

module.exports.update = (req, res) => {
    Auction.updateOne({ _id: req.body._id }, req.body,
        (error, doc) => {
            if (error) {
                res.status(500).json(processErrors(error));
            } else {
                res.status(201).json(doc);
            }
        });
};


module.exports.delete = (req, res, next) => {
    Auction.findByIdAndRemove(req.params.id, err => {
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

module.exports.startAuction = (req, res) => {
    console.dir(req.body);
    Auction.updateOne({ _id: req.body._id }, { $set: { status: "onSale" } }, (error, doc) => {
        if (error) {
            res.status(500).json(processErrors(error));
        } else {
            res.status(201).json(doc);
        }
    });
};

const endAuction = (req, res) => {
    console.dir(req.body);
    Auction.updateOne({ _id: req.body._id }, { $set: { status: "sold" } }, (error, doc) => {
        if (error) {
            res.status(500).json(processErrors(error));
        } else {
            res.status(201).json(doc);
        }
    });
};


module.exports.endAuction = endAuction;


module.exports.newAuction = async (req, res) => {
    const auction = new Auction({
        seller: req.user.username,
        status: req.body.status,
        type: req.body.type,
        name: req.body.name,
        price: req.body.price,
        date: req.body.date,
        description: req.body.description,
        bidders: [],
        latestBidder: ""
    });
    try {
        const doc = await auction.save();
        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json(processErrors(error));
    }
};


module.exports.patchAuction = (async (req, res) => {
    const body = req.body;
    console.dir(req.body);
    console.dir(req.body.id);
    Auction.findById(req.body.id, (err, doc) => {
        if (err) {
            res.code(500);
        } else {
            if (body.seller === req.user.username) {
                if (body.name) {
                    doc.name = body.name;
                }
                if (body.type) {
                    doc.type = body.type;
                }
                if (body.date || body.date === "") {
                    doc.date = body.date;
                }
            }
            if (body.bid) {
                doc.bids.push(body.bid);

            }
            if (body.status) {
                doc.status = body.status;
            }
            doc.save();
            res.json(doc);
        }
    }
    );
});

module.exports.deleteAuction = ((req, res) => {
    const filter = {
        _id: req.body.id,
        seller: req.user.username
    };
    Auction.findOneAndDelete(filter, (err, doc) => {
        if (err) {
            res.status(500).json(Auction.processErrors(err));
        } else {
            if (doc === null) {
                res.json({
                    message: "Error deleting auction"
                });
            } else {
                res.json({
                    message: "Auction successfully deleted"
                });
            }
        }
    }
    );
});



module.exports.processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};