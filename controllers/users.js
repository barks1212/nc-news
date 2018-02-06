const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost/northcoders-news-api';
mongoose.Promise = Promise;
const {
  Users,
  Articles,
  Comments
} = require('../models/models')


function getUsers(req, res) {
  Users.find()
    .then((allUsers) => {
      res.status(200).json({
        users: allUsers
      });
    })
    .catch(console.error);
}

function getSingleUser(req, res) {
  Users.findOne({
    username: req.params.username
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(console.error);
}

function getAllArticlesByUser(req, res) {
  Articles.find({
    created_by: req.params.username
  })
    .then((userArticles) => {
      res.status(200).json(userArticles);
      mongoose.disconnect();
    })
    .catch(console.error);
}

function getAllCommentsByUser(req, res) {
  Comments.find({ created_by: req.params.username })
    .then((userComments) => {
      res.status(200).json(userComments);
    })
    .catch(console.error);
}

module.exports = {
  getSingleUser,
  getUsers,
  getAllArticlesByUser,
  getAllCommentsByUser
};