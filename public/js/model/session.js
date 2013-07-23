Model.Session = Backbone.Model.extend({
  url: '/session',

  initialize: function() {

  },

  signIn: function(email, password) {

    user = new Model.User();

    $.ajax({
      type: 'POST',
      url: '/session/signin',
      data: {
        email: email,
        password: password
      },
      dataType: 'json'
    }).fail(this.onSignInFail.bind(this))
      .done(this.setSession.bind(this))
  },

  onSignInFail: function() {
    this.setSession(['Login Failed']);
  },

  setSession: function(data) {
    if (_.isArray(data))
      user.set('errors', data);
    else
      user.set(data);
  },

  signOut: function() {
    $.get('/session/signout')
     .always(this.clearSession.bind(this));
  },

  clearSession: function() {
    if (user) {
      user.stopListening();

      user = null;
    }
  }
});
