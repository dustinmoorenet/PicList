View.Toolbar.Filter = Backbone.View.extend({
  className: 'filter',

  events: {
    'keyup input': 'onChange',
    'search input': 'onChange',
  },

  template: _.template(
    '<label>Filter:</label>'
  + '<input type="search" />'
  ),

  initialize: function() {
    this.onChange = _.throttle(this.onChange.bind(this), 1000);

    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  },

  onChange: function() {
    var tags = this.$('input').val().split(' ');

    photos.tagFilter(tags);
  }
});
