const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost/northcoders-news-api';
mongoose.Promise = Promise;
const {
  Users,
  Articles,
  Comments
} = require('../models/models')

function updateTotalVotes(user, votes) {
  return Object.assign({}, user, {
    totalVotes: user.totalVotes ? user.totalVotes + votes : votes
  })
}

function reduceToVoteCount(collection) {
  return collection.reduce((total, item) => total + item.votes, 0);
}

function getUsers(req, res, next) {
  let users;
  const query = !req.params.username ? {} : { username: req.params.username };
  Users.find(query).lean()
    .then(users => {
      const articlePromises = users.map(user => {
        return Articles.find({ created_by: user.username })
      })
      return Promise.all([users, ...articlePromises]);
    })
    .then(([users, ...articlesByUser]) => {
      const articleVotesCounts = articlesByUser.map(reduceToVoteCount);
      users = users.map((user, i) => {
        return updateTotalVotes(user, articleVotesCounts[i])
      });
      const commentsPromises = users.map(user => {
        return Comments.find({ created_by: user.username })
      })
      return Promise.all([users, ...commentsPromises]);
    })
    .then(([users, ...commentsByUser]) => {
      const commentVotesCounts = commentsByUser.map(reduceToVoteCount);
      users = users.map((user, i) => {
        return updateTotalVotes(user, commentVotesCounts[i])
      });
      users.length ?
      res.status(200).json({ users })
      :
      res.status(404).send('Invalid username')
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'bad path!'
      })
    })
}

function getAllArticlesByUser(req, res, next) {
  Articles.find({
    created_by: req.params.username
  })
    .then((userArticles) => {
      userArticles.length ? 
      res.status(200).json(userArticles)
      :
      res.status(404).send('Invalid username')
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'bad path!'
      })
    })
}

function getAllCommentsByUser(req, res, next) {
  Comments.find({ created_by: req.params.username })
    .then((userComments) => {
      userComments.length ? 
      res.status(200).json(userComments)
      :
      res.status(400).send('Invalid Username') 
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'bad path!'
      })
    });
}

module.exports = {
  getUsers,
  getAllArticlesByUser,
  getAllCommentsByUser
};