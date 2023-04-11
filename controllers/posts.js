const router = require("express").Router();
const {Post } = require("../models");


// const queryString = require("node:querystring");
const axios = require("axios");



//posts
router.get("/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    const post = postData.get({ plain: true });

    const postType = post.post_type
    const spotifyKey = post.spotify_id
    const access_token = req.session.access_token

    if (postType === "album" ) {
      const rawData = await axios.get(
        `https://api.spotify.com/v1/albums/${spotifyKey}/tracks?limit=10`,
        // "https://api.spotify.com/v1/playlists/03HusFeEsbdRBAVU88VF26",

        {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
        }
      )

      const data = rawData.data;
      res.status(200).json({message: data})

    } else if (postType === "album") {
        const rawData = await axios.get(
          `https://api.spotify.com/v1/${postType}s/${spotifyKey}/tracks?limit=10`,
          // "https://api.spotify.com/v1/playlists/03HusFeEsbdRBAVU88VF26",
  
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            },
          }
        )
  
        const data = rawData.data;
        res.status(200).json({message: data})
  
      } else if (postType === "audiobook" || postType === "podcast" || postType === "track" ) {
      const rawData = await axios.get(
        `https://api.spotify.com/v1/${postType}s/${spotifyKey}`,
        // "https://api.spotify.com/v1/playlists/03HusFeEsbdRBAVU88VF26",

        {
          headers: {
            Authorization: `Bearer ${access_token}`
          },
        }
      )

      // Handle the retrieved data here
      const data = rawData.data;
      const imageArr = data.images;
      const link = data.href;
      const title = data.name;
      
      res.status(200).json({message: imageArr, link, title})
    } else { 
      res.status(400).json({message: "Something is wrong with this post."})
    }

 
    
    
  // res.render("post", { data, logged_in: req.session.logged_in, });
    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
