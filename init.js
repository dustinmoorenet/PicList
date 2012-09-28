var nano = require('nano')('http://127.0.0.1:5984/');

nano.db.destroy('photos', function() {

  nano.db.create('photos', function() {
  });
});
