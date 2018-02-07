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

  describe('GET methods' ,() => {
    describe('/', () => {
      it.only('Responds to GET request with an object with users array and 200 status', () => {
        return request
          .get('/api/users')
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body.users[0].username).to.equal('tickle122');
          });
      });
    })
  })
})