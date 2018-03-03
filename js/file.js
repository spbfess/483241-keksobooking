'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var previewFile = function (fileChooser, preview, onLoad) {
    var previews = [];

    Array.prototype.forEach.call(fileChooser.files, function (file) {
      console.log('!!!');
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          onLoad(reader.result);


          // console.log(typeof reader.result);
          // previews.push(reader.result);
          // console.log('listener: array[0]: ', previews[0]);
        });

        reader.readAsDataURL(file);
      }
    });
    // console.log('array is', previews[0]);
    // return previews;
  };

  window.file = {
    preview: previewFile
  };
})();
