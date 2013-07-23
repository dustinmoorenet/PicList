var message = _.clone(Backbone.Events),
    main,
    photos,
    user,
    session,
    routes = {};

$(function() {
  session = new Model.Session();

  routes.main = new Router.Main();

  Backbone.history.start();
});
