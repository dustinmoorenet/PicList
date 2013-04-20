var config = require('../config'),
    db = require('./db')(config.db),
    photo_db = couchdb.use('photos');

var Photos = function() {
}

Photos.prototype.all = function(callback, options) {
  var view = 'date_order',
      params = {
        descending: !!options.descending
      };

  if (options.tags && options.tags.length) {
    view = 'tags';
    params.keys = options.tags;
    params.reduce = false;
  }

  photo_db.view('photos', view, params, function(err, body) {
    if (!err)
      callback(err, body.rows);
    else
      callback(err);
  });
}

module.exports = Photos;
