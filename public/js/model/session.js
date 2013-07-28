/**
 * A session model, to keep track of the session
 * and provide API interface with the server
 */
Model.Session = Backbone.Model.extend({
  url: '/session/info',

  /**
   * Get session info
   */
  initialize: function() {
    this.fetch();

    this.listenToOnce(this, 'sync error', this.onInfo);
  },

  /**
   * Set session state in DOM
   */
  onInfo: function() {
    $('body').toggleClass('has-session', this.get('has_session'));
  },

  /**
   * Sign in user
   *
   * @param [string] email The user's email
   * @param [string] password Plain-text password
   */
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

  /**
   * Server returned an error
   */
  onSignInFail: function() {
    this.setSession(['Login Failed']);
  },

  /**
   * Set the session data
   *
   * @param [mixed] data The user data or error array
   */
  setSession: function(data) {
    if (_.isArray(data))
      user.set('errors', data);
    else
      user.set(data);
  },

  /**
   * Sign out the user
   */
  signOut: function() {
    $.get('/session/signout')
     .always(this.clearSession.bind(this));
  },

  /**
   * Clear out the session
   */
  clearSession: function() {
    if (user) {
      user.stopListening();

      user = null;
    }

    location = '';
  }
});
