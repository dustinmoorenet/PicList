View.BaseModal = Backbone.View.extend({
  className: 'base-modal',

  template: _.template(
    '<div class="wrap"><div class="content"></div></div>'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  html: function(html) {
    this.$('> .wrap .content').html(html);
  }
});

View.Message = Backbone.View.extend({
  className: 'message',

  events: {
    'click .btn': 'remove'
  },

  template: _.template(
    '<header><%= title %></header>'
  + '<div class="content"><%= content %></div>'
  + '<div class="buttons"><%= buttons %></div>'
  ),

  buttonTemplate: _.template(
    '<div class="btn <%= className %>"><%= text %></div>'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      title: this.options.title || '',
      content: this.options.content || '',
      buttons: this.buildButtons(this.options.buttons || [])
    }));

    this.base_modal = new View.BaseModal();

    this.base_modal.html(this.el);

    $('body').append(this.base_modal.el);

    return this;
  },

  remove: function() {
    this.$el.remove();

    this.base_modal.remove();
  },

  buildButtons: function(buttons) {
    var view = this,
        html = '';

    view.events = view.events || {};

    buttons.forEach(function(button, index) {
      var className = button.className || 'btn-' + index;
      html += view.buttonTemplate({
        text: button.text || '',
        className: className
      });
      view.events['click .' + className] = button.onClick || function() {};
    });

    this.delegateEvents();

    return html;
  }
});

var YesNo = function(options) {
  new View.Message({
    title: 'Confirm',
    content: options.message,
    buttons: [
      {
        text: 'Yes',
        className: 'yes',
        onClick: options.onYes
      },
      {
        text: 'No',
        className: 'no',
        onClick: options.onNo
      }
    ]
  });
}
