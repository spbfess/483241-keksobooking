'use strict';

(function () {
  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 40;
  var PIN_OFFSET_Y = 35;

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

  window.pin = {
    create: createMapPinDomObject
  };
})();
