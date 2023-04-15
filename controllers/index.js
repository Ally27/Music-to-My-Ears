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


module.exports = router;
