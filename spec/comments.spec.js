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
    describe('/:commentid', () => {
      it('gets comments by id with status 200', () => {
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
  });

  describe('PUT methods', () => {
    describe('/:commentid', () => {
      it('change the vote and 202 status', () => {
        let votes;
        request
          .get('/api/comments/5a79cd9e39d1b52e5f2ac3bc')
          .then(res => {
            votes = res.body.votes;
          });
        return request
          .put('/api/comments/5a79cd9e39d1b52e5f2ac3bc?vote=up')
          .expect(202)
          .then(res => {
            expect(res.body[0].votes).to.not.equal(votes);
          });
      });
    });
  });

  describe('DELETE methods', () => {
    describe('/:commentid', () => {
      it('delete the comment and 202 status', () => {
        return request
          .delete('/api/comments/5a79cd9e39d1b52e5f2ac3bb')
          .expect(202)
          .then(res => {
            expect(res.body).to.equal('Comment deleted');
          });
      });
    });
  });
});