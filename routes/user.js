const router = require('express').Router();
let User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router
  .route('/login/:gpId/:email').get(async (req, res) => {
    try {
      const groupId = req.params.gpId;
      const email = req.params.email;

      const group = await User.find({ groupId: groupId });
      let foundUser;

      if (group.length == 0) {
        return res.status(201).json({ "message": "group id not found!" });
      }

      for (let user of group) {
        if (email === user.email) {
          foundUser = user;
          break;
        }
      }
      if(!foundUser) return res.status(202).json({"message" : "user not found"});

      // User found... return the token to the client
      const token = jwt.sign(foundUser.toJSON(), process.env.KEY, { algorithm: process.env.ALGORITHM, expiresIn: "5h" })
      return res.status(200).json({token : token.toString()});

    } catch (err) {
      console.log(err)
      return res.status(400).json(err);
    }
  })

// router.route('/').get((req, res) => {
//   Note.find({googleId : req.params.googleId})
//     .then(note => res.status(200).json(note))
//     .catch(err => res.status(400).json('Error: ' + err));
// });
// router.route('/add').post((req, res) => {
//   const groupId = req.body.groupId;
//   const email = req.body.email;

//   const newUser = new User({groupId,email});

//   newUser.save()
//         .then(() => res.json('User added!'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

module.exports = router;