'use strict';
angular.module('gg.heatmap', []);
;'use strict';
angular.module('gg.heatmap')
.directive('heatmap', function (HeatmapHelper, $window, $timeout) {
  return {
    template: '<div class="heatmap-container"></div>',
    restrict: 'EA',
    replace: true,
    scope: {
      zeroColor: '@',
      colors: '=',
      matrix: '='
    },
    link: function (scope, elem) {
      var drawTimeout = null,
          drawDelay = HeatmapHelper.drawDelay;
      function draw() {
        //to avoid multiple draws, we'll alaways make sure no changes we're made within 300 ms until redrawing
        $timeout.cancel(drawTimeout);
        elem.addClass('heatmap-resizing');
        drawTimeout = $timeout(function () {
          console.log('Drawing');
          HeatmapHelper.renderMap(elem, scope.matrix, scope.colors, scope.colors.length);
          elem.removeClass('heatmap-resizing');
        }, drawDelay);
      }
      scope.$watch('colors', function (colors) {
        draw();
      }, true);

      scope.$watch('matrix', function (matrix) {
        draw();
      }, true);

      angular.element($window).bind('resize', function () {
        scope.$apply(draw);
      });

    }
  };
});
;'use strict';
angular.module('gg.heatmap')
.factory('HeatmapHelper', function HeatmapHelper() {
  return {
    drawDelay: 1,
    cubeTemplate: '<div class="heatmap-cube" style="width: $width$;height: $height$;top: $top$; left:$left$; background-color:$color$" value="$value$" title="$tooltip$"><span style="line-height:$height$">$value$</span></div>',
    defaultZeroColor: '#fffff',
    defaultColors: ['#a4fba6', '#4ae54a', '#30cb00', '#0f9200', '#006203'],
    randomData: function (rows, cols, min, max) {
      var matrix = [];
      min = min || 0;
      max = max || 100;
      rows = rows || 7;
      cols = cols || 10;
      for (var i = 0; i < rows; i++) {
        matrix.push([]);
        for (var j = 0;j < cols; j++) {
          var val = min + parseInt(Math.random() * Math.random() * (max - min));
          matrix[i].push(j % 2 ? val : {value: val, tooltip: 'Value is: ' + val});
        }
      }
      return matrix;
    },
    getMatrixMinMax: function (matrix) {
     var max = -9007199254740992,
     min = 9007199254740992,
     _this = this;

     angular.forEach(matrix, function (row) {
      angular.forEach(row, function (cell) {
        var val = _this.getCellValue(cell);
        if (val > max) {
          max = val;
        }

        if (val < min) {
          min = val;
        }
      });
    });

     return {min: min, max:max};
   },
   createRangesArray: function (matrix, slots) {
     var minMax = this.getMatrixMinMax(matrix),
     range = minMax.max - minMax.min,
     ranges = [];
     slots = slots || 5;

      //all are the same we just have one range..
     if (!range) {
       ranges = [minMax.min];
     } else {
        //first and last range will always be min and max, so all that is left is to create the inner values
       for (var i = 0; i < slots;i++) {
         ranges.push(minMax.min + i * range / (slots - 1));
       }
     }
     return ranges;
   },
    getRangeSlotFromValue: function (value, ranges) {
      if (!ranges || !ranges.length) {
        throw 'ranges must be given';
      }
      for (var i = 0;i < ranges.length - 1;i++) {
        if (value >= ranges[i] && value <= ranges[i + 1]) {
          return i;
        }
      }
      throw 'value cannot be outside of the range';
    },
    calcualteFontSize: function (cellSize) {
      var ratio = 0.4,
          fontSize = cellSize * ratio,
          min = 7;
      return (fontSize > min ? fontSize : min) + 'px';
    },
    getCellValue: function (cell) {
      return cell && cell.value !== undefined ? cell.value : cell;
    },
    createCube: function (val, color, size, position, tooltip) {

      var html = this.cubeTemplate
                  .replace(/\$value\$/g, val)
                  .replace(/\$width\$/g, (size.width || size) + 'px')
                  .replace(/\$height\$/g, (size.height || size) + 'px')
                  .replace(/\$top\$/g, (position.top) + 'px')
                  .replace(/\$left\$/g, (position.left) + 'px')
                  .replace(/\$color\$/g, color)
                  .replace(/\$tooltip\$/g, tooltip || '');
      var elem = angular.element(html);
      if (val === null) {
        elem.css('display', 'none');
      }

      return elem;
    },
    renderMap: function renderMap(elem, matrix, colors, slots) {
      var _this = this;
      var marginRatio = 0.9;
      var minMargin = 1;
      var maxMargin = 10;
      var ranges = _this.createRangesArray(matrix, slots + 1);
      var containerWidth = elem.width();
      var rows = matrix[0].length;
      var cellSize = parseInt(containerWidth / rows);
      var margin = Math.min(Math.max(parseInt((1 - marginRatio) * cellSize), minMargin), maxMargin);
      var cubeSize = cellSize - margin;
      var height = matrix.length * (cubeSize + margin);

      elem.empty();
      elem.css('height', height);
      elem.css('fontSize', _this.calcualteFontSize(cubeSize));
      angular.forEach(matrix, function (row, rowIndex) {
        angular.forEach(row, function (cellObj, colIndex) {
          var cellValue = _this.getCellValue(cellObj),
              tooltip = cellObj && cellObj.tooltip,
              slot = _this.getRangeSlotFromValue(cellValue, ranges),
              color = colors[slot],
              position = {left: colIndex * (cubeSize + margin), top: rowIndex * (cubeSize + margin)},
              cube = _this.createCube(cellValue, color, cubeSize, position, tooltip);
          cube.addClass('heatmap-range-' + slot);
          if (tooltip) {
            try {
              $(cube).tooltip({container: 'body'});
            } catch (e) {
              console.error('jquery and bootstrap.js are required to display tooltips!');
            }
          }
          elem.append(cube);
        });
      });
    }
  };
});
