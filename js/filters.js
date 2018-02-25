'use strict';

(function () {
  var PRICE_FILTER = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: Infinity
    }
  };

  var filterFunc = function (ads, rawFilters) {
    var filter = getFilterObject(rawFilters);
    var filterFeatures = filter.features;
    var filterSelects = Object.keys(filter.select);

    var filtered = ads.filter(function (ad) {
      var advertFeatures = ad.offer.features;

      var featuresOk = filterFeatures.every(function (feature) {
        return advertFeatures.indexOf(feature) !== -1;
      });

      var selectOk = filterSelects.every(function (option) {
        if (option === 'price') {
          var priceFilterMin = PRICE_FILTER[filter.select.price].min;
          var priceFilterMax = PRICE_FILTER[filter.select.price].max;

          return window.util.numberIsInRange(ad.offer.price, priceFilterMin, priceFilterMax);
        }

        return ad.offer[option].toString() === filter.select[option];
      });

      return featuresOk && selectOk;
    });

    return filtered;
  };

  var getFilterObject = function (rawFilters) {
    var features = [];
    var select = {};
    var selectNameRegexp = /housing-(.*)/;

    rawFilters.forEach(function (field) {
      switch (field.tagName) {
        case 'INPUT':
          if (field.checked) {
            features.push(field.value);
          }
          break;
        case 'SELECT':
          if (field.value !== 'any') {
            var filterName = selectNameRegexp.exec(field.name)[1];
            select[filterName] = field.value;
          }
          break;
      }
    });

    return {features: features, select: select};
  };

  window.filters = {
    filter: filterFunc
  };
})();
