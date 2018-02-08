const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Articles, Comments } = require('../models/models');

function getArticles(req, res, next) {

  const query = !req.params.article_id ? {} : { _id: req.params.article_id };
  Articles.find(query).lean()
    .then(allArticles => {
      const commentsCountPromises = allArticles.map((article) => {
        return Comments.count({
          belongs_to: article._id
        });
      });
      return Promise.all([allArticles, ...commentsCountPromises])
    })
    .then(([articles, ...commentsCounts]) => {
      articles.forEach((article, i) => {
        article.comments = commentsCounts[i];
      });
      res.status(200).json({ articles });
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid id!'
      })
    })
}

function getCommentsForArticle (req, res, next) {
  Comments.find({
    belongs_to: req.params.article_id
  }).populate('belongs_to', 'title').lean()
    .then(comments => {
      comments.sort((b, a) => {
        return a.votes - b.votes;
      });
      res.status(200).json({ comments });
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid id!'
      })
    })
}

function addCommentsForArticle (req, res, next) {
  const newComment = new Comments({
    body: req.body.text,
    belongs_to: req.params.article_id
  })
  return newComment.save()
    .then(newComment => {
      res.status(201).json(newComment);
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid id!'
      })
    })
}

function updateArticleVote (req, res, next) {
  const { article_id } = req.params;
  let { vote } = req.body;
  let increment;
  if (vote === 'up') increment = 1;
  if (vote === 'down') increment = -1;

  Articles.findByIdAndUpdate({ _id: article_id }, { $set: { votes: increment } })
    .then(article => {
      res.status(201)
      res.send(article)
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid id or query!'
      })
    })
}

function deleteArticle (req, res, next) {
  Articles.findOneAndRemove({ _id: req.params.article_id })
    .then(() => {
      res.status(202).json('Article deleted');
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid id!'
      })
    })
}
module.exports = {
  getArticles,
  getCommentsForArticle,
  addCommentsForArticle,
  updateArticleVote,
  deleteArticle
};