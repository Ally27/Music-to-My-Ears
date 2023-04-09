const router = require("express").Router();
const { User, Post, Tag } = require("../models");
const withAuth = require("../utils/auth");


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

router.get("/login", (req, res) => {
  // if user is already logged in for this session, redirect them to the homepage
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  // otherwise the login handlebar is rendered
  res.render("login", {logged_in: req.session.logged_in,});
});


//users
router.get("/users", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll();
    const users = userData.map((user) => user.get({ plain: true }));

    res.render("users", { users, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/create", withAuth, async (req, res) => {
  try {
    const tagData = await Tag.findAll();
    const tags = tagData.map((tag) => tag.get({ plain: true }));

    res.render("create", { tags, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/users/:id", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    const user = userData.get({ plain: true });

    res.render("user", { user, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});

//posts
router.get("/posts/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    const post = postData.get({ plain: true });

    res.render("post", { post, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});

//tags
router.get("/tags/:tag", async (req, res) => {
  try {
    const tagData = await Tag.findOne({
      where: { tag_name: req.params.tag },
      include: [{ model: Post, through: PostTag, as: "tagged_posts" }],
    });

    const tag = tagData.get({ plain: true });
    res.render("tag", { tag, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to connect create/post page to navbar
router.get('/create', (req, res) => {
  // if user is logged in, redirect to their profile
  if (req.session.logged_in) {
    res.render('create');
    // otherwise prompt them to login 
  } else {
    res.redirect('/login');
  }
});

// route to connect community page to navbar
router.get('/community', (req, res) => {
  // if user is logged in, redirect to their profile
  if (req.session.logged_in) {
    res.render('community');
    // otherwise prompt them to login 
  } else {
    res.redirect('/login');
  }
});


// route to connect account page to navbar
router.get('/account', (req, res) => {
  // if user is logged in, redirect to their profile
  if (req.session.logged_in) {
    res.render('account', {logged_in: req.session.logged_in,});
    // otherwise prompt them to login 
  } else {
    res.redirect('/login');
  }
});


// route to connect contact page to navbar
router.get('/contact', (req, res) => {
  // if user is logged in, redirect to their profile
  if (req.session.logged_in) {
    res.render('contact');
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
