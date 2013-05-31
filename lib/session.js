var crypto = require('crypto')

var users = {};

var session = function() {

  return function(req, res, next) {
    if (!req.cookies.user_session)
      createSession(req, res, next);
    else
      validateSession(req, res, next);
  }
};

function createSession(req, res, next) {

  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex');

    users[token] = {};

    res.cookie('user_session', token);

    next();
  });
}

function validateSession(req, res, next) {
  next();
}

module.exports = session;
