'use strict';

(function () {
  var MIN_PRICE_MAP = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };

  var advertFormDomObject = document.querySelector('.notice__form');
  var advertFormFieldsets = advertFormDomObject.querySelectorAll('fieldset');
  var advertFormAccommodationDomObject = advertFormDomObject.querySelector('#type');
  var advertFormPriceDomObject = advertFormDomObject.querySelector('#price');
  var advertFormTimeInDomObject = advertFormDomObject.querySelector('#timein');
  var advertFormTimeOutDomObject = advertFormDomObject.querySelector('#timeout');
  var advertFormRoomNumberDomObject = advertFormDomObject.querySelector('#room_number');
  var advertFormCapacityDomObject = advertFormDomObject.querySelector('#capacity');
  var advertFormResetDomObject = advertFormDomObject.querySelector('button.form__reset');
  var advertFormAddressDomObject = advertFormDomObject.querySelector('#address');

  var disableAdvertForm = function () {
    var fieldsetsNumber = advertFormFieldsets.length;

    for (var i = 0; i < fieldsetsNumber; i++) {
      advertFormFieldsets[i].disabled = true;
    }

    advertFormDomObject.classList.add('notice__form--disabled');
  };

  var setAdvertAddress = function (addressCoordinates) {
    var advertAddress = addressCoordinates[0] + ', ' + addressCoordinates[1];

    advertFormAddressDomObject.value = advertAddress;
  };

  var enableAdvertForm = function () {
    var fieldsetsNumber = advertFormFieldsets.length;

    for (var i = 0; i < fieldsetsNumber; i++) {
      advertFormFieldsets[i].disabled = false;
    }

    advertFormDomObject.classList.remove('notice__form--disabled');
    advertFormAddressDomObject.readOnly = true;
  };

  var resetAdvertForm = function (initialAdvertAddress) {
    advertFormDomObject.reset();
    setAdvertAddress(initialAdvertAddress);
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
    advertFormAccommodationDomObject.addEventListener('change', function () {
      var accommodation = advertFormAccommodationDomObject.value;
      var minPrice = MIN_PRICE_MAP[accommodation];

      advertFormPriceDomObject.min = minPrice;
    });
  };

  var setCapacityValidity = function () {
    var roomsNumber = parseInt(advertFormRoomNumberDomObject.value, 10);
    var capacity = parseInt(advertFormCapacityDomObject.value, 10);
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
    advertFormRoomNumberDomObject.addEventListener('change', function () {
      setCapacityValidity();
    });

    advertFormCapacityDomObject.addEventListener('change', function () {
      setCapacityValidity();
    });
  };

  var addInvalidStyle = function (element) {
    element.style.border = '3px solid red';
  };

  var clearInvalidStyle = function (element) {
    element.style.border = '';
  };

  var addAdvertFromResetHadler = function (resetHandler) {
    advertFormResetDomObject.addEventListener('click', resetHandler);
  };

  syncCheckInOutTime();
  setMinPrice();
  validateCapacity();

  advertFormDomObject.addEventListener('invalid', function (evt) {
    var target = evt.target;
    addInvalidStyle(target);

    if (target.validity.tooShort) {
      target.setCustomValidity('Это поле должно содержать минимум ' + target.minLength + ' символов');
    } else if (target.validity.tooLong) {
      target.setCustomValidity('Это поле не должно быть длиннее ' + target.maxLength + ' символов');
    } else if (target.validity.valueMissing) {
      target.setCustomValidity('Обязательное поле для заполнения');
    } else if (target.validity.rangeUnderflow) {
      target.setCustomValidity('Значение не может быть ниже ' + target.min);
    } else if (target.validity.rangeOverflow) {
      target.setCustomValidity('Значение не может быть выше ' + target.max);
    } else if (target !== advertFormCapacityDomObject) {
      target.setCustomValidity('');
      clearInvalidStyle(target);
    }
  }, true);

  advertFormDomObject.addEventListener('input', function (evt) {
    clearInvalidStyle(evt.target);
  });

  window.form = {
    enable: enableAdvertForm,
    setAddress: setAdvertAddress,
    reset: resetAdvertForm,
    addResetHadler: addAdvertFromResetHadler
  };
})();
