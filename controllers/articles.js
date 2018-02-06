const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Articles, Comments } = require('../models/models');

function getArticles(req, res) {
  const query = !req.params.article_id ? {} : { _id: req.params.article_id };
  Articles.find(query).lean()
    .then(allArticles => {
      const commentCount = allArticles.map((article) => {
        return Comments.find({
          belongs_to: article._id
        }).count();
      });
      return Promise.all([allArticles, Promise.all(commentCount)])
    })
    .then(([allArticles, comments]) => {
      allArticles.forEach((article, i) => {
        article.comments = comments[i];
      });
      res.status(200).json(allArticles);
    })
    .catch(console.error)
}

function getCommentsForArticle(req, res) {
  Comments.find({
    belongs_to: req.params.article_id
  }).populate('belongs_to', 'title').lean()
    .then(allComments => {
      allComments.sort((b, a) => {
        return a.votes - b.votes;
      });
      res.status(200).json(allComments);
    })
    .catch(console.error)
}