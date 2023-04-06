const router = require('express').Router();
const { Post, Tag } = require('../../models');

router.get('/', async (req, res) => {
    try {
      const tagData = await Tag.findAll({
        include: [{model: Post}],
      });
      res.status(200).json(tagData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const tagData = await Tag.findByPk(req.params.id, {
        include: [{model: Post}],
      });
      // checks that there is a user with the requested id 
      if (!tagData) {
        res.status(404).json({ message: 'No Tag found with that id!' });
        return;
      }
      // makes a json of user if the id exist 
      res.status(200).json(tagData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;