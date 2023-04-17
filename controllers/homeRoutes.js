const router = require("express").Router();
const { User, Post, Tag } = require("../models");
const queryString = require("node:querystring");
const axios = require("axios");
const withAuth = require('../utils/auth');


// base route. shows all posts.
//////// WANT TO CHANGE it to top 10 playlists wiith most upvotes.
router.get('/', withAuth, async (req, res) => {
  try {
//  gets all newest posts 
    const newpostData = await Post.findAll({
      order: [['id', 'DESC']],
      include: [{ model: User, attributes: ['name'] }]
    });
    // gets playlists with the highest number of upvotes
    const postData = await Post.findAll({
      order: [['upvotes', 'DESC']]
    });
    // gets all tag data
    const tagData = await Tag.findAll();

    // cuts newposts and posts to a specified amount to render on the homepage 
    const newpostsArr = newpostData.map((newpost) => newpost.get({ plain: true }));
    const postsArr = postData.map((post) => post.get({ plain: true }));
    const newposts = newpostsArr.slice(0,8)
    const posts = postsArr.slice(0,3)
    const tags = tagData.map((tag) => tag.get({ plain: true }));
    const access_token = req.session.access_token

    // makes api call for each iteration in the posts array and adds a cover_img property to each
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
    // gets all posts for user with id
    const postData = await Post.findAll({
      where: {user_id: req.params.id,},
    });
    // gets userdata for user with id
    const userData = await User.findByPk(req.params.id);
    const user = userData.get({ plain: true });

    // gets posts/user data to render, creates tagArr with all tag_id that user has post (without redundancy)
    const posts = postData.map((post) => post.get({ plain: true }));
    const tagsArr = [...new Set(postData.map((tag) => tag.tag_id))];
    let tags = [];

    // gets tag name for each tag id and adds it tags array 
    for (let i = 0; i< tagsArr.length; i++) {
      const tagData = await Tag.findByPk(tagsArr[i]);
      const tag = tagData.get({ plain: true });
      tags.push(tag)
    }
    const access_token = req.session.access_token

    // makes api call for each iteration in the posts array and adds a cover_img property to each
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
    // gets tag data
    const tagData = await Tag.findByPk(req.params.id);
    const tag = tagData.get({ plain: true });
    // gets all posts with associated tag 
    const postData = await Post.findAll({
      where: {tag_id: req.params.id},
      include: [{ model: User, attributes: ['name'] }]
    });
    // limits to 8 posts shown
    const newpostsArr = postData.map((post) => post.get({ plain: true }));
    const posts = newpostsArr.slice(0,8)

    const access_token = req.session.access_token

    // makes api call for each iteration in the posts array and adds a cover_img property to each
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
    // get all posts from user thats signed in 
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
    });
    // gets user data for the user whos signed in 
    const userData = await User.findByPk(req.session.user_id);
    // checks that there is a user with the requested id 
    if (!userData) {
      res.status(404).json({ message: "You don't have an account!" });
      return;
    }
 
    // gets posts/user data to render, creates tagArr with all tag_id that user has post (without redundancy)
    const posts = postData.map((post) => post.get({ plain: true }));
    const tagsArr = [...new Set(postData.map((tag) => tag.tag_id))];
    let tags = [];
    const user = userData.get({ plain: true });

    // gets list of names of all tags a specific user has used and returns an array  
    for (let i = 0; i< tagsArr.length; i++) {
      const tagData = await Tag.findByPk(tagsArr[i]);
      const tag = tagData.get({ plain: true });
      tags.push(tag)
    }

    const access_token = req.session.access_token

    // makes api call for each iteration in the posts array and adds a cover_img property to each
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
router.get('/contact', async (req, res) => {
  res.render('contact', {logged_in: req.session.logged_in});
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
 
  res.redirect('/')

});

// update password page. coming soon!
router.get('/updatepassword',  async (req, res) => {
  res.render('comingsoon');
  
});

module.exports = router;
