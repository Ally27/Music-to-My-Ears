const router = require("express").Router();
const {Post, Comment, User, Tag } = require("../models");

const axios = require("axios");
const withAuth = require('../utils/auth');


// handles all data management/api calls dealing with displaying a post's data 
router.get("/", withAuth, async (req, res) => {

  try {
    // gets all posts a user has made
    const tagData = await Post.findAll({
      where: { user_id: req.session.user_id },
    });
    
    // gets only tag_id from the posts and filters it to avoid any redundancy
    const tagsArr = [...new Set(tagData.map((tag) => tag.tag_id))];
    let tags = [];

    // gets list of names of all tags a specific user has used and returns an array  
    for (let i = 0; i< tagsArr.length; i++) {
      const tagData = await Tag.findByPk(tagsArr[i]);
      const tag = tagData.get({ plain: true });
      tags.push(tag)
    }

    // finds the newest posts 
    const newpostData = await Post.findAll({
        order: [['id', 'DESC']],
        include: [{ model: User, attributes: ['name'] }]
      });
    // finds the newest comments 
    const commentData = await Comment.findAll({
      order: [['id', 'DESC']],
      include: [{ model: User, attributes: ['name'] },
      { model: Post, attributes: ['id','title'] }]
    });
    // finds the newest users 
    const newuserData = await User.findAll({
        order: [['id', 'DESC']],
      });
    
    // gets only a specific number of newusers, new comments and new posts and returns an array for each to be rendered on community page.
    const newpostsArr = newpostData.map((newpost) => newpost.get({ plain: true }));
    const newposts = newpostsArr.slice(0,3)
    const commentsArr = commentData.map((comment) => comment.get({ plain: true }));
    const comments = commentsArr.slice(0,3);
    const newuserArr = newuserData.map((newuser) => newuser.get({ plain: true }));
    const newusers = newuserArr.slice(0,5)

    // gets spotify key from post data and access token from session storage 
    const access_token = req.session.access_token
    
    // iterates through newposts and runs a spotify api call for each to add cover_img to be rendered on community
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


    // makes spotify api call to get the 21 latest album releases on spotify
    const rawData = await axios.get(
        `https://api.spotify.com/v1/browse/new-releases?country=US&limit=21`,
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

    // iterate through all albums to get their artist, title, external link, image link and release date and pushes that to an album array 
    for (var i=0; i<nalbums; i++) {
        const album = data.items[i]
        const artist = album.artists[0].name
        const titleraw = album.name
        const title = titleraw.split(" (")[0]
        const exLink = album.external_urls.spotify
        const img = album.images[0].url
        const relDate = album.release_date
        albums.push({ artist,title,exLink,img, relDate})

    }

 // renders all above data on community page 
      res.render("community", { newposts, comments, newusers, albums, tags, logged_in: req.session.logged_in, });
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;
