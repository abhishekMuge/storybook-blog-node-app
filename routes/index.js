const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("user");
const Story = mongoose.model("stories");
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');


router.get('/',ensureGuest, (re, res) => {
    res.render('index/index')
})


router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Story.find({user:req.user.id})
    .then(stories => {
      res.render('index/dashboard', {
        stories: stories
      });
    }); 
  });



module.exports = router;