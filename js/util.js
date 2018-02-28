'use strict';

(function () {
  var ESC_CODE = 27;

  var getRandomInteger = function (min, max, isMaxIncluded) {
    return isMaxIncluded ? Math.round(Math.random() * (max - min)) + min : Math.floor(Math.random() * (max - min)) + min;
  };

  var getRandomElement = function (elements, removeFromObject) {
    var randomElement;
    var randomIndex;
    var elementsLength = elements.length;

    if (elementsLength !== 0) {
      randomIndex = getRandomInteger(0, elementsLength, false);
      randomElement = removeFromObject ? elements.splice(randomIndex, 1)[0] : elements.slice(randomIndex, randomIndex + 1)[0];
    }

    return randomElement;
  };

  var getShuffledArray = function (elements) {
    elements = elements.slice();
    var elementsLength = elements.length;
    var shuffledArray = [];

    for (var i = 0; i < elementsLength; i++) {
      shuffledArray.push(getRandomElement(elements, true));
    }

    return shuffledArray;
  };

  var getShuffledAndSlicedArray = function (elements, sliceLength) {
    var shuffledArray = getShuffledArray(elements);

    return shuffledArray.splice(0, sliceLength);
  };

  var stickToRange = function (number, rangeMin, rangeMax) {
    if (number < rangeMin) {
      number = rangeMin;
    } else if (number > rangeMax) {
      number = rangeMax;
    }

    return number;
  };

  var numberIsInRange = function (number, min, max) {
    // max is not included
    return number >= min && number < max;
  };

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_CODE) {
        action();
      }
    },
    getRandomInteger: getRandomInteger,
    getRandomElement: getRandomElement,
    getShuffledArray: getShuffledArray,
    getShuffledAndSlicedArray: getShuffledAndSlicedArray,
    stickToRange: stickToRange,
    numberIsInRange: numberIsInRange
  };
})();
