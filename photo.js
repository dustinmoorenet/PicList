var couchdb = require('nano')('http://127.0.0.1:5984/'),
    fs = require('fs'),
    im = require('imagemagick');

var photo_db = couchdb.use('photos');

var Photo = function(id, callback) {
  var photo = this;
  if (id) {
    photo.id = id;
    photo_db.get(id, function(err, body) {
console.log('this is what I got for photo: ', body);
      callback(err, photo);
    });
  }
};

Photo.prototype.create = function(file) {

  var obj = {
    original_filename: file.name,
    width: 0,
    height: 0,
  };

  couchdb.request({db: '_uuids'}, function(_, uuids){
    photo_db.insert(obj, uuids[0], function(err, body) {
      if (!err) {
        console.log('we stored this: ', body);

        fs.readFile(file.path, function(err, data) {
          if (!err) {
            photo_db.attachment.insert(
              body.id,
              'original',
              data,
              file.type,
              { rev: body.rev },
              function(err, body) {
                if (!err) {
                  console.log('no error: ', body);

                  im.resize({
                    srcData: data,
                    dstPath: file.path + '-small.jpg',
                    width: 256
                  }, function(err, stdout, stderr){
                    if (err) throw err;
                    console.log('resized to fit within 256x256px');

                    fs.readFile(file.path + '-small.jpg', function(err, data) {
                      if (!err) {
                        photo_db.attachment.insert(
                          body.id,
                          'thumb',
                          data,
                          file.type,
                          { rev: body.rev },
                          function(err, body) {
                            if (!err)
                              console.log('no error: ', body);
                            else
                              console.log('there is an error: ', err);
                          }
                        );
                      }
                    });
                  });
                } else
                  console.log('there is an error: ', err);
              }
            );

            fs.unlink(file.path);
          }
        });
      }
    });
  });
}

Photo.prototype.getImage = function(version, callback) {
  var photo = this;
  photo_db.attachment.get(this.id, version, function(err, body) {
console.log('this is what I got from attachment: ', body);
    photo.data = body;
    callback(err, photo);
  });
}

exports.Photo = Photo;
