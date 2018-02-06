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