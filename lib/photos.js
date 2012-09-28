var couchdb = require('nano')('http://127.0.0.1:5984/'),
    photo_db = couchdb.use('photos');

var Photos = function() {
}

Photos.prototype.all = function(callback) {
  photo_db.list(function(err, body) {
    if (!err)
      callback(err, body.rows);
    else
      callback(err);
  });
}

exports.Photos = Photos;
