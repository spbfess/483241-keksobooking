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
  var ACCOMMODATION_PHOTO_TITLE = 'Фотография жилья №';

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
  var draggedPhotosElementDomObject = null;

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

  var getPreviews = function () {
    return Array.prototype.slice.call(photoPreviewsDomObject.querySelectorAll('img'), 0);
  };

  var dataURItoFile = function (dataURI, fileName) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var dataTypedArray = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      dataTypedArray[i] = byteString.charCodeAt(i);
    }

    return new File([dataTypedArray], fileName, {type: mimeString, lastModified: new Date()});
  };

  var getAdverFromSendObject = function () {
    var sendData = new FormData(advertFormDomObject);
    var previews = getPreviews();
    var files = [];

    sendData.delete('photos');

    previews.forEach(function (preview) {
      var file = dataURItoFile(preview.src, preview.dataset.fname);

      files.push(file);
    });

    sendData.append('photos', files);
    return sendData;
  };

  var renderPhotoPreviews = function (photoPreviews) {
    var fragment = document.createDocumentFragment();
    var templatePhotosElementDomObject = document.createElement('li');
    var templatePhotoDomObject = document.createElement('img');

    templatePhotosElementDomObject.draggable = true;
    templatePhotosElementDomObject.classList.add('photo__preview');
    templatePhotoDomObject.width = PHOTO_PREVIEW_WIDTH;
    templatePhotosElementDomObject.appendChild(templatePhotoDomObject);

    photoPreviews.forEach(function (photoPreview, index) {
      var photosElementDomObject = templatePhotosElementDomObject.cloneNode(true);

      photosElementDomObject.firstElementChild.src = photoPreview;
      photosElementDomObject.firstElementChild.alt = ACCOMMODATION_PHOTO_TITLE + index;
      photosElementDomObject.firstElementChild.dataset.fname = 'file_' + index;
      fragment.append(photosElementDomObject);
    });

    photoPreviewsDomObject.innerHTML = '';
    photoPreviewsDomObject.appendChild(fragment);
  };

  var clearRenderedImages = function () {
    photoPreviewsDomObject.innerHTML = '';
    avatarDomObject.src = defaultAvatarImage;
  };

  var removePhotoPreviewsDragAndDropHandlers = function () {
    photoPreviewsDomObject.removeEventListener('dragenter', onPhotoPreviewsDragEnter);
    photoPreviewsDomObject.removeEventListener('dragover', onPhotoPreviewsDragOver);
    photoPreviewsDomObject.removeEventListener('dragleave', onPhotoPreviewsDragLeave);
    photoPreviewsDomObject.removeEventListener('dragend', onPhotoPreviewsDragEnd);
    photoPreviewsDomObject.removeEventListener('drop', onPhotoPreviewsDrop);
  };

  var removePhotoPreviewsDragStyleEffects = function (target) {
    target.classList.remove('photo__preview--dragover');
    draggedPhotosElementDomObject.classList.remove('photo__preview--dragged');

    Array.prototype.forEach.call(photoPreviewsDomObject.children, function (child) {
      child.classList.remove('photo__preview--dragging');
    });
  };

  var onPhotoPreviewsDragStart = function (evt) {
    if (evt.target.classList.contains('photo__preview')) {
      draggedPhotosElementDomObject = evt.target;
      evt.target.classList.add('photo__preview--dragged');
      evt.dataTransfer.setData('text/plain', evt.target.alt);

      Array.prototype.forEach.call(photoPreviewsDomObject.children, function (child) {
        child.classList.add('photo__preview--dragging');
      });

      photoPreviewsDomObject.addEventListener('dragenter', onPhotoPreviewsDragEnter);
      photoPreviewsDomObject.addEventListener('dragover', onPhotoPreviewsDragOver);
      photoPreviewsDomObject.addEventListener('dragleave', onPhotoPreviewsDragLeave);
      photoPreviewsDomObject.addEventListener('dragend', onPhotoPreviewsDragEnd);
      photoPreviewsDomObject.addEventListener('drop', onPhotoPreviewsDrop);
    }
  };

  var onPhotoPreviewsDragEnter = function (evt) {
    evt.preventDefault();
    evt.target.classList.add('photo__preview--dragover');
  };

  var onPhotoPreviewsDragOver = function (evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';

    return false;
  };

  var onPhotoPreviewsDragLeave = function (evt) {
    evt.preventDefault();
    evt.target.classList.remove('photo__preview--dragover');
  };

  var onPhotoPreviewsDragEnd = function (evt) {
    evt.preventDefault();
    removePhotoPreviewsDragStyleEffects(evt.target);
    removePhotoPreviewsDragAndDropHandlers();
  };

  var onPhotoPreviewsDrop = function (evt) {
    evt.preventDefault();

    if (evt.target.classList.contains('photo__preview')) {
      if (draggedPhotosElementDomObject !== evt.target) {
        removePhotoPreviewsDragStyleEffects(evt.target);

        var cloneDraggedDomObject = draggedPhotosElementDomObject.cloneNode(true);
        var cloneDroppedDomObject = evt.target.cloneNode(true);

        photoPreviewsDomObject.replaceChild(cloneDraggedDomObject, evt.target);
        photoPreviewsDomObject.replaceChild(cloneDroppedDomObject, draggedPhotosElementDomObject);
        removePhotoPreviewsDragAndDropHandlers();
        draggedPhotosElementDomObject = null;
      }
    }

    return false;
  };

  var initializeAdvertFormHandlers = function (onAdvertFormResetClick, onAdvertFormSubmit) {
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
      // var files = avatarFileChooserDomObject.files;

      window.file.createPreviews(files, function (avatarPreview) {
        avatarDomObject.src = avatarPreview[0];
      });
    });

    photoFileChooserDomObject.addEventListener('change', function () {
      var files = Array.prototype.slice.call(photoFileChooserDomObject.files);
      // var files = photoFileChooserDomObject.files;

      window.file.createPreviews(files, renderPhotoPreviews);
    });

    photoPreviewsDomObject.addEventListener('dragstart', onPhotoPreviewsDragStart);
    advertFormResetDomObject.addEventListener('click', onAdvertFormResetClick);
    advertFormDomObject.addEventListener('submit', onAdvertFormSubmit);
  };

  window.form = {
    enable: enableAdvertForm,
    initializeHandlers: initializeAdvertFormHandlers,
    getSendObject: getAdverFromSendObject,
    reset: resetAdvertForm,
    setAddress: setAdvertAddress,
  };
})();
