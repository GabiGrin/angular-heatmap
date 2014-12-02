'use strict';
angular.module('gg.heatmap')
.factory('TimeHeatmapHelper', function () {
  var SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR   = MINUTE * 60,
  DAY    = HOUR * 24,
  WEEK   = DAY * 7,
  YEAR   = DAY * 365;

  return {
    randomData: function randomData(start, min, max, gap, limit) {
      var data = [];
      var now = (new Date(start)).getTime();
      for (var i = 0;i < limit;i++) {
        data.push({time: now + gap * i, value: min + parseInt(Math.random() * max)});
      }
      return data;
    },
    timeUnits: {
      hour: HOUR,
      day:  DAY
    },
    maxTimeGap: 2,
    calculateTimeUnit: function (time2, time1) {
      var result = null;
      angular.forEach(this.timeUnits, function (timeUnit, key) {
        if (!result && (time2 - time1 === timeUnit)) {
          result = key;
        }
      });
      if (!result) {
        throw '2 Points have unsupported timegaps!';
      }
      return result;
    },
    validateInput: function (input) {
      var lastTimeUnit;
      for (var i = 0; i < input.length - 1; i++) {
        if (val && !val.time) {
          throw 'invalid data, not all points have a time value';
        }
      }
    }
  };
});
