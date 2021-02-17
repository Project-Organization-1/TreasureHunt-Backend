const router = require('express').Router();
let User = require('../models/user.model');

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
      // console.log(groupId);
      // console.log(email);

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

      return res.status(200).json(foundUser);

    } catch (err) {
      return res.status(400).json({ "err": "some error occurred" });
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