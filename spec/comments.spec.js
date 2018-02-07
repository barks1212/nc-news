const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');

describe('api/comments', function () {
  this.timeout(10000);

  after(done => {
    mongoose.connection.close()
    done()
  })

  describe('GET methods', () => {
    describe('/', () => {
      it('gets all the comments with status 200', () => {
        return request
          .get('/api/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.an('array');
            expect(res.body.comments[0].created_by).to.equal('weegembump');
          })
      });
    });
    it.only('gets comments by id with status 200', () => {
      return request
        .get('/api/comments/5a79cd9e39d1b52e5f2ac3bc')
        .expect(200)
        .then(res => {
          console.log(res.body)
          expect(res.body.comments).to.be.an('array');
          expect(res.body.comments[0].created_by).to.equal('weegembump');
        })
    });
  });
  it('change the vote and 202 status', () => {
    let votes;
    request
      .get('/api/comments/5a3d30a7e84d40061379c5d7')
      .then(res => {
        votes = res.votes;
      });
    return request
      .put('/api/comments/5a3d30a7e84d40061379c5d7?vote=up')
      .expect(202)
      .then(res => {
        expect(res.body[0].votes).to.not.equal(votes);
      });
  });
  it('delete the comment and 200 status', () => {
    return request
      .delete('/api/comments/5a3d2c9456ce3f044853cbe5')
      .expect(202)
      .then(res => {
        expect(res.body).to.equal('Comment deleted');
      });
  });
});