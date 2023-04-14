const router = require('express').Router();
const { User, Post, Tag, Comment } = require('../../models');

// gets all posts data 
router.get('/', async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [{ model: User, attributes: ['name'] }, {model: Tag}, {model: Comment, attributes: ['content'], order: [['id', 'ASC']] }],
      });
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

  // gets specific post data 
  router.get('/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [{ model: User, attributes: ['name'] }, {model: Tag}, {model: Comment, attributes: ['content'], order: [['id', 'ASC']] }],
      });
      // checks that there is a user with the requested id 
      if (!postData) {
        res.status(404).json({ message: 'No Post found with that id!' });
        return;
      }
      // makes a json of user if the id exist 
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // create new post 
  router.post('/', async (req, res) => {
    try {
      const postData = await Post.create(req.body);
      res.status(200).json(postData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });

//upvoting on a post
router.put("/upvote/:id", async (req, res) => {
  try {
    //  
    const postData = await Post.update( req.body, { where: { id: req.params.id } } );

    if (!postData) {
      res
        .status(404)
        .json({ message: "No post found with that id!" });
      return;
    } 
    res.json({message: "Upvote!"})
  } catch (err) {
    res.status(400).json(err);
  }
});


  
  module.exports = router;