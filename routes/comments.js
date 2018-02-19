const express = require('express');
const router = express.Router();
const {getAllComments, updateCommentVote, deleteComment}  = require('../controllers/comments');


router.route('/')
  .get(getAllComments);

router.route('/:comment_id')
  .get(getAllComments)
  .put(updateCommentVote)
  .delete(deleteComment);

module.exports = router;