const express = require('express');
const router = express.Router();
const {
  getArticles,
  getCommentsForArticle,
  addCommentsForArticle,
  updateArticleVote,
  deleteArticle
} = require('../controllers/articles');

router.route('/')
  .get(getArticles);

router.route('/:article_id/comments')
  .get(getCommentsForArticle)
  .post(addCommentsForArticle);

router.route('/:article_id')
  .get(getArticles)
  .put(updateArticleVote)
  .delete(deleteArticle);


module.exports = router;