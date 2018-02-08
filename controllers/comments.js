const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Comments } = require('../models/models');


function getAllComments(req, res, next) {
  const query = !req.params.comment_id ? {} : { _id: req.params.comment_id };
  Comments.find(query).lean()
    .then((comments) => {
      console.log(comments)
      res.status(200).json({ comments });
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'Invalid id!'
      })
    })
}

function updateCommentVote(req, res, next) {
  const { comment_id } = req.params;
  let { vote } = req.body;
  let increment;
  if (vote === 'up') increment = 1;
  if (vote === 'down') increment = -1;

  Comments.findByIdAndUpdate({ _id: comment_id }, { $inc: { votes: increment } })
    .then(comment => {
      res.status(201)
      res.send(comment)
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'Invalid id provided or invalid query!'
      })
    })
}

function deleteComment(req, res, next) {
  Comments.findOneAndRemove({ _id: req.params.comment_id })
    .then(() => {
      res.status(202).json('Comment deleted');
    })
    .catch(err => {
      return next({
        status: 404,
        message: 'invalid id!'
      })
    })
}

module.exports = { updateCommentVote, deleteComment, getAllComments };
