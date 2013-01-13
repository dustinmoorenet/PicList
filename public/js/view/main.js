/**
 * The main application view
 * 
 * This view holds all elements of the application
 */
View.Main = Backbone.View.extend({
  className: 'main',

  initialize: function() {
  },

  render: function() {
    this.photo_list = new View.PhotoList();

    this.$el.append(this.photo_list.el);

    this.toolbar = new View.Toolbar();

    this.$el.append(this.toolbar.el);

    this.upload_drop = new View.UploadDrop();

    this.$el.append(this.upload_drop.el);

    this.uploader = new View.Uploader();

    this.$el.append(this.uploader.el);

    $('body').get(0).addEventListener('dragenter', this.handleDragEnter.bind(this), false);
    
    this.uploader.on('upload_complete', this.photo_list.getPhotos, this.photo_list);

    this.upload_drop.render();
  },

  handleDragEnter: function() {
    this.upload_drop.show();
  },
});


