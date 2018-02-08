const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');

describe('api/topics', function () {
  this.timeout(10000);
  let data;
  before(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then((savedData) => {
        data = savedData
      })
  })
  after(done => {
    mongoose.connection.close()
    done()
  })

  describe('GET methods', () => {
    describe('/', () => {
      it('Responds with an array of all topics and 200 status', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an('array')
            expect(res.body.topics[0].title).to.equal('Football')
          })
      });
    });
    describe('/:topic/articles', () => {
      it('get article by slug and 200 status', () => {
        return request
          .get(`/api/topics/${data.topics[0].slug}/articles`)
          .expect(200)
          .then(res => {
            console.log(res.body.articles)
            expect(res.body.articles).to.be.an('array')
            expect(res.body.articles[0].title).to.equal('Football is fun')
          })
      });
    });
  });

  describe('POST methods', () => {
    describe('/:topic/articles', () => {
      it('posts an article to specific topic 201 status', () => {
        return request
          .post(`/api/topics/${data.topics[0].slug}/articles`)
          .send({
            title: 'This is football',
            body: 'Football football football'
          })
          .expect(201)
          .then(res => {
            expect(res.body.created_by).to.equal('northcoder')
            expect(res.body.title).to.equal('This is football')
          });
      });
    });
  });

  describe('Error handling', () => {
    describe('/:topic/articles GET', () => {
      it('returns a 404 with error message for invalid GET request', () => {
        return request
          .get('/api/topics/candy/articles')
          .expect(404)
          .then(res => {
            expect(res.text).to.equal('invalid topic name!')
          });
      });
    });
    describe('/:topic/articles POST', () => {
      it('returns a 404 with error message for invalid POST request', () => {
        return request
          .post('/api/topics/candy/articles')
          .expect(404)
          .then(res => {
            expect(res.text).to.equal('invalid topic!')
          });
      });
    });
  });
});