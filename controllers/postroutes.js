const router = require("express").Router();
const {Post, Comment, User } = require("../models");

// const queryString = require("node:querystring");
const axios = require("axios");

router.get("/", async (req, res) => {
  
  try { 
    const postData = await Post.findAll();
    const posts = postData.map((post) => post.get({ plain: true }));
    

    // Render homepage.handlebars with the logged_in flag
    res.render('posts', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
})

// handles all data management/api calls dealing with displaying a post's data 
router.get("/:id", async (req, res) => {
  try {
    // gets all comments for a post with specifed id 
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name'] }]
    });
    const post = postData.get({ plain: true });

    // json.res({message: post})

    const commentData = await Comment.findAll({
      where: { post_id: req.params.id},
      include: [{ model: User, attributes: ['name'] }]
    });

    const comments = commentData.map((comment) => comment.get({ plain: true }));

    
    // gets spotify key from post data and access token from session storage 
    const spotifyKey = post.spotify_id
    const access_token = req.session.access_token

    // makes spotify api call to get the first 25 tracks from specified playlist 
    const rawData = await axios.get(
      `https://api.spotify.com/v1/playlists/${spotifyKey}/tracks?limit=25`,
      // "https://api.spotify.com/v1/playlists/03HusFeEsbdRBAVU88VF26",

      {
        headers: {
          Authorization: `Bearer ${access_token}`
        },
      })
    
    // gets number of tracks, extracts data and creates empty array 
    const ntracks = rawData.data.items.length
    const data = rawData.data
    const tracks = []

    // iterate through all tracks to get their artist, title, external link and image link and pushes that to a tracks array 
    for (var i=0; i<ntracks; i++) {
      const artist = data.items[i].track.artists[0].name
      const title = data.items[i].track.name
      const exLink = data.items[i].track.external_urls.spotify
      const img = data.items[i].track.album.images[0].url
      tracks.push({ artist,title,exLink,img})
    }

    console.log(tracks.length)

  // tracks array used to render on post.handlebars with specific information we want 
  res.render("post", { post, tracks, comments, logged_in: req.session.logged_in, });

  // res.json({message: post})
    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
