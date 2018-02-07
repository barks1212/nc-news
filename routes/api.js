const express = require('express');
const router = express.Router();
const {topicsRouter, articlesRouter, commentsRouter, usersRouter} = require('./index');



router.use('/topics', topicsRouter)
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/users', usersRouter);
router.use('/*', (req, res) => {
  res.send('invalid url path')
});

module.exports = router;