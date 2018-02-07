const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Comments } = require('../models/models');


function getAllComments(req, res, next) {
  const query = !req.params.comment_id ? {} : { _id: req.params.comment_id };
  Comments.find(query).lean()
    .then((comments) => {
      console.log(comments)
      res.status(200).json({comments});
    })
    .catch(err => {
      return next({
        status: 404,
        message : 'Invalid id!'
      })
    })
}

function updateCommentVote(req, res, next) {
  Comments.findOne({ _id: req.params.comment_id })
    .then((comment) => {
      const { vote } = req.query;
      let currentVotes = comment.votes;

      if (vote === 'up')++currentVotes
      else if (vote === 'down')--currentVotes
      return Promise.all([Comments.findOneAndUpdate({ _id: comment._id }, { $set: { votes: currentVotes } })])
    })
    .then((updateComment) => {
      res.status(202).json(updateComment);
    })
    .catch(err => {
      return next({
        status : 404,
        message : 'Invalid id provided or invalid query!'
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
        message : 'invalid id!'
      })
    })
}

module.exports = { updateCommentVote, deleteComment, getAllComments };
