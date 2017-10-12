const chai = require('chai');
const expect = chai.expect;
const app = require('../../src/server');
const chaiHttp = require('chai-http');
const db = require('../helpers/db');
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
        expect(response.redirects[0]).to.match(/\/contacts\/1$/);
      });
    });
  });

  describe()
});
