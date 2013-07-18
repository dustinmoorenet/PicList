var app = {},
    crypto = require('crypto'),
    mongojs = require('mongojs'),
    db = mongojs('piclist', ['app']);

app.id = 1;

/**
 * Load the app
 *
 * @param [function] callback Function to call once load is complete
 */
app.load = function(callback) {
  db.app.findOne({_id: app.id}, (function(err, app_data) {
    if (err || !app_data) {
      app.createKey(callback); 

    } else {
      app.key = app_data.key;

      callback();
    }
  }).bind(this));
}

/**
 * Create app key
 *
 * @param [function] callback Function to call once load is complete
 */
app.createKey = function(callback) {
  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex');
  
    app.key = token;

    db.app.save({_id: app.id, key: token}, callback);
  });
}

module.exports = app;
