/**
 * status
 *   initializing: before upload started
 *   uploading: currently uploading
 *   processing: server side processing after upload
 *   complete: server side finished
 *   error: an error occurred
 */
Model.UploadSet = Backbone.Model.extend({
  defaults: function() {
    return {
      status: 'initializing',
      files: new Collection.Files()
    };
  },

  initialize: function() {
  },

  sync: function() {
    var view = this,
        formData = new FormData();
  
    var files = this.get('files');

    files.forEach(function(file) {
      formData.append(file.get('name'), file.get('file'));
    });
  
    return $.ajax({
      url: '/photo',  //server script to process data
      type: 'POST',
      xhr: this.customXhr.bind(this),
      //Ajax events
      beforeSend: this.onBeforeSend.bind(this),
      success: this.onSuccess.bind(this),
      error: this.onError.bind(this),
      // Form data
      data: formData,
      //Options to tell JQuery not to process data or worry about content-type
      cache: false,
      contentType: false,
      processData: false
    });
  },

  customXhr: function() {
    var xhr = $.ajaxSettings.xhr();

    // check if upload property exists
    if (xhr.upload) {
      // for handling the progress of the upload
      xhr.upload.addEventListener('progress', this.onProgress.bind(this), false);
    }

    return xhr;
  },

  onBeforeSend: function() {
    this.set('status', 'uploading');
  },

  onProgress: function(evt) {
    if(evt.lengthComputable) {
      this.set('percent_uploaded', evt.loaded / evt.total);
    }
  },

  onSuccess: function() {
    this.set('status', 'complete');

    photos.refresh();
  },

  onError: function() {
    this.set('status', 'error');
  },
});
