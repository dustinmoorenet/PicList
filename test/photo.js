var Photo = require('../lib/photo');
var fs = require('fs');


exports.testAdd = function(test) {
  fs.createReadStream('fixtures/Test.jpg').pipe(fs.createWriteStream('fixtures/Copy_Test.jpg'));

  // Create photo
  var photo = new Photo({
    name: 'Test.jpg',
    path: 'fixtures/Copy_Test.jpg',
    size: 12702
  }, function(data) {
    data = data || {};
    test.ifError(data.error);

    test.done();
  });

  test.expect(1);
}

exports.testRead = function(test) {
  test.expect(1);
  test.ok(true, 'This is true');
  test.done();
}

exports.testDelete = function(test) {
  test.expect(1);
  test.ok(true, 'This is true again');
  test.done();
}
