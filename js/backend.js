'use strict';

(function () {
  var TIMEOUT = 10000;
  var HTTP_STATUS_OK = 200;
  var SEND_URL = 'https://js.dump.academy/keksobooking';
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var StatusMessage = {
    ERROR_SEND_BASE: 'При попытке отправить данные на сервер произошла ошибка:',
    ERROR_LOAD_BASE: 'При попытке получить данные с сервера произошла ошибка:',
    ERROR_HTTP_ANNEX: 'http код ошибки:',
    ERROR_NETWORK_ANNEX: 'сервер не доступен по сети. Проверьте сетевые настройки и подключение к интернету.',
    ERROR_TIMEOUT_ANNEX: 'запрос не был выполнен за отведенное время:',
    SUCCESS: 'Данные успешно загружены на сервер'
  };

  var getXhrObject = function (onLoad, onError, isSendAction) {
    var xhr = new XMLHttpRequest();
    var errorMessageBase = isSendAction ? StatusMessage.ERROR_SEND_BASE : StatusMessage.ERROR_LOAD_BASE;

    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_OK) {
        if (isSendAction) {
          onLoad(StatusMessage.SUCCESS);
        } else {
          onLoad(xhr.response);
        }
      } else {
        var httpStatusMessage = [errorMessageBase, StatusMessage.ERROR_HTTP_ANNEX, xhr.status, xhr.statusText].join(' ');

        onError(httpStatusMessage);
      }
    });

    xhr.addEventListener('error', function () {
      var networkStatusMessage = [errorMessageBase, StatusMessage.ERROR_NETWORK_ANNEX].join(' ');

      onError(networkStatusMessage);
    });

    xhr.addEventListener('timeout', function () {
      var timeoutStatusMessage = [errorMessageBase, StatusMessage.ERROR_TIMEOUT_ANNEX, xhr.timeout / 1000, 'секунд'].join(' ');

      onError(timeoutStatusMessage);
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
