/**
 * Main router
 */
Router.Main = Backbone.Router.extend({
  routes: {
    '': function() {
      main = new View.Main();

      main.render();

      $('body').append(main.el);
    },

    'signin': function() {
      new View.Form.Login();
    },

    'signout': function() {
      if (session)
        session.signOut();
    }
  }
});
