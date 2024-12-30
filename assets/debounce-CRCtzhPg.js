function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = void 0;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}
export {
  debounce as d
};
