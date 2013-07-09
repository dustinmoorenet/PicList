var mongojs = require('mongojs'),
    db = mongojs('piclist', ['session', 'user']),
    Session = require('../lib/session'),
    User = require('../lib/user'),
    expect = require('expect.js'),
    sinon = require('sinon');

describe('Session', function() {
  beforeEach(function(done) {
    this.req = {};
    this.res = {
      clearCookie: sinon.spy(),
      cookie: sinon.spy()
    };

    User.create({
      _id: 'test_session',
      email: 'frank@tank.com',
      password: '1234'
    }, (function(err, user) {
      this.user = user;

      done();
    }).bind(this));
  });

  afterEach(function(done) {
    db.user.remove({_id: /^test_/}, function() {
      done();
    });
  });

  it('should be of a function', function() {
    expect(Session).to.be.a(Function);
  });

  describe('validate', function() {
    beforeEach(function(done) {
      Session.create(
        this.user,
        this.res,
        (function(err, session) {
          this.req.cookies = {user_session: session._id};

          done(); 
        }).bind(this)
      );
    });

    it('should find a valid session', function(done) {

      Session.validate(this.req, this.res, (function() {
        expect(this.req.session).to.be.an(Object);

        expect(this.res.clearCookie.called).to.be(false);

        done();
      }).bind(this));
    });

    it('should find an invalid session', function(done) {
      this.req.cookies.user_session = 'not going to find me';

      Session.validate(this.req, this.res, (function() {
        expect(this.req.session).to.be(undefined);

        expect(this.res.clearCookie.called).to.be(true);

        done();
      }).bind(this));
    });
  });

  describe('signIn', function() {
    beforeEach(function() {
      sinon.spy(Session, 'signOut');
    });

    afterEach(function() {
      Session.signOut.restore();
    });

    it('should create a session with a valid email and password', function(done) {
      Session.signIn(this.user.props.email, '1234', this.req, this.res, (function(err, user) {
        expect(err).to.be(null);

        expect(Session.signOut.called).to.be(true);

        expect(user.toJSON()).to.eql(this.user.toJSON());

        done();
      }).bind(this));
    });

    it('should not create a session because email not real', function(done) {
      Session.signIn('not@franks.email', '1234', this.req, this.res, (function(err, user) {
        expect(err).to.be.an(Object);

        expect(Session.signOut.called).to.be(true);

        expect(user).to.be(undefined);

        done();
      }).bind(this));
    });

    it('should not create a session because password not correct', function(done) {
      Session.signIn(this.user.props.email, '12345', this.req, this.res, (function(err, user) {
        expect(err).to.be.an(Object);

        expect(Session.signOut.called).to.be(true);

        expect(user).to.be(undefined);

        done();
      }).bind(this));
    });
  });

  describe('create', function() {
    it('should create a session', function(done) {
      Session.create(this.user, this.res, (function(err, session) {
        expect(err).to.be(null);

        expect(this.res.cookie.calledWith('user_session', session._id));

        done();
      }).bind(this));
    });
  });

  describe('signOut', function() {
    beforeEach(function() {
      sinon.spy(Session, 'delete');
    });

    afterEach(function() {
      Session.delete.restore();
    });

    it('should delete the session', function() {
      Session.
// How do we clean up the created sessions? Search for the user property in the session store?
    });
  });

  describe('delete', function() {

  });
});
