'use strict';

(function () {
  var TIMEOUT = 10000;
  var SEND_ERROR_MESSAGE_BASE = 'При попытке отправить данные на сервер произошла ошибка:';
  var UPLOAD_ERROR_MESSAGE_BASE = 'При попытке получить данные с сервера произошла ошибка:';
  var HTTP_ERROR_MESSAGE_ANNEX = 'http код ошибки:';
  var NETWORK_ERROR_MESSAGE_ANNEX = 'Сервер не доступен по сети. Проверьте сетевые настройки и подключение к интернету.';
  var TIMEOUT_ERROR_MESSAGE_ANNEX = 'Запрос не был выполнен за отведенное время:';

  var getXhrObject = function () {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    // xhr.addEventListener('load', function () {
    //   console.log('loaded');
    //   console.log(xhr.response);
    // });

    // xhr.addEventListener('error', function () {
    //   console.log('ERROR: LOAD: network error has occurred');
    // });

    // xhr.addEventListener('timeout', function () {
    //   console.log('ERROR: LOAD: timeout of ' + xhr.timeout/1000 + 's reached');
    // });

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = getXhrObject();

    xhr.addEventListener('load', function () {
      // console.log('UPLOAD: loaded');
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        var httpErrorMessage = [UPLOAD_ERROR_MESSAGE_BASE, HTTP_ERROR_MESSAGE_ANNEX, xhr.status, xhr.statusText].join(' ');
        onError(httpErrorMessage);
      }
      // console.log(xhr.response);
    });

    xhr.addEventListener('error', function () {
      var networkErrorMessage = [UPLOAD_ERROR_MESSAGE_BASE, NETWORK_ERROR_MESSAGE_ANNEX].join(' ');
      onError(networkErrorMessage);
    });

    xhr.addEventListener('timeout', function () {
      var timeoutErrorMessage = [UPLOAD_ERROR_MESSAGE_BASE, TIMEOUT_ERROR_MESSAGE_ANNEX, xhr.timeout / 1000, 'секунд'].join(' ');
      onError(timeoutErrorMessage);
    });

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    // xhr.open('GET', url);
    xhr.send();
  };

  var send = function (data, onLoad, onError) {
    var xhr = getXhrObject();

    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {
        onLoad();
      } else {
        var httpErrorMessage = [SEND_ERROR_MESSAGE_BASE, HTTP_ERROR_MESSAGE_ANNEX, xhr.status, xhr.statusText].join(' ');
        onError(httpErrorMessage);
      }
    });

    xhr.addEventListener('error', function () {
      var networkErrorMessage = [SEND_ERROR_MESSAGE_BASE, NETWORK_ERROR_MESSAGE_ANNEX].join(' ');
      onError(networkErrorMessage);
    });

    xhr.addEventListener('timeout', function () {
      var timeoutErrorMessage = [SEND_ERROR_MESSAGE_BASE, TIMEOUT_ERROR_MESSAGE_ANNEX, xhr.timeout / 1000, 'секунд'].join(' ');
      onError(timeoutErrorMessage);
    });

    // xhr.open('POST', 'http://httpstat.us/404');
    xhr.open('POST', 'https://js.dump.academy/keksobooking');
    xhr.send(data);
  };

  var communicate = function (url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    var errorMessageBase = data ? SEND_ERROR_MESSAGE_BASE : UPLOAD_ERROR_MESSAGE_BASE;

    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        var httpErrorMessage = [errorMessageBase, HTTP_ERROR_MESSAGE_ANNEX, xhr.status, xhr.statusText].join(' ');

        onError(httpErrorMessage);
      }
    });

    xhr.addEventListener('error', function () {
      var networkErrorMessage = [errorMessageBase, NETWORK_ERROR_MESSAGE_ANNEX].join(' ');

      onError(networkErrorMessage);
    });

    xhr.addEventListener('timeout', function () {
      var timeoutErrorMessage = [errorMessageBase, TIMEOUT_ERROR_MESSAGE_ANNEX, xhr.timeout / 1000, 'секунд'].join(' ');

      onError(timeoutErrorMessage);
    });

    if (data) {
      xhr.open('POST', 'https://js.dump.academy/keksobooking');
      xhr.send(data);
    } else {
      xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
      xhr.send();
    }
  };

  var getXhrObject2 = function (isSendAction, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    var errorMessageBase = isSendAction ? SEND_ERROR_MESSAGE_BASE : UPLOAD_ERROR_MESSAGE_BASE;

    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {
        if (!isSendAction) {
          onLoad(xhr.response);
        } else {
          onLoad();
        }
      } else {
        var httpErrorMessage = [errorMessageBase, HTTP_ERROR_MESSAGE_ANNEX, xhr.status, xhr.statusText].join(' ');

        onError(httpErrorMessage);
      }
    });

    xhr.addEventListener('error', function () {
      var networkErrorMessage = [errorMessageBase, NETWORK_ERROR_MESSAGE_ANNEX].join(' ');

      onError(networkErrorMessage);
    });

    xhr.addEventListener('timeout', function () {
      var timeoutErrorMessage = [errorMessageBase, TIMEOUT_ERROR_MESSAGE_ANNEX, xhr.timeout / 1000, 'секунд'].join(' ');

      onError(timeoutErrorMessage);
    });

    return xhr;
  };

  var send2 = function (url, data, onLoad, onError) {
    var xhr = getXhrObject2(true, onLoad, onError);

    xhr.open('POST', url);
    xhr.send(data);
  };

  var load2 = function (url, onLoad, onError) {
    var xhr = getXhrObject2(false, onLoad, onError);

    xhr.open('GET', url);
    xhr.send();
  };

  window.backend = {
    load: load,
    send: send,
    send2: send2,
    load2: load2,
    communicate: communicate
  };
})();
