var config = require('../config'),
    db = require('./db')(config.db),
    photo_db = couchdb.use('photos');

var Photos = function() {
}

Photos.prototype.all = function(callback, descending) {
  var params = {
    descending: !!descending
  };

  photo_db.view('photos', 'date_order', params, function(err, body) {
    if (!err)
      callback(err, body.rows);
    else
      callback(err);
  });
}

module.exports = Photos;
