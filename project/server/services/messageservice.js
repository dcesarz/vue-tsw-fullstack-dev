const Message = require("../models");

const processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

const saveMessage = (message, res) => {
    message.save( (err, doc) => {
        if (err) {
            // Unprocessable Entity
            res.status(422).json(processErrors(err));
        } else {
            res.json(doc);
        }
    });
};

module.exports.create = (req, res) => {
    let message = new Message(req.body);
    saveMessage(message, res);
};

module.exports.read = (req, res, next) => {
    Message.findById(req.params.id, (err, message) => {
        if (err) {
            next(err);
        } else {
            if (message) {
                res.json(message);
            } else {
                // Not Found
                res.sendStatus(404);
            }
        }
    });
};

module.exports.list = (req, res, next) => {
    Message.find({}, (err, messages) => {
        if (err) {
            next(err);
        } else {
            res.json(messages);
        }
    });
};

module.exports.update = (req, res, next) => {
    Message.findById(req.params.id, (err, message) => {
        if (err) {
            next(err);
        } else {
            if (message) {
                message.title = req.body.title;
                message.content = req.body.content;
                saveMessage(message, res);
            } else {
                // Not Found
                res.sendStatus(404);
            }
        }
    });
};

module.exports.delete = (req, res, next) => {
    Message.findByIdAndRemove(req.params.id, err => {
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
