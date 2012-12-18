View.FullPhoto = Backbone.View.extend({
  className: 'full-photo',

  events: {
    'click .close.icon': 'close'
  },

  template: _.template(
    '<img src="/photo/original/<%= id %>" />'
  + '<div class="icon close"></div>'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {
    var view = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.$('img').load(function() {
      view.loaded();
    })

    this.base_modal = new View.BaseModal();

    this.base_modal.html(this.el);

    $('body').append(this.base_modal.el);

    return this;
  },

  remove: function() {
    this.base_modal.remove();
  },

  close: function() {
    this.remove();
  },

  loaded: function() {
    this.$('.icon').show();
  }
});
