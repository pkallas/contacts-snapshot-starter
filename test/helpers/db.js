const pgp = require('pg-promise')();
const connectionString = 'postgres://localhost:5432/contacts_test';
const db = pgp(connectionString);

module.exports = db;
