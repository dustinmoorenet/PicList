var Model = {};
var Collection = {};

Model.Photo = Backbone.Model.extend({
  urlRoot: '/photo/' 
});

Collection.Photos = Backbone.Collection.extend({
  model: Model.Photo
});

/**
 * status
 *   initializing: before upload started
 *   uploading: currently uploading
 *   processing: server side processing after upload
 *   complete: server side finished
 *   error: an error occurred
 */
Model.UploadSet = Backbone.Model.extend({
  defaults: {
    status: 'initializing',
    files: null
  },
  initialize: function() {
    this.set('files', new Collection.Files());
  }
});

Model.File = Backbone.Model.extend({});

Collection.Files = Backbone.Collection.extend({
  model: Model.File 
});

var View = {};

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

View.UploaderItem = Backbone.View.extend({
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
        //this.remove();
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
console.log('item removed');
    if (this.collection.length == 0)
      this.$el.hide();

    this.renderCount();
  },

  attachFileSource: function(file_source) {
    file_source.on('received_files', this.processItem, this);
  },

  processItem: function(evt) {
    var view = this,
        upload_set = evt.upload_set;

    this.$el.show();

    var item_view = new View.UploaderItem({model: upload_set});

    this.$('ul').append(item_view.el);

    this.collection.add(upload_set);

    this.renderCount();
  },

  uploadItem: function(upload_set) {
    var formData = new FormData();
  
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

View.PhotoList = Backbone.View.extend({
  className: 'photo-list',

  initialize: function() {
    this.collection = new Collection.Photos();

    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.addPhoto, this);

    this.collection.fetch({url: '/photos/'});
  },

  render: function() {
    var view = this;

    this.clearPhotos();
  
    this.collection.each(function(photo) {
      view.addPhoto(photo);
    });
  },

  remove: function() {
    this.$el.remove();

    this.collection.off('reset', this.onReset, this);
    this.collection.off('add', this.addPhoto, this);
  },

  clearPhotos: function() {
    this.$('.photo-list-item').remove();
  },
  
  addPhoto: function(photo) {
    var item = new View.PhotoListItem({model: photo});
    this.$el.append(item.el);
  },
  
  getPhotos: function() {
    this.collection.fetch({add: true, url: '/photos/'});
  }
});

View.PhotoListItem = Backbone.View.extend({
  className: 'photo-list-item',

  template: _.template(
    '<img src="/photo/thumb/<%= id %>" />'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {

    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  
});

View.Main = Backbone.View.extend({
  className: 'main',

  events: {
  },

  initialize: function() {
    var view = this;

    this.photo_list = new View.PhotoList();

    this.$el.append(this.photo_list.el);

    this.upload_drop = new View.UploadDrop();

    this.$el.append(this.upload_drop.el);

    this.uploader = new View.Uploader();

    this.$el.append(this.uploader.el);

    $('body').get(0).addEventListener('dragenter', function() {
      view.handleDragEnter(); }, false);
    
    this.uploader.attachFileSource(this.upload_drop);
  },

  render: function() {
    this.upload_drop.render();
  },

  handleDragEnter: function() {
    this.upload_drop.show();
  },
});

$(function() {
//  $(':button').click(uploadFiles);
//
//  $(':file').on('change', handleFileInputChange);

  var main = new View.Main();

  $('body').append(main.el);

  main.render();
});

function handleFileInputChange(evt) {
  var files = evt.target.files; // FileList object

  loadFiles(files);
}
