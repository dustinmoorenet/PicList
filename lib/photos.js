var config = require('../config'),
    db = require('./db')(config.db),
    photo_db = couchdb.use('photos'),
    Photo = require('./photo');

var Photos = function() {
  this.photos = [];
}

Photos.prototype.find = function(callback, options) {
  var view = 'date_order',
      params = {
        descending: !!options.descending
      };

  if (options.tags && options.tags.length) {
    view = 'tags';
    params.keys = options.tags;
    params.reduce = false;
  }

  photo_db.view('photos', view, params, (function(err, body) {
    if (!err)
      this.parse(body.rows);
    else
      callback(err);

    callback(err, this);
  }).bind(this));
}

Photos.prototype.parse = function(raw_data) {
  this.photos = [];

  raw_data.forEach((function(data) {
    if (data.value)
      this.photos.push(new Photo(data.value));
  }).bind(this));
};

Photos.prototype.toJSON = function() {
  var array = [];

  this.photos.forEach(function(photo) {
    array.push(photo.toJSON());
  });

  return array;
};

module.exports = Photos;
