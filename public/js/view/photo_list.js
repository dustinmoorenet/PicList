View.PhotoList = Backbone.View.extend({
  className: 'photo-list',

  template: _.template(
    '<div class="fake-padding"></div>'
  ),

  initialize: function() {
    message.on('addtags', this.addTags, this);

    this.collection = new Collection.Photos();

    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.addPhoto, this);

    this.collection.fetch({url: '/photos/'});
  },

  render: function() {
    var view = this;

    this.$el.html(this.template());

    this.clearPhotos();
  
    this.collection.each(function(photo) {
      view.addPhoto(photo);
    });
  },

  remove: function() {
    this.$el.remove();

    message.off('addtags', this.addTag, this);

    this.collection.off('reset', this.onReset, this);
    this.collection.off('add', this.addPhoto, this);
  },

  clearPhotos: function() {
    this.$('.photo-list-item').remove();
  },
  
  addPhoto: function(photo) {
    var item = new this.PhotoListItem({model: photo});
    this.$el.append(item.el);
  },
  
  getPhotos: function() {
    this.collection.fetch({add: true, url: '/photos/'});
  },

  addTags: function(tags) {
    var view = this,
        item_ids = [];

    this.collection.each(function(item) {
      if (item.get('selected'))
        item_ids.push(item.id);
    });    

    if (item_ids.length == 0)
      return;

    $.post('/tag/add', { tags: tags, items: item_ids }, function(items) {
      items.forEach(function(item) {
        view.collection.get(item.id).set(item);
      });
      message.trigger('update_filter');
    });
  }
});

View.PhotoList.prototype.PhotoListItem = Backbone.View.extend({
  className: 'photo-list-item',

  events: {
    'click': 'select',
    'click .expand.icon': 'expand',
    'click .info.icon': 'displayInfo',
    'click .trash.icon': 'delete',
  },

  template: _.template(
    '<img src="/photo/thumb/<%= id %>" />'
  + '<div class="icon expand"></div>'
  + '<div class="icon info"></div>'
  + '<div class="icon trash"></div>'
  ),

  initialize: function() {
    this.render();
  },

  render: function() {

    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  remove: function() {
    this.$el.remove();
  },

  select: function(evt) {
    if (this.$('.icon').is(evt.target))
      return;

    this.$el.toggleClass('selected');
    this.model.set('selected', this.$el.hasClass('selected'));
  },

  expand: function() {
    var full_photo = new View.FullPhoto({model: this.model});
  },

  displayInfo: function() {
  },

  delete: function() {
    this.model.destroy({ success: _.bind(this.remove, this) });
  }
});
