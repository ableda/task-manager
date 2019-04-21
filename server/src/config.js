// config.js
const env = process.env.NODE_ENV || 'dev'; // 'dev' or 'test'

const dev = {
 app: {
   port: parseInt(process.env.SERVER_PORT) || 8081
 },
 db: {
   host: process.env.DB_HOST || 'localhost',
   port: parseInt(process.env.DEV_DB_PORT) || 27017,
   name: process.env.DEV_DB_NAME || 'database'
 }
};
const test = {
 app: {
   port: parseInt(process.env.TEST_SERVER_PORT) || 8081
 },
 db: {
   host: process.env.TEST_DB_HOST || 'localhost',
   port: parseInt(process.env.TEST_DB_PORT) || 27017,
   name: process.env.TEST_DB_NAME || 'database-test'
 }
};

const config = {
 dev,
 test
};

module.exports = config[env];
