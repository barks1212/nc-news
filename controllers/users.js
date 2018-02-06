const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost/northcoders-news-api';
mongoose.Promise = Promise;
const {
  Users,
  Articles,
  Comments
} = require('../models/models')


function getUsers(req, res) {
  Users.find()
    .then((allUsers) => {
      res.status(200).json({
        users: allUsers
      });
    })
    .catch(console.error);
}