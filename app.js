if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const express = require('express');
const morgan = require('morgan')
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


app.use('/api', router)

app.use((err,req,res,next) => {
  if (err.status === 404) {
    return res.status(404).send(err.message);
  }
  next()
});

app.use((err, req, res, next) => {
  (error.name === 'CastError') ? res.status(400).send('cast error - check url') :
  res.status(500).json(err);
})

module.exports = app;