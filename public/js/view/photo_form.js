View.PhotoForm = Backbone.View.extend({
  className: 'photo-form',

  initialize: function() {
    this.model.fetch({ success: this.render.bind(this) });
  },

  render: function() {
    this.modal = new View.BaseModal();

    this.modal.html(this.el);

    $('body').append(this.modal.el);
  }
});
