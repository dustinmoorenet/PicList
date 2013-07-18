var mongojs = require('mongojs'),
    db = mongojs('piclist', ['app']),
    expect = require('expect.js'),
    sinon = require('sinon'),
    app = require('../lib/app');

describe('App', function() {

  beforeEach(function() {
    app.id = 'test';
  });

  afterEach(function(done) {
    delete app.key;

    db.app.remove({_id: app.id}, done);
  });

  describe('load', function() {
    it('should create an app key if none exist', function(done) {
      expect(app.key).to.be(undefined);

      app.load(function() {
        expect(app.key).to.be.a('string');
        expect(app.key.length).to.be(96);

        done();
      });
    });

    it('should not create an app key if one exist', function(done) {
      app.createKey(function() {
        expect(app.key).to.be.a('string');
        expect(app.key.length).to.be(96);

        var temp_key = app.key;

        app.load(function() {
          expect(app.key).to.equal(temp_key);

          done();
        });
      });
    });
  });

  describe('createKey', function() {
    it('should create an app key', function(done) {
      expect(app.key).to.be(undefined);

      app.createKey(function() {
        expect(app.key).to.be.a('string');
        expect(app.key.length).to.be(96);

        done();
      });
    });
  });
});
