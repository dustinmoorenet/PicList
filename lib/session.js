var crypto = require('crypto'),
    mongojs = require('mongojs'),
    db = mongojs('piclist', ['session']),
    User = require('./user');

/**
 * Session management express middleware
 *
 * @return Returns a function that handles the incoming request
 */
function Session() {

  return function(req, res, next) {
    if (req.cookies.user_session)
      Session.validate(req, res, next);
    else
      next();
  }
}

/**
 * Validate the incoming request by finding the session key in the db
 *
 * @param [object] req The request object
 * @param [object] res The response object
 * @param [function] next The function to call when we are done handling
 *                        the request
 */
Session.validate = function(req, res, next) {
  var session_key = req.cookies.user_session;

  db.session.findOne({_id: session_key}, function(err, session) {
    if (err || !session)
      res.clearCookie('user_session');
    else
      req.session = session;

    next();
  });
};

/**
 * Sign in the user if the email and password are valid
 *
 * @param [string] email The user's email address
 * @param [string] password The user's plaintext password
 * @param [object] req The request object
 * @param [object] res The response object
 * @param [function] callback The function to call once validation is done
 */
Session.signIn = function(email, password, req, res, callback) {
  Session.signOut(req);
  
  User.validatePassword(email, password, function(err, user) {
    if (err)
      callback(err);
    else
      Session.create(user, res, function(err, session) {
        callback(err, user);
      })
  });
};

/**
 * Create a new session
 *
 * @param [User] user The user who needs a session
 * @param [object] res The response object
 * @param [function] callback The function to call when the session is created
 */
Session.create = function(user, res, callback) {
  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex');

    var session = {
      _id: token,
      user: user.toJSON()
    };

    db.session.save(session, function(err, saved) {
      if (err || !saved)
        err = {error: 'Could not create session'};
      else
        res.cookie('user_session', token);

      callback(err, session);
    });
  });
}

/**
 * Sign out the user
 * 
 * @param [object] req The request object
 */
Session.signOut = function(req) {
  if (!req.session)
    return;
  
  Session.delete(req.session);

  delete req.session;
}

/**
 * Delete the session from the db
 *
 * @param [object] session The session to delete
 */
Session.delete = function(session) {
  if (!session)
    return;

  db.session.remove(session, true);
};

module.exports = Session;
