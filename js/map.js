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
var ACCOMMODATION_TYPES = ['flat', 'house', 'bungalo', 'palace'];
var ACCOMMODATION_MAP = {
  flat: {
    alias: 'Квартира',
    minPrice: 1000
  },
  bungalo: {
    alias: 'Лачуга',
    minPrice: 0
  },
  house: {
    alias: 'Дом',
    minPrice: 5000
  },
  palace: {
    alias: 'Дворец',
    minPrice: 10000
  }
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
var PIN_OFFSET_Y = 35;
var MAIN_PIN_OFFSET_Y = 48.5;
var ESC_CODE = 27;

var mapCardTemplateDomObject = document.querySelector('template').content.querySelector('.map__card');
var currentMapCardDomObject = null;
var mapDomObject = document.querySelector('section.map');
var mapPinsDomObject = mapDomObject.querySelector('.map__pins');
var mapFiltersContainerDomObject = mapDomObject.querySelector('.map__filters-container');
var mainPinDomObject = mapPinsDomObject.querySelector('.map__pin--main');
var avdertFormDomObject = document.querySelector('.notice__form');
var avdertFormFieldsets = avdertFormDomObject.querySelectorAll('fieldset');
var advertFormAccommodationDomObject = avdertFormDomObject.querySelector('#type');
var advertFormPriceDomObject = avdertFormDomObject.querySelector('#price');
var advertFormTimeInDomObject = avdertFormDomObject.querySelector('#timein');
var advertFormTimeOutDomObject = avdertFormDomObject.querySelector('#timeout');
var advertFormRoomNumberDomObject = avdertFormDomObject.querySelector('#room_number');
var advertFormCapacityDomObject = avdertFormDomObject.querySelector('#capacity');
var advertFormResetDomObject = avdertFormDomObject.querySelector('button.form__reset');
var advertFormAddressDomObject = avdertFormDomObject.querySelector('#address');

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
  var randomApartmentType = getRandomElement(ACCOMMODATION_TYPES, false);
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

var closeMapCard = function () {
  var mapCardDomObject = mapDomObject.querySelector('article.map__card');

  mapCardDomObject.remove();
  document.removeEventListener('keydown', onMapCardCloseButtonKeydown);
};

var onMapCardCloseButtonKeydown = function (evt) {
  if (evt.keyCode === ESC_CODE) {
    closeMapCard();
  }
};

var addCloseMapCardHandlers = function (mapCard) {
  var closeMapCardButton = mapCard.querySelector('button.popup__close');

  closeMapCardButton.addEventListener('click', function () {
    closeMapCard();
  });
  document.addEventListener('keydown', onMapCardCloseButtonKeydown);
};

var createMapCardDomObject = function (ad) {
  var mapCardDomObject = mapCardTemplateDomObject.cloneNode(true);
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

  mapCardDomObject.querySelector('h3').textContent = ad.offer.title;
  mapCardDomObject.querySelector('p').children[0].textContent = ad.offer.address;
  mapCardDomObject.querySelector('.popup__price').textContent = ad.offer.price + '₽/ночь';
  mapCardDomObject.querySelector('h4').textContent = ACCOMMODATION_MAP[ad.offer.type]['alias'];
  mapCardDomObject.querySelector('h4 + p').textContent = roomsAvailable + ' для ' + guestsAvailable;
  mapCardDomObject.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  mapCardDomObject.querySelector('p:last-of-type').textContent = ad.offer.description;
  mapCardDomObject.querySelector('.popup__avatar').src = ad.author.avatar;

  var templateFeaturesDomObject = mapCardDomObject.querySelector('.popup__features');
  var templatePicturesDomObject = mapCardDomObject.querySelector('.popup__pictures');
  var featuresDomObject = createFeaturesDomObject(ad.offer.features);
  var picturesDomObject = createPicturesDomObject(ad.offer.photos);

  mapCardDomObject.replaceChild(featuresDomObject, templateFeaturesDomObject);
  mapCardDomObject.replaceChild(picturesDomObject, templatePicturesDomObject);

  return mapCardDomObject;
};

var renderMapCard = function (ad) {
  var mapCardDomObject = createMapCardDomObject(ad);
  addCloseMapCardHandlers(mapCardDomObject);

  if (currentMapCardDomObject !== null) {
    currentMapCardDomObject.remove();
  }

  currentMapCardDomObject = mapCardDomObject;
  mapDomObject.insertBefore(mapCardDomObject, mapFiltersContainerDomObject);
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

var addRenderMapCardHandler = function (pinButton, ad) {
  pinButton.addEventListener('click', function () {
    renderMapCard(ad);
  });
};

var renderAdvertPins = function (ads) {
  var fragmentDomObject = document.createDocumentFragment();
  var mapPinDomObject;
  var adsLength = ads.length;

  for (var i = 0; i < adsLength; i++) {
    mapPinDomObject = createMapPinDomObject(ads[i]);
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

var disableAdvertForm = function () {
  var fieldsetsNumber = avdertFormFieldsets.length;

  for (var i = 0; i < fieldsetsNumber; i++) {
    avdertFormFieldsets[i].disabled = true;
  }

  avdertFormDomObject.classList.add('notice__form--disabled');
};

var enableAdvertForm = function () {
  var fieldsetsNumber = avdertFormFieldsets.length;

  for (var i = 0; i < fieldsetsNumber; i++) {
    avdertFormFieldsets[i].disabled = false;
  }

  avdertFormDomObject.classList.remove('notice__form--disabled');
  advertFormAddressDomObject.readOnly = true;
};

var resetAdvertForm = function () {
  avdertFormDomObject.reset();
  setAdvertAddress();
  disableAdvertForm();
};

var setAdvertAddress = function () {
  var mainPinCoords = getMainPinCoordinates();
  var advertAddress = mainPinCoords[0] + ', ' + mainPinCoords[1];

  advertFormAddressDomObject.value = advertAddress;
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

var setDrivenTime = function (drivingTime) {
  var drivenTime = (drivingTime === advertFormTimeInDomObject) ? advertFormTimeOutDomObject : advertFormTimeInDomObject;
  drivenTime.selectedIndex = drivingTime.selectedIndex;
};

var validateTime = function () {
  advertFormTimeInDomObject.addEventListener('input', function (evt) {
    setDrivenTime(evt.target);
  });
  advertFormTimeOutDomObject.addEventListener('input', function (evt) {
    setDrivenTime(evt.target);
  });
};

var getSelectValue = function (select) {
  var selectedIndex = select.selectedIndex;
  var selectOptions = select.children;
  var selectedValue = selectOptions[selectedIndex].value;

  return selectedValue;
};

var getSelectIntValue = function (select) {
  return parseInt(getSelectValue(select), 10);
};

var getSelectedPrice = function () {
  return parseInt(advertFormPriceDomObject.value, 10);
};

var setPriceValidity = function () {
  var currentPrice = getSelectedPrice();
  var accommodation = getSelectValue(advertFormAccommodationDomObject);
  var minPrice = ACCOMMODATION_MAP[accommodation].minPrice;

  if (currentPrice < minPrice) {
    advertFormPriceDomObject.setCustomValidity('Для данного типа жилья цена не может быть ниже ' + minPrice);
  } else {
    advertFormPriceDomObject.setCustomValidity('');
  }
};

var validatePrice = function () {
  advertFormPriceDomObject.addEventListener('input', function () {
    setPriceValidity();
  });

  advertFormAccommodationDomObject.addEventListener('input', function () {
    setPriceValidity();
  });
};

var setCapacityValidity = function () {
  var roomsNumber = getSelectIntValue(advertFormRoomNumberDomObject);
  var capacity = getSelectIntValue(advertFormCapacityDomObject);
  var failed = false;
  var message;

  if (capacity === 0 || roomsNumber === 100) {
    if (!(capacity === 0 && roomsNumber === 100)) {
      failed = true;
      message = 'Для 100 комнат единственное валидное значение кол-ва мест - не для гоcтей, и наоборот';
    }
  } else if (capacity > roomsNumber) {
    failed = true;
    message = 'Кол-во мест не может превышать кол-во комнат';
  }

  if (failed) {
    advertFormCapacityDomObject.setCustomValidity(message);
  } else {
    advertFormCapacityDomObject.setCustomValidity('');
  }
};

var validateCapacity = function () {
  advertFormRoomNumberDomObject.addEventListener('input', function () {
    setCapacityValidity();
  });

  advertFormCapacityDomObject.addEventListener('input', function () {
    setCapacityValidity();
  });
};

var validateAdvertForm = function () {
  validateTime();
  validatePrice();
  validateCapacity();
};

var adverts = generateAdverts();
var mainPinDefaultCoordinates = getMainPinCoordinates();

resetAdvertForm();

mainPinDomObject.addEventListener('mouseup', function () {
  if (!checkMapIsActive()) {
    activateMap();
    enableAdvertForm();
  }
  setAdvertAddress();
});

validateAdvertForm();
advertFormResetDomObject.addEventListener('click', function (evt) {
  evt.preventDefault();
  deactivateMap();
  resetAdvertForm();
});
