var mongojs = require('mongojs'),
    db = mongojs('piclist', ['user']),
    User = require('../lib/user'),
    expect = require('expect.js');

global.app = {key: 'test_app'};

describe('User', function() {
  beforeEach(function() {
  });

  afterEach(function(done) {
    db.user.remove({_id: /^test_/}, function() {
      done();
    });
  });

  it('should be of type User', function() {
    var user = new User({});

    expect(user).to.be.a(User);
  });

  it('should store properties', function() {
    var user = new User({
      _id: '1234',
      email: 'frank@tank.com'
    });

    expect(user.id).to.be('1234');
    expect(user.properties).to.eql({_id: '1234', email: 'frank@tank.com'});
  });

  describe('save', function() {
    it('should save user info', function(done) { 
      User.create({
        _id: 'test_save',
        email: 'frank@tank.com',
        password: '1234'
      }, function(err, user) {
        expect(err).to.be(undefined);

        expect(user).to.be.a(User);

        user.properties.first_name = 'Frank';

        user.save(function(err) {
          expect(err).to.be(undefined);
        });
      });
    });
  });

  describe('toJSON', function() {
    it('should clone the properties', function() {
      var user = new User({
        _id: '1234',
        email: 'frank@tank.com',
        friends: [
          'john@smith.com',
          'jack@smith.com',
        ]
      });

      var clone = {
        id: '1234',
        email: 'frank@tank.com',
        friends: [
          'john@smith.com',
          'jack@smith.com',
        ]
      };

      expect(user.toJSON()).to.eql(clone);

      expect(JSON.parse(JSON.stringify(user))).to.eql(JSON.parse(JSON.stringify(clone)));
    });
  });

  describe('toString', function() {
    it('should describe the object', function() {
      var user = new User({
        _id: '1234',
        email: 'frank@tank.com'
      });

      expect(user.toString()).to.be('[User] frank@tank.com : 1234');

      expect('' + user).to.be('[User] frank@tank.com : 1234');
    });
  });
});
