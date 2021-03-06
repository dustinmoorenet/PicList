/**
 * The main application view
 * 
 * This view holds all elements of the application
 */
View.Main = Backbone.View.extend({
  className: 'main',

  initialize: function() {
    this.upload_sets = new Collection.UploadSets();

    $(window).resize(_.debounce(this.resize.bind(this), 200));
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

    this.upload_drop.render();
  },

  handleDragEnter: function() {
    this.upload_drop.show();
  },

  resize: function() {
    this.trigger('resize', this.$el.width(), this.$el.height());
  }
});


