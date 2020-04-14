const express = require('express');
const router = express.Router();



router.get('/', (re, res) => {
    res.render('index/index')
})


router.get('/dashboard', (re, res) => {
    res.send('this is dashboard');
})

module.exports = router;