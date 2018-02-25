'use strict';

(function () {
  var filterFunc = function (ads, rawFilters) {
    var filter = getFilterObject(rawFilters);
    var filterFeatures = filter.features;

    console.log(ads);

    var filtered = ads.filter(function (ad) {
      var advertFeatures = ad.offer.features;

      return filterFeatures.every(function (feature) {
        return advertFeatures.indexOf(feature) !== -1;
      });
    });
    console.log(filtered);
    return filtered;
  };

  var getFilterObject = function (rawFilters) {
    var features = []
    var select = {};
    var selectNameRegexp = /housing-(.*)/;

    rawFilters.forEach(function (field) {
      switch (field.tagName) {
        case 'INPUT':
          if (field.checked) {
            features.push(field.value);
          };
          break;
        case 'SELECT':
          if (field.value !== 'any') {
            var filterName = selectNameRegexp.exec(field.name)[1];
            select[filterName] = field.value;
          };
          break;
      }
    });
    console.log({features, select});
    return {features, select};
  }

  window.filters = {
    filter: filterFunc
  }
})();
