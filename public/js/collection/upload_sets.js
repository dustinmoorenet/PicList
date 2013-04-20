Collection.UploadSets = Backbone.Collection.extend({
  model: Model.UploadSet,

  initialize: function() {
    message.on('received_files', this.processSet, this);
  },

  processSet: function(evt) {
    var upload_set = evt.upload_set;

    this.add(upload_set);

    upload_set.save();
  }
});
