'use strict';

(function () {
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

  var getRandomAdvert = function () {
    var randomAvatarNumber = window.util.getRandomElement(AVATAR_NUMBERS, true);
    var randomTitle = window.util.getRandomElement(TITLES, true);
    var randomApartmentType = window.util.getRandomElement(ACCOMMODATION_TYPES, false);
    var randomCheckinTime = window.util.getRandomElement(CHECKIN_TIMES, false);
    var randomCheckoutTime = window.util.getRandomElement(CHECKOUT_TIMES, false);
    var randomFeatures = window.util.getShuffledAndSlicedArray(FEATURES, window.util.getRandomInteger(0, FEATURES.length, true));
    var randomPhotos = window.util.getShuffledArray(PHOTOS);
    var randomPrice = window.util.getRandomInteger(RANGE_PRICES[0], RANGE_PRICES[1], true);
    var randomRoomsNumber = window.util.getRandomInteger(RANGE_ROOMS[0], RANGE_ROOMS[1], true);
    var randomGuestsNumber = window.util.getRandomInteger(RANGE_GUESTS[0], RANGE_GUESTS[1], true);
    var randomLocation = {
      'x': window.util.getRandomInteger(RANGE_PIN_COORDINATES.X[0], RANGE_PIN_COORDINATES.X[1], true),
      'y': window.util.getRandomInteger(RANGE_PIN_COORDINATES.Y[0], RANGE_PIN_COORDINATES.Y[1], true)
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
    generateAdverts: generateAdverts
  };
})();
