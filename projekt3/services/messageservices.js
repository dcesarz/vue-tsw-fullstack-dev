const Message = require("../models/Message");

const processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

/**
 * @route POST api/msgs/new
 * @desc New message
 * @access Priavte
 */
module.exports.newMessage = (req, res) => {
    let { to, msg } = req.body;
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    let from = req.session.passport.user.id;
    if (!from){
      return res.status(401);
    }
    let date = Date.now();
    let n = new Message({
        sender,
        recipent,
        content
    });
    n.save().then(m => {
      return res.status(201).json(m);
    });
  }
};

/**
 * @route GET api/msgs/filter
 * @desc A filter
 * @access Private
 */
//  module.export.filter = async function(req, res){
//     if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
//     else {
//     let userId = req.session.passport.user.id;
//     Message.aggregate([
//       {$match:{"to": userId}}, 
//       {$group: {"_id": {"_id":"$_id", "from":"$from", "to":"$to", "msg":"$msg", "date":"$date"}, "from":{"$first":"$from"}}}
//     ], function(err, result) {
//         if (err) {
//           console.log(err);
//         } else {
//           res.json(result);
//         }
//       });
//     }
// };

module.exports.inbox = (req, res) => {
    Message.find((error, docs) => {
      if (error) {
        res.json(error);
      } else {
        res.json(docs);
      }
    });
  };

/**
 * @route GET api/msgs/inbox
 * @desc Getting messages addressed to the logged in user.
 * @access Private
 */
// module.exports.inboxpost = async function(req, res){
//   if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
//   else {
//   let userId = req.session.passport.user.id;
//   let from = req.body.from;
//   Message.aggregate([{ 
//     $match: { 
//       $or: [{'to': userId, 'from': from }, {'to': from, 'from': userId }]}}], function(err, result) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.json(result);
//       }
//     });
//   }
// };
