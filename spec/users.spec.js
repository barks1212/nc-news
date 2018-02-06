const app = require('../app');
const {expect} = require ('chai');
const request = require('supertest')(app);

  describe('api/users', () => {
    it('Responds to GET request with an object with users array and 200 status', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('Object')
          expect(res.body.users[0].username).to.equal('tickle122');
        });
    });
  });