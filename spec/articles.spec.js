const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');



describe('api/articles', function () {
  this.timeout(10000);

  after(done => {
    mongoose.connection.close()
    done()
  })
  describe('GET methods', () => {

    describe('/', () => {
      it('responds with an array of all articles and 200 status', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.be.an('array');
            expect(res.body.articles.length).to.equal(36);
          })
      });
    })
    describe('/:articleid/comments', () => {
      it('get comments of a specific article 200 status', () => {
        return request
          .get('/api/articles/5a79cd9d39d1b52e5f2ac398/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.an('array')
            expect(res.body.comments[0].belongs_to._id).to.equal("5a79cd9d39d1b52e5f2ac398")
          })
      });
    });
  })

  describe('PUT methods', () => {

    describe('./:articleid?vote', () => {
      it(`update article's vote  202 status`, () => {
        let votes;
        request
          .get('/api/articles/5a79cd9d39d1b52e5f2ac398')
          .then(res => {
            votes = res.votes;
          })
        return request
          .put('/api/articles/5a79cd9d39d1b52e5f2ac398?vote=up')
          .send({ votes: 5 })
          .expect(202)
          .then(res => {
            expect(res.body.votes).to.not.equal(votes);
          })
      });
    });
  });
});