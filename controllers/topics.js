const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Topics, Articles, Comments } = require('../models/models');

function getAllTopics(req, res) {
    Topics.find()
        .then((topics) => {
            res.status(200).send({topics});
            mongoose.disconnect();
        })
        .catch(console.error)
}

function getArticlesForTopic(req, res) {
  let everyArticle
  console.log(req.params.topic)
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
          res.status(200).json({articles});
      })
      .catch(console.error)
}

function addArticleForTopic(req, res) {
  const newArticle = new Articles({
      title: req.body.title,
      body: req.body.body,
      created_by: req.body.created_by,
      belongs_to: req.params.topic
  })
  newArticle.save()
      .then((newArticle) => {
          res.status(201).json(newArticle)
      })
      .catch(console.error);
}

module.exports = {
  getAllTopics,
  getArticlesForTopic,
  addArticleForTopic
};