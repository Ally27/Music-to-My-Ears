const router = require('express').Router();
const { User, Post, Tag } = require('../../models');

router.get('/', async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [{ model: User }, {model: Tag}],
      });
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [{ model: User }, {model: Tag}],
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
  
  router.post('/', async (req, res) => {
    try {
      const postData = await Post.create(req.body);
      res.status(200).json(postData);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  module.exports = router;