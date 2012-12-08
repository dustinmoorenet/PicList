var Photo = require('../lib/photo');
var fs = require('fs');

var the_id,
    the_photo;

exports.testAdd = function(test) {
  fs.createReadStream('fixtures/Test.jpg').pipe(fs.createWriteStream('fixtures/Copy_Test.jpg'));

  // Create photo
  var photo = new Photo({
    name: 'Test.jpg',
    path: 'fixtures/Copy_Test.jpg',
    size: 12702
  }, function(data) {
    data = data || {};
    test.ifError(data.error, 'The photo should have created successfully');

    the_id = photo.id;

    test.done();
  });

  test.expect(1);
}

exports.testRead = function(test) {

  // Get photo
  var photo = new Photo(the_id, function(err) {
    test.ifError(err, 'The photo should have been found successfully');

    test.done();
  });

  the_photo = photo;

  test.expect(1);
}

exports.testDelete = function(test) {
  the_photo.delete(function(err) {
    test.ifError(err, 'The photo should have deleted successfully');

    test.done();
  });
  test.expect(1);
}

exports.testReadAgain = function(test) {
  // Get photo
  var photo = new Photo(the_id, function(err) {
    test.ok(err, 'The photo should not exist');

    test.done();
  });

  test.expect(1);
}
