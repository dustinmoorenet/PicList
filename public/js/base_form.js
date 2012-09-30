View.BaseForm = Backbone.View.extend({
  className: 'base-form',

  template: _.template(
    '<header></header>'
  + '<div class="info"></div>'
  + '<table>'
  + '  <tr>'
  + '    <td><label for=""></label></td>'
  + '    <td><input name="" /></td>'
  + '    <td class="error"></td>'
  + '  </tr>'
  + '</table>'
  + '<div class="buttons">'
  + '  <div class="btn close">'
  + '</div>'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.base_modal = new View.BaseModal();

    this.base_modal.html(this.el);

    $('body').append(this.base_modal.el);

    return this;
  },

  buildInput: function() {
    
  }
});
