const router = require("express").Router();
const { User, Post, Tag } = require("../models");
const queryString = require("node:querystring");
const axios = require("axios");
const withAuth = require('../utils/auth');


// base route. shows all posts.
//////// WANT TO CHANGE it to top 10 playlists wiith most upvotes.
router.get('/', withAuth, async (req, res) => {
  try {

    const newpostData = await Post.findAll({
      order: [['id', 'DESC']],
      include: [{ model: User, attributes: ['name'] }]
    });
    const postData = await Post.findAll({
      order: [['upvotes', 'DESC']]
    });
    const tagData = await Tag.findAll();

    const newpostsArr = newpostData.map((newpost) => newpost.get({ plain: true }));
    const postsArr = postData.map((post) => post.get({ plain: true }));
    const newposts = newpostsArr.slice(0,8)
    const posts = postsArr.slice(0,3)
    const tags = tagData.map((tag) => tag.get({ plain: true }));
    const access_token = req.session.access_token

    for (let i = 0; i < posts.length; i++) {
      const current_id = posts[i].spotify_id;
      const rawData = await axios.get(
        `https://api.spotify.com/v1/playlists/${current_id}`,
  
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
        });
        const cover_img = rawData.data.images[0].url
      posts[i].cover_img = cover_img; // modify the spotify_id value at the current index
    }


    // Render homepage.handlebars with the logged_in flag
    res.render('homepage', { posts, newposts, tags, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err); // log the error message to the console
    res.status(500).json(err);
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
router.get("/users", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll();
    const users = userData.map((user) => user.get({ plain: true }));

    res.render("users", { users, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});


// route to create new post.
router.get("/create", withAuth, async (req, res) => {
  try {
    // calls all tags from DB to dynamically render as options for their playlist
    const tagData = await Tag.findAll();
    const tags = tagData.map((tag) => tag.get({ plain: true }));

    res.render("create", { tags, logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});

// find a specific user 
router.get("/users/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {user_id: req.params.id,},
    });

    const userData = await User.findByPk(req.params.id);
    const user = userData.get({ plain: true });

    const tagData = await Post.findAll({
      where: { user_id: req.params.id },
    });
    
    const posts = postData.map((post) => post.get({ plain: true }));
    const tagsArr = [...new Set(tagData.map((tag) => tag.tag_id))];
    let tags = [];

    for (let i = 0; i< tagsArr.length; i++) {
      const tagData = await Tag.findByPk(tagsArr[i]);
      const tag = tagData.get({ plain: true });
      tags.push(tag)
    }
    const access_token = req.session.access_token

    for (let i = 0; i < posts.length; i++) {
      const current_id = posts[i].spotify_id;
      const rawData = await axios.get(
        `https://api.spotify.com/v1/playlists/${current_id}`,
  
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
        });
        const cover_img = rawData.data.images[0].url
      posts[i].cover_img = cover_img; // modify the spotify_id value at the current index
    }
    // renders their account

    res.render("user", { user, posts, tags, logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all posts associated with a tag 
router.get("/tags/:id", withAuth, async (req, res) => {
  try { 

    const tagData = await Tag.findByPk(req.params.id);
    const tag = tagData.get({ plain: true });

    const postData = await Post.findAll({
      where: {tag_id: req.params.id},
      include: [{ model: User, attributes: ['name'] }]
    });
 
    const newpostsArr = postData.map((post) => post.get({ plain: true }));
    const posts = newpostsArr.slice(0,8)

    const access_token = req.session.access_token

    for (let i = 0; i < posts.length; i++) {
      const current_id = posts[i].spotify_id;
      const rawData = await axios.get(
        `https://api.spotify.com/v1/playlists/${current_id}`,
  
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
        });
        const cover_img = rawData.data.images[0].url
      posts[i].cover_img = cover_img; // modify the spotify_id value at the current index
    }


    // Render homepage.handlebars with the logged_in flag
    res.render('tag', { posts, tag, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// gets user_id from session storage and displays user's profile. has information about user and a list of all of their posts 
router.get('/account', async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
    });
    const userData = await User.findByPk(req.session.user_id);
    const user = userData.get({ plain: true });
    
    // checks that there is a user with the requested id 
    if (!userData) {
      res.status(404).json({ message: "You don't have an account!" });
      return;
    }

    const tagData = await Post.findAll({
      where: { user_id: req.session.user_id },
    });
    
    const posts = postData.map((post) => post.get({ plain: true }));
    const tagsArr = [...new Set(tagData.map((tag) => tag.tag_id))];
    let tags = [];

    for (let i = 0; i< tagsArr.length; i++) {
      const tagData = await Tag.findByPk(tagsArr[i]);
      const tag = tagData.get({ plain: true });
      tags.push(tag)
    }

    const access_token = req.session.access_token

    for (let i = 0; i < posts.length; i++) {
      const current_id = posts[i].spotify_id;
      const rawData = await axios.get(
        `https://api.spotify.com/v1/playlists/${current_id}`,
  
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
        });
        const cover_img = rawData.data.images[0].url
      posts[i].cover_img = cover_img; // modify the spotify_id value at the current index
    }
    
    // renders their account
    // res.json({message: tags})
    res.render("account", { user, posts, tags, logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to render page for editing user data 
router.get('/account/edit', withAuth, async (req, res) => {
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
router.get('/contact', withAuth, async (req, res) => {
  res.render('contact');
});

// spotify authentificiation route to get access_token 
router.get('/auth', withAuth, async (req, res) => {
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

router.get('/updatepassword',  async (req, res) => {
  res.render('comingsoon');
  
});

module.exports = router;
