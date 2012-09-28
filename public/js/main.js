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
    'dragenter .drop': 'handleDragEnter',
    'dragleave .drop': 'handleDragLeave',
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
    this.render();
  },

  render: function() {
    this.$el.html(this.template());

    return this;
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

    if (!$drop.hasClass('drop'))
      return;

    $drop.removeClass('hover');
  
    var files = evt.originalEvent.dataTransfer.files; // FileList object.
  
console.log('got files?: ', files);
    //loadFiles(files);
  },

  handleDragEnter: function(evt) {
    $(evt.target).addClass('hover');
  },

  handleDragLeave: function(evt) {
    $(evt.target).removeClass('hover');
  },

});

$(function() {
  photos.on('reset', onReset);
  photos.on('add', addPhoto);
  photos.fetch({url: '/photos/'});

  $(':button').click(uploadFiles);

  $(':file').on('change', handleFileInputChange);

  upload_drop = new View.UploadDrop();

  $('body').append(upload_drop.el);
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
  files_to_upload = files;
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
