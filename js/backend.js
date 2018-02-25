'use strict';

(function () {
  var TIMEOUT = 10000;
  var SEND_URL = 'https://js.dump.academy/keksobooking';
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var ErrorMessage = {
    SEND_BASE: 'При попытке отправить данные на сервер произошла ошибка:',
    LOAD_BASE: 'При попытке получить данные с сервера произошла ошибка:',
    HTTP_ANNEX: 'http код ошибки:',
    NETWORK_ANNEX: 'сервер не доступен по сети. Проверьте сетевые настройки и подключение к интернету.',
    TIMEOUT_ANNEX: 'запрос не был выполнен за отведенное время:'
  };

  var getXhrObject = function (onLoad, onError, isSendAction) {
    var xhr = new XMLHttpRequest();
    var errorMessageBase = isSendAction ? ErrorMessage.SEND_BASE : ErrorMessage.LOAD_BASE;

    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        var httpErrorMessage = [errorMessageBase, ErrorMessage.HTTP_ANNEX, xhr.status, xhr.statusText].join(' ');

        onError(httpErrorMessage);
      }
    });

    xhr.addEventListener('error', function () {
      var networkErrorMessage = [errorMessageBase, ErrorMessage.NETWORK_ANNEX].join(' ');

      onError(networkErrorMessage);
    });

    xhr.addEventListener('timeout', function () {
      var timeoutErrorMessage = [errorMessageBase, ErrorMessage.TIMEOUT_ANNEX, xhr.timeout / 1000, 'секунд'].join(' ');

      onError(timeoutErrorMessage);
    });

    return xhr;
  };

  var send = function (data, onLoad, onError) {
    var xhr = getXhrObject(onLoad, onError, true);

    xhr.open('POST', SEND_URL);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    var xhr = getXhrObject(onLoad, onError, false);

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  window.backend = {
    load: load,
    send: send,
  };
})();
