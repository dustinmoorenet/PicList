/**
* Module dependencies.
*/
 
var express = require('express'),
    stylus = require('stylus'),
    fs = require('fs'),
    Photo = require('./lib/photo'),
    Photos = require('./lib/photos');
 
var app = express();
 
// This must be BEFORE other app.use
app.use(stylus.middleware({
    debug: true
  , src: __dirname + '/views'
  , dest: __dirname + '/public'
  , compile: compileMethod
}));
 
function compileMethod(str) {
  return stylus(str)
    .set('compress', true);
};
 
app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.get('/photos', function(req, res) {
  new Photos().all(function(err, photos) {
    if (!err)
      res.json(photos);
    else
      res.json([]);
  });
});

app.get('/photo', function(req, res) {
  res.json(['hey']);
});

app.get('/photo/original/:id?', function(req, res) {
  var photo = new Photo(req.params.id, function(err) {
    photo.getImage('original', function(err, image) {
      if (!err) {
        res.status(200);
        res.set('Content-Type', image.type);
        res.send(image.data);
      } else {
        res.status(500);
        res.send('');
      }
    });
  });
});

app.get('/photo/thumb/:id?', function(req, res) {
  var photo = new Photo(req.params.id, function(err) {
    photo.getImage('thumb', function(err, image) {
      if (!err) {
        res.status(200);
        res.set('Content-Type', image.type);
        res.send(image.data);
      } else {
        res.status(500);
        res.send('');
      }
    });
  });
});

app.post('/photo', function(req, res) {
  var finished_count = 0,
      file_names = Object.keys(req.files);

  file_names.forEach(function(file_name) {
    var photo = new Photo();
    photo.create(req.files[file_name], function(err) {
      finished_count++;
      if (finished_count == file_names.length)
        res.send('');
    });
  });
});

app.delete('/photo/:id?', function(req, res) {
  var photo = new Photo(req.params.id, function(err) {
    photo.delete(function(err) {
      if (err) {
        res.status(500);
      } else {
        res.status(204);
      }

      res.send('');
    });
  });
});

app.post('/tag/add', function(req, res) {
  var items = req.param('items') || [],
      tags = req.param('tags') || [],
      finished_count = 0,
      photos = [];

  items.forEach(function(item) {
    var photo = new Photo(item, function(err) {
      photos.push(photo.document);

      photo.addTags(tags, function(err) {
        finished_count++;
        if (finished_count == items.length)
          res.json(photos);
      });
    });
  });
});
 
app.listen(3000);
console.log('server listening on port 3000');
