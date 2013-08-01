describe('Util', function() {
  describe('compare', function() {
    it('should return -1 when comparing 1 and 2', function() {
      expect(-1, Util.compare(1, 2));
    });

    it('should return 0 when comparing 1 and 1', function() {
      expect(0, Util.compare(1, 1));
    });

    it('should return 1 when comparing 2 and 1', function() {
      expect(1, Util.compare(2, 1));
    });
  });
});
