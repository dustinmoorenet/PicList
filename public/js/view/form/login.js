View.Form.Login = Backbone.View.extend({
  className: 'login form',

  events: {
    'click .submit': 'signIn'
  },

  template: _.template(
    '<header>Sign in</header>'
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

  initialize: function() {
    this.render()

    this.listenTo(user, 'change:id', this.remove);
    this.listenTo(user, 'change:errors', this.paintErrors);
  },

  render: function() {
    this.$el.html(this.template());

    this.modal = new View.BaseModal();

    this.modal.html(this.el);

    $('body').append(this.modal.el);
  },

  remove: function() {
    this.modal.remove();

    Backbone.View.prototype.remove.apply(this);
  },

  signIn: function() {
    user.signIn(this.$('input.username').val(),
                this.$('input.password').val());
  },

  paintErrors: function() {

  }
});
