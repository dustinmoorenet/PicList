var Photo = require('../lib/photo'),
    expect = require('expect.js'),
    fs = require('fs');

describe('Photo', function() {

  describe('create', function() {
    it('should store a photo', function(done) {
      fs.createReadStream('test/fixtures/Test.jpg').pipe(fs.createWriteStream('test/fixtures/Copy_Test.jpg'));

      var test = this;

      // Create photo
      var photo = new Photo({
        name: 'Test.jpg',
        path: 'fixtures/Copy_Test.jpg',
        size: 12702
      }, function(data) {
        data = data || {};
        expect(data.error).to.be(undefined);

        done();
      });
    });
  });

//  describe('get', function() {
//    it('should get the stored photo', function(done) {  
//
//      // FIXME we need an id to look up
//
//      // Get photo
//      var photo = new Photo(this.id, function(err) {
//        expect(err).to.be(undefined);
//    
//        done();
//      });
//    
//      the_photo = photo;
//    });
//  });
//
//exports.testDelete = function(test) {
//  the_photo.delete(function(err) {
//    test.ifError(err, 'The photo should have deleted successfully');
//
//    test.done();
//  });
//  test.expect(1);
//}
//
//exports.testReadAgain = function(test) {
//  // Get photo
//  var photo = new Photo(the_id, function(err) {
//    test.ok(err, 'The photo should not exist');
//
//    test.done();
//  });
//
//  test.expect(1);
//}
});
