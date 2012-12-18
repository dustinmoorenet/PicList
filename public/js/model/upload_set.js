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
