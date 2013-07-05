var crypto = require('crypto'),
    mongojs = require('mongojs'),
    db = mongojs('piclist', ['session']);

var session = function() {

  return function(req, res, next) {
    if (req.cookies.user_session)
      session.validate(req, res, next);
    else
      next();
  }
};

session.validate = function(req, res, next) {
  var session_key = req.cookies.user_session;

  db.session.findOne({_id: session_key}, function(err, session) {
    if (err || !session)
      res.clearCookie('user_session');
    else
      req.session = session;

    next();
  });
};

session.signIn = function(email, password, req, res, callback) {
  session.signOut(req);
  
  User.validatePassword(email, password, function(err, user) {
    if (err)
      callback(err);
    else
      session.create(user, res, function(err, session) {
        callback(err, user);
      })
  });
};

session.create = function(user, res, callback) {
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

session.signOut = function(req) {
  if (!req.session)
    return;
  
  session.delete(req.session);

  delete req.session;
}

session.delete = function(session) {
  if (!session)
    return;

  db.session.remove(session, true);
};

module.exports = session;
