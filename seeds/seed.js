const sequelize = require('../config/connection');
const { User, Post, Tag, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json')
const tagData = require('./tagData.json');
const commentData = require('./commentData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Tag.bulkCreate(tagData, {
    individualHooks: true,
    returning: true,
  })

  await Post.bulkCreate(postData, {
    individualHooks: true,
    returning: true,
  })

  await Comment.bulkCreate(commentData, {
    individualHooks: true,
    returning: true,
  })

  process.exit(0);
};

seedDatabase();
