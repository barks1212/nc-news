const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Comments } = require('../models/models');


function getAllComments(req, res) {
  const query = !req.params.comment_id ? {} : { _id: req.params.comment_id };
  Comments.find(query).lean()
    .then((allComments) => {
      console.log(allComments)
      res.status(200).json(allComments);
    })
    .catch(console.error)
}

function updateCommentVote(req, res) {
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
    .catch(console.error)
}