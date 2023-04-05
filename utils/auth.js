const withAuth = (req, res, next) => {
  // checks to see if the user's session status is logged in. if not, redirects them to the login page 
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuth;
