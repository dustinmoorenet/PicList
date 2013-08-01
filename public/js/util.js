var Util = {};

Util.compare = function compare(a, b) {
  return a < b  ? -1
       : a == b ?  0
       :           1;
};
