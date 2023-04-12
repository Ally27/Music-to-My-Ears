const router = require("express").Router();
const {Post } = require("../models");


// const queryString = require("node:querystring");
const axios = require("axios");



//posts
router.get("/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    const post = postData.get({ plain: true });

    const spotifyKey = post.spotify_id
    const access_token = req.session.access_token

    
    const rawData = await axios.get(
      `https://api.spotify.com/v1/playlists/${spotifyKey}/tracks?limit=25`,
      // "https://api.spotify.com/v1/playlists/03HusFeEsbdRBAVU88VF26",

      {
        headers: {
          Authorization: `Bearer ${access_token}`
        },
      })

    const data = rawData.data
    const cover_img_url = rawData.data.items[0].track.album.images[0].url;
    res.status(200).json({message: cover_img_url})

    

 
    
    
  // res.render("post", { data, logged_in: req.session.logged_in, });
    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
