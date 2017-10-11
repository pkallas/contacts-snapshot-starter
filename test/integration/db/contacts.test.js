const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
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
      return expect(contacts.create('Patrick Kallas')).to.eventually.be.rejected;
    });
  });

  describe('findAll', function () {

    it('Should return an empty array when the database has no contacts', function () {
      return contacts.findAll()
      .then(allContacts => {
        expect(allContacts).to.eql([]);
      });
    });

    it('Should return all contacts from the database', function () {
      return db.seedContacts()
      .then(() => {
        return contacts.findAll()
        .then(allContacts => {
          expect(allContacts).eql([
            { id: 1, first_name: 'Jared', last_name: 'Grippe' },
            { id: 2, first_name: 'Tanner', last_name: 'Welsh' },
            { id: 3, first_name: 'NeEddra', last_name: 'James' },
          ]);
        });
      });
    });
  });
});
