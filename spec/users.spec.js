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
      it('Responds to GET request with an object with users array and 200 status', () => {
        return request
          .get('/api/users')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body.users[0].username).to.equal('tickle122');
          });
      });
    });
    describe('/:username', () => {
      it('returns a specfic user with a 200 status', () => {
        return request
          .get(`/api/users/${data.user.username}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body.users[0].totalVotes).to.equal(0)
          });
      });
    });
    describe('/:username/articles', () => {
      it('returns a specified users articles', () => {
        return request
          .get(`/api/users/${data.user.username}/articles`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array')
            expect(res.body[0].belongs_to).to.equal('cats')
            expect(res.body.length).to.equal(2)
          });
      });
    });
    describe('/:username/comments', () => {
      it('returns a specified users comments', () => {
        return request
          .get(`/api/users/${data.user.username}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array')
            expect(res.body.length).to.equal(2)
          });
      });
    });
  });

  describe('Error handling', () => {
    it('returns a 404 with error message', () => {
      return request
        .get('/api/users/sandwiches')
        .expect(404)
        .then(res => {
          expect(res.text).to.equal('Invalid username')
        })
    })
  })
});