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
  + '    <div class="text file-name"><%= m.file_name %></div>'
  + '  </div>'
  + '  <div class="row" <%= m.original_date_time ? "" : "hidden" %> >'
  + '    <label>Date Created</label>'
  + '    <div class="text date-created"><%= m.original_date_time %></div>'
  + '  </div>'
  + '</div>'
  + '<div class="preview">'
  + '  <img src="/photo/thumb/<%= m.id %>"/>'
  + '</div>'
  + '<footer></footer>'
  ),

  initialize: function() {
    this.model.fetch({ success: this.render.bind(this) });
  },

  render: function() {
    this.$el.html(this.template({ m: this.model.toJSON() }));

    this.modal = new View.BaseModal();

    this.modal.html(this.el);

    $('body').append(this.modal.el);
  },

  remove: function() {
    this.$el.remove();
    this.modal.remove();
  }
});
