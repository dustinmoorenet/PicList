View.Toolbar = Backbone.View.extend({
  className: 'toolbar',

  initialize: function() {
    this.render();
  },

  render: function() {
    this.add_tag = new View.AddTag();
    this.$el.append(this.add_tag.el);

    return this;
  }
});

View.AddTag = Backbone.View.extend({
  className: 'add-tag',

  events: {
    'click .btn': 'open',
    'blur input': 'close',
    'keypress input': 'typing',
  },

  template: _.template(
    '<div class="btn icon"></div>'
  + '<input type="text" />'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
    this.$('input').hide();
    return this;
  },

  open: function() {
    this.$('input').show().focus();
  },

  close: function() {
    var $input = this.$('input').hide(),
        value = $input.val();

console.log('closing');
    $input.val('');

    message.trigger('addtags', [value]);
  },

  typing: function(evt) {

    if (evt.which == 13)
      this.$('input').get(0).blur();
  }
});
