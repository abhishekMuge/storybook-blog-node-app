const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("user");
const Story = mongoose.model("stories");
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');


router.get('/', (req, res) => {
    Story.find({status : 'public'})
        .populate('user')
        .sort({storyDate : 'desc'})
        .then(stories => {
            res.render('stories/index', {
                stories : stories 
            })
        })
})

// Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
      _id: req.params.id
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if(story.status == 'public'){
        res.render('stories/show', {
          story:story
        });
      } else {
        if(req.user){
          if(req.user.id == story.user._id){
            res.render('stories/show', {
              story:story
            });
          } else {
            res.redirect('/stories');
          }
        } else {
          res.redirect('/stories');
        }
      }  
    });
  });
  

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add')
})

router.post('/', (req, res) => {
    let allowComment;
    if(req.body.allowComment){
        allowComment = true
    }
    else{
        allowComment = false
    }

    const newStory = {
        title : req.body.title,
        body : req.body.body,
        status : req.body.status,
        allowComment : allowComment,
        user : req.user.id
    }

    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`stories/show/${story.id}`)
        })
})


router.get('/user/:userId', (req, res) => {
  Story.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories:stories
      });
    });
});

router.get('/edit/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
      })
      .populate('user')
      .then(story => {
        if(story.user.id != req.user.id  ){
          res.redirect('/stories')
        }
        else{
          res.render('stories/edit', {
            story: story
          });
        }
      });
})

router.put('/:id', (req,res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    let allowComment;
    if(req.body.allowComment){
        allowComment = true
    }
    else{
        allowComment = false
    }

    story.title  = req.body.title,
    story.body =  req.body.body,
    story.status  = req.body.status,
    story.allowComment  = allowComment,
    
    story.save()
    .then(story => {
      res.redirect('/dashboard');
    })

  });
})


router.delete('/:id', (req,res) => {
    Story.deleteOne({_id : req.params.id})
      .then(story => {
        res.redirect('/dashboard')
      })
})

router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }

    // Add to comments array
    story.comments.unshift(newComment);

    story.save()
      .then(story => {
        res.redirect(`/stories/show/${story.id}`);
      });
  });
});


module.exports = router;