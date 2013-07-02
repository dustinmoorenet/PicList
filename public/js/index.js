var message = _.clone(Backbone.Events),
    main,
    photos,
    user;

$(function() {
  user = new Model.User();

  main = new View.Main();

  main.render();

  $('body').append(main.el);

  new View.Form.Login();
});
