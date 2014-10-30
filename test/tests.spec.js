'use strict';
describe('Service', function () {
  var HeatmapHelper;
  var m1 = [[1, 2], [3, 4]],
  m2 = [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]],
  m3 = [[{value: 120, tooltip:'Test'}, 123, 123], [235, 234, 234], [502, 234, 233]];
  beforeEach(function () {
    module('gg.heatmap');
    inject(function ($injector) {
      HeatmapHelper = $injector.get('HeatmapHelper');
    });
  });
  it('should have the HeatmapHelper', function () {
    expect(HeatmapHelper).toBeDefined();
  });

  it('calculates min and max', function () {
    expect(HeatmapHelper.getMatrixMinMax(m1)).toEqual({min: 1, max:4});
    expect(HeatmapHelper.getMatrixMinMax(m3)).toEqual({min: 120, max: 502});
  });

  it('takes a matrix and slots number and calculates an array that represents the ranges', function () {
    expect(HeatmapHelper.createRangesArray(m1, 2)).toEqual([1, 4]);
    expect(HeatmapHelper.createRangesArray(m1, 4)).toEqual([1, 2, 3, 4]);
    expect(HeatmapHelper.createRangesArray(m3)).toEqual([120, 215.5, 311, 406.5, 502]);
  });

  it('calculate single range for indentical values', function () {
    expect(HeatmapHelper.createRangesArray(m2, 2)).toEqual([1]);
    expect(HeatmapHelper.createRangesArray(m2, 200)).toEqual([1]);
    expect(HeatmapHelper.createRangesArray(m2, 123)).toEqual([1]);
  });

  it('calculates the range slot of a value', function () {
    expect(HeatmapHelper.getRangeSlotFromValue(2, [1, 2, 3, 4])).toBe(0);
    expect(HeatmapHelper.getRangeSlotFromValue(2.5, [1, 2, 3, 4])).toBe(1);
    expect(HeatmapHelper.getRangeSlotFromValue(500, [0, 200, 400, 600])).toBe(2);
    expect(function () {
      return HeatmapHelper.getRangeSlotFromValue(601, [0, 200, 400, 600]);
    }).toThrow('value cannot be outside of the range');
    expect(function () {
      return HeatmapHelper.getRangeSlotFromValue(601, []);
    }).toThrow('ranges must be given');

    expect(HeatmapHelper.getRangeSlotFromValue(350, HeatmapHelper.createRangesArray(m3))).toBe(2);
  });

  it('should render a map cube', function () {
    var cube1 = HeatmapHelper.createCube(15, '#0044ff', 50, {top: 10, left: 20}),
        cube2 = HeatmapHelper.createCube(20, '#202020', {width: 20, height: 30}, {top: 10, left: 20});

    expect(cube1.css('width')).toBe('50px');
    expect(cube1.css('height')).toBe('50px');
    expect(cube2.css('width')).toBe('20px');
    expect(cube2.css('height')).toBe('30px');
    expect(cube1.attr('value')).toBe('15');
  });

});
