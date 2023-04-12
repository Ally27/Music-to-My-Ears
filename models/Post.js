const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const axios = require("axios");

class Post extends Model {
  update(){
    this.upvotes = this.upvotes + 1
  }
}


Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spotify_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    post_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id',
      },
    },
    upvotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    cover_img: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    hooks: {
      async beforeCreate(post) {
        const spotifyId = post.spotify_id;
        const access_token = "BQD4mGbC3wEwC1xNZjJlRzivKTnIyoO_6J4NyrXOPVbd7MBIosnq7wty7-RR0qhbh3a4dFH2VAtCQ68HFTd4034JKppIUixQwlC6sZomP7huPQcJ73sGxvAnDB057aFd7rUKcdtARmaSFM21cB45JPrHVjsd5hHefVh20YrjFn2cIcvwu7K6x3gQpwc"
        // const accessToken = post.user.session.access_token; // assuming user is associated with post
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${spotifyId}/tracks?limit=25`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log("this is my response" + response)
        // const imgUrl = response.data.items[0].track.album.images[0].url; // assuming the image URL is present in the response
        // post.cover_img = imgUrl; // set the image URL to cover_img column
      }
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post',
  }
);

module.exports = Post;
