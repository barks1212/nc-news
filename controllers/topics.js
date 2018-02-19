const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Topics, Articles, Comments } = require('../models/models');

function getAllTopics (req, res, next) {
  Topics.find()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

function getArticlesForTopic (req, res, next) {
  let articles;
  if (req.params.topic !== 'football' && req.params.topic !== 'coding' && req.params.topic !== 'cooking') return next({name: 'invalidTopic'});
  Articles.find({ belongs_to: req.params.topic }).lean()
    .then((allArticles) => {
      articles = allArticles;
      let commentCount = allArticles.map((article) => {
        return Comments.find({ belongs_to: article._id }).count();
      });
      return Promise.all(commentCount);
    })
    .then((comments) => {
      articles.forEach(function (element, i) {
        element.comments = comments[i];
      });
      articles.length ?
        res.status(200).json({ articles })
        :
        res.status(404).send('invalid topic name!');
    })
    .catch(next);
}

function addArticleForTopic (req, res, next) {
  if (req.body.title === undefined || req.body.title.length === 0) return next({name: 'invalidTitle'});
  if (req.body.body === undefined || req.body.body.length === 0) return next({name: 'invalidBody'});
  if (req.params.topic !== 'football' && req.params.topic !== 'coding' && req.params.topic !== 'cooking') return next({name: 'invalidTopic'});
  const newArticle = new Articles({
    title: req.body.title,
    body: req.body.body,
    created_by: req.body.created_by,
    belongs_to: req.params.topic
  });
  newArticle.save()
    .then((newArticle) => {
      res.status(201).json(newArticle);
    })
    .catch(next);
}

module.exports = {
  getAllTopics,
  getArticlesForTopic,
  addArticleForTopic
};