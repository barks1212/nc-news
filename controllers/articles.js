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

function addCommentsForArticle(req, res) {
  const newComment = new Comments({
    body: req.body.comment,
    belongs_to: req.params.article_id
  })
  return newComment.save()
    .then(newComment => {
    res.status(201).json(newComment);
  })
    .catch(console.error)
}

function updateArticleVote(req, res) {
  Articles.findOne({
    _id: req.params.article_id
  })
    .then(article => {
      const { vote } = req.query;
      let currentVotes = article.votes;
      if (vote === 'up')++currentVotes
      else if (vote === 'down')--currentVotes
      return Promise.all([Articles.findOneAndUpdate({
        _id: article._id
      }, {
          $set: {
            votes: currentVotes
          }
        })])
    })
    .then(updatedArticle => {
      res.status(202).json(updatedArticle[0]);
    })
    .catch(console.error);
}