Model.Session = Backbone.Model.extend({
  url: '/session',

  signIn: function(email, password) {
    $.ajax({
      type: 'POST',
      url: '/session/signin',
      data: {
        email: email,
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
    $.get('/session/signout')
     .always((function() {
      this.clear();
    }).bind(this));;
  }
});
