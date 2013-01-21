var message = _.clone(Backbone.Events);

var main;

var photos;

$(function() {
  main = new View.Main();

  main.render();

  $('body').append(main.el);
});
