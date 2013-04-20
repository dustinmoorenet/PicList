Collection.Photos = Backbone.Collection.extend({
  model: Model.Photo,

  url: function() {
    var query = $.param(this.query_parts);
    return '/photos/?' + query;
  },

  initialize: function() {
    this.query_parts = {};

    this.setSort(false);
  },

  refresh: function() {
    this.fetch();
  },

  setSort: function(descending) {
    this.query_parts.descending = !!descending;

    this.fetch({reset: true}); 
  },

  tagFilter: function(tags) {
    tags = _.uniq(tags);

    this.query_parts.tags = tags;

    this.fetch({reset: true}); 
  }
});
