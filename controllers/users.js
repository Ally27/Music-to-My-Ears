const router = require("express").Router();
const { User, Post, Tag } = require("../models");
const withAuth = require("../utils/auth");


//users
router.get("/", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll();
    const users = userData.map((user) => user.get({ plain: true }));

    res.render("users", { users, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    const user = userData.get({ plain: true });

    res.render("user", { user, logged_in: req.session.logged_in, });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
