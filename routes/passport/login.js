const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('passport/login')
})

module.exports = router