const router = require("express").Router();
const { User, Post, Tag } = require("../models");
const queryString = require("node:querystring");
const axios = require("axios");

// base route. shows all posts.
//////// WANT TO CHANGE it to top 10 playlists wiith most upvotes.
router.get('/', async (req, res) => {
  if (req.session.logged_in) {

    try {
      const postData = await Post.findAll();
      const posts = postData.map((post) => post.get({ plain: true }));


      // Render homepage.handlebars with the logged_in flag
      res.render('homepage', { posts, logged_in: req.session.logged_in });
    } catch (err) {
      res.status(500).json(err);
    }

    } else {
      res.redirect('/login');
    }
});


// route for login page 
router.get("/login", (req, res) => {
  // if user is already logged in for this session, redirect them to the homepage
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  // otherwise the login.handlebar is rendered
  res.render("login", {logged_in: req.session.logged_in,});
});


//get all users
router.get("/users", async (req, res) => {

  if (req.session.logged_in) {
    try {
      const userData = await User.findAll();
      const users = userData.map((user) => user.get({ plain: true }));

      res.render("users", { users, logged_in: req.session.logged_in, });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.redirect('/login');
  }
});


// route to create new post.
router.get("/create", async (req, res) => {
  if (req.session.logged_in) {

    try {
      // calls all tags from DB to dynamically render as options for their playlist
      const tagData = await Tag.findAll();
      const tags = tagData.map((tag) => tag.get({ plain: true }));

      res.render("create", { tags, logged_in: req.session.logged_in});
    } catch (err) {
      res.status(500).json(err);
    }

  } else {
    res.redirect('/login');
  }
});

// find a specific user 
router.get("/users/:id", async (req, res) => {
  if (req.session.logged_in) {
    try {
      const userData = await User.findByPk(req.params.id);
      const user = userData.get({ plain: true });

      res.render("user", { user, logged_in: req.session.logged_in, });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.redirect('/login');
  }
});

//get all posts associated with a tag 
router.get("/tags/:id", async (req, res) => {
  if (req.session.logged_in) {
    try {
      const postData = await Post.findAll({
        where: { tag_id: req.params.id },
      });

    const posts = postData.map((post) => post.get({ plain: true }));
    res.json({message: posts})
    // res.render("tag", { tag, logged_in: req.session.logged_in, });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.redirect('/login');
  }
});

// gets user_id from session storage and displays user's profile. has information about user and a list of all of their posts 
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
      if (!userData) {
        res.status(404).json({ message: "You don't have an account!" });
        return;
      }
      const posts = postData.map((post) => post.get({ plain: true }));
      // renders their account
      res.render("account", { user, posts, logged_in: req.session.logged_in});
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.redirect('/login');
  }
});

// Route to render page for editing user data 
router.get('/account/edit', async (req, res) => {
  if (req.session.logged_in) {

    try {
      const userData = await User.findByPk(req.session.user_id);
      const user = userData.get({ plain: true });
      // checks that there is a user with the requested id 
      if (!userData) {
        res.status(404).json({ message: "You don't have an account!" });
        return;
      }
      res.render('updateuser', {user, logged_in: req.session.logged_in}  );
    } catch {
      res.status(500).json(err);
    }
  } else {
    res.redirect('/login');
  }
});


// Route to sign up new user 
router.get('/signup', async (req, res) => {
  if (req.session.logged_in) {
    // redirects to homepage if already logged in 
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

// spotify authentificiation route to get access_token 
router.get('/auth', async (req, res) => {
  // uses .env variables to make api post to spotify and get access_token back
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
  
  // stores new access token in session storage 
  const new_access_token = spotifyResponse.data.access_token;
  req.session.access_token = new_access_token;
  //  gets user_id from session storage 
  const user_id = req.session.user_id
 
  // updates user model for logged in user with their access token to get it in the front end 
  try {
    //  
    const userData = await User.update(
      { access_token: new_access_token },
      { where: { id: user_id } }
    );

    // returns a error if  no user exists 
    if (!userData) {
      res
        .status(404)
        .json({ message: "No user found with that id!" });
      return;
    } 
    //takes user home 
    res.redirect('/')
  
  // returns error if not able to put anything for access token
  } catch (err) {
    res.status(400).json(err);
  }

});

router.get('/community', async (req, res) => {
  res.render('community');
});


module.exports = router;
