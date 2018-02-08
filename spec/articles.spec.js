const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');



describe('api/articles', function () {
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
      it('responds with an array of all articles and 200 status', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.be.an('array');
            expect(res.body.articles.length).to.equal(2);
          })
      });
    })
    describe('/:articleid/comments', () => {
      it('get comments of a specific article 200 status', () => {
        return request
          .get(`/api/articles/${data.articles[0]._id}/comments`)
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.an('array')
            expect(res.body.comments[0].belongs_to).to.equal("5a7c4c09e2b3620db62329a1")
          })
      });
    });
  })

  describe('PUT methods', () => {
    describe('/:articleid?vote', () => {
      it(`update article's vote  201 status`, () => {
        return request
          .put(`/api/articles/${data.articles[0]._id}`)
          .send({ vote: 'up' })
          .expect(201)
          .then(res => {
            expect(res.body.votes).to.equal(0)
            return request
              .get(`/api/articles/${data.articles[0]._id}`)
              .then(res => {
                expect(res.body.articles[0].votes).to.equal(1)
              })
          })
      })
    });
  });

    describe('POST methods', () => {
      describe('/:articleid/comments', () => {
        it('add comment to a specific article 201 status', () => {
          return request
            .post(`/api/articles/${data.articles[0]._id}/comments`)
            .send({
              text: "Redu kadezzo siigoter re cokbaru giffe palofja hifji dibwu nopewnuw gukizis wanun ub sepdid guv caju bumiwede. Poledmep we moproke rehi le jagegwo fekot ubi sedvuvuha oztobkoc vehbizpal lusuw kikufze jovku baccad. Ju sile cerad bugamak ji vawsozinu si coel lideucu figjuv tu pubasbip lekaseha ge.",
              belongs_to: {
                _id: `${data.articles[0]._id}`
              }
            })
            .expect(201)
            .then(res => {
              expect(res.body.created_by).to.equal('northcoder')
              expect(res.body.belongs_to).to.equal(`${data.articles[0]._id}`)
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
        it('returns a 404 with an error message on an invalid GET request', () => {
          return request
            .get('/api/articles/123')
            .expect(404)
            .then(res => {
              expect(res.text).to.equal('invalid id!')
            });
        });
      });
      describe('/:articleid/comments, GET', () => {
        it('returns a 404 with an error message on an invalid GET request', () => {
          return request
            .get('/api/articles/123/comments')
            .expect(404)
            .then(res => {
              expect(res.text).to.equal('invalid id!')
            });
        });
      });
      describe('/:articleid/comments, POST', () => {
        it('returns a 404 with an error message on an invalid POST request', () => {
          return request
            .post('/api/articles/123/comments')
            .expect(404)
            .then(res => {
              expect(res.text).to.equal('invalid id!')
            });
        });
      });
      describe('/:articleid/, PUT', () => {
        it('returns a 404 with an error message on an invalid PUT request', () => {
          return request
            .put('/api/articles/123?vote=up')
            .expect(404)
            .then(res => {
              expect(res.text).to.equal('invalid id or query!')
            });
        });
      });
      describe('/:articleid/, DELETE', () => {
        it('returns a 404 with an error message on an invalid DELETE request', () => {
          return request
            .delete('/api/articles/123')
            .expect(404)
            .then(res => {
              expect(res.text).to.equal('invalid id!')
            });
        });
      });
    });
  });