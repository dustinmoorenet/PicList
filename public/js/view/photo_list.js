View.PhotoList = Backbone.View.extend({
  className: 'photo-list',

  template: _.template(
    '<div class="fake-padding"></div>'
  ),

  initialize: function() {
    photos = new Collection.Photos();

    this.listenTo(photos, 'reset', this.render);
    this.listenTo(photos, 'add', this.addPhoto);
    this.listenTo(message, 'addtags', this.addTags);
  },

  render: function() {
    var view = this;

    this.$el.html(this.template());

    this.clearPhotos();
  
    photos.forEach(this.addPhoto.bind(this));
  },

  clearPhotos: function() {
    this.$('.photo-list-item').remove();
  },
  
  addPhoto: function(photo) {
    var item = new View.PhotoList.Item({model: photo});
    this.$el.append(item.el);
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
        photos.get(item.id).set(item);
      });
      message.trigger('update_filter');
    });
  }
});

View.PhotoList.Item = Backbone.View.extend({
  className: 'item',

  events: function() {
    var events = {};

    events[Input.event] = 'select';
    events[Input.event + ' .expand.icon'] = 'expand';
    events[Input.event + ' .info.icon']   = 'displayInfo';
    events[Input.event + ' .trash.icon']  = 'delete';

    return events;
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
    evt.preventDefault();

    if (this.$('.icon').is(evt.target))
      return;

    this.$el.toggleClass('selected');
    this.model.set('selected', this.$el.hasClass('selected'));
  },

  expand: function(evt) {
    evt.preventDefault();

    var full_photo = new View.FullPhoto({model: this.model});
  },

  displayInfo: function(evt) {
    evt.preventDefault();

    new View.PhotoForm({
      model: this.model
    });
  },

  delete: function(evt) {
    evt.preventDefault();

    this.model.destroy({ success: this.remove.bind(this) });
  }
});
