const chai = require('chai');
const expect = chai.expect;
const app = require('../../src/server');
const chaiHttp = require('chai-http');
// const db = require('../helpers/db');
chai.use(chaiHttp);
const request = chai.request;

context('Testing Routes', function () {

  describe('/', function () {

    it('Should render the home page', function () {
      return request(app)
      .get('/')
      .then(response => {
        expect(response).to.have.status(200);
      });
    });
  });

  describe('/contacts', function () {

    it('Should post to contacts and redirect to contacts/:contactid', function () {
      return request(app)
      .post('/contacts')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({ first_name: 'Patrick',
              last_name: 'Kallas', })
      .then(response => {
        expect(response.redirects[0]).to.match(/\/contacts\/4$/);
      });
    });
  });

  describe('/contacts/new', function () {

    it('Should render the contacts/new page', function () {
      return request(app)
      .get('/contacts/new')
      .then(response => {
        expect(response).to.have.status(200);
      });
    });
  });

  describe('contacts/:contactid', function () {

    it('Should render the contacts/:contactid', function () {
      return request(app)
      .get('/contacts/1')
      .then(response => {
        expect(response).to.have.status(200);
      });
    });

    it('Should render a not found page when the contact does not exist', function () {
      return request(app)
      .get('/contacts/7')
      .then(response => {
        expect(response).to.have.status(404);
      })
      .catch(error => {
        expect(error.response).to.have.status(404);
      });
    });

    describe('/contacts/search', function () {

      it('Should render the search page', function () {
        return request(app)
        .get('/contacts/search?q=Jared')
        .then(response => {
          expect(response).to.have.status(200);
        });
      });
    });
  });
});
