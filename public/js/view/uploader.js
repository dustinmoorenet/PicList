View.Uploader = Backbone.View.extend({
  className: 'uploader',

  template: _.template(
    '<header>'
  + '  <div class="title">File Uploads</div>'
  + '  <div class="count-holder">(<span class="count">0</span>)</div>'
  + '</header>'
  + '<ul></ul>'
  ),

  initialize: function() {
    this.collection = new Backbone.Collection();

    this.collection.on('add', this.renderItem, this);
    this.collection.on('remove', this.removeItem, this);

    this.render();

    this.$el.hide();
  },

  render: function() {
    this.$el.html(this.template());
  },

  renderCount: function() {
    this.$('.count').html(this.collection.length);
  },

  removeItem: function() {
    if (this.collection.length == 0)
      this.$el.hide();

    this.renderCount();
  },

  renderItem: function(item) {

    this.$el.show();

    var item_view = new View.Uploader.Item({model: item});

    this.$('ul').append(item_view.el);

    this.renderCount();
  },
});

View.Uploader.Item = Backbone.View.extend({
  className: 'item',

  tagName: 'li',

  template: _.template(
    '<div class="icon"></div>'
  + '<div class="label"></div>'
  + '<div class="progress"></div>'
  ),

  initialize: function() {
    this.listenTo(this.model, 'change:percent_uploaded', this.updateProgress);
    this.listenTo(this.model, 'change:status', this.statusChange);

    this.render();
  },

  render: function() {
    this.$el.html(this.template());

    this.setLabel();

    return this;
  },

  remove: function() {
    this.model.collection.remove(this.model);

    Backbone.View.prototype.remove.apply(this);
  },

  setLabel: function(status) {
    var label = '',
        count = this.model.get('files').length,
        noun = count + (count == 1 ? ' file' : ' files');

    switch (status) {
      case 'uploading':
        label = 'uploading ' + noun;
        break;
      case 'processing':
        label = 'processing ' + noun;
        break;
      case 'complete':
        label = noun + ' uploaded';
        break;
      case 'error':
        label = noun + ' errored while uploading';
        break;
      case 'initializing':
      default:
        label = noun + ' preparing for upload';
    }

    this.model.set('label', label);

    this.$('.label').text(label);
  },

  updateProgress: function(model, perecent_uploaded) {
    var progress = percent_uploaded * 100;

    if (Math.round(progress) == 100)
      this.model.set('status', 'processing');

    this.$('.progress').css('width',  progress + '%');
  },

  statusChange: function(model, status) {

    this.setLabel(status);

    switch (status) {
      case 'complete':
        this.remove();
        break;
      case 'error':
        this.error();
        break;
      default:
    }
  },

  error: function() {
    this.$el.addClass('error');
  }
});
