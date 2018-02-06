const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Topics, Articles, Comments } = require('../models/models');

function getAllTopics(req, res) {
    Topics.find()
        .then((allTopics) => {
            res.status(200).send(allTopics);
            mongoose.disconnect();
        })
        .catch(console.error)
}