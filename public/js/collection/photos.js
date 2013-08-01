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

    if (this.query_parts.decending)
      this.comparator = this.sortNEWEST;
    else
      this.comparator = this.sortOLDEST;

    this.fetch({reset: true}); 
  },

  tagFilter: function(tags) {
    tags = _.uniq(tags);

    this.query_parts.tags = tags;

    this.fetch({reset: true}); 
  },

  sortOLDEST: function(a, b) {
    return Util.compare(a.get('original_date_time'),
                        b.get('original_date_time'));
  },

  sortNEWEST: function(a, b) {
    return Util.compare(b.get('original_date_time'),
                        a.get('original_date_time'));
  }
});
