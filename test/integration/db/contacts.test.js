const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const db = require('../../helpers/db');
const contacts = require('../../../src/models/contacts');


context('Contacts Database Functions', function () {

  beforeEach(() => {
    return db.truncateContacts()
    .then(() => console.log('Testing Contacts table has been truncated'));
  });

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
          expect(allContacts).to.eql([
            { id: 1, first_name: 'Jared', last_name: 'Grippe' },
            { id: 2, first_name: 'Tanner', last_name: 'Welsh' },
            { id: 3, first_name: 'NeEddra', last_name: 'James' },
          ]);
        });
      });
    });
  });

  describe('findById', function () {

    it('Should return undefined if there is no contact with that id', function () {
      return contacts.findById(1)
      .then(contact => {
        expect(contact).to.be.undefined;
      });
    });

    it('Should return the contact with matching id', function () {
      return db.seedContacts()
      .then(() => {
        return contacts.findById(2)
        .then(contact => {
          expect(contact).to.eql({ first_name: 'Tanner', last_name: 'Welsh', id: 2, });
        });
      });
    });

    it('Should throw an error when not given an integer', function () {
      return expect(contacts.findById('Patrick')).to.eventually.be.rejected;
    });
  });

  describe('destroy', function () {

    it('Should remove a contact with the given id', function () {
      let allContactsLength = 0;
      return db.seedContacts()
      .then(() => {
        return contacts.findAll()
        .then(allContacts => {
          allContactsLength = allContacts.length;
          return contacts.destroy(1)
          .then(() => contacts.findAll())
          .then(allContacts => {
            expect(allContacts.length).to.eql(allContactsLength - 1);
          });
        });
      });
    });
  });

  describe('search', function () {

    it('Should find all contacts matching the search term', function () {
      return db.seedContacts()
      .then(() => {
        return contacts.search('Jared')
        .then(foundContacts => {
          expect(foundContacts).to.eql([{ first_name: 'Jared', last_name: 'Grippe', id: 1, }]);
        });
      });
    });

    it('Should find all contacts matching the search term', function () {
      return db.seedContacts()
      .then(() => {
        return contacts.search('NeEddra')
        .then(foundContacts => {
          expect(foundContacts).to.eql([{ first_name: 'NeEddra', last_name: 'James', id: 3, }]);
        });
      });
    });
  });

  it('Should return an empty array when no matches were found', function () {
    return db.seedContacts()
    .then(() => {
      return contacts.search('There is no way anything will match this')
      .then(foundContacts => {
        expect(foundContacts).to.have.lengthOf(0);
      });
    });
  });
});
