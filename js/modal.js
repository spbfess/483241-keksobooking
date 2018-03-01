'use strict';

(function () {
  var ModalClass = {
    ERROR: 'modal__error',
    INFO: 'modal__info',
    SHOW: 'modal__show'
  };
  var ModalDisplayTime = {
    ERROR: 7000,
    INFO: 5000
  };

  var modalDomObject = document.querySelector('.modal');

  var openModal = function (message, isError) {
    var modalTypeClass = isError ? ModalClass.ERROR : ModalClass.INFO;
    var displayTime = isError ? ModalDisplayTime.ERROR : ModalDisplayTime.INFO;

    modalDomObject.textContent = message;
    modalDomObject.classList.add(ModalClass.SHOW, modalTypeClass);

    setTimeout(function () {
      modalDomObject.classList.remove(ModalClass.SHOW, modalTypeClass);
      modalDomObject.textContent = '';
    }, displayTime);
  };

  window.modal = {
    open: openModal
  };
})();
