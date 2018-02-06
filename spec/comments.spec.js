const app = require('../app');
const {expect} = require ('chai');
const request = require('supertest')(app);

  describe('api/comments/id', () => {
    it('gets all the comments with status 200', () => {
      return request
      .get('/api/comments')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('Array');
        expect(res.body[0].created_by).to.equal('tickle122');
      })
    });
    it('gets comments by id with status 200', () => {
      return request
      .get('/api/comments/5a3d30a7e84d40061379c5db')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('Array');
        expect(res.body[0].created_by).to.equal('happyamy2016');
      })
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
    it('delete the comment and 202 status', () => {
      return request
        .delete('/api/comments/5a3d2c9456ce3f044853cbe5')        
        .expect(202)
        .then(res => {
          expect(res.body).to.equal('Comment deleted');
        });
    });
  });