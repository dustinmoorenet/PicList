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

    this.collection.on('add', this.uploadItem, this);
    this.collection.on('remove', this.itemRemoved, this);

    message.on('received_files', this.processItem, this);

    this.render();

    this.$el.hide();
  },

  render: function() {
    this.$el.html(this.template());
  },

  renderCount: function() {
    this.$('.count').html(this.collection.length);
  },

  itemRemoved: function() {
    if (this.collection.length == 0)
      this.$el.hide();

    this.renderCount();
  },

  processItem: function(evt) {
    var view = this,
        upload_set = evt.upload_set;

    this.$el.show();

    var item_view = new this.UploaderItem({model: upload_set});

    this.$('ul').append(item_view.el);

    this.collection.add(upload_set);

    this.renderCount();
  },

  uploadItem: function(upload_set) {
    var view = this,
        formData = new FormData();
  
    var files = upload_set.get('files');

    files.each(function(file) {
      formData.append(file.get('name'), file.get('file'));
    });
  
    $.ajax({
      url: '/photo',  //server script to process data
      type: 'POST',
      xhr: function() {  // custom xhr
        myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) { // check if upload property exists
          // for handling the progress of the upload
          myXhr.upload.addEventListener('progress', function(evt) {
            if(evt.lengthComputable){
              upload_set.set('percent_uploaded', evt.loaded / evt.total);
            }
          }, false);
        }
        return myXhr;
      },
      //Ajax events
      beforeSend: function() {
        upload_set.set('status', 'uploading');
      },
      success: function() {
        upload_set.set('status', 'complete');
        view.trigger('upload_complete');
      },
      error: function() {
        upload_set.set('status', 'error');
      },
      // Form data
      data: formData,
      //Options to tell JQuery not to process data or worry about content-type
      cache: false,
      contentType: false,
      processData: false
    });
  },
});

View.Uploader.prototype.UploaderItem = Backbone.View.extend({
  className: 'uploader-item',

  tagName: 'li',

  template: _.template(
    '<div class="icon"></div>'
  + '<div class="label"></div>'
  + '<div class="progress"></div>'
  ),

  initialize: function() {
    this.model.on('change:percent_uploaded', this.updateProgress, this);
    this.model.on('change:status', this.statusChange, this);
    this.render();
  },

  render: function() {
    this.$el.html(this.template());

    this.setLabel();

    return this;
  },

  remove: function() {
    this.model.off('change:percent_uploaded', this.updateProgress, this);
    this.model.off('change:status', this.statusChange, this);
    this.model.collection.remove(this.model);
    this.$el.remove();
  },

  setLabel: function() {
    var label = '',
        status = this.model.get('status'),
        count = this.model.get('files').length,
        noun = count + (count == 1 ? ' file' : ' files');

    switch (status) {
      case 'initializing':
        label = noun + ' preparing for upload';
        break;
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
      default:
    }

    this.model.set('label', label);

    this.$('.label').text(label);
  },

  updateProgress: function() {
    var progress = this.model.get('percent_uploaded') * 100;

    if (Math.round(progress) == 100)
      this.model.set('status', 'processing');

    this.$('.progress').css('width',  progress + '%');
  },

  statusChange: function() {
    var status = this.model.get('status');

    this.setLabel();

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
