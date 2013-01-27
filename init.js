var nano = require('nano')('http://127.0.0.1:5984/'),
    reset = false,
    update = false;

function connect() {
  nano.request({db: "_uuids"}, function(err, uuids) {
    if (err) {
      setTimeout(connect, 500);
    } else {
      doIt();
    }
  });
}

function doIt() {
  if (process.argv.length > 2) {
    reset = (process.argv[2] == 'reset');
    update = (process.argv[2] == 'update');
  }
  
  nano.db.get('photos', function(err, body) {
    if (!err) {

      if (reset) {
        console.log('resetting');
  
        nano.db.destroy('photos', createDatabase);

      } else if (update) {
        console.log('updating');
  
        buildDesigns();

      } else {
        console.log('nothing to do');
      }
    } else {
      console.log('no database so creating one');
      createDatabase();
    }
  });
}

function createDatabase() {
  nano.db.create('photos', buildDesigns);
}

function buildDesigns() {
  var photos = nano.db.use('photos'),
      design = require('./db/designs/photos.json'),
      design_id = '_design/photos';

  photos.get(design_id, function(err, body) {
    if (!err)
      design._rev = body._rev;
    
    photos.insert(design, design_id, function(err, body) {
      if (err)
        console.log(err);
    });
  });
}

connect();
