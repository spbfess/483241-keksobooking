(function () {
  'use strict';

  var PHOTO_WIDTH = 100;
  var ACCOMMODATION_MAP = {
    flat: 'Квартира',
    bungalo: 'Лачуга',
    house: 'Дом',
    palace: 'Дворец'
  };

  var mapFiltersContainerDomObject = document.querySelector('.map__filters-container');
  var mapCardTemplateDomObject = document.querySelector('template').content.querySelector('.map__card');
  var currentMapCardDomObject = null;

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
    var mapCardDomObject = document.querySelector('article.map__card');

    mapCardDomObject.remove();
    document.removeEventListener('keydown', onMapCardCloseButtonKeydown);
  };

  var onMapCardCloseButtonKeydown = function (evt) {
    if (evt.keyCode === util.ESC_CODE) {
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
    mapCardDomObject.querySelector('h4').textContent = ACCOMMODATION_MAP[ad.offer.type];
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

  var renderMapCard = function (mapDomObject, ad) {
    var mapCardDomObject = createMapCardDomObject(ad);
    addCloseMapCardHandlers(mapCardDomObject);

    if (currentMapCardDomObject !== null) {
      currentMapCardDomObject.remove();
    }

    currentMapCardDomObject = mapCardDomObject;
    mapDomObject.insertBefore(mapCardDomObject, mapFiltersContainerDomObject);
  };

  window.card = {
    renderMapCard: renderMapCard
  };
}) ();
