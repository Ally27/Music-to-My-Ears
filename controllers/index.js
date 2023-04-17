const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const postRoutes = require('./postroutes');
const searchRoutes = require('./searchroutes')
const communityRoutes = require('./communityroutes')



router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/posts', postRoutes);
router.use('/search', searchRoutes);
router.use('/community', communityRoutes)

router.get('*', function(req, res){
    res.status(404).render('404', {logged_in: req.session.logged_in});
  });


module.exports = router;
