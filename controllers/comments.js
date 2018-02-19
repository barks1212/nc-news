const mongoose = require('mongoose');
const { Comments } = require('../models/models');

function getAllComments(req, res, next) {
  const query = !req.params.comment_id ? {} : { _id: req.params.comment_id };
  Comments.find(query).lean()
    .then((comments) => {
      res.status(200).json({ comments });
    })
    .catch(next);
}

function updateCommentVote(req, res, next) {
  const { vote } = req.query;
  const { comment_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(comment_id)) return next({ name: 'InvalidId' });
  let increment;
  if (vote === 'up') increment = 1;
  else if (vote === 'down') increment = -1;
  else return next({ name: 'InvalidQuery' });
  Comments.findOneAndUpdate({ _id: comment_id }, { $inc: { votes: increment } }, { new: true })
    .then((updateComment) => {
      res.status(202).json(updateComment);
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.comment_id)) return next({ name: 'InvalidId' });
  Comments.findOneAndRemove({ _id: req.params.comment_id })
    .then(() => {
      res.status(202).json('Comment deleted');
    })
    .catch(next);
}

module.exports = { updateCommentVote, deleteComment, getAllComments };
