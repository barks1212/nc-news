if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})
}

const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});