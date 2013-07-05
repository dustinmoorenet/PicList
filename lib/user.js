var mongojs = require('mongojs'),
    db = mongojs('piclist', ['user']),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    session = require('./session');

var User = function(data) {
  this.id = data._id;

  this.properties = data;
}

User.prototype.save = function(callback) {
  db.user.update(this.properties, function(err) {
    if (err)
      var error = {error: 'User failed to save'};

    callback(err);
  });
};

User.prototype.toJSON = function() {
  var obj = JSON.parse(JSON.stringify(this.properties));

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

User.prototype.toString = function() {
  return '[User] ' + this.properties.email + ' : ' + this.id;
};

User.get = function(id, callback) {
  db.user.findOne({_id: id}, function(err, user) {
    if (!err && user)
      user = new User(user);
 
    callback(err, user);
  });
}

User.create = function(user, callback) {
  user._id = user._id || uuid.v4();
  user.password = User.hashPassword(user.email, user.password);

  db.user.insert(user, function(err) {
    if (err)
      err = {error: 'User could not be created'};

    callback(err, new User(user));
  });
}

/**
 * Takes an email and password get a user if combo is found
 *
 * Object factory
 *
 * @param [string] email Email address of user
 * @param [string] password Possible plain text password of user
 * @param [function] callback The outcome of the validation
 *   @param [object] err If the credentials are not valid, this will have an 
 *                       error message
 *   @param [User] user The validated user if credentials are good
 */
User.validatePassword = function(email, password, callback) {
  var hash_password = User.hashPassword(email, password);

  db.user.findOne({email: email, password: hashed_password}, function(err, user) {
    if (err || !user) 
      var error = {error: 'Invalid email or password'};
    else
      user = new User(user);
 
    callback(error, user);
  });
};

User.hashPassword = function(email, password) {
  var plain_text = email + global.app.key + password;

  return crypto.pbkdf2Sync(plain_text, global.app.key, 1000, 64);
};

module.exports = User;
