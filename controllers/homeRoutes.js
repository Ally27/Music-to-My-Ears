const router = require("express").Router();
const { User, Post, Tag } = require("../models");
const withAuth = require("../utils/auth");

// withAuth middleware is called to check if logged_in returns true for the current session before performing the get request
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll();

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("homepage", { posts });
    console.log(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // if user is already logged in for this session, redirect them to the homepage
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  // otherwise the login handlebar is rendered
  res.render("login");
});


//users
router.get("/users", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll();

    const users = userData.map((user) => user.get({ plain: true }));

    res.render("users", { users });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/users/:id", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);

    const user = userData.get({ plain: true });

    res.render("user", { user });

  } catch (err) {
    res.status(500).json(err);
  }
});

//posts
router.get("/posts/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    const post = postData.get({ plain: true });
    res.render("post", { post });
  } catch (err) {
    res.status(500).json(err);
  }
});
//tags
router.get("/tags/:tag", async (req, res) => {
  try {
    const tagData = await Tag.findOne({
      where: { tag_name: req.params.tag },
      include: [{ model: Post, through: PostTag, as: "tagged_posts" }],
    });
    const tag = tagData.get({ plain: true });
    res.render("tag", { tag });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
