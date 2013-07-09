var mongojs = require('mongojs'),
    db = mongojs('piclist', ['user']),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    session = require('./session');

/**
 * A user object
 *
 * @param [object] data User data
 */
var User = function(data) {
  this.id = data._id;

  this.props = data;
}

/**
 * Save user info
 *
 * @param [function] callback Callback when save is complete
 *   @param [object] err Any error encounterd while saving
 */
User.prototype.save = function(callback) {
  db.user.update({_id: this.id}, this.props, function(err) {
    if (err)
      err = {error: 'User failed to save'};

    callback(err);
  });
};

/**
 * Clone the user properties
 *
 * @return [object] Return the user properties 
 */
User.prototype.toJSON = function() {
  var obj = JSON.parse(JSON.stringify(this.props));

  obj.id = obj._id;
  delete obj._id;

  return obj;
};

/**
 * Convert the object to a string summary
 *
 * @return [string] Return a summary of object
 */
User.prototype.toString = function() {
  return '[User] ' + this.props.email + ' : ' + this.id;
};

/**
 * Get a user by id
 *
 * @param [string] id The id of the user 
 * @param [function] callback Called when search has finished
 *   @param [object] err Any error encounterd while searching
 *   @param [object] user If user is found, the user
 */
User.get = function(id, callback) {
  db.user.findOne({_id: id}, function(err, user) {
    if (!err && user)
      user = new User(user);
 
    callback(err, user);
  });
}

/**
 * Create a user
 *
 * @param [object] user The user structure
 *   @attr [string] _id (Optional) the uuid of the user
 *   @attr [string] email The user's email address
 *   @attr [string] password The user's plaintext password.  It will be hashed and
 *                           the plaintext password will be overridden.
 * @param [function] callback Called when the insert finishes
 *   @param [object] err Any error encounterd while inserting
 *   @param [object] user If user is found, the user
 */
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
  var hashed_password = User.hashPassword(email, password);

  db.user.findOne({email: email, password: hashed_password}, function(err, user) {
    if (err || !user) 
      err = {error: 'Invalid email or password'};
    else
      user = new User(user);
 
    callback(err, user);
  });
};

/**
 * Hash a password by salting with app key
 *
 * This is a slow function on purpose.
 *
 * @param [string] email The user's email
 * @param [string] password The user's password
 *
 * @return [string] Returns a hex hash 128 characters long
 */
User.hashPassword = function(email, password) {
  var plain_text = email + global.app.key + password;

  return crypto.pbkdf2Sync(plain_text, global.app.key, 10000, 64).toString('hex');
};

module.exports = User;
