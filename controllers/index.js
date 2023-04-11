const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const postRoutes = require('./posts')
const userRoutes = require('./users')
const createRoutes = require('./create')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/create', createRoutes);


module.exports = router;
