const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');

const queryString = require("node:querystring");
const axios = require("axios");



// withAuth middleware is called to check if logged_in returns true for the current session before performing the get request 
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll();
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      // Pass the logged in flag to the template
      logged_in: req.session.logged_in,
    });
    console.log("this is my access_token: " + req.session.access_token)
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

router.get('/account', (req, res) => {
  // if user is logged in, redirect to their profile
  if (req.session.logged_in) {
    res.render('account');
    // otherwise prompt them to login 
  } else {
    res.redirect('/login');
  }
});


router.get('/auth', async (req, res) => {
  const spotifyResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    queryString.stringify({
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: process.env.REDIRECT_URI_DECODED,
    }),


    {
      headers: {
        Authorization: "Basic " + process.env.BASE64_AUTHORIZATION,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  
  const new_access_token = spotifyResponse.data.access_token;
  req.session.access_token = new_access_token;
  
  res.redirect('/')
});


module.exports = router;
