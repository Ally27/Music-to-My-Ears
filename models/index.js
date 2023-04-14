const User = require('./User');
const Post = require('./Post')
const Tag = require('./Tag')
const Comment = require('./Comment')

// A user can have many post
User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  
// A post belongs to a single user
Post.belongsTo(User, {
    foreignKey: 'user_id',
  });

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  
// A post belongs to a single user
Comment.belongsTo(User, {
    foreignKey: 'user_id',
  });


// A tag can have many post
Tag.hasMany(Post, {
    foreignKey: 'tag_id'
});

// A post belongs to a single user
Post.hasOne(Tag, { 
    foreignKey: 'tag_id'
})

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
})

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
})

module.exports = { User, Post, Tag, Comment };
