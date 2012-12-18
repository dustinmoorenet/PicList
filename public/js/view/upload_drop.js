View.UploadDrop = Backbone.View.extend({
  className: 'upload-drop',

  events: {
    'dragover .drop': 'handleDragOver',
    'drop': 'handleFileDrop',
    'dragenter': 'handleDragEnter',
    'dragleave': 'handleDragLeave',
  },

  template: _.template(
    '<table>'
  + '  <tr>'
  + '    <td class="drop custom-drop custom-drop1 column1">Beijing Trip</td>'
  + '    <td class="drop main-drop column2" rowspan="3">Uncategorized</td>'
  + '    <td class="drop custom-drop custom-drop4 column3">Dustin Moore</td>'
  + '  </tr>'
  + '  <tr>'
  + '    <td class="drop custom-drop custom-drop2 column1">Funny Cats</td>'
  + '    <td class="disabled drop custom-drop custom-drop5 column3"></td>'
  + '  </tr>'
  + '  <tr>'
  + '    <td class="drop custom-drop custom-drop3 column1">Jade Moore</td>'
  + '    <td class="disabled drop custom-drop custom-drop6 column3"></td>'
  + '  </tr>'
  + '</table>'
  ),

  initialize: function() {
  },

  render: function() {
    this.$el.html(this.template());

    return this;
  },

  show: function() {
    this.$el.show();
  },

  hide: function() {
    this.$el.hide();
  },

  handleDragOver: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  },

  handleFileDrop: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var $drop = $(evt.target);

    this.hide();

    if (!$drop.hasClass('drop'))
      return;

    $drop.removeClass('hover');

    var upload_set = new Model.UploadSet();
  
    var files = upload_set.get('files');
    _.each(evt.originalEvent.dataTransfer.files, function(file) {
      files.add({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    });

    this.trigger('received_files', {upload_set: upload_set});
  },

  handleDragEnter: function(evt) {
    $(evt.target).filter('.drop').addClass('hover');
  },

  handleDragLeave: function(evt) {
    $(evt.target).removeClass('hover');

    if (evt.originalEvent.x == 0 && evt.originalEvent.y == 0)
      this.hide();
  },
});
