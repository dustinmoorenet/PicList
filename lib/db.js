var nano = require('nano');

module.exports = function(config) {
console.log(config);
  return couchdb = nano(config);
};
