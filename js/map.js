'use strict';

(function () {
  var MAIN_PIN_OFFSET_Y = 48.5;

  var mapDomObject = document.querySelector('section.map');
  var mapPinsDomObject = mapDomObject.querySelector('.map__pins');
  var mainPinDomObject = mapPinsDomObject.querySelector('.map__pin--main');

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
    renderAdvertPins(adverts);
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

  var onAdvertFormResetClick = function (evt) {
    evt.preventDefault();
    deactivateMap();
    window.card.close();
    window.form.reset(mainPinDefaultCoordinates);
  };

  var adverts = window.data.generateAdverts();
  var mainPinDefaultCoordinates = getMainPinCoordinates();

  window.form.reset(mainPinDefaultCoordinates);
  window.form.addResetHadler(onAdvertFormResetClick);

  mainPinDomObject.addEventListener('mouseup', function () {
    if (!checkMapIsActive()) {
      activateMap();
      window.form.enable();
    }
    window.form.setAddress(getMainPinCoordinates());
  });
})();
