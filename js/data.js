(function () {
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
  var RANGE_PRICES = [1000, 1000000];
  var RANGE_ROOMS = [1, 5];
  var RANGE_GUESTS = [1, 10];
  var ADVERTS_NUMBER = 8;
  var RANGE_PIN_COORDINATES = {
    'X': [300, 900],
    'Y': [150, 500]
  };
  var PIN_OFFSET_Y = 35;

  var getRandomAdvert = function () {
    var randomAvatarNumber = util.getRandomElement(AVATAR_NUMBERS, true);
    var randomTitle = util.getRandomElement(TITLES, true);
    var randomApartmentType = util.getRandomElement(ACCOMMODATION_TYPES, false);
    var randomCheckinTime = util.getRandomElement(CHECKIN_TIMES, false);
    var randomCheckoutTime = util.getRandomElement(CHECKOUT_TIMES, false);
    var randomFeatures = util.getShuffledAndSlicedArray(FEATURES, util.getRandomInteger(0, FEATURES.length, true));
    var randomPhotos = util.getShuffledArray(PHOTOS);
    var randomPrice = util.getRandomInteger(RANGE_PRICES[0], RANGE_PRICES[1], true);
    var randomRoomsNumber = util.getRandomInteger(RANGE_ROOMS[0], RANGE_ROOMS[1], true);
    var randomGuestsNumber = util.getRandomInteger(RANGE_GUESTS[0], RANGE_GUESTS[1], true);
    var randomLocation = {
      'x': util.getRandomInteger(RANGE_PIN_COORDINATES.X[0], RANGE_PIN_COORDINATES.X[1], true),
      'y': util.getRandomInteger(RANGE_PIN_COORDINATES.Y[0], RANGE_PIN_COORDINATES.Y[1], true) - PIN_OFFSET_Y
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

  window.data = {
    ACCOMMODATION_MAP: ACCOMMODATION_MAP,
    generateAdverts: generateAdverts
  };
}) ();
