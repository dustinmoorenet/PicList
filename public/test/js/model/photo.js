describe('Photo model', function() {
  beforeEach(function() {
    this.photo = new Model.Photo();
  });

  it('should be a Model.Photo', function() {
    expect(this.photo).to.be.a(Model.Photo);
  });

  describe("url", function() {
    describe("when no id is set", function() {
      it("should return the model URL", function() {
        expect(this.photo.url()).to.equal("/photo/");
      });
    });
  
    describe("when id is set", function() {
      it("should return the model URL and id", function() {
        this.photo.id = 1;
        expect(this.photo.url()).to.equal("/photo/1");
      });
    });
  });
});
