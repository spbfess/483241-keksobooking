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
  var mainPinCoordinatesRange = {
    x: {
      min: 0,
      max: parseInt(mapWidth, 10)
    },
    y: {
      min: MainPinYLimit.MIN,
      max: MainPinYLimit.MAX
    }
  };
  var pointerInitialCoordinates;

  var addRenderMapCardHandler = function (pinButton, ad) {
    pinButton.addEventListener('click', function () {
      window.card.render(mapDomObject, ad);
    });
  };

  var getMainPinCoordinates = function () {
    var x = parseInt(mainPinDomObject.offsetLeft, 10);
    var y = parseInt(mainPinDomObject.offsetTop, 10) + MAIN_PIN_OFFSET_Y;

    return [x, y];
  };

  var setMainPinCoordinates = function (coordinates) {
    var x = coordinates[0];
    var y = coordinates[1] - MAIN_PIN_OFFSET_Y;

    mainPinDomObject.style.left = x + 'px';
    mainPinDomObject.style.top = y + 'px';
  };

  var activateMap = function () {
    mapDomObject.classList.remove('map--faded');
    window.backend.load(onAdvertsSuccessLoad, onFailedServerCommunication);
  };

  var isMapActive = function () {
    return mapDomObject.classList.contains('map--faded') ? false : true;
  };

  var deactivateMap = function () {
    var renderedPins = window.pin.getAll();

    window.pin.clearAll(renderedPins);
    mapDomObject.classList.add('map--faded');
    setMainPinCoordinates(mainPinDefaultCoordinates);
  };

  var resetPage = function () {
    deactivateMap();
    window.card.close();
    window.filter.resetForm();
    window.form.reset(mainPinDefaultCoordinates);
  };

  var onAdvertFormResetClick = function (evt) {
    evt.preventDefault();
    resetPage();
  };

  var onAdvertFormSubmitSuccess = function () {
    resetPage();
    window.modal.open('Данные успешно загружены на сервер', false);
  };

  var onAdvertFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.send(window.form.getFormDataObject(), onAdvertFormSubmitSuccess, onFailedServerCommunication);
  };

  var onAdvertsSuccessLoad = function (loadedAdverts) {
    window.pin.renderAll(loadedAdverts, addRenderMapCardHandler);
    window.filter.enableForm();
    window.filter.setChangeHandler(loadedAdverts, window.pin.reRenderAll, addRenderMapCardHandler);
  };

  var onFailedServerCommunication = function (message) {
    window.modal.open(message, true);
  };

  var onMainPinMouseMove = function (evt) {
    var mainPinCoords = getMainPinCoordinates();
    var shift = {
      x: pointerInitialCoordinates.x - evt.clientX,
      y: pointerInitialCoordinates.y - evt.clientY
    };
    var x = mainPinCoords[0] - shift.x;
    var y = mainPinCoords[1] - shift.y;

    x = window.util.stickToRange(x, mainPinCoordinatesRange.x.min, mainPinCoordinatesRange.x.max);
    y = window.util.stickToRange(y, mainPinCoordinatesRange.y.min, mainPinCoordinatesRange.y.max);

    setMainPinCoordinates([x, y]);
    window.form.setAddress([x, y]);
    pointerInitialCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };
  };

  var onMainPinMouseUp = function (evt) {
    evt.preventDefault();

    if (!isMapActive()) {
      activateMap();
      window.form.enable(getMainPinCoordinates());
    }

    document.removeEventListener('mousemove', onMainPinMouseMove);
    document.removeEventListener('mouseup', onMainPinMouseUp);
  };

  var mainPinDefaultCoordinates = getMainPinCoordinates();

  resetPage();
  window.form.addResetHandler(onAdvertFormResetClick);
  window.form.addSubmitHandler(onAdvertFormSubmit);

  mainPinDomObject.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    pointerInitialCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });
})();
