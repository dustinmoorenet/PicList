var User = require('./lib/user');
    global.app = require('./lib/app');

global.app.load(function() {
  var user = {
    email: process.argv[2],
    password: process.argv[3],
    first_name: process.argv[4],
    last_name: process.argv[5]
  };
  
  User.create(user, function() {
    console.log(arguments);

    process.exit();
  });
});
