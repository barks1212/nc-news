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
      return Promise.all([allArticles, ...commentsCountPromises]);
    })
    .then(([articles, ...commentsCounts]) => {
      articles.forEach((article, i) => {
        article.comments = commentsCounts[i];
      });
      res.status(200).json({ articles });
    })
    .catch(next);
}

function getCommentsForArticle(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.article_id)) return next({ name: 'InvalidId' });
  Comments.find({
    belongs_to: req.params.article_id
  }).populate('belongs_to', 'title').lean()
    .then(comments => {
      comments.sort((b, a) => {
        return a.votes - b.votes;
      });
      res.status(200).json({ comments });
    })
    .catch(next);
}

function addCommentsForArticle(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.article_id)) return next({ name: 'InvalidId' });
  if (req.body.text === undefined || req.body.text.length === 0) return next({ name: 'InvalidComment' });
  const newComment = new Comments({
    body: req.body.text,
    belongs_to: req.params.article_id
  });
  return newComment.save()
    .then(newComment => {
      res.status(201).json(newComment);
    })
    .catch(next);
}

function updateArticleVote(req, res, next) {
  const { vote } = req.query;
  const { article_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(article_id)) return next({ name: 'InvalidId' });
  let increment;
  if (vote === 'up') increment = 1;
  else if (vote === 'down') increment = -1;
  else return next({ name: 'InvalidQuery' });
  Articles.findOneAndUpdate({ _id: article_id }, { $inc: { votes: increment } }, { new: true })
    .then((updatedArticle) => {
      res.status(202).json(updatedArticle);
    })
    .catch(next);
}

function deleteArticle(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.article_id)) return next({ name: 'InvalidId' });
  Articles.findOneAndRemove({ _id: req.params.article_id })
    .then(() => {
      res.status(202).json('Article deleted');
    });
}

module.exports = {
  getArticles,
  getCommentsForArticle,
  addCommentsForArticle,
  updateArticleVote,
  deleteArticle
};