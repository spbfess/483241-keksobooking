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
var RANGE_PRICES = [1000, 1000000];
var RANGE_ROOMS = [1, 5];
var RANGE_GUESTS = [1, 10];
var ADEVRTS_NUMBER = 8;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var RANGE_PIN_COORDINATES = {
  'X': [300, 900],
  'Y': [150, 500]
};

var getRandomInteger = function (min, max, isMaxIncluded) {
  var randomInteger = isMaxIncluded ? Math.round(Math.random() * (max - min)) + min : Math.floor(Math.random() * (max - min)) + min;
  return randomInteger;
};

var getRandomElement = function (elements, removeFromObject) {
  var element;
  var index;
  var elementsLength = elements.length;

  if (elementsLength !== 0) {
    // console.log('elements = ' + elements);
    index = getRandomInteger(0, elementsLength, false);
    element = removeFromObject ? elements.splice(index, 1)[0] : elements.slice(index, index + 1)[0];
  }

  return element;
};

var getShuffledArray = function (elements, sliceLength) {
  var copiedElements = elements.slice();
  var elementsLength = elements.length;
  var shuffledArray = [];

  for (var index = 0; index < elementsLength; index++) {
    shuffledArray.push(getRandomElement(copiedElements, true));
  }

  return sliceLength ? shuffledArray.splice(0, sliceLength) : shuffledArray;
};

var getAdvert = function () {
  var randomAvatarNumber = getRandomElement(AVATAR_NUMBERS, true);
  var randomTitle = getRandomElement(TITLES, true);
  var randomApartmentType = getRandomElement(APARTMENT_TYPES, false);
  var randomCheckinTime = getRandomElement(CHECKIN_TIMES, false);
  var randomCheckoutTime = getRandomElement(CHECKOUT_TIMES, false);
  var randomFeatures = getShuffledArray(FEATURES, getRandomInteger(FEATURES.length, true));
  var randomPhotos = getShuffledArray(PHOTOS);
  var randomPrice = getRandomInteger(RANGE_PRICES[0], RANGE_PRICES[1], true);
  var randomRoomsNumber = getRandomInteger(RANGE_ROOMS[0], RANGE_ROOMS[1], true);
  var randomGuestsNumber = getRandomInteger(RANGE_GUESTS[0], RANGE_GUESTS[1], true);
  var randomLocation = {
    'x': getRandomInteger(RANGE_PIN_COORDINATES.X[0], RANGE_PIN_COORDINATES.X[1], true),
    'y': getRandomInteger(RANGE_PIN_COORDINATES.Y[0], RANGE_PIN_COORDINATES.Y[1], true)
  };

  // if (typeof randomAvatarNumber === 'undefined') {
  //   return null;
  // }

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
  console.log(advertTemplate);
  console.log(advertTemplate.author.avatar);
  console.log(advertTemplate.offer.title);
  console.log(advertTemplate.offer.address);
  console.log(advertTemplate.offer.price);
  console.log(advertTemplate.offer.type);
  console.log(advertTemplate.offer.rooms);
  console.log(advertTemplate.offer.guests);
  console.log(advertTemplate.offer.checkin);
  console.log(advertTemplate.offer.checkout);
  console.log(advertTemplate.offer.features);
  console.log(advertTemplate.offer.photos);
  console.log(advertTemplate.location);
  console.log('----------------------------');

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
  // FIXME: check anf correct types for button coordinates, img dimmensions
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

