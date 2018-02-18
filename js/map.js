(function () {
  'use strict';

  var MAIN_PIN_OFFSET_Y = 48.5;

  var mapDomObject = document.querySelector('section.map');
  var mapPinsDomObject = mapDomObject.querySelector('.map__pins');
  var mainPinDomObject = mapPinsDomObject.querySelector('.map__pin--main');

  var addRenderMapCardHandler = function (pinButton, ad) {
    pinButton.addEventListener('click', function () {
      card.renderMapCard(mapDomObject, ad);
    });
  };

  var renderAdvertPins = function (ads) {
    var fragmentDomObject = document.createDocumentFragment();
    var mapPinDomObject;
    var adsLength = ads.length;

    for (var i = 0; i < adsLength; i++) {
      mapPinDomObject = pin.createMapPinDomObject(ads[i]);
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

  //   advertFormDomObject.addEventListener('invalid', function (evt) {
  //     var target = evt.target;
  //     target.style.border = '3px solid red';

  //     if (target.validity.tooShort) {
  //       target.setCustomValidity('Это поле должно содержать минимум ' + target.minLength + ' символов');
  //     } else if (target.validity.tooLong) {
  //       target.setCustomValidity('Это поле не должно быть длиннее ' + target.maxLength + ' символов');
  //     } else if (target.validity.valueMissing) {
  //       target.setCustomValidity('Обязательное поле для заполнения');
  //     } else if (target.validity.rangeUnderflow) {
  //       target.setCustomValidity('Значение не может быть ниже ' + target.min);
  //     } else if (target.validity.rangeOverflow) {
  //       target.setCustomValidity('Значение не может быть выше ' + target.max);
  //     } else if (target !== advertFormCapacityDomObject) {
  //       target.setCustomValidity('');
  //       target.style.border = '';
  //     }
  //   }, true);

  //   advertFormDomObject.addEventListener('input', function (evt) {
  //     evt.target.style.border = '';
  //   });

  var adverts = data.generateAdverts();
  var mainPinDefaultCoordinates = getMainPinCoordinates();

  form.setAdvertAddress(mainPinDefaultCoordinates);
  // resetAdvertForm();

  mainPinDomObject.addEventListener('mouseup', function () {
    if (!checkMapIsActive()) {
      activateMap();
      form.enableAdvertForm();
    }
    form.setAdvertAddress(getMainPinCoordinates());
  });
  // setAdvertFormReactionOnUserInput();
  var advertFormResetDomObject = document.querySelector('button.form__reset');
  advertFormResetDomObject.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivateMap();
    form.resetAdvertForm();
  });
}) ();
