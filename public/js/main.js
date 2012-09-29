var Photo = Backbone.Model.extend({
  urlRoot: '/photo/' 
});

var Photos = Backbone.Collection.extend({
  model: Photo
});

var photos = new Photos();
var files_to_upload;

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
  
    var files = evt.originalEvent.dataTransfer.files; // FileList object.
  
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

View.Uploader = Backbone.View.extend({
  className: 'uploader',

  template: _.template(
    '<header>File Uploads</header>'
  + '<ul>'
  + '  <li><img src="/photo/thumb/3c0fd48eb04fa9ca6fec58d96301c1af" /><span>Some File Name.jpg</li>'
  + '  <li><img src="/photo/thumb/3c0fd48eb04fa9ca6fec58d96301c1af" /><span>Some File Name.jpg</li>'
  + '  <li><img src="/photo/thumb/3c0fd48eb04fa9ca6fec58d96301c1af" /><span>Some File Name.jpg</li>'
  + '  <li><img src="/photo/thumb/3c0fd48eb04fa9ca6fec58d96301c1af" /><span>Some File Name.jpg</li>'
  + '</ul>'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
  },

  attachFileSource: function(file_source) {
    file_source.on('received_files', this.processFiles, this);
  },

  processFiles: function(evt) {
console.log('processFiles: ', evt);
    var files = evt.files;

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
    this.files_to_upload = files;

console.log('got files from file source');
  }
}, Backbone.Events);

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
console.log('handleDragEnter');
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

function uploadFiles(evt) {
  var formData = new FormData();

  for (var i = 0, file; file = files_to_upload[i]; ++i) {
    formData.append(file.name, file);
  }

  $.ajax({
    url: '/photo',  //server script to process data
    type: 'POST',
    xhr: function() {  // custom xhr
        myXhr = $.ajaxSettings.xhr();
        if(myXhr.upload){ // check if upload property exists
            myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
        }
        return myXhr;
    },
    //Ajax events
    //beforeSend: beforeSendHandler,
    success: completeHandler,
    //error: errorHandler,
    // Form data
    data: formData,
    //Options to tell JQuery not to process data or worry about content-type
    cache: false,
    contentType: false,
    processData: false
  });
}

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
  if(e.lengthComputable){
    $('progress').attr({value:e.loaded,max:e.total});
  }
}

function completeHandler(e) {
  photos.fetch({add: true, url: '/photos/'});
}
