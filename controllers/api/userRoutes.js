const router = require('express').Router();
const { User } = require('../../models');

router.post('/login', async (req, res) => {
  try {
    // looks for a matching entry to user's email that they entered 
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    // waits for user data to return that it is in fact a user, then calls bcrypt to compare the entered password with the stored one 
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // saves the user session to the boolean "true" so that it will return logged_in as true when our code checks
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    // destroys the db entry that we had initialized in our server.js file such that the session is ended and there is no stored data for it within our database after it has ended. 
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
