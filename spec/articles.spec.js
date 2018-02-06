const app = require('../app');
const {expect} = require ('chai');
const request = require('supertest')(app);

  describe.only('api/articles', () => {
    it('Responds with an array of all articles and 200 status', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('Array')
          expect(res.body[0].belongs_to).to.equal('football')
        })
    })
    it('Responds with an array of specific article and 200 status', () => {
      return request
        .get('/api/articles/5a3d30a7e84d40061379c5b4')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('Array')
          expect(res.body[0].belongs_to).to.equal('football')
        })
    })
    it('get comments of a specific article 200 status', () => {
      return request
        .get('/api/articles/5a3d30a7e84d40061379c5b4/comments')
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('Array')
          expect(res.body[0].belongs_to._id).to.equal("5a3d30a7e84d40061379c5b4")
        })
    })
    it(`update article's vote  200 status`, () => {
      let votes;
      request
      .get('/api/articles/5a3d30a7e84d40061379c5b4')
      .then(res => {
        votes = res.votes;
      })
      return request
        .put('/api/articles/5a3d30a7e84d40061379c5b4?vote=up') 
        .send({votes:5})
        .expect(202)
        .then(res => {
          expect(res.body.votes).to.not.equal(votes);
        })
    })
  });