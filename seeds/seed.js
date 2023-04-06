const sequelize = require('../config/connection');
const { User, Post, Tag } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Post.bulkCreate(postData, {
    individualHooks: true,
    returning: true,
  })

  await Tag.bulkCreate(tagData, {
    individualHooks: true,
    returning: true,
  })

  process.exit(0);
};

seedDatabase();
