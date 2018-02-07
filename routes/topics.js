const express = require('express');
const router = express.Router();
const { getAllTopics, getArticlesForTopic, addArticleForTopic } = require('../controllers/topics');

router.route('/')
  .get(getAllTopics);

router.route('/:topic/articles')
  .get(getArticlesForTopic)
  .post(addArticleForTopic);

module.exports = router;