var curl = require('node-curl'),
    fs = require('fs');


var file_or_directory = process.argv[2];

fs.stat(file_or_directory, function(stat) {
  if (file)
    uploadFile();
  else
    readFiles();
});

function readfiles(path) {


}

function uploadFile(filename, path) {

  curl('127.0.0.1:3000/photo', {
    MULTIPART: [
      {name: filename, file: path, type: 'image/jpeg'},
    ]
  }, function(e) {
    console.log(e);
    console.log(this.body);
    this.close()
  });
});
