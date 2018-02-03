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

var switchMapMode = function (map, active) {
  if (active === true) {
    map.classList.remove('map--faded');
  } else if (active === false) {
    map.classList.add('map--faded');
  }
};

var createMapPinDomObject = function (advertData) {
  var pinButton = document.createElement('button');
  var pinImg = document.createElement('img');
  // FIXME: correct coordinates, taking into account element size with its sharp tail
  pinButton.style.left = advertData.location.x + 'px';
  pinButton.style.top = advertData.location.y + 'px';
  pinButton.classList.add('map__pin');
  pinImg.src = advertData.author.avatar;
  pinImg.width = PIN_WIDTH;
  pinImg.height = PIN_HEIGHT;
  pinImg.draggable = false;

  pinButton.appendChild(pinImg);
  // console.log(pinButton);
  return pinButton;
};

var addPinsToMap = function (map) {
  var mapPinsDomObject = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var index = 0, advert, pin; index < ADEVRTS_NUMBER; index++) {
    advert = getAdvert();
    pin = createMapPinDomObject(advert);
    fragment.appendChild(pin);
  }

  mapPinsDomObject.appendChild(fragment);
};

// -------------------------------------------------------

var mapDomObject = document.querySelector('section.map');
switchMapMode(mapDomObject, true);
addPinsToMap(mapDomObject);

