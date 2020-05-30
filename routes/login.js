const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User')
const passport = require('passport');
const initializePassport = require('../passport-config')

initializePassport(
    passport,
    async email => await User.findOne({email: email}).exec(),
    async id => await User.findOne({id: id})
)

router.get('/', (req, res) => {
    res.render('passport/login')
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
module.exports = router