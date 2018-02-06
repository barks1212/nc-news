if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const router = require('./routes/api')
mongoose.Promise = Promise;
const app = express();

const {DB_URI, NODE_ENV} = process.env;
mongoose.connect(DB_URI)
.then(() => console.log('successfully connected to', NODE_ENV))
.catch(err => console.log('connection failed', err));

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send('All good');
});

// app.use('/api', router)

app.use((err, req, res, next) => {
  res.status(500).json(err);
  next();
})

module.exports = app;