const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Topics, Articles, Comments } = require('../models/models');

function getAllTopics(req, res) {
    Topics.find()
        .then((allTopics) => {
            res.status(200).send(allTopics);
            mongoose.disconnect();
        })
        .catch(console.error)
}

function getArticlesForTopic(req, res) {
  let everyArticle
  console.log(req.params.topic)
  Articles.find({ belongs_to: req.params.topic }).lean()
      .then((allArticles) => {
          everyArticle = allArticles
          let commentCount = allArticles.map((article) => {
              return Comments.find({ belongs_to: article._id }).count();
          })
          return Promise.all(commentCount)
      })
      .then((comments) => {
          everyArticle.forEach(function (element, i) {
              element.comments = comments[i];
          });
          res.status(200).json(everyArticle);
      })
      .catch(console.error)
}

function addArticleForTopic(req, res) {
  const newArticle = new Articles({
      title: req.body.title,
      body: req.body.body,
      created_by: req.body.by,
      belongs_to: req.params.topic_id
  })
  newArticle.save()
      .then((newArticle) => {
          res.status(201).json(newArticle)
      })
      .catch(console.error);
}