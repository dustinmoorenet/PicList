View.PhotoList = Backbone.View.extend({
  className: 'photo-list',

  template: _.template(
    '<div class="fake-padding"></div>'
  ),

  initialize: function() {
    photos = new Collection.Photos();

    this.listenTo(photos, 'reset', this.render);
    this.listenTo(photos, 'add', this.addPhoto);
    this.listenTo(photos, 'remove', this.removePhoto);
    this.listenTo(message, 'addtags', this.addTags);

    this.listenTo(main, 'resize', this.resize);

    this.resize = _.debounce(this.resize.bind(this), 500);
  },

  render: function() {
    var view = this;

    this.$el.html(this.template());

    this.clearPhotos();
  
    this.addPhotos();
  },

  resize: function() {
    this.bestFit();

    var view = this,
        list_y = 0;

    this.rows.forEach(function(row) {
      var list_x = 0;

      row.photos.forEach(function(id) {
        var photo_view = view.photo_views[id],
            photo = photo_view.model,
            best_width = (row.best_height * photo.get('width')) / photo.get('height');

        photo.set({
          list_x: list_x,
          list_y: list_y,
          best_height: row.best_height,
          best_width: best_width
        });

        photo_view.resize();

        list_x += best_width;
      });

      list_y += row.best_height;
    })
  },

  clearPhotos: function() {
    this.trigger('remove');

    this.photo_views = {};
  },

  bestFit: function() {
    var view_width = this.$el.width(),
        n = 0,
        running_total = 0;

    this.rows = [{photos: []}];

    // for each photo
    photos.forEach((function(photo, index) {

      // get width for 200px height
      var width_200 = (200 * photo.get('width')) / photo.get('height');

      if (running_total + width_200 < view_width) {
        // add to running total
        running_total += width_200;
      } else {
        // determine best height to fit width
        var diff = view_width / running_total;
        this.rows[n].best_height = 200 * diff;

        // increment row and build structure
        this.rows[++n] = {photos: []};

        // reset running_total
        running_total = width_200;
      }

      // add photo to row and add to running total
      this.rows[n].photos.push(photo.id);

    }).bind(this));

    // determine best height to fit width for last row
    var diff = view_width / running_total;
    this.rows[n].best_height = 200 * diff < 300 ? 200 * diff : 300;
  },
  
  addPhotos: function() {
    photos.forEach(this.addPhoto.bind(this));
  },

  addPhoto: function(photo) {
    var item = new View.PhotoList.Item({model: photo});
    this.$el.append(item.el);

    item.listenTo(this, 'remove', this.remove);

    this.photo_views[photo.id] = item;

    this.resize();
  },

  removePhoto: function(photo) {
    delete this.photo_views[photo.id];

    this.resize();
  },
  
  addTags: function(tags) {
    var view = this,
        item_ids = [];

    photos.forEach(function(item) {
      if (item.get('selected'))
        item_ids.push(item.id);
    });    

    if (item_ids.length == 0)
      return;

    $.post('/tag/add', { tags: tags, items: item_ids }, function(items) {
      items.forEach(function(item) {
        photos.get(item._id).set('tags', item.tags);
      });
      message.trigger('update_filter');
    });
  }
});
