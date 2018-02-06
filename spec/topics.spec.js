const app = require('../app');
const {expect} = require ('chai');
const request = require('supertest')(app);

  describe('api/topics', () => {
    it('Responds with an array of all topics and 200 status', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('Array')
          expect(res.body[0].title).to.equal('Football')
        })
    })
    it('get article by slug and 200 status', () => {
      return request
        .get('/api/topics/football/articles')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('Array')
          expect(res.body[0]._id).to.equal("5a3d30a7e84d40061379c5b3")
        })
    })
  });