'use strict';
angular.module('gg.heatmap')
.directive('heatmap', function (HeatmapHelper, $window, $timeout) {
  return {
    template: '<div class="heatmap-container"></div>',
    restrict: 'EA',
    replace: true,
    scope: {
      zeroColor: '@',
      colors: '=',
      matrix: '=',
      colLabels: '=',
      rowLabels: '=',
      options: '='
    },
    link: function (scope, elem) {
      var drawTimeout = null,
      drawDelay = HeatmapHelper.drawDelay,
      options = HeatmapHelper.getOptions(scope.options);

      function draw() {
        //to avoid multiple draws, we'll alaways make sure no changes we're made within 300 ms until redrawing
        $timeout.cancel(drawTimeout);
        elem.addClass('heatmap-resizing');
        drawTimeout = $timeout(function () {
          console.log('Drawing');
          HeatmapHelper.renderMap(elem, scope.matrix, scope.colors, scope.colors.length, scope.colLabels || [], scope.rowLabels || [], scope.options);
          elem.removeClass('heatmap-resizing');
        }, drawDelay);
      }
      scope.$watch('colors', function (colors) {
        draw();
      }, true);

      scope.$watch('matrix', function (matrix) {
        draw();
      }, true);

      if (options.response){
        angular.element($window).bind('resize', function () {
          scope.$apply(draw);
        });
      }

    }
  };
});
