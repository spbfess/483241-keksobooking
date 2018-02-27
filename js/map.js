'use strict';

(function () {
  var MAIN_PIN_OFFSET_Y = 48;
  var MAIN_PIN_Y_LIMITS = [150, 500];
  var MAX_PINS_NUMBER_AT_MAP = 5;

  var mapDomObject = document.querySelector('section.map');
  var mapWidth = mapDomObject.offsetWidth;
  var mapPinsDomObject = mapDomObject.querySelector('.map__pins');
  var mainPinDomObject = mapPinsDomObject.querySelector('.map__pin--main');
  var mainPinCoordinatesRange = {
    x: {
      min: 0,
      max: parseInt(mapWidth, 10)
    },
    y: {
      min: MAIN_PIN_Y_LIMITS[0],
      max: MAIN_PIN_Y_LIMITS[1]
    }
  };
  var pointerInitialCoords;

  var addRenderMapCardHandler = function (pinButton, ad) {
    pinButton.addEventListener('click', function () {
      window.card.render(mapDomObject, ad);
    });
  };

  var getRenderedAdvertPins = function () {
    return mapPinsDomObject.querySelectorAll('.map__pin:not(.map__pin--main)');
  };

  var clearRenderedAdvertPins = function (pins) {
    pins.forEach(function (pin) {
      pin.remove();
    });
  };

  var renderAdvertPins = function (ads) {
    var fragmentDomObject = document.createDocumentFragment();
    var mapPinDomObject;

    ads = window.util.getShuffledAndSlicedArray(ads, MAX_PINS_NUMBER_AT_MAP);
    ads.forEach(function (ad) {
      mapPinDomObject = window.pin.create(ad);
      addRenderMapCardHandler(mapPinDomObject, ad);
      fragmentDomObject.appendChild(mapPinDomObject);
    });

    mapPinsDomObject.appendChild(fragmentDomObject);
  };

  var reRenderAdvertPins = function (ads) {
    clearRenderedAdvertPins(getRenderedAdvertPins());
    window.card.close();
    renderAdvertPins(ads);
  };

  var getMainPinCoordinates = function () {
    var x = parseInt(mainPinDomObject.offsetLeft, 10);
    var y = parseInt(mainPinDomObject.offsetTop, 10);

    if (checkMapIsActive()) {
      y = y + MAIN_PIN_OFFSET_Y;
    }

    return [x, y];
  };

  var setMainPinCoordinates = function (coordinates) {
    var x = coordinates[0];
    var y = checkMapIsActive() ? coordinates[1] - MAIN_PIN_OFFSET_Y : coordinates[1];

    mainPinDomObject.style.left = x + 'px';
    mainPinDomObject.style.top = y + 'px';
  };

  var activateMap = function () {
    mapDomObject.classList.remove('map--faded');
    window.filter.enableForm();
    window.backend.load(onAdvertsSuccessLoad, onFailedServerCommunication);
  };

  var checkMapIsActive = function () {
    return mapDomObject.classList.contains('map--faded') ? false : true;
  };

  var deactivateMap = function () {
    var renderedPins = getRenderedAdvertPins();

    clearRenderedAdvertPins(renderedPins);
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
    renderAdvertPins(loadedAdverts);
    window.filter.setChangeHandler(loadedAdverts, reRenderAdvertPins);
  };

  var onFailedServerCommunication = function (message) {
    window.modal.open(message, true);
  };

  var onMainPinMouseMove = function (evt) {
    var mainPinCoords = getMainPinCoordinates();
    var shift = {
      x: pointerInitialCoords.x - evt.clientX,
      y: pointerInitialCoords.y - evt.clientY
    };
    var x = mainPinCoords[0] - shift.x;
    var y = mainPinCoords[1] - shift.y;

    x = window.util.stickToRange(x, mainPinCoordinatesRange.x.min, mainPinCoordinatesRange.x.max);
    y = window.util.stickToRange(y, mainPinCoordinatesRange.y.min, mainPinCoordinatesRange.y.max);

    setMainPinCoordinates([x, y]);
    window.form.setAddress([x, y]);
    pointerInitialCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
  };

  var onMainPinMouseUp = function (evt) {
    evt.preventDefault();

    if (!checkMapIsActive()) {
      activateMap();
      window.form.enable(getMainPinCoordinates());
    }

    document.removeEventListener('mousemove', onMainPinMouseMove);
    document.removeEventListener('mouseup', onMainPinMouseUp);
  };

  // -----------------------------------------------------------------------------------------------------
  var mainPinDefaultCoordinates = getMainPinCoordinates();

  resetPage();
  window.form.addResetHandler(onAdvertFormResetClick);
  window.form.addSubmitHandler(onAdvertFormSubmit);

  mainPinDomObject.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    pointerInitialCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });
})();
