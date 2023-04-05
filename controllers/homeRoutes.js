const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');

// withAuth middleware is called to check if logged_in returns true for the current session before performing the get request 
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll();

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', { posts });
    console.log(posts)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // if user is already logged in for this session, redirect them to the homepage 
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  // otherwise the login handlebar is rendered 
  res.render('login');
});

module.exports = router;
