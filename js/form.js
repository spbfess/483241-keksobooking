'use strict';

(function () {
  var MIN_PRICE_MAP = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  var MAX_ROOMS_NUMBER = 100;
  var PHOTO_PREVIEW_WIDTH = 200;

  var advertFormDomObject = document.querySelector('.notice__form');
  var advertFormFieldsets = advertFormDomObject.querySelectorAll('fieldset');
  var advertFormFields = advertFormDomObject.querySelectorAll('select, input');
  var advertFormAccommodationDomObject = advertFormDomObject.querySelector('#type');
  var advertFormPriceDomObject = advertFormDomObject.querySelector('#price');
  var advertFormTimeInDomObject = advertFormDomObject.querySelector('#timein');
  var advertFormTimeOutDomObject = advertFormDomObject.querySelector('#timeout');
  var advertFormRoomNumberDomObject = advertFormDomObject.querySelector('#room_number');
  var advertFormCapacityDomObject = advertFormDomObject.querySelector('#capacity');
  var advertFormResetDomObject = advertFormDomObject.querySelector('button.form__reset');
  var advertFormAddressDomObject = advertFormDomObject.querySelector('#address');
  var avatarFileChooserDomObject = advertFormDomObject.querySelector('#avatar');
  var avatarDomObject = advertFormDomObject.querySelector('.notice__preview img');
  var defaultAvatarImage = avatarDomObject.src;
  var photoContainerDomObject = advertFormDomObject.querySelector('.form__photo-container');
  var photoPreviewsDomObject = photoContainerDomObject.querySelector('.photo__previews');
  var photoFileChooserDomObject = photoContainerDomObject.querySelector('#images');

  var disableAdvertForm = function () {
    advertFormFieldsets.forEach(function (fieldset) {
      fieldset.disabled = true;
    });

    advertFormDomObject.classList.add('notice__form--disabled');
  };

  var setAdvertAddress = function (address) {
    var advertAddress = address.x + ', ' + address.y;

    advertFormAddressDomObject.value = advertAddress;
  };

  var enableAdvertForm = function (initialAddress) {
    advertFormFieldsets.forEach(function (fieldset) {
      fieldset.disabled = false;
    });

    advertFormDomObject.classList.remove('notice__form--disabled');
    advertFormAddressDomObject.readOnly = true;
    setAdvertAddress(initialAddress);
  };

  var resetAdvertForm = function (initialAddress) {
    clearInvalidityStyleOnAllFields();
    clearRenderedImages();
    advertFormDomObject.reset();
    setMinPrice();
    setAdvertAddress(initialAddress);
    disableAdvertForm();
  };

  var setDrivenTime = function (drivingTime) {
    var drivenTime = (drivingTime === advertFormTimeInDomObject) ? advertFormTimeOutDomObject : advertFormTimeInDomObject;
    drivenTime.selectedIndex = drivingTime.selectedIndex;
  };

  var syncCheckInOutTime = function () {
    advertFormTimeInDomObject.addEventListener('change', function (evt) {
      setDrivenTime(evt.target);
    });
    advertFormTimeOutDomObject.addEventListener('change', function (evt) {
      setDrivenTime(evt.target);
    });
  };

  var setMinPrice = function () {
    var accommodation = advertFormAccommodationDomObject.value;
    var minPrice = MIN_PRICE_MAP[accommodation];

    advertFormPriceDomObject.min = minPrice;
    advertFormPriceDomObject.placeholder = minPrice;
  };

  var setMinPriceOnAccommodationChange = function () {
    advertFormAccommodationDomObject.addEventListener('change', function () {
      setMinPrice();
    });
  };

  var setCapacityValidity = function () {
    var roomsNumber = parseInt(advertFormRoomNumberDomObject.value, 10);
    var capacity = parseInt(advertFormCapacityDomObject.value, 10);
    var failed = false;
    var message;

    if (capacity === 0 || roomsNumber === MAX_ROOMS_NUMBER) {
      if (!(capacity === 0 && roomsNumber === MAX_ROOMS_NUMBER)) {
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
    advertFormRoomNumberDomObject.addEventListener('change', function () {
      setCapacityValidity();
    });

    advertFormCapacityDomObject.addEventListener('change', function () {
      setCapacityValidity();
    });
  };

  var addInvalidityStyle = function (element) {
    element.style.border = '3px solid red';
  };

  var clearInvalidityStyle = function (element) {
    element.style.border = '';
  };

  var clearInvalidityStyleOnAllFields = function () {
    advertFormFields.forEach(function (field) {
      clearInvalidityStyle(field);
    });
  };

  var getAdverFromSendObject = function () {
    return new FormData(advertFormDomObject);
  };

  var renderPhotoPreviews = function(photoPreviews) {
    var fragment = document.createDocumentFragment();
    var templatePhotosElementDomObject = document.createElement('li');
    var templatePhotoDomObject = document.createElement('img');

    templatePhotosElementDomObject.draggable = true;
    templatePhotosElementDomObject.classList.add('photo__preview');
    templatePhotoDomObject.width = PHOTO_PREVIEW_WIDTH;
    templatePhotosElementDomObject.appendChild(templatePhotoDomObject);

    photoPreviews.forEach(function(photoPreview, index) {
      var photosElementDomObject = templatePhotosElementDomObject.cloneNode(true);

      photosElementDomObject.firstElementChild.src = photoPreview;
      photosElementDomObject.firstElementChild.data_id = index;
      fragment.append(photosElementDomObject);
    });

    photoPreviewsDomObject.innerHTML = '';
    photoPreviewsDomObject.appendChild(fragment);
  };

  var clearRenderedImages =  function () {
    photoPreviewsDomObject.innerHTML = '';
    avatarDomObject.src = defaultAvatarImage;
  };

  var initializeAdvertForm = function (onAdvertFormResetClick, onAdvertFormSubmit) {
    syncCheckInOutTime();
    setMinPriceOnAccommodationChange();
    validateCapacity();

    advertFormDomObject.addEventListener('invalid', function (evt) {
      addInvalidityStyle(evt.target);
    }, true);

    advertFormDomObject.addEventListener('input', function (evt) {
      clearInvalidityStyle(evt.target);
    });

    avatarFileChooserDomObject.addEventListener('change', function () {
      var files = Array.prototype.slice.call(avatarFileChooserDomObject.files);

      window.file.createPreviews(files, function (avatarPreview) {
        avatarDomObject.src = avatarPreview[0];
      });
    });

    photoFileChooserDomObject.addEventListener('change', function () {
      var files = Array.prototype.slice.call(photoFileChooserDomObject.files);

      window.file.createPreviews(files, renderPhotoPreviews);
    });

    advertFormResetDomObject.addEventListener('click', onAdvertFormResetClick);
    advertFormDomObject.addEventListener('submit', onAdvertFormSubmit);
  };


  var draggedPhotosElementDomObject = null;

  var onPhotoPreviewsDrop = function (evt) {
    if (evt.target.classList.contains('photo__preview')) {
      if (draggedPhotosElementDomObject !== evt.target) {
        draggedPhotosElementDomObject.style.opacity = 1;
        evt.target.classList.remove('photo__preview--dragover');

        var tempDragged = draggedPhotosElementDomObject.cloneNode(true);
        var tempDropped = evt.target.cloneNode(true);

        photoPreviewsDomObject.replaceChild(tempDragged, evt.target);
        photoPreviewsDomObject.replaceChild(tempDropped, draggedPhotosElementDomObject);
      }
    }

    return false;
  };

  photoPreviewsDomObject.addEventListener('dragstart', function (evt) {
    if (evt.target.classList.contains('photo__preview')) {
      draggedPhotosElementDomObject = evt.target;
      evt.target.style.opacity = '0.4';
    }
  });
  photoPreviewsDomObject.addEventListener('dragenter', function (evt) {
    evt.target.classList.add('photo__preview--dragover');
  });
  photoPreviewsDomObject.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';

    return false;
  });
  photoPreviewsDomObject.addEventListener('dragleave', function (evt) {
    evt.target.classList.remove('photo__preview--dragover');
  });
  photoPreviewsDomObject.addEventListener('dragend', function (evt) {
    evt.target.classList.remove('photo__preview--dragover');
    evt.target.style.opacity = 1;

  });
  photoPreviewsDomObject.addEventListener('drop', onPhotoPreviewsDrop);

  window.form = {
    enable: enableAdvertForm,
    initialize: initializeAdvertForm,
    getSendObject: getAdverFromSendObject,
    reset: resetAdvertForm,
    setAddress: setAdvertAddress,
  };
})();
