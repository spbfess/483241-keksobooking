'use strict';

(function () {
  var VALID_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'bmp'];

  var definePreviewScope = function (files) {
    files.forEach(function (file, index, array) {

      var fileName = file.name.toLowerCase();
      var valid = VALID_FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (!valid) {
        array.splice(index, 1);
      }
    });
  };

  var createPreviewFiles = function (files, onLoad) {
    var results = [];

    definePreviewScope(files);

    var onPictureLoad = function (evt) {
      results.push(evt.target.result);

      if (files.length === 0) {
        onLoad(results);
      }

      evt.target.removeEventListener('load', onPictureLoad);
    };

    files.slice(0).forEach(function () {
      var reader = new FileReader();
      var file = files.shift();

      reader.addEventListener('load', onPictureLoad);
      reader.readAsDataURL(file);
    });
  };

  window.file = {
    createPreviews: createPreviewFiles
  };
})();
