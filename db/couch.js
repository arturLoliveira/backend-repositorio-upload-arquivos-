require('dotenv').config(); 

const nano = require('nano')(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@${process.env.COUCHDB_HOST}:${process.env.COUCHDB_PORT}`);
const coursesDB = nano.db.use('courses');

module.exports = coursesDB;
