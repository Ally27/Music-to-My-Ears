const router = require("express").Router();
const { Tag } = require("../models");
const withAuth = require("../utils/auth");


router.get("/", withAuth, async (req, res) => {
  try {
    const tagData = await Tag.findAll();
    const tags = tagData.map((tag) => tag.get({ plain: true }));

    res.render("create", { tags, logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});




module.exports = router;
