var Photo = Backbone.Model.extend({
  urlRoot: '/photo/' 
});

var Photos = Backbone.Collection.extend({
  model: Photo
});

var photos = new Photos();

var UploadFile = Backbone.Model.extend({
  urlRoot: '/photo/' 
});

var UploadFiles = Backbone.Collection.extend({
  model: UploadFile 
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
  
    var files = [];
    _.each(evt.originalEvent.dataTransfer.files, function(file) {
      files.push(new UploadFile({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
    });
  
    this.trigger('received_files', {files: files});

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
    '<img src="<%= source %>" title="<%= name %>" />'
  + '<div class="name"><%= name %></div>'
  + '<div class="progress"></div>'
  ),

  initialize: function() {
    this.model.on('change:percent_uploaded', this.updateProgress, this);
    this.model.on('change:status', this.statusChange, this);
    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  remove: function() {
    this.model.off('change:percent_uploaded', this.updateProgress, this);
    this.model.off('change:status', this.statusChange, this);
    this.model.collection.remove(this.model);
    this.$el.remove();
  },

  updateProgress: function() {
    this.$('.progress').css('width', (this.model.get('percent_uploaded') * 100) + '%');
  },

  statusChange: function() {
    var status = this.model.get('status');

    if (status == 'complete')
      this.remove();
    else if (status == 'error')
      this.error();
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
    this.files_to_upload = new UploadFiles();

    this.files_to_upload.on('add', this.uploadFile, this);
    this.files_to_upload.on('remove', this.onRemove, this);

    this.render();

    this.$el.hide();
  },

  render: function() {
    this.$el.html(this.template());
  },

  onRemove: function() {
    if (this.files_to_upload.length == 0)
      this.$el.hide();
  },

  attachFileSource: function(file_source) {
    file_source.on('received_files', this.processFiles, this);
  },

  processFiles: function(evt) {
    var view = this,
        files = evt.files;

    this.$el.show();

    // Loop through the FileList and render image files as thumbnails.
    files.forEach(function(file) {

      var f = file.get('file');

      // Only process image files.
      if (!f.type.match('image.*'))
        return;

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          file.set('source', e.target.result);

          var item_view = new View.UploaderItem({model: file});

          view.$('ul').prepend(item_view.el);

          view.$('.count').html(view.$('li').length);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    });
    this.files_to_upload.add(files);
  },

  uploadFile: function(file) {
      var formData = new FormData();
  
      formData.append(file.get('name'), file.get('file'));
  
      $.ajax({
        url: '/photo',  //server script to process data
        type: 'POST',
        xhr: function() {  // custom xhr
          myXhr = $.ajaxSettings.xhr();
          if (myXhr.upload) { // check if upload property exists
            // for handling the progress of the upload
            myXhr.upload.addEventListener('progress', function(evt) {
              if(evt.lengthComputable){
                file.set('percent_uploaded', evt.loaded / evt.total);
              }
            }, false);
          }
          return myXhr;
        },
        //Ajax events
        beforeSend: function() {
          file.set('status', 'uploading');
        },
        success: function() {
          file.set('status', 'complete');
        },
        error: function() {
          file.set('status', 'error');
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

View.Main = Backbone.View.extend({
  className: 'main',

  events: {
  },

  initialize: function() {
    var view = this;

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
  photos.on('reset', onReset);
  photos.on('add', addPhoto);
  photos.fetch({url: '/photos/'});

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

function loadFiles(files) {
}

function onReset() {
  clearPhotos();

  photos.each(function(photo) {
    addPhoto(photo);
  });
}

function clearPhotos() {
  $('#image_list img').remove();
}

function addPhoto(photo) {
  $('#image_list').append('<img src="/photo/thumb/' + photo.id + '" />');
}

function progressHandlingFunction(e){
}

function completeHandler(e) {
  photos.fetch({add: true, url: '/photos/'});
}
