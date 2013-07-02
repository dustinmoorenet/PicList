Model.User = Backbone.Model.extend({
  url: '/user',

  signIn: function(username, password) {
    $.ajax({
      type: 'POST',
      url: '/user/signin',
      data: {
        username: username,
        password: password
      }
    }).fail(function(errors) {
      this.set('errors', ['Login Failed']);

    }).complete((function(data) {
      if (_.isArray(data))
        this.set('errors', data);
      else
        this.set(data);

    }).bind(this));
  },

  signOut: function() {
    $.get('/user/signout')
     .always((function() {
      this.clear();
    }).bind(this));;
  }
});
