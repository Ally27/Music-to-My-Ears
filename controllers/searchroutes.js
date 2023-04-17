const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const { Op } = require("sequelize");


router.get("/:search", async (req, res) => {
  try {
    // gets all posts where title or content include the searched string 
    const postData = await Post.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${req.params.search}%`
              }
            },
            {
              content: {
                [Op.like]: `%${req.params.search}%`
              }
            }
          ]
        }
      });

    // gets all users where name or bio include the searched string 
    const userData = await User.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${req.params.search}%`
              }
            },
            {
              bio: {
                [Op.like]: `%${req.params.search}%`
              }
            }
          ]
        }
      });
      
    // gets all comments where content include the searched string 
    const commentData = await Comment.findAll({
        include: [{ model: User, attributes: ['name'] },
        { model: Post, attributes: ['id', 'title'],
         }],
        where: {
          content: {
            [Op.like]: `%${req.params.search}%` 
          }
        }
      });

// maps all data we just grabbed from our api 
const posts = postData.map((post) => post.get({ plain: true }));
const users = userData.map((user) => user.get({ plain: true }));
const comments = commentData.map((comment) => comment.get({ plain: true }));
const searchId = req.params.search
    
// renders search results on our search.handlebars
res.render("search", { searchId, posts, users, comments, logged_in: req.session.logged_in, });
    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
