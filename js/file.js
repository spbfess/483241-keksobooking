'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // var onPictureLoad = function (evt) {
  //   // console.log('in handler - results len before: ', results.length);
  //   // console.log('in handler - incrementing results');
  //   results.push(evt.target.result);
  //   // console.log('in handler - results len after: ', results.length);

  //   evt.target.removeEventListener('load', onPictureLoad)
  // };

  // var recurseFunction = function () {
  //   console.log('now files are: ', files, ' len is: ', files.length);
  //   var file = files.shift();
  //   console.log('now file is: ', file);
  //   if (file) {
  //     console.log('file exists');
  //     var fileName = file.name.toLowerCase();
  //     var matches = FILE_TYPES.some(function (it) {
  //       return fileName.endsWith(it);
  //     });

  //     if (matches) {
  //       console.log('matches: true');
  //       var reader = new FileReader();

  //       reader.addEventListener('load', onPictureLoad);
  //       reader.readAsDataURL(file);
  //     } else {
  //       console.log('matches: false');
  //     }
  //     recurseFunction();
  //   }

  // };

  var defineScope = function (files, matches) {
    files.forEach(function (file) {
      var fileName = file.name.toLowerCase();
      var valid = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      console.log('valid: ', valid);
      if (valid) {
        matches.push(file);
      }
    });
  };

  var createPreviewFiles = function (files, onLoad) {
    var matches = [];
    var results = [];
    var matched;

    defineScope(files, matches);
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
