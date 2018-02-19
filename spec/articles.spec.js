const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
const db  = require('../config.secret').DB.test;

describe('api/articles', function () {
  this.timeout(10000);
  let data;
  before(function () {
    const p = mongoose.connection.readyState === 0 ? mongoose.connect(db) : Promise.resolve();
    return p
      .then(() => {
        return mongoose.connection.dropDatabase();
      })
      .then(saveTestData)
      .then(savedData => {
        data = savedData;
      });
  });
  // before(() => {
  //   return mongoose.connection.dropDatabase()
  //     .then(saveTestData)
  //     .then((savedData) => {
  //       data = savedData;
  //     });
  // });
  after(done => {
    mongoose.connection.close();
    done();
  });
  describe('GET methods', () => {

    describe('/', () => {
      it('responds with an array of all articles and 200 status', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.be.an('array');
            expect(res.body.articles.length).to.equal(2);
          });
      });
    });
    describe('/:articleid/comments', () => {
      it('get comments of a specific article 200 status', () => {
        return request
          .get(`/api/articles/${data.articles[0]._id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.an('array');
            expect(res.body.comments[0].body).to.equal('this is a comment');
          });
      });
    });
  });

  describe('PUT methods', () => {
    describe('/:articleid?vote', () => {
      it('update article\'s vote 202 status', () => {
        return request
          .put(`/api/articles/${data.articles[0]._id}?vote=up`)
          .expect(202)
          .then(res => {
            expect(res.body.votes).to.equal(1);
          });
      });
    });
  });

  describe('POST methods', () => {
    describe('/:articleid/comments', () => {
      it('add comment to a specific article 201 status', () => {
        return request
          .post(`/api/articles/${data.articles[0]._id}/comments`)
          .send({
            text: 'Redu kadezzo siigoter re cokbaru giffe palofja hifji dibwu nopewnuw gukizis wanun ub sepdid guv caju bumiwede. Poledmep we moproke rehi le jagegwo fekot ubi sedvuvuha oztobkoc vehbizpal lusuw kikufze jovku baccad. Ju sile cerad bugamak ji vawsozinu si coel lideucu figjuv tu pubasbip lekaseha ge.',
            belongs_to: {
              _id: `${data.articles[0]._id}`
            }
          })
          .expect(201)
          .then(res => {
            expect(res.body.created_by).to.equal('northcoder');
            expect(res.body.belongs_to).to.equal(`${data.articles[0]._id}`);
          });
      });
    });
  });

  describe('DELETE methods', () => {
    describe('/:articleid', () => {
      it('delete the article and 202 status', () => {
        return request
          .delete(`/api/articles/${data.articles[0]._id}`)
          .expect(202)
          .then(res => {
            expect(res.body).to.equal('Article deleted');
          });
      });
    });
  });

  describe('Error handling', () => {
    describe('/:articleid, GET', () => {
      it('returns a 400 with an error message on an invalid GET request', () => {
        return request
          .get('/api/articles/123')
          .expect(400)
          .then(res => {
            expect(res.text).to.eq; ('{"message":"Invalid id: 123"}');
          });
      });
    });
    describe('/:articleid/comments, GET', () => {
      it('returns a 400 with an error message on an invalid GET request', () => {
        return request
          .get('/api/articles/123/comments')
          .expect(400)
          .then(res => {
            expect(res.text).to.equal('{"message":"Invalid id"}');
          });
      });
    });
    describe('/:articleid/comments, POST', () => {
      it('returns a 400 with an error message on a POST request where the article id is invalid', () => {
        return request
          .post('/api/articles/123/comments')
          .expect(400)
          .then(res => {
            expect(res.text).to.equal('{"message":"Invalid id"}');
          });
      });
      it('returns a 400 with an error message on a POST request where the text is invalid', () => {
        return request
          .post(`/api/articles/${data.articles[0]._id}/comments`)
          .send({
            text: ''
          })
          .expect(400)
          .then(res => {
            expect(res.text).to.equal('{"message":"Please enter a valid comment"}');
          });
      });
    });
    describe('/:articleid/, PUT', () => {
      it('returns a 400 with an error message on a PUT request where the article id is invalid', () => {
        return request
          .put('/api/articles/123?vote=up')
          .expect(400)
          .then(res => {
            expect(res.text).to.equal('{"message":"Invalid id"}');
          });
      });
      it('returns a 400 with an error message on a PUT request where the vote query is invalid', () => {
        return request
          .put(`/api/articles/${data.articles[0]._id}?vote=brown`)
          .expect(400)
          .then(res => {
            expect(res.text).to.equal('{"message":"Vote must be up or down"}');
          });
      });
    });
    describe('/:articleid/, DELETE', () => {
      it('returns a 400 with an error message on a DELETE request where the article id is invalid', () => {
        return request
          .delete('/api/articles/123')
          .expect(400)
          .then(res => {
            expect(res.text).to.equal('{"message":"Invalid id"}');
          });
      });
    });
  });
});