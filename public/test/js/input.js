describe('Input module', function() {
  describe('event property', function() {
    it('is touchstart if touch events are available', function() {
      var value = Has.touch ? 'touchstart' : 'click';
      expect(Input.event).to.equal(value);
    });
  });
})
