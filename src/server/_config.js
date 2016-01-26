var config = {};

config.mongoURI = {
  development: 'mongodb://localhost/augur',
  test: 'mongodb://localhost/augur-test',
  production: process.env.MONGOLAB_URI
};

module.exports = config;
