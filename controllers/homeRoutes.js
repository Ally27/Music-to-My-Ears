const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// withAuth middleware is called to check if logged_in returns true for the current session before performing the get request 
router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']],
    });

    const users = userData.map((project) => project.get({ plain: true }));

    res.render('homepage', {
      users,
      // checks to make sure the withAuth returns true before rendering homepage view 
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // if user is already logged in for this session, redirect them to the homepage 
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  // otherwise the login handlebar is rendered 
  res.render('login');
});

module.exports = router;
