const express = require('express');
const router = express.Router();
const {
  // getSingleUser,
  getUsers,
  getAllArticlesByUser,
  getAllCommentsByUser
} = require('../controllers/users');

router.route('/')
  .get(getUsers);

router.route('/:username/articles')
  .get(getAllArticlesByUser);

  router.route('/:username/comments')
    .get(getAllCommentsByUser);

router.route('/:username')
  .get(getUsers);

module.exports = router;