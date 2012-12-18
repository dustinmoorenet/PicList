var Model = {};
var Collection = {};
var View = {};

var message = _.clone(Backbone.Events);

$(function() {
//  $(':button').click(uploadFiles);
//
//  $(':file').on('change', handleFileInputChange);

  var main = new View.Main();

  $('body').append(main.el);

  main.render();
});

function handleFileInputChange(evt) {
  var files = evt.target.files; // FileList object

  loadFiles(files);
}
