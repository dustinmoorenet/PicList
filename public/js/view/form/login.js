/**
 * Form for signing into the system
 */
View.Form.Login = Backbone.View.extend({
  className: 'login form',

  events: {
    'click .submit': 'signIn',
    'keydown': 'onKeyDown'
  },

  template: _.template(
    '<header>Sign in</header>'
  + '<div class="errors"></div>'
  + '<div class="form">'
  + '  <div>'
  + '    <label>Username</label>'
  + '    <input type="text" class="username" />'
  + '  </div>'
  + '  <div>'
  + '    <label>Password</label>'
  + '    <input type="password" class="password" />'
  + '  </div>'
  + '  <div class="controls">'
  + '    <button class="submit">Sign in</button>'
  + '  </div>'
  + '</div>'
  ),

  /**
   * Render DOM
   */
  initialize: function() {
    this.render()
  },

  /**
   * Build DOM
   */
  render: function() {
    this.$el.html(this.template());

    this.modal = new View.BaseModal();

    this.modal.html(this.el);

    $('body').append(this.modal.el);
  },

  /**
   * Remove form and refresh page
   */
  remove: function() {
    location = '';

    this.modal.remove();

    Backbone.View.prototype.remove.apply(this);
  },

  /**
   * A key was pressed, watch for the Enter key
   *
   * @param [Event] evt The key down event
   */
  onKeyDown: function(evt) {
    if (evt.which == 13)
      this.signIn();
  },

  /**
   * Sign in the user
   */
  signIn: function() {
    session.signIn(this.$('input.username').val(),
                   this.$('input.password').val());

    this.listenTo(user, 'change:id', this.remove);
    this.listenTo(user, 'change:errors', this.paintErrors);
  },

  /**
   * Login error where received
   */
  paintErrors: function(model, errors) {
    this.$('.errors').html(_.isArray(errors) && errors.join(','));

    this.stopListening(user);
  }
});
