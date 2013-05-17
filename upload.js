var curl = require('node-curl'),
    fs = require('fs'),
    path = require('path');


var file_paths = process.argv.slice(2);

if (file_paths.length == 0) {
  usage();
  return;
}

var files = [];

file_paths.forEach(function(file_path) {
  var stat = fs.statSync(file_path)

  if (stat.isFile()) {
    var filename = path.basename(file_path);

    files.push(readFile(filename, file_path));

  } else if (stat.isDirectory()) {
    files.concat(readFiles(file_path));
  }
});

upload(files);

function usage() {
  console.log('Please give a valid file or directory');
}

function readFiles(directory) {
  var files = fs.readdirSync(directory);

  var file_list = [];

  files.forEach(function(file) {
    file_list.push(readFile(file, path.join(directory, file)));
  });

  return file_list;
}

function readFile(filename, file_path) {
  var ext = path.extname(filename);

  if (ext.match(/jpeg|jpg/))
    var type = 'image/jpeg';
  else if (ext.match(/png/))
    var type = 'image/png';
  else
    return;

  return { name: filename, file: file_path, type: type };
}

function upload(file_list) {
  if (file_list.length == 0) {
    curl.close();
    return;
  }

  var file = file_list.shift();

  process.stdout.write((file_list.length + 1) + '. ' + file.name);

  curl('127.0.0.1:3000/photo', {
    MULTIPART: [ file ]
  }, function(err) {
    if (err) {
      process.stdout.write(err, '\n');
      return;
    }
      
    process.stdout.write(' [DONE]\n');

    setTimeout(upload.bind(null, file_list));
  });
}
