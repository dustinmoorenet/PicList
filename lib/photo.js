var couchdb = require('nano')('http://127.0.0.1:5984/'),
    fs = require('fs'),
    im = require('imagemagick');

var photo_db = couchdb.use('photos');

var Photo = function(id_or_file, callback) {
  if (typeof(id_or_file) == 'string') {
    this.get(id_or_file, callback);

  } else if (typeof(id_or_file) == 'object') {
    this.create(id_or_file, callback);
  }
};

Photo.prototype.get = function(id, callback) {
  var photo = this;
  this.id = id;
  photo_db.get(id, function(err, body) {
    if (!err) {
      photo.rev = body.rev;
      photo.document = body;
    }

    callback(err);
  });
}

Photo.prototype.create = function(file, callback) {
  var photo = this,
      callback = callback || function() {};

  this.document = {
    original_filename: file.name,
    width: 0,
    height: 0,
  };

  this.getUuid(function(err) {
    if (!err) {
      photo.saveDocument(function(err) {
        if (!err)
          photo.processUpload(file, callback);
        else {
          fs.unlink(file.path);
          callback(err);
        }
      });
    } else {
      fs.unlink(file.path);
      callback(err);
    }
  });
}

Photo.prototype.getUuid = function(callback) {
  var photo = this;

  couchdb.request({db: '_uuids'}, function(err, body) {
    if (!err)
      photo.id = body.uuids[0];

    callback(err);
  })
}

Photo.prototype.saveDocument = function(callback) { 
  var photo = this;

  photo_db.insert(this.document, this.id, function(err, body) {
    if (!err)
      photo.rev = body.rev;

    callback(err);
  });
}

Photo.prototype.processUpload = function(file, callback) {
  var photo = this;

  fs.readFile(file.path, function(err, data) {
    if (!err)
      photo.storeOriginalImage(file, data, callback);
    else {
      fs.unlink(file.path);
      callback(err);
    }
  });
}

Photo.prototype.storeOriginalImage = function(file, data, callback) {
  var photo = this;

  this.storeImage('original', data, file.type, function(err) {
    if (!err)
      photo.storeThumbnail(file, data, callback);
    else {
      fs.unlink(file.path);
      callback(err);
    }
  });
}

Photo.prototype.storeThumbnail = function(file, data, callback) {
  var photo = this;

  im.resize({
    srcData: data,
    dstPath: file.path + '-small.jpg',
    width: 256
  }, function(err, stdout, stderr){

    if (!err) {
      fs.readFile(file.path + '-small.jpg', function(err, data) {
        if (!err) {
          photo.storeImage('thumb', data, 'image/jpeg');
        }
        callback(err);
      });
    } else {
      callback(err);
    }
  });
}

Photo.prototype.storeImage = function(name, data, type, callback) {
  var photo = this;
      callback = callback || function() {};

  photo_db.attachment.insert(
    this.id,
    name,
    data,
    type,
    { rev: this.rev },
    function(err, body) {
      if (!err) {
        console.log('no error: ', body);
        photo.rev = body.rev;
      } else {
        console.log('there is an error: ', err);
      }
      callback(err, body);
    }
  );
}

Photo.prototype.getImage = function(version, callback) {
  var image = this.document._attachments[version];

  if (!image) {
    callback({ error: 'no ' + version + ' image stored' });
    return;
  }

  photo_db.attachment.get(this.id, version, function(err, body) {
    if (!err && !body)
      err = { error: 'no image found' };

    image.data = body;

    callback(err, image);
  });
}

exports.Photo = Photo;
