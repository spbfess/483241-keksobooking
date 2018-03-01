'use strict';

(function () {
  var ESC_KEY_CODE = 27;

  var getRandomInteger = function (min, max) {
    // max is not included
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var pullRandomElement = function (elements) {
    // takes away random element from elements object and returns it
    var randomIndex = getRandomInteger(0, elements.length);
    var randomElement = elements.splice(randomIndex, 1)[0];

    return randomElement;
  };

  var getShuffledArray = function (elements) {
    // does not change initial array, returns shuffled copy
    var shuffledArray = [];

    elements = elements.slice();
    elements.forEach(function () {
      shuffledArray.push(pullRandomElement(elements));
    });

    return shuffledArray;
  };

  var getShuffledAndSlicedArray = function (elements, sliceLength) {
    // does not change initial array, returns shuffled copy slice
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

  var isEscEvent = function (evt, callback) {
    if (evt.keyCode === ESC_KEY_CODE) {
        callback();
    }
  };

  window.util = {
    getShuffledAndSlicedArray: getShuffledAndSlicedArray,
    isEscEvent: isEscEvent,
    numberIsInRange: numberIsInRange,
    stickToRange: stickToRange
  };
})();
