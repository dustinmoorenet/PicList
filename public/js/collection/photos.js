Collection.Photos = Backbone.Collection.extend({
  model: Model.Photo,

  initialize: function() {
    this.setSort(false);
  },

  refresh: function() {
    this.fetch({update: true, url: this._url});
  },

  setSort: function(descending) {
    var query = '?descending=' + (descending ? 'true' : 'false');

    this._url = '/photos/' + query;

    this.fetch({url: this._url});
  }
});
