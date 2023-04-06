const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const tagRoutes = require('./tagRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/tags', tagRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
