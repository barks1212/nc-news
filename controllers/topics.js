const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Topics, Articles, Comments } = require('../models/models');

function getAllTopics(req, res, next) {
  Topics.find()
    .then((topics) => {
      res.status(200).send({ topics });
      mongoose.disconnect();
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid path!'
      });
    });
}

function getArticlesForTopic(req, res, next) {
  let articles;
  Articles.find({ belongs_to: req.params.topic }).lean()
    .then((allArticles) => {
      articles = allArticles
      let commentCount = allArticles.map((article) => {
        return Comments.find({ belongs_to: article._id }).count();
      })
      return Promise.all(commentCount)
    })
    .then((comments) => {
      articles.forEach(function (element, i) {
        element.comments = comments[i];
      });
      articles.length ?
        res.status(200).json({ articles })
        :
        res.status(404).send('invalid topic name!')
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid topic!'
            })
        })
}

function addArticleForTopic(req, res, next) {
  const newArticle = new Articles({
    title: req.body.title,
    body: req.body.body,
    created_by: req.body.created_by,
    belongs_to: req.body.topic
  })
  newArticle.save()
    .then((newArticle) => {
      res.status(201).json(newArticle)
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid topic!'
      })
    })
}

module.exports = {
    getAllTopics,
    getArticlesForTopic,
    addArticleForTopic
};