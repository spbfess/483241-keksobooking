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
var APPARTMENTS_MAP = {
  'flat': 'Квартира',
  'bungalo': 'Лачуга',
  'house': 'Дом',
  'palace': 'Дворец'
};
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PHOTO_WIDTH = 100;
var RANGE_PRICES = [1000, 1000000];
var RANGE_ROOMS = [1, 5];
var RANGE_GUESTS = [1, 10];
var ADVERTS_NUMBER = 8;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var RANGE_PIN_COORDINATES = {
  'X': [300, 900],
  'Y': [150, 500]
};
var MAP_IS_ACTIVE = false;
var PIN_OFFSET_Y = 35;
var MAIN_PIN_OFFSET_Y = 48.5;
var ESC_CODE = 27;

var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapDomObject = document.querySelector('section.map');
var mapPinsDomObject = mapDomObject.querySelector('.map__pins');
var mapFiltersContainerDomObject = mapDomObject.querySelector('.map__filters-container');
var mainPinDomObject = mapPinsDomObject.querySelector('.map__pin--main');
var avdertFormDomObject = document.querySelector('.notice__form');
var avdertFormFieldsets = avdertFormDomObject.children;
var advertAddressInputDomObject = avdertFormDomObject.querySelector('#address');

var getRandomInteger = function (min, max, isMaxIncluded) {
  return isMaxIncluded ? Math.round(Math.random() * (max - min)) + min : Math.floor(Math.random() * (max - min)) + min;
};

var getRandomElement = function (elements, removeFromObject) {
  var randomElement;
  var randomIndex;
  var elementsLength = elements.length;

  if (elementsLength !== 0) {
    randomIndex = getRandomInteger(0, elementsLength, false);
    randomElement = removeFromObject ? elements.splice(randomIndex, 1)[0] : elements.slice(randomIndex, randomIndex + 1)[0];
  }

  return randomElement;
};

var getShuffledArray = function (elements) {
  elements = elements.slice();
  var elementsLength = elements.length;
  var shuffledArray = [];

  for (var i = 0; i < elementsLength; i++) {
    shuffledArray.push(getRandomElement(elements, true));
  }

  return shuffledArray;
};

var getShuffledAndSlicedArray = function (elements, sliceLength) {
  var shuffledArray = getShuffledArray(elements);

  return shuffledArray.splice(0, sliceLength);
};

var getRandomAdvert = function () {
  var randomAvatarNumber = getRandomElement(AVATAR_NUMBERS, true);
  var randomTitle = getRandomElement(TITLES, true);
  var randomApartmentType = getRandomElement(APARTMENT_TYPES, false);
  var randomCheckinTime = getRandomElement(CHECKIN_TIMES, false);
  var randomCheckoutTime = getRandomElement(CHECKOUT_TIMES, false);
  var randomFeatures = getShuffledAndSlicedArray(FEATURES, getRandomInteger(0, FEATURES.length, true));
  var randomPhotos = getShuffledArray(PHOTOS);
  var randomPrice = getRandomInteger(RANGE_PRICES[0], RANGE_PRICES[1], true);
  var randomRoomsNumber = getRandomInteger(RANGE_ROOMS[0], RANGE_ROOMS[1], true);
  var randomGuestsNumber = getRandomInteger(RANGE_GUESTS[0], RANGE_GUESTS[1], true);
  var randomLocation = {
    'x': getRandomInteger(RANGE_PIN_COORDINATES.X[0], RANGE_PIN_COORDINATES.X[1], true),
    'y': getRandomInteger(RANGE_PIN_COORDINATES.Y[0], RANGE_PIN_COORDINATES.Y[1], true) - PIN_OFFSET_Y
  };

  var advert = {
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

  return advert;
};

var generateAdverts = function () {
  var adverts = [];
  var advert;

  for (var i = 0; i < ADVERTS_NUMBER; i++) {
    advert = getRandomAdvert();
    adverts.push(advert);
  }

  return adverts;
};

var createFeaturesDomObject = function (features) {
  var featuresLength = features.length;
  var featuresDomObject = document.createElement('ul');
  var featureDomObject;

  for (var i = 0; i < featuresLength; i++) {
    featureDomObject = document.createElement('li');
    featureDomObject.classList.add('feature', 'feature--' + features[i]);
    featuresDomObject.appendChild(featureDomObject);
  }

  featuresDomObject.classList.add('popup__features');

  return featuresDomObject;
};

var createPicturesDomObject = function (pictures) {
  var picturesLength = pictures.length;
  var picturesDomObject = document.createElement('ul');
  var pictureDomObject;
  var templatePictureDomObject = document.createElement('li');

  templatePictureDomObject.appendChild(document.createElement('img'));

  for (var i = 0; i < picturesLength; i++) {
    pictureDomObject = templatePictureDomObject.cloneNode(true);
    pictureDomObject.firstElementChild.src = pictures[i];
    pictureDomObject.firstElementChild.width = PHOTO_WIDTH;
    picturesDomObject.appendChild(pictureDomObject);
  }

  picturesDomObject.classList.add('popup__pictures');

  return picturesDomObject;
};

var closeAdvertInfo = function () {
  var advertInfoDomObject = mapDomObject.querySelector('article.map__card');

  advertInfoDomObject.remove();
  document.removeEventListener('keydown', onAdvertInfoCloseButtonKeydown);
};

var onAdvertInfoCloseButtonKeydown = function (evt) {
  if (evt.keyCode === ESC_CODE) {
    closeAdvertInfo();
  }
};

var addCloseAdvertInfoHandlers = function (advertInfo) {
  var closeAdvertInfoButton = advertInfo.querySelector('button.popup__close');

  closeAdvertInfoButton.addEventListener('click', function () {
    closeAdvertInfo();
  });
  document.addEventListener('keydown', onAdvertInfoCloseButtonKeydown);
};

var renderAdvertInfo = function (ad) {
  var advertDomObject = mapCardTemplate.cloneNode(true);
  var roomsNumber = ad.offer.rooms;
  var roomsAvailable;

  if (roomsNumber === 1) {
    roomsAvailable = roomsNumber + ' комната';
  } else if (roomsNumber > 1 && roomsNumber < 5) {
    roomsAvailable = roomsNumber + ' комнаты';
  } else {
    roomsAvailable = roomsNumber + ' комнат';
  }

  var guestsNumber = ad.offer.guests;
  var guestsAvailable = guestsNumber === '1' ? guestsNumber + ' гостя' : guestsNumber + ' гостей';

  advertDomObject.querySelector('h3').textContent = ad.offer.title;
  advertDomObject.querySelector('p').children[0].textContent = ad.offer.address;
  advertDomObject.querySelector('.popup__price').textContent = ad.offer.price + '₽/ночь';
  advertDomObject.querySelector('h4').textContent = APPARTMENTS_MAP[ad.offer.type];
  advertDomObject.querySelector('h4 + p').textContent = roomsAvailable + ' для ' + guestsAvailable;
  advertDomObject.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  advertDomObject.querySelector('p:last-of-type').textContent = ad.offer.description;
  advertDomObject.querySelector('.popup__avatar').src = ad.author.avatar;

  var templateFeaturesDomObject = advertDomObject.querySelector('.popup__features');
  var templatePicturesDomObject = advertDomObject.querySelector('.popup__pictures');

  var featuresDomObject = createFeaturesDomObject(ad.offer.features);
  var picturesDomObject = createPicturesDomObject(ad.offer.photos);

  advertDomObject.replaceChild(featuresDomObject, templateFeaturesDomObject);
  advertDomObject.replaceChild(picturesDomObject, templatePicturesDomObject);
  addCloseAdvertInfoHandlers(advertDomObject);

  var mapCard = mapDomObject.querySelector('article.map__card');

  if (mapCard) {
    mapCard.remove();
  }

  mapDomObject.insertBefore(advertDomObject, mapFiltersContainerDomObject);
};

var createMapPinDomObject = function (ad) {
  var pinButtonDomObject = document.createElement('button');
  var pinImgDomObject = document.createElement('img');

  pinButtonDomObject.style.left = ad.location.x + 'px';
  pinButtonDomObject.style.top = ad.location.y + 'px';
  pinButtonDomObject.classList.add('map__pin');
  pinImgDomObject.src = ad.author.avatar;
  pinImgDomObject.width = PIN_WIDTH;
  pinImgDomObject.height = PIN_HEIGHT;
  pinImgDomObject.draggable = false;
  pinButtonDomObject.appendChild(pinImgDomObject);

  return pinButtonDomObject;
};

var addRenderAdvertInfoHandler = function (pinButton, ad) {
  pinButton.addEventListener('click', function () {
    renderAdvertInfo(ad);
  });
};

var renderAdvertPins = function (ads) {
  var fragmentDomObject = document.createDocumentFragment();
  var mapPinDomObject;
  var adsLength = ads.length;

  for (var i = 0; i < adsLength; i++) {
    mapPinDomObject = createMapPinDomObject(ads[i]);
    addRenderAdvertInfoHandler(mapPinDomObject, ads[i]);
    fragmentDomObject.appendChild(mapPinDomObject);
  }

  mapPinsDomObject.appendChild(fragmentDomObject);
};

var disableAdvertForm = function () {
  var fieldsetsNumber = avdertFormFieldsets.length;

  for (var i = 0; i < fieldsetsNumber; i++) {
    if (avdertFormFieldsets[i].tagName === 'FIELDSET') {
      avdertFormFieldsets[i].disabled = true;
    }
    avdertFormDomObject.classList.add('notice__form--disabled');
  }
};

var enableAdvertForm = function () {
  var fieldsetsNumber = avdertFormFieldsets.length;

  for (var i = 0; i < fieldsetsNumber; i++) {
    if (avdertFormFieldsets[i].tagName === 'FIELDSET') {
      avdertFormFieldsets[i].disabled = false;
    }
    avdertFormDomObject.classList.remove('notice__form--disabled');
  }
  advertAddressInputDomObject.disabled = true;
};

var getPinCoordinates = function (pin) {
  var x = parseInt(pin.offsetLeft, 10);
  var y = parseInt(pin.offsetTop, 10);

  if (MAP_IS_ACTIVE) {
    y = pin.classList.contains('map__pin--main') ? y + MAIN_PIN_OFFSET_Y : y + PIN_OFFSET_Y;
  }

  return [x, y];
};

var setAdvertAddress = function () {
  var mainPinCoords = getPinCoordinates(mainPinDomObject);
  var advertAddress = mainPinCoords[0] + ', ' + mainPinCoords[1];

  advertAddressInputDomObject.value = advertAddress;
};

var activateMap = function () {
  if (!MAP_IS_ACTIVE) {
    mapDomObject.classList.remove('map--faded');
    enableAdvertForm();
    renderAdvertPins(adverts);
    MAP_IS_ACTIVE = true;
  }
};

var adverts = generateAdverts();

disableAdvertForm();
setAdvertAddress();
mainPinDomObject.addEventListener('mouseup', function () {
  activateMap();
  setAdvertAddress();
});
