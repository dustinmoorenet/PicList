View.Toolbar = Backbone.View.extend({
  className: 'toolbar',

  initialize: function() {
    this.render();
  },

  render: function() {
    this.add_tag = new View.AddTag();
    this.$el.append(this.add_tag.el);

    this.upload_dialog = new View.UploadDialog();
    this.$el.append(this.upload_dialog.el);

    this.sort = new View.Toolbar.Sort();
    this.$el.append(this.sort.el);

    this.filter = new View.Toolbar.Filter();
    this.$el.append(this.filter.el);

    return this;
  }
});

View.AddTag = Backbone.View.extend({
  className: 'add-tag',

  events: function() {
    var events = {
      'blur input': 'close',
      'keypress input': 'typing',
    };

    events[Input.event + ' .btn'] = 'open';

    return events;
  },

  template: _.template(
    '<div class="btn add"></div>'
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
    this.$('input').show();
  },

  close: function() {
    var $input = this.$('input').hide(),
        value = $input.val();

    $input.val('');

    message.trigger('addtags', [value]);
  },

  typing: function(evt) {

    if (evt.which == 13)
      this.$('input').get(0).blur();
  }
});

View.UploadDialog = Backbone.View.extend({
  className: 'upload-dialog',

  template: _.template(
    '<div class="icon upload"></div>'
  + '<input type="file" multiple />'
  ),

  events: {
    'change input': 'uploadReceived'
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  },

  uploadReceived: function(evt) {
    var upload_set = new Model.UploadSet();
  
    var files = upload_set.get('files');
    _.each(evt.target.files, function(file) {
      files.add({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    });

    message.trigger('received_files', {upload_set: upload_set});
  }
});
