describe('Main view', function() {
  beforeEach(function() {
    sinon.stub(View, 'PhotoList').returns(new Backbone.View());
    sinon.stub(View, 'UploadDrop').returns(new Backbone.View());
    sinon.stub(View, 'Uploader').returns(new Backbone.View());
    sinon.stub(View, 'Toolbar').returns(new Backbone.View());

    this.view = new View.Main();
  });

  afterEach(function() {
    View.PhotoList.restore();
    View.UploadDrop.restore();
    View.Uploader.restore();
    View.Toolbar.restore();
  });

  it('builds several views', function() {

    var mock = sinon.mock(this.view.$el);

    mock.expects('append').exactly(4);

    this.view.render();

    mock.verify();
  });

  it('waits for file drag', function() {

    this.view.render();

    // function doesn't really exist since we stubbed parent
    this.view.upload_drop.show = sinon.spy(); 

    this.view.handleDragEnter()

    expect(this.view.upload_drop.show.calledOnce);
  });

  it('routes upload_complete message to photo_list', function() {
    this.view.render();

    // function doesn't really exist since we stubbed parent
    this.view.photo_list.getPhotos = sinon.spy();

    this.view.uploader.trigger('upload_complete');

    expect(this.view.photo_list.getPhotos.calledOnce);
  });
});
