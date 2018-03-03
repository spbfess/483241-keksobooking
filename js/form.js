'use strict';

(function () {
  var MIN_PRICE_MAP = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  var MAX_ROOMS_NUMBER = 100;

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

    advertFormResetDomObject.addEventListener('click', onAdvertFormResetClick);
    advertFormDomObject.addEventListener('submit', onAdvertFormSubmit);
  };

  window.form = {
    enable: enableAdvertForm,
    initialize: initializeAdvertForm,
    getSendObject: getAdverFromSendObject,
    reset: resetAdvertForm,
    setAddress: setAdvertAddress,
  };
})();
