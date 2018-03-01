'use strict';

(function () {
  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 40;
  var PIN_OFFSET_Y = 35;
  var MAX_PINS_NUMBER_AT_MAP = 5;

  var mapPinsDomObject = document.querySelector('.map__pins');

  var createMapPinDomObject = function (ad) {
    var pinButtonDomObject = document.createElement('button');
    var pinImgDomObject = document.createElement('img');

    pinButtonDomObject.style.left = ad.location.x + 'px';
    pinButtonDomObject.style.top = ad.location.y - PIN_OFFSET_Y + 'px';
    pinButtonDomObject.classList.add('map__pin');
    pinImgDomObject.src = ad.author.avatar;
    pinImgDomObject.width = PIN_WIDTH;
    pinImgDomObject.height = PIN_HEIGHT;
    pinImgDomObject.draggable = false;
    pinButtonDomObject.appendChild(pinImgDomObject);

    return pinButtonDomObject;
  };

  var getRenderedAdvertPins = function () {
    return mapPinsDomObject.querySelectorAll('.map__pin:not(.map__pin--main)');
  };

  var clearRenderedAdvertPins = function (pins) {
    pins.forEach(function (pin) {
      pin.remove();
    });
  };

  var renderAdvertPins = function (ads, onPinRender) {
    var fragmentDomObject = document.createDocumentFragment();
    var mapPinDomObject;

    ads = window.util.getShuffledAndSlicedArray(ads, MAX_PINS_NUMBER_AT_MAP);
    ads.forEach(function (ad) {
      mapPinDomObject = createMapPinDomObject(ad);
      onPinRender(mapPinDomObject, ad);
      fragmentDomObject.appendChild(mapPinDomObject);
    });

    mapPinsDomObject.appendChild(fragmentDomObject);
  };

  var reRenderAdvertPins = function (ads, onPinRender) {
    clearRenderedAdvertPins(getRenderedAdvertPins());
    window.card.close();
    renderAdvertPins(ads, onPinRender);
  };

  window.pin = {
    renderAll: renderAdvertPins,
    reRenderAll: reRenderAdvertPins,
    clearAll: clearRenderedAdvertPins,
    getAll: getRenderedAdvertPins
  };
})();
