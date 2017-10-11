const expect = require('chai').expect;
const db = require('../../helpers/db');
const contacts = require('../../../src/models/contacts');

beforeEach(() => {
  return db.truncateContacts()
  .then(() => console.log('Testing Contacts table has been truncated'));
});

context('Contacts Database Functions', function () {
  describe('Create', function () {

    it('Should add Patrick Kallas as a contact', function () {
      let contact = {
        first_name: 'Patrick',
        last_name: 'Kallas',
      };
      return contacts.create(contact)
      .then(newContact => {
        expect(newContact[0]).to.eql({ first_name: 'Patrick', last_name: 'Kallas', id: 1, });
      });
    });

    it('Should throw an error when input is not an object', function () {
      return contacts.create('Patrick Kallas')
      .catch(error => {
        expect(error.message).to.eql('null value in column "first_name" violates not-null constraint');
      });
    });
  });
});
