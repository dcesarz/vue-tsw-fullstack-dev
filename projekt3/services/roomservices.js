//const Room = require("../models/Room");
const User = require("../models/User");
const Room = require("../models/Room");

module.exports.newRoom = (req, res) => {
    if (req.session.passport === undefined) res.status(401).json({msg: "Unauthorized"});
    else {
    console.log('1');
    console.log(req.body);
    console.log(req.session.passport);
    User.findOne({"_id": req.session.passport.user}, (err, user) => {
        if (err) {
            console.log('2');
            //done(err);
            return res.status(400).json("Error.. :( ");
        }
        if (user) {
            if(user.username === req.body.user1 || user.username === req.body.user2)
            {
                console.log('3');
                console.log("continue..")
                console.log('6');
                let user2 = req.body.user2;
                let user1 = req.body.user1;
                // if (!user1){
                //   return res.status(401);
                // }
                console.log('7');
                let n = new Room({
                    user1,
                    user2
                });
                console.log('8');
                n.save().then(m => {
                  return res.status(201).json(m);
                });
            }
            else{
                console.log('4');
                return res.status(400).json("You have no authority to access this room");
                        }
            }
        else {
            console.log('5');
            return res.status(400).json("Unknown id!");
        }
    });
  }
};

module.exports.findByTwo = (req, res) => {
    let filtr = {
        $or: [
             { user1: req.body.user1, user2: req.body.user2},
             { user1: req.body.user2, user2: req.body.user1}
        ]
    };
    Room.findOne(filtr, function (err, doc) {
        if (err) {
            res.json(err);
          } else {
            res.json(doc);
          }
      });
}

module.exports.all = (req, res) => {
    Room.find((error, docs) => {
      if (error) {
        res.json(error);
      } else {
        res.json(docs);
      }
    });
  };

