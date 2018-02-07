const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');

describe('api/topics', function () {
  this.timeout(10000);

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
      it.only('get article by slug and 200 status', () => {
        return request
          .get('/api/topics/football/articles')
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.an('array')
            expect(res.body.articles[0]._id).to.equal("5a79cd9d39d1b52e5f2ac385")
          })
      });
    });
  });
})