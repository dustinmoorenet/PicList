var nano = require('nano')('http://127.0.0.1:5984/');

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
  if (process.argv.length > 2)
    var reset = (process.argv[2] == 'reset');
  
  nano.db.get('photos', function(err, body) {
    if (!err && reset) {
      console.log('resetting');
  
      nano.db.destroy('photos', function() {
        nano.db.create('photos');
      });
    } else if (err) {
      console.log('no database so creating one');
      nano.db.create('photos');
    } else {
      console.log('nothing to do');
    }
  });
}

connect();
