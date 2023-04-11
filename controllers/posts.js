const router = require("express").Router();
const { Post } = require("../models");

//posts
router.get("/:id", async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id);
      const spotify_ID = postData.spotify_id

      console.log(spotify_ID)
  
    //   res.render("post", { post, logged_in: req.session.logged_in, });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
module.exports = router;
