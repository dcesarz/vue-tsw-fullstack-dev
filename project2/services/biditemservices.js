const BidItem = require("../models/biditem");

const isAuth = (req, res, next) => {
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
        msg[key] = err.errors[key].biditem;
    }
    return msg;
};

const paginatedResults = (filter) => {
    return async (req, res, next) => {
        let tempPage = 1;
        if (req.params.page) {
            tempPage = req.params.page;
        }
        const page = parseInt(tempPage);
        const limit = 2;

        const skippedPages = (page - 1) * limit;
        try {
            const docs = await BidItem.find(
                filter
            ).skip(skippedPages).limit(limit + 1);

            const results = {
                auctions: docs
            };
            if (docs.length > limit) {
                results.nextPage = true;
                docs.pop();
            } else {
                results.nextPage = false;
            }
            if (skippedPages > 0) {
                results.previousPage = true;
            } else {
                results.previousPage = false;
            }
            res.paginatedResults = results;
            next();
        } catch (err) {
            console.log(err);
            res.status(422).json(BidItem.processErrors(err));
        }
    };
};

async function paginatedResults2 (filter, _page) {
    const page = parseInt(_page);
    const limit = 2;

    const skippedPages = (page - 1) * limit;
    try {
        const docs = await BidItem.find(
            filter
        ).skip(skippedPages).limit(limit + 1);
        const results = {
            auctions: docs
        };
        if (docs.length > limit) {
            results.nextPage = true;
            docs.pop();
        } else {
            results.nextPage = false;
        }
        if (skippedPages > 0) {
            results.previousPage = true;
        } else {
            results.previousPage = false;
        }
        return results;
    } catch (err) {
        console.log(err);
        return { myErrorMessage: err };
    }
}

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
                res.json(biditem.bids);
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

module.exports.listBids = (req, res, next) => {
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

module.exports.update = (req, res, next) => {
    BidItem.findById(req.params.id, (err, biditem) => {
        if (err) {
            next(err);
        } else {
            if (biditem) {
                biditem.name = req.body.name;
                biditem.price = req.body.price;
                biditem.seller = req.body.seller;
                biditem.type = req.body.type;
                biditem.latestBidder = req.body.latestBidder;
                biditem.bidders = req.body.bidders;
                biditem.duration = req.body.duration;
                biditem.status = req.body.status;
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

module.exports.startAuction = (isAuth, (req, res) => {
        const filter = {
            _id: req.body.id,
            seller: req.user.username
        };
        BidItem.findOne(filter, (err, doc) => {
            if (err) {
                res.status(500).json(BidItem.processErrors(err));
            } else if (doc.seller === req.user.username &&
                       doc.status === "New") {
                doc.status = "OnSale";
                if (doc.type === "Bid") {
                    const tempTime = doc.duration;
                    doc.duration = new Date(new Date().getTime() + doc.duration).getTime();
                    console.dir(doc.duration);
                    doc.save();
    
                    res.json(doc);
                    console.dir("Auction timeout started.....");
                    setTimeout(() => {
                        BidItem.findOne(filter, (err, doc) => {
                            if (err) {
                                res.status(500).json(BidItem.processErrors(err));
                            } else if (doc.latestBidder !== "") {
                                console.dir("Auction sold");
                                doc.status = "Sold";
                            } else {
                                console.dir("Not sold.");
                                doc.status = "NotSold";
                            }
                            doc.save();
                        }
                        );
                    }, tempTime);
                } else {
                    doc.save();
                    console.dir("Product on sale");
                    res.json(doc);
                }
            } else {
                res.json({ message: "Auction has already started.." });
            }
        });
    
})

module.exports.newAuction = (async (req, res) => {
        try {
            const user = req.user;
            const body = req.body;
            let biditem = {};
            if (req.body.type === "Bid") {
                biditem = new BidItem({
                    name: body.name,
                    price: body.price,
                    type: body.type,
                    seller: user.username,
                    duration: body.duration,
                    status: body.status
                });
            } else {
                biditem = new BidItem({
                    name: body.name,
                    price: body.price,
                    type: body.type,
                    seller: user.username,
                    status: body.status
                });
            }
            const doc = await biditem.save();
            res.json(doc);
        } catch (err) {
            console.log(err);
            res.status(422).json(BidItem.processErrors(err));
        }
});

module.exports.patchAuction = (async (req, res) => { 
        const body = req.body;
        console.dir(req.body);
        console.dir(req.body.id);
        BidItem.findById(req.body.id, (err, doc) => {
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
                        if (body.duration || body.duration === "") {
                            doc.duration = body.duration;
                        }
                    }
                    if (body.bid) {
                        doc.bids.push(body.bid);
                        //update.bids = bids;
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
    BidItem.findOneAndDelete(filter, (err, doc) => {
        if (err) {
            res.status(500).json(BidItem.processErrors(err));
        } else {
            if (doc === null) {
                res.json({
                    message: "Make sure you are an owner of the auction to delete it."
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

module.exports.auctionPage = (paginatedResults({ status: "OnSale" }), (req, res) => {
    res.json(res.paginatedResults)});

module.exports.mybidsPage = (isAuth, async (req, res) => {
        const filter = {
            bidders: req.user.username,
            status: "OnSale"
        };
        const results = await paginatedResults2(filter, req.params.page);
        // console.dir(results);
        if (results.myErrorMessage !== undefined) {
            res.status(422).json(BidItem.processErrors(results.myErrorMessage));
        } else {
            res.json(results);
        }
    });

module.exports.myauctionsPage = (isAuth, async (req, res) => {
    const filter = {
        $or: [
            { seller: req.user.username, status: "New" },
            { seller: req.user.username, status: "OnSale" }
        ]
    };
    const results = await paginatedResults2(filter, req.params.page);
    // console.dir(results);
    if (results.myErrorMessage !== undefined) {
        res.status(422).json(BidItem.processErrors(results.myErrorMessage));
    } else {
        res.json(results);
    }
});

module.exports.myhistoryPage = (isAuth, async (req, res) => {
    const filter = {
        $or: [
            { latestBidder: req.user.username, status: "Sold" },
            { seller: req.user.username, status: "Sold" },
            { latestBidder: req.user.username, status: "NotSold" },
            { seller: req.user.username, status: "NotSold" }
        ]
    };
    const results = await paginatedResults2(filter, req.params.page);
    // console.dir(results);
    if (results.myErrorMessage !== undefined) {
        res.status(422).json(BidItem.processErrors(results.myErrorMessage));
    } else {
        res.json(results);
    }
});

module.exports.processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};