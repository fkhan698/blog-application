const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/User')


router.get('/', (req, res) => {
    res.render('passport/register')
})

router.post('/', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      let newUser = new User({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      newUser = await newUser.save();
      res.redirect('/login')
    } catch(e){
      console.log(e)
      res.redirect('/register')
    }
})

//   function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect('/')
//     }
//     next()
//     }
  


module.exports = router;