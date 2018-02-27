'use strict';

(function () {
  var lastTimeout;

  var getDebounceFunction = function (timeout) {
    return function (functionToDebounce) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(functionToDebounce, timeout);
    };
  };

  window.debounce = {
    getFunction: getDebounceFunction
  };
})();
