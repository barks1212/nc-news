const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');

describe('api/comments', function () {
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
      it('gets all the comments with status 200', () => {
        return request
          .get('/api/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.an('array');
            expect(res.body.comments[0].created_by).to.equal('northcoder');
          })
      });
    });
    describe('/:commentid', () => {
      it('gets comments by id with status 200', () => {
        return request
          .get(`/api/comments/${data.comments[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.an('array');
            expect(res.body.comments[0].created_by).to.equal('northcoder');
          })
      });
    });
  });

  describe('PUT methods', () => {
    describe('/:commentid', () => {
      it.only('change the vote and 201 status', () => {
        return request
          .put(`/api/comments/${data.comments[0]._id}`)
          .send({ vote: 'up' })
          .expect(201)
          .then(res => {
            expect(res.body.votes).to.equal(0)
            return request
              .get(`/api/comments/${data.comments[0]._id}`)
              .then(res => {
                expect(res.body.comments[0].votes).to.equal(1)
              });
          });
      });
    });
  });

  describe('DELETE methods', () => {
    describe('/:commentid', () => {
      it('delete the comment and 202 status', () => {
        return request
          .delete(`/api/comments/${data.comments[0]._id}`)
          .expect(202)
          .then(res => {
            expect(res.body).to.equal('Comment deleted');
          });
      });
    });
  });

  describe('Error handling', () => {
    describe('/:commentid, GET', () => {
      it('returns a 404 with error message on invalid GET request', () => {
        return request
          .get('/api/comments/123456')
          .expect(404)
          .then(res => {
            expect(res.text).to.equal('Invalid id!')
          });
      });
    });
    describe('/:commentid, PUT', () => {
      it('returns a 404 with error message on invalid PUT request', () => {
        return request
          .put('/api/comments/123456?vote=up')
          .expect(404)
          .then(res => {
            expect(res.text).to.equal('Invalid id provided or invalid query!')
          });
      });
    });
    describe('/:commentid, DELETE', () => {
      it('returns a 404 with error message on invalid DELETE request', () => {
        return request
          .delete('/api/comments/123456')
          .expect(404)
          .then(res => {
            expect(res.text).to.equal('invalid id!')
          });
      });
    });
  });
});