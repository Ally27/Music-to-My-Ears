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

    res.render("create", { tags, logged_in: req.session.logged_in});
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

//tags
router.get("/tags/:id", async (req, res) => {
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

router.get('/account', async (req, res) => {
  // if user is logged in, redirect to their profile
  if (req.session.logged_in) {

    try {
      const postData = await Post.findAll({
        where: {
          user_id: req.session.user_id,
        },
      });
      const userData = await User.findByPk(req.session.user_id);
      const user = userData.get({ plain: true });
      // checks that there is a user with the requested id 
      if (!postData) {
        res.status(404).json({ message: "You haven't posted anything yet!" });
        return;
      }
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render("account", { user, posts, logged_in: req.session.logged_in});
  
    } catch (err) {
      res.status(500).json(err);
    }
  
  } else {
    res.redirect('/login');
  }
});

// Route to display edit bio page
router.get('/signup', async (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/')
  } else {
    res.render('signup');    
  }
});


// Route to display contact bio page
router.get('/contact', async (req, res) => {
  res.render('contact');
});

// Route to display community bio page
router.get('/community', async (req, res) => {
  res.render('community');
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
  const user_id = req.session.user_id
  // const body = JSON.stringify({
  //   access_token: req.session.access_token
  // }) 

  try {
    //  
    const userData = await User.update(
      { access_token: new_access_token },
      { where: { id: user_id } }
    );

    if (!userData) {
      res
        .status(404)
        .json({ message: "No user found with that id!" });
      return;
    } 
    console.log (new_access_token, user_id)
    res.redirect('/')
  
  } catch (err) {
    res.status(400).json(err);
  }

});

router.get('/community', async (req, res) => {
  res.render('community');
});


module.exports = router;
