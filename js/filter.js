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
  var DEBOUNCE_INTERVAL = 500;

  var filtersFormDomObject = document.querySelector('.map__filters');
  var filtersFormFields = filtersFormDomObject.querySelectorAll('select, input');
  var debounceFiltration = window.debounce.getFunction(DEBOUNCE_INTERVAL);

  var getAdsFiltered = function (ads) {
    var adFilter = getAdFilterObject();
    var filterFeatures = adFilter.features;
    var filterSelects = Object.keys(adFilter.select);

    var filteredAds = ads.filter(function (ad) {
      var advertFeatures = ad.offer.features;

      var featuresFiltrationPassed = filterFeatures.every(function (feature) {
        return advertFeatures.indexOf(feature) !== -1;
      });

      var selectFiltrationPassed = filterSelects.every(function (option) {
        if (option === 'price') {
          var priceFilterMin = PRICE_FILTER[adFilter.select.price].min;
          var priceFilterMax = PRICE_FILTER[adFilter.select.price].max;

          return window.util.numberIsInRange(ad.offer.price, priceFilterMin, priceFilterMax);
        }

        return ad.offer[option].toString() === adFilter.select[option];
      });

      return featuresFiltrationPassed && selectFiltrationPassed;
    });

    return filteredAds;
  };

  var getAdFilterObject = function () {
    var features = [];
    var select = {};
    var selectNamePattern = /housing-(.*)/;

    filtersFormFields.forEach(function (field) {
      switch (field.tagName) {
        case 'INPUT':
          if (field.checked) {
            features.push(field.value);
          }
          break;
        case 'SELECT':
          if (field.value !== 'any') {
            var filterName = selectNamePattern.exec(field.name)[1];
            select[filterName] = field.value;
          }
          break;
      }
    });

    return {features: features, select: select};
  };

  var disableFiltersForm = function () {
    filtersFormFields.forEach(function (field) {
      field.disabled = true;
    })
  };

  var enableFiltersForm = function () {
    filtersFormFields.forEach(function (field) {
      field.disabled = false;
    })
  };

  var setChangeHandler = function (adverts, applyFiltration) {
    filtersFormDomObject.addEventListener('change', function () {
      var filteredAds = getAdsFiltered(adverts);

      debounceFiltration(function () {
        applyFiltration(filteredAds);
      });
    });
  };

  window.filter = {
    setChangeHandler: setChangeHandler,
    enableForm: enableFiltersForm,
    disableForm: disableFiltersForm
  };
})();
