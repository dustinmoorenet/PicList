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
    expect(user.props).to.eql({_id: '1234', email: 'frank@tank.com'});
  });

  describe('save', function() {
    it('should save user info', function(done) { 
      User.create({
        _id: 'test_save',
        email: 'frank@tank.com',
        password: '1234'
      }, function(err, user) {
        expect(err).to.be(null);

        expect(user).to.be.a(User);

        user.props.first_name = 'Frank';

        user.save(function(err) {
          expect(err).to.be(null);

          done();
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

  describe('get', function() {
    it('should get a created user', function(done) {
      User.create({
        _id: 'test_get',
        email: 'frank@tank.com',
        password: '1234'
      }, function(err, user) {
        expect(err).to.be(null);

        expect(user).to.be.a(User);

        User.get(user.id, function(err, user_again) {
          expect(err).to.be(null);

          expect(user_again).to.be.a(User);

          expect(user_again.id).to.eql(user.id);
 
          done();
        });
      });
    });
  });

  describe('create', function() {
    it('should create a user', function(done) {
      User.create({
        _id: 'test_create',
        email: 'frank@tank.com',
        password: '1234'
      }, function(err, user) {
        expect(err).to.be(null);

        expect(user).to.be.a(User);

        done();
      });
    });
  });

  describe('validatePassword', function() {
    beforeEach(function(done) {
      User.create({
        _id: 'test_create',
        email: 'frank@tank.com',
        password: '1234'
      }, (function(err, user) {
        this.user = user

        done();
      }).bind(this));

    });

    it('should get user for a valid email/password combo', function(done) {
      User.validatePassword(this.user.props.email, '1234', (function(err, user) {
        expect(err).to.be(null);

        expect(user).to.be.a(User);

        expect(user.toJSON()).to.eql(this.user.toJSON());

        done();
      }).bind(this));
    });

    it('should not get user for an invalid email', function(done) {
      User.validatePassword('not@frank.com', '1234', (function(err, user) {
        expect(err).to.be.an(Object);

        expect(user).to.be(null);

        done();
      }).bind(this));
    });

    it('should not get user for an invalid password', function(done) {
      User.validatePassword(this.user.props.email, '12345', (function(err, user) {
        expect(err).to.be.an(Object);

        expect(user).to.be(null);

        done();
      }).bind(this));
    });
  });

  describe('hashPassword', function() {
    it('should create a hash different than the password', function() {
      var password = '1234567890',
          hash = User.hashPassword('one@email.com', password);

      expect(hash).to.not.equal(password);
      expect(hash.length).to.be(128);
    });

    it('should create the same hash every time', function() {
      var hash_1 = User.hashPassword('one@email.com', '1234567890'),
          hash_2 = User.hashPassword('one@email.com', '1234567890');

      expect(hash_1).to.equal(hash_2);
    });

    it('should create different hashes for different app keys', function() {
      var hash_1 = User.hashPassword('one@email.com', '1234567890');

      var app_key = global.app.key;

      global.app.key = 'something different';

      var hash_2 = User.hashPassword('one@email.com', '1234567890');

      expect(hash_1).to.not.equal(hash_2);

      global.app.key = app_key;
    });
  });
});
