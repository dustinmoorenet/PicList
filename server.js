/**
* Module dependencies.
*/
 
var express = require('express'),
    formidable = require('formidable'),
    stylus = require('stylus'),
    fs = require('fs'),
    Photo = require('./lib/photo').Photo;
 
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

  var form = formidable.IncomingForm(),
      util = require('util'),
      fields = [],
      files = [],
      i = 0;

  form.on('file', function(field, file) {
    console.log(field, file)
    files.push([field, file])
    var photo = new Photo();
    photo.create(file);
  })
  .on('end', function() {
    console.log('at the end');
    console.log(util.inspect(files))
    res.redirect('back');
  })
     
  form.parse(req)

});
 
app.listen(3000);
console.log('server listening on port 3000');
