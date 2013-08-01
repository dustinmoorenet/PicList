View.PhotoList.Item = Backbone.View.extend({
  className: 'item',

  events: function() {
    var events = {};

    events[Input.event] = 'select';
    events[Input.event + ' .expand.icon'] = 'expand';
    events[Input.event + ' .info.icon']   = 'displayInfo';
    events[Input.event + ' .trash.icon']  = 'delete';

    return events;
  },

  template: _.template(
    '<img src="/photo/thumb/<%= id %>" />'
  + '<div class="icon expand"></div>'
  + '<div class="icon info"></div>'
  + '<div class="icon trash"></div>'
  ),

  initialize: function() {
    this.render();

    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {

    this.$el.html(this.template(this.model.toJSON()));

    var $img = this.$('img');

    $img.load(this.loaded.bind(this));

    this.resize();
  },

  loaded: function() {
    this.$el.addClass('loaded');
  },

  resize: function() {
    this.$el.css({
      width: this.model.get('best_width'),
      height: this.model.get('best_height'),
      top: this.model.get('list_y'),
      left: this.model.get('list_x')
    });

    // TODO this is terrible, we shouldn't have to wait!!!
    _.delay((function() {
      this.$el.addClass('positioned');
    }).bind(this), 1000);
  },

  select: function(evt) {
    evt.preventDefault();

    if (this.$('.icon').is(evt.target))
      return;

    this.$el.toggleClass('selected');
    this.model.set('selected', this.$el.hasClass('selected'));
  },

  expand: function(evt) {
    evt.preventDefault();

    var full_photo = new View.FullPhoto({model: this.model});
  },

  displayInfo: function(evt) {
    evt.preventDefault();

    new View.PhotoForm({
      model: this.model
    });
  },

  delete: function(evt) {
    evt.preventDefault();

    this.model.destroy();
  }
});
