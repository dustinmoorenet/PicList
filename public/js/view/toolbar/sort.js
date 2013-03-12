View.Toolbar.Sort = Backbone.View.extend({
  className: 'sort',

  events: {
    'change select': 'changed'
  },

  template: _.template(
    '<select>'
  + '  <option value="date_order">Oldest</option>'
  + '  <option value="date_order_reverse">Newest</option>'
  + '</select>'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  },

  changed: function() {
    photos.setSort(this.$('select').val() == 'date_order_reverse');
  }
});
