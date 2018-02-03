'use strict';

var AVATAR_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];
var APARTMENT_TYPES = ['flat', 'house', 'bungalo'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var ADEVRTS_NUMBER = 8;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

var getRandomInteger = function (min, max, isMaxIncluded) {
  var randomInteger = isMaxIncluded ? Math.round(Math.random() * (max - min)) + min : Math.floor(Math.random() * (max - min)) + min;
  return randomInteger;
};

var getRandomElement = function (elements, removeFromObject) {
  var randomElement;
  var randomIndex;
  var elementsLength = elements.length;

  if (elementsLength !== 0) {
    // console.log('elements = ' + elements);
    randomIndex = getRandomInteger(0, elementsLength, false);
    randomElement = removeFromObject ? elements.splice(randomIndex, 1)[0] : elements.slice(randomIndex, randomIndex + 1)[0];
  }

  return randomElement;
};

var getShuffledArray = function (elements, sliceLength) {
  var copiedElements = elements.slice();
  var elementsLength = elements.length;
  var shuffledArray = [];

  for (var index = 0; index < elementsLength; index++) {
    shuffledArray.push(getRandomElement(copiedElements, true));
  }

  return sliceLength >= 0 ? shuffledArray.splice(0, sliceLength) : shuffledArray;
};

var getAdvert = function () {
  var randomAvatarNumber = getRandomElement(AVATAR_NUMBERS, true);
  var randomTitle = getRandomElement(TITLES, true);
  var randomApartmentType = getRandomElement(APARTMENT_TYPES, false);
  var randomCheckinTime = getRandomElement(CHECKIN_TIMES, false);
  var randomCheckoutTime = getRandomElement(CHECKOUT_TIMES, false);
  var randomFeatures = getShuffledArray(FEATURES, getRandomInteger(FEATURES.length, true));
  var randomPhotos = getShuffledArray(PHOTOS, -1);
  var randomPrice = getRandomInteger(1000, 1000000, true);
  var randomRoomsNumber = getRandomInteger(1, 5, true);
  var randomGuestsNumber = getRandomInteger(1, 10, true);
  var randomLocation = {
    'x': getRandomInteger(300, 900, true),
    'y': getRandomInteger(150, 500, true)
  };

  if (typeof randomAvatarNumber === 'undefined') {
    return null;
  }

  var advertTemplate = {
    'author': {
      'avatar': 'img/avatars/user' + randomAvatarNumber + '.png'
    },
    'offer': {
      'title': randomTitle,
      'address': randomLocation.x + ', ' + randomLocation.y,
      'price': randomPrice,
      'type': randomApartmentType,
      'rooms': randomRoomsNumber,
      'guests': randomGuestsNumber,
      'checkin': randomCheckinTime,
      'checkout': randomCheckoutTime,
      'features': randomFeatures,
      'description': '',
      'photos': randomPhotos,
    },
    'location': {
      'x': randomLocation.x,
      'y': randomLocation.y
    }
  };

  // for (var property in advertTemplate) {
  //   if (advertTemplate.hasOwnProperty(property)) {
  //     console.log(advertTemplate[property]);
  //   }
  // }

  return advertTemplate;
};

var switchMapMode = function (map, fade) {
  if (fade === true) {
    map.classList.add('map--faded');
  } else if (fade === false) {
    map.classList.remove('map--faded');
  }
};

var createMapPinDomObject = function (map, pinData) {
  var button = document.createElement('button');
  var img = document.createElement('img');

  button.style.left = pinData.location.x + 'px';
  button.style.top = pinData.location.y + 'px';
  button.classList.add('map__pin');
  img.src = pinData.author.avatar;
  img.width = PIN_WIDTH;
  img.height = PIN_HEIGHT;
  img.draggable = false;

  button.appendChild(img);
  console.log(button);
  return button;
};

// var addMapPinsToDom = function (map, pins) {
//   var fragment = document.createDocumentFragment();

//   for (var pinIndex = 0; pinIndex < pins.length; i++) {
//     fragment.appendChild(pins[pinIndex]);
//   }

//   var mapPinsDomObject = map.querySelector('.map__pins');
//   console.log(mapPinsDomObject);

// }
// -------------------------------------------------------

var mapDomObject = document.querySelector('section.map');
var mapPinsDomObject = mapDomObject.querySelector('.map__pins');
var fragment = document.createDocumentFragment();
switchMapMode(mapDomObject, false);

var advert;
var pin;

for (var index = 0; index < ADEVRTS_NUMBER; index++) {
  advert = getAdvert();
  pin = createMapPinDomObject(mapDomObject, advert);
  fragment.appendChild(pin);
}

mapPinsDomObject.appendChild(fragment);
console.log(fragment);

// for (var _ = 0; _ < 20; _++) {
//   getAdvert();
//   console.log('-------------------------------');
// }
