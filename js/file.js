'use strict';

(function () {
  var VALID_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'bmp'];

  var definePreviewScope = function (files, matches) {
    files.forEach(function (file) {
      var fileName = file.name.toLowerCase();
      var valid = VALID_FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (valid) {
        matches.push(file);
      }
    });
  };

  var createPreviewFiles = function (files, onLoad) {
    var matches = [];
    var results = [];
    var matched;

    definePreviewScope(files, matches);
    matched = matches.length;

    var onPictureLoad = function (evt) {
      results.push(evt.target.result);

      if (results.length === matched) {
        onLoad(results);
      }

      evt.target.removeEventListener('load', onPictureLoad);
    };

    matches.forEach(function (match) {
      var reader = new FileReader();

      reader.addEventListener('load', onPictureLoad);
      reader.readAsDataURL(match);
    });
  };

  window.file = {
    createPreviews: createPreviewFiles
  };
})();
