'use strict';

(function () {
  var ModalCssClass = {
    ERROR: 'modal__error',
    INFO: 'modal__info',
    SHOW: 'modal__show'
  };
  var ModalDisplayTime = {
    ERROR: 7000,
    INFO: 5000
  };

  var modalDomObject = document.querySelector('.modal');

  var displayModalWindow = function (message, isError) {
    var modalTypeClass = isError ? ModalCssClass.ERROR : ModalCssClass.INFO;
    var displayTime = isError ? ModalDisplayTime.ERROR : ModalDisplayTime.INFO;

    modalDomObject.textContent = message;
    modalDomObject.classList.add(ModalCssClass.SHOW, modalTypeClass);

    window.setTimeout(function () {
      modalDomObject.classList.remove(ModalCssClass.SHOW, modalTypeClass);
      modalDomObject.textContent = '';
    }, displayTime);
  };

  window.modal = {
    display: displayModalWindow
  };
})();
