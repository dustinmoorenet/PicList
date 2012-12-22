View.PhotoForm = Backbone.View.extend({
  className: 'photo-form',

  events: {
    'click .close.icon': 'remove'
  },

  template: _.template(
    '<header>'
  + '  <div class="title">Info</div>'
  + '  <div class="close icon"></div>'
  + '</header>'
  + '<div class="info">'
  + '  <div class="row">'
  + '    <label>File Name</label>'
  + '    <div class="file-name"><%= file_name %></div>'
  + '  </div>'
  + '  <div class="row">'
  + '    <label>Date Created</label>'
  + '    <div class="date-created"></div>'
  + '  </div>'
  + '</div>'
  + '<div class="preview">'
  + '  <img src="/photo/thumb/<%= id %>"/>'
  + '</div>'
  + '<footer></footer>'
  ),

  initialize: function() {
    this.model.fetch({ success: this.render.bind(this) });
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    this.modal = new View.BaseModal();

    this.modal.html(this.el);

    $('body').append(this.modal.el);
  },

  remove: function() {
    this.$el.remove();
    this.modal.remove();
  }
});
