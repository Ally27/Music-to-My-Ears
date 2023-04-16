const router = require("express").Router();
const {Post, Comment, User, Tag } = require("../models");

const axios = require("axios");
const withAuth = require('../utils/auth');


// handles all data management/api calls dealing with displaying a post's data 
router.get("/", withAuth, async (req, res) => {

  try {
    // gets all comments for a post with specifed id 
    const newpostData = await Post.findAll({
        order: [['id', 'DESC']],
        include: [{ model: User, attributes: ['name'] }]
      });

    const commentData = await Comment.findAll({
      order: [['id', 'DESC']],
      include: [{ model: User, attributes: ['name'] },
      { model: Post, attributes: ['id'] }]
    });

    const newuserData = await User.findAll({
        order: [['id', 'DESC']],
      });
    
    const newpostsArr = newpostData.map((newpost) => newpost.get({ plain: true }));
    const newposts = newpostsArr.slice(0,3)
    const commentsArr = commentData.map((comment) => comment.get({ plain: true }));
    const comments = commentsArr.slice(0,5);
    const newuserArr = newuserData.map((newuser) => newuser.get({ plain: true }));
    const newusers = newuserArr.slice(0,5)

    // gets spotify key from post data and access token from session storage 
    const access_token = req.session.access_token

    for (let i = 0; i < newposts.length; i++) {
      const current_id = newposts[i].spotify_id;
      const rawData = await axios.get(
        `https://api.spotify.com/v1/playlists/${current_id}`,
  
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
        });
        const cover_img = rawData.data.images[0].url
      newposts[i].cover_img = cover_img; // modify the spotify_id value at the current index
    }


    // makes spotify api call to get the first 25 tracks from specified playlist 
    const rawData = await axios.get(
        `https://api.spotify.com/v1/browse/new-releases?country=US&limit=15`,
        // "https://api.spotify.com/v1/playlists/03HusFeEsbdRBAVU88VF26",

      {
        headers: {
          Authorization: `Bearer ${access_token}`
        },
      })
    
    // gets number of tracks, extracts data and creates empty array 
    const nalbums = rawData.data.albums.items.length
    const data = rawData.data.albums
    const albums = []

    // iterate through all tracks to get their artist, title, external link and image link and pushes that to a tracks array 
    for (var i=0; i<nalbums; i++) {
        const album = data.items[i]
        const artist = album.artists[0].name
        const title = album.name
        const exLink = album.external_urls.spotify
        const img = album.images[0].url
        const relDate = album.release_date
        albums.push({ artist,title,exLink,img, relDate})

    }
    // res.status(200),json({message: data})

//     // tracks array used to render on post.handlebars with specific information we want 
      res.render("community", { newposts, comments, newusers, albums, logged_in: req.session.logged_in, });
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;
