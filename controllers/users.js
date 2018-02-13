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
  }).lean()
    .then((userArticles) => {
      const commentsCountPromises = userArticles.map((article) => {
        return Comments.count({
          belongs_to: article._id
        })
      })
      return Promise.all([userArticles, ...commentsCountPromises])
    })
    .then(([articles, ...commentCounts]) => {
      articles.forEach((article, i) => {
        article.comments = commentCounts[i]
      })
      res.status(200).json(articles)
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'bad path!'
      })
    })
}

function getAllCommentsByUser(req, res, next) {
  Comments.find({ created_by: req.params.username }).lean()
    .then((userComments) => {
      const commentArticlePromises = userComments.map((comment) => {
        return Articles.findOne({ _id: comment.belongs_to })
      })
      return Promise.all([userComments, ...commentArticlePromises])
    })
    .then(([userComments, ...commentArticles]) => {
      userComments.forEach((comment, i) => {
        if (commentArticles[i] !== null) {
          comment.commentArticle = commentArticles[i].title
          comment.commentTopic = commentArticles[i].belongs_to
        }
      })
      res.status(200).json(userComments)
    })
    .catch(console.error)
}

module.exports = {
  getUsers,
  getAllArticlesByUser,
  getAllCommentsByUser
};