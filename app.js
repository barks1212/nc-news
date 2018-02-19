if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/api');
mongoose.Promise = Promise;
const app = express();

const {DB_URI} = require('./config.js');

mongoose.connect(DB_URI)
  .then(() => console.log('successfully connected to', DB_URI))
  .catch(err => console.log('connection failed', err));

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send('All good');
});

app.use('/api', router);

app.use((err, req, res, next) => {
  switch (err.name) {
  case 'CastError':
    res.status(400).send({message: `Invalid id: ${err.value}`});
    break;
  case 'InvalidId':
    res.status(400).send({message: 'Invalid id'});
    break;
  case 'InvalidQuery':
    res.status(400).send({message: 'Vote must be up or down'}); 
    break;
  case 'InvalidComment':
    res.status(400).send({message: 'Please enter a valid comment'});
    break;
  case 'invalidUser':
    res.status(400).send({message: 'Please enter a valid username'});
    break;
  case 'noUserArticles':
    res.status(400).send({message: 'No articles for that user'});
    break;
  case 'noUserComments':
    res.status(400).send({message: 'No comments for that user'});
    break;
  case 'invalidTopic':
    res.status(400).send({message: 'Please enter a valid topic'});
    break;
  case 'invalidTitle':
    res.status(400).send({message: 'Please enter a valid title'});
    break;
  case 'invalidBody':
    res.status(400).send({message: 'Please enter a valid body'});
    break;
  default:
    res.status(500).send({message: 'Something went horribly wrong'});
    break;
  }
  next();
});

app.use((err,req,res,next) => {
  if (err.status === 404) {
    return res.status(404).send('not found');
  }
  next(err);
});


module.exports = app;