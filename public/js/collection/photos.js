Collection.Photos = Backbone.Collection.extend({
  model: Model.Photo,

  initialize: function() {
    this.fetch({url: '/photos/'});
  },

  refresh: function() {
    this.fetch({update: true, url: '/photos/'});
  }
});
