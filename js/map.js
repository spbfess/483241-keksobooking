'use strict';

(function () {
  var MAIN_PIN_OFFSET_Y = 48;
  var MainPinYLimit = {
    MIN: 150,
    MAX: 500
  };

  var mapDomObject = document.querySelector('section.map');
  var mapWidth = mapDomObject.offsetWidth;
  var mainPinDomObject = mapDomObject.querySelector('.map__pin--main');
  var mainPinPositionRange = {
    x: {
      min: 0,
      max: parseInt(mapWidth, 10)
    },
    y: {
      min: MainPinYLimit.MIN,
      max: MainPinYLimit.MAX
    }
  };
  var pointerInitialPosition;

  var addRenderMapCardHandler = function (pinButton, ad) {
    pinButton.addEventListener('click', function () {
      window.card.render(mapDomObject, ad);
    });
  };

  var getMainPinPosition = function () {
    var x = parseInt(mainPinDomObject.offsetLeft, 10);
    var y = parseInt(mainPinDomObject.offsetTop, 10) + MAIN_PIN_OFFSET_Y;

    return {
      x: x,
      y: y
    };
  };

  var setMainPinPosition = function (position) {
    var x = position.x;
    var y = position.y - MAIN_PIN_OFFSET_Y;

    mainPinDomObject.style.left = x + 'px';
    mainPinDomObject.style.top = y + 'px';
  };

  var activateMap = function () {
    mapDomObject.classList.remove('map--faded');
    window.backend.load(onAdvertsLoadSuccess, onFailedServerCommunication);
  };

  var isMapActive = function () {
    return mapDomObject.classList.contains('map--faded') ? false : true;
  };

  var deactivateMap = function () {
    var renderedPins = window.pin.getAll();

    window.pin.clearAll(renderedPins);
    mapDomObject.classList.add('map--faded');
    setMainPinPosition(mainPinDefaultPosition);
  };

  var resetPage = function () {
    deactivateMap();
    window.card.close();
    window.filter.resetForm();
    window.form.reset(mainPinDefaultPosition);
  };

  var onAdvertFormResetClick = function (evt) {
    evt.preventDefault();
    resetPage();
  };

  var onAdvertFormSubmitSuccess = function (message) {
    resetPage();
    window.modal.display(message, false);
  };

  var onAdvertFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.send(window.form.getFormDataObject(), onAdvertFormSubmitSuccess, onFailedServerCommunication);
  };

  var onAdvertsLoadSuccess = function (loadedAdverts) {
    window.pin.renderAll(loadedAdverts, addRenderMapCardHandler);
    window.filter.enableForm();
    window.filter.setChangeHandler(loadedAdverts, window.pin.reRenderAll, addRenderMapCardHandler);
  };

  var onFailedServerCommunication = function (message) {
    window.modal.display(message, true);
  };

  var onMainPinMouseMove = function (evt) {
    var mainPinPosition = getMainPinPosition();
    var shift = {
      x: pointerInitialPosition.x - evt.clientX,
      y: pointerInitialPosition.y - evt.clientY
    };
    var x = mainPinPosition.x - shift.x;
    var y = mainPinPosition.y - shift.y;

    x = window.util.stickToRange(x, mainPinPositionRange.x.min, mainPinPositionRange.x.max);
    y = window.util.stickToRange(y, mainPinPositionRange.y.min, mainPinPositionRange.y.max);

    var newMainPinPosition = {
      x: x,
      y: y
    };

    setMainPinPosition(newMainPinPosition);
    window.form.setAddress(newMainPinPosition);
    pointerInitialPosition = {
      x: evt.clientX,
      y: evt.clientY
    };
  };

  var onMainPinMouseUp = function (evt) {
    evt.preventDefault();

    if (!isMapActive()) {
      activateMap();
      window.form.enable(getMainPinPosition());
    }

    document.removeEventListener('mousemove', onMainPinMouseMove);
    document.removeEventListener('mouseup', onMainPinMouseUp);
  };

  var mainPinDefaultPosition = getMainPinPosition();

  resetPage();
  window.form.initialize(onAdvertFormResetClick, onAdvertFormSubmit);

  mainPinDomObject.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    pointerInitialPosition = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });
})();
