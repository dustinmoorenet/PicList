describe('Has module', function() {
  describe('touch property', function() {
    it('is true if touch events are present', function() {
      expect(Has.touch).to.equal(document.ontouchstart === null);
    });
  });
});
