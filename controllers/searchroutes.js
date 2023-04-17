const router = require("express").Router();
const { Post, User, Comment } = require("../models");

const { Op } = require("sequelize");


//posts
router.get("/:search", async (req, res) => {
  try {
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
    
const posts = postData.map((post) => post.get({ plain: true }));
const users = userData.map((user) => user.get({ plain: true }));
const comments = commentData.map((comment) => comment.get({ plain: true }));
const searchId = req.params.search
    
//   res.json({message: posts, users, comments})
res.render("search", { searchId, posts, users, comments, logged_in: req.session.logged_in, });
    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
