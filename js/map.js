'use strict';

(function () {
  var MAIN_PIN_OFFSET_Y = 48;
  var MAIN_PIN_Y_LIMITS = [150, 500];

  var mapDomObject = document.querySelector('section.map');
  var filtersDomObject = mapDomObject.querySelector('.map__filters');
  var filters = filtersDomObject.querySelectorAll('select, input');
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
  var adverts = [];

  var addRenderMapCardHandler = function (pinButton, ad) {
    pinButton.addEventListener('click', function () {
      window.card.render(mapDomObject, ad);
    });
  };

  var renderAdvertPins = function (ads) {
    var fragmentDomObject = document.createDocumentFragment();
    var mapPinDomObject;
    var adsLength = ads.length;

    for (var i = 0; i < adsLength; i++) {
      mapPinDomObject = window.pin.create(ads[i]);
      addRenderMapCardHandler(mapPinDomObject, ads[i]);
      fragmentDomObject.appendChild(mapPinDomObject);
    }

    mapPinsDomObject.appendChild(fragmentDomObject);
  };

  var getRenderedAdvertPins = function () {
    return mapPinsDomObject.querySelectorAll('.map__pin:not(.map__pin--main)');
  };

  var clearRenderedAdvertPins = function (pins) {
    var pinsNumber = pins.length;

    for (var i = 0; i < pinsNumber; i++) {
      pins[i].remove();
    }
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
    adverts = loadedAdverts;
    renderAdvertPins(loadedAdverts);
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

  filtersDomObject.addEventListener('change', function(evt) {
    console.log('change detected on: ' + evt.target.tagName, evt.target)
    var filtered = window.filters.filter(adverts, filters);

    clearRenderedAdvertPins(getRenderedAdvertPins());
    renderAdvertPins(filtered);
  });

//-----------------------------------------------------------------------------------------------------
  var mainPinDefaultCoordinates = getMainPinCoordinates();

  window.form.reset(mainPinDefaultCoordinates);
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
