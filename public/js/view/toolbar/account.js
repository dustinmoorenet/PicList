/**
 * Display account status/controls
 */
View.Toolbar.Account = Backbone.View.extend({
  className: 'account',

  template: _.template(
    '<div class="sign-in"><a href="#signin">Sign In</a></div>'
  + '<div class="menu"><a href="#signout">Sign Out</a></div>'
  ),

  /**
   * Render DOM
   */
  initialize: function() {
    this.render();
  },

  /**
   * Build DOM
   */
  render: function() {
    this.$el.html(this.template());
  }
});
