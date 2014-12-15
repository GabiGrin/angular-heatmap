'use strict';
angular.module('gg.heatmap')
.provider('HeatmapHelper', function HeatmapHelper() {

  var defaultOptions = {
    width: null,
    height: null,
    heightRatio: 0.8,
    cellSize: null,
    margin: 4,
    tooltipDelay: 500,
    labelsFontSize: {
      rows: 12,
      cols: 12
    },
    labelsContainerSize: {
      rows: 50,
      cols: 20
    },
    responsive: true
  };

  function _getMeasure(elm, measure) {
    var size = elm.css(measure);
    return size && size.replace ? parseInt(size.replace('px', '')) : 0;
  }

  function getWidth(elm) {
    return _getMeasure(elm, 'width');
  }

  function getHeight(elm) {
    return _getMeasure(elm, 'height');
  }

  this.setDefaultOptions = function (options) {
    defaultOptions = angular.copy(options);
  };

  this.$get = function () {
    return {
      drawDelay: 1,
      cubeTemplate: '<div class="heatmap-cube-container" style="width: $width$;height: $height$;top: $top$; left:$left$;" ><div class="heatmap-cube" style="background-color:$color$" value="$value$" title="$tooltip$"><span style="line-height:$height$">$value$</span></div></div>',
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
    fontSize = cellSize.width * ratio,
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
  getOptions: function (givenOptions) {
    return angular.extend({}, defaultOptions, givenOptions);
  },
  calculateCubeSize: function (elemWidth, rows, options) {
    if (options.cellSize) {
      if (options.cellSize.width) {
        return angular.copy(options.cellSize);
      } else {
        return {width: options.cellSize, height: options.cellSize};
      }
    } else {
      var cellWidth = (elemWidth - (rows - 1) * options.margin) / rows;
      var cellHeight = cellWidth * options.heightRatio;
      return {width: parseInt(cellWidth), height: parseInt(cellHeight)};
    }
  },
  createColsLabels: function (labels, totalWidth, rowsLabelsWidth, options) {
    var className = 'heatmap-labels columns';
    var labelWidth = totalWidth / labels.length;
    var container = angular.element('<div>');
    container.addClass(className);

    if (labels.length) {
      container.css('width', totalWidth + 'px')
      .css('height', options.labelsContainerSize.cols + 'px')
      .css('line-height', options.labelsContainerSize.cols + 'px')
      .css('left', rowsLabelsWidth + 'px')
      .css('top', 0);
      angular.forEach(labels, function (label, idx) {
        var labelDom = angular.element('<div>')
        .addClass('heatmap-label label-column')
        .css('width', labelWidth + 'px')
        .css('left', labelWidth * idx + 'px');
        var labelSpan = angular.element('<span>')
        .addClass('label-value')
        .text(label);

        container.append(labelDom.append(labelSpan));
      });
    }
    return container;
  },
  createRowsLabels: function (labels, totalHeight, colsLabelsWidth, options) {
    var className = 'heatmap-labels rows';
    var labelHeight = totalHeight / labels.length;
    var container = angular.element('<div>');
    container.addClass(className);

    if (labels.length) {
      container.css('height', totalHeight + 'px')
      .css('width', options.labelsContainerSize.rows + 'px')
      .css('top', colsLabelsWidth + 'px')
      .css('left', 0);
      angular.forEach(labels, function (label, idx) {
        var labelDom = angular.element('<div>')
        .addClass('heatmap-label label-row')
        .text(label)
        .css('height', labelHeight + 'px')
        .css('top', labelHeight * idx + 'px');
        container.append(labelDom);
      });
    }
    return container;
  },
  calculateMatrixContainerSize: function (cols, rows, cubeSize, margin) {
    return {
      width: parseInt(cols * (cubeSize.width + margin) - margin),
      height: parseInt(rows * (cubeSize.height + margin) - margin)
    };
  },
  createMatrixContainer: function (width, height) {
    return angular.element('<div>')
    .addClass('heatmap-matrix-container')
    .css('width', width + 'px')
    .css('height', height + 'px');
  },
  renderMatrixContainer: function (colors, slots, matrix, cellSize, margin) {
    var rows = matrix.length;
    var cols = matrix[0].length;
    var containerSize = this.calculateMatrixContainerSize(cols, rows, cellSize, margin);
    var container = this.createMatrixContainer(containerSize.width, containerSize.height);
    var _this = this;
    var ranges = _this.createRangesArray(matrix, slots + 1);
    var tooltipErrorShown = false;

    container.css('fontSize', this.calcualteFontSize(cellSize));

    angular.forEach(matrix, function (row, rowIndex) {
      angular.forEach(row, function (cellObj, colIndex) {
        var cellValue = _this.getCellValue(cellObj),
        tooltip = cellObj && cellObj.tooltip,
        slot = _this.getRangeSlotFromValue(cellValue, ranges),
        color = colors[slot],
        position = {
          left: colIndex * (cellSize.width + margin),
          top: rowIndex * (cellSize.height + margin)
        },
        cube = _this.createCube(cellValue, color, cellSize, position, tooltip);
        cube.addClass('heatmap-range-' + slot);
        if (tooltip) {
          try {
            $(cube).tooltip({container: 'body', delay: {show: defaultOptions.tooltipDelay}});
          } catch (e) {
            if (!tooltipErrorShown) {
              console.error('jquery and bootstrap.js are required to display tooltips!');
            }
          }
        }
        container.append(cube);
      });
    });
    return container;
  },
  renderMap: function renderMap(elem, matrix, colors, slots, colLabels, rowLabels, givenOptions) {
    var _this = this;
    var options = _this.getOptions(givenOptions);
    var colLabelsHeight = colLabels.length ? options.labelsContainerSize.cols : 0;
    var rowLabelsWidth = rowLabels.length ? options.labelsContainerSize.rows : 0;

    var ranges = _this.createRangesArray(matrix, slots + 1);
    var containerWidth = elem.width();
    var rows = matrix[0].length;
    var margin = options.margin;
    console.log('margin', margin);
    var cellSize = _this.calculateCubeSize(elem.width() - rowLabelsWidth, rows, options);
    var renderedMatrix = _this.renderMatrixContainer(colors, slots, matrix, cellSize, margin);
    var height = getHeight(renderedMatrix) + colLabelsHeight;
    console.log('rs,', rowLabelsWidth, containerWidth);
    var columnLabelsContainer = _this.createColsLabels(colLabels, getWidth(renderedMatrix), rowLabelsWidth, options);
    var rowsLabelContainer = _this.createRowsLabels(rowLabels, height - colLabelsHeight, colLabelsHeight, options);

    console.log('bb', height, colLabelsHeight);
    elem.empty();
    elem.css('height', height);
    renderedMatrix.css('top', colLabelsHeight + 'px');
    renderedMatrix.css('left', rowLabelsWidth + 'px');

    elem.append(columnLabelsContainer);
    elem.append(rowsLabelContainer);
    //create matrix of cubes
    elem.append(renderedMatrix);
  }

};
};
});
