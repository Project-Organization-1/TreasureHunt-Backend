const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req,res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router
.route('/login/:gpId/:email').get( async (req, res) => {
  const groupId = req.params.gpId;
  const email = req.params.email;
  console.log(groupId);
  console.log(email);

  const group = await User.find({groupId: groupId});
  
  for(let user of group){
    // console.log(user)
    if(email === user.email){

      res.append("user", user);
      console.log(res);
      return res.status(200).json(user);
    }
  }
  return res.status(200).send('group nt found')
  console.log(group);
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