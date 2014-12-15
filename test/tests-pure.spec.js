'use strict';

function toInt(num){
  return parseInt(num, 10);
}

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
    var cube1Container = HeatmapHelper.createCube(15, '#0044ff', 50, {top: 10, left: 20}),
    cube2Container = HeatmapHelper.createCube(20, '#202020', {width: 20, height: 30}, {top: 10, left: 20});

    var cube1 = cube1Container.find('div');
    var cube2 = cube2Container.find('div');

    expect(cube1Container.css('width')).toBe('50px');
    expect(cube1Container.css('height')).toBe('50px');
    expect(cube2Container.css('width')).toBe('20px');
    expect(cube2Container.css('height')).toBe('30px');
    expect(cube1Container.find('div').attr('value')).toBe('15');
  });

  it('calculates the size of the cube correctly when it is given', function (){
    var elemWidth = 100;
    var givenOptions = {cellSize: 25};
    var options = HeatmapHelper.getOptions(givenOptions);
    var size = HeatmapHelper.calculateCubeSize(elemWidth, 10, options);

    expect(size).toEqual({width:25, height:25});

    givenOptions = {cellSize: {width: 40, height: 35}};
    options = HeatmapHelper.getOptions(givenOptions);
    size = HeatmapHelper.calculateCubeSize(elemWidth, 10, options);

    expect(size).toEqual({width:40, height:35});
  });

  it('should calculate the size of the matrix container', function(){
    expect(HeatmapHelper.calculateMatrixContainerSize(10, 10, {width: 20, height: 20}, 1))
      .toEqual({width: 209, height: 209});

  expect(HeatmapHelper.calculateMatrixContainerSize(5, 15, {width: 10, height: 20}, 1))
      .toEqual({width: 54, height: 314});

  });

  it('creates a matrix container', function() {
    var container1 = HeatmapHelper.createMatrixContainer(100,200);
    expect(container1.css('width')).toBe('100px');
    expect(container1.css('height')).toBe('200px');
  });

  it('renders a matrix container', function(){
    var matrix1 = [[1, 2, 3], [4, 6, 7]];
    var matrix2 = [[1, 2], [2, 5], [4, 6]];
    var matrix3 = [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4 ,4 ,4 ,4]];
    var colors = ['red', 'yellow'];
    var slots = colors.length;
    var margin = 2;

    var cubeSize1 = {width: 10, height: 10};
    var cubeSize2 = {width: 5, height: 10};
    var cubeSize3 = {width: 20, height: 10};

    var rendered1 = HeatmapHelper.renderMatrixContainer(colors, slots, matrix1, cubeSize1, margin);
    var rendered2 = HeatmapHelper.renderMatrixContainer(colors, slots, matrix2, cubeSize2, margin);
    var rendered3 = HeatmapHelper.renderMatrixContainer(colors, slots, matrix3 , cubeSize3, margin);

    expect(rendered1.children().length).toBe(6);
    expect(rendered2.children().length).toBe(6);
    expect(rendered3.children().length).toBe(16);

  });


  it('should calculate the size of the cube', function (){
    var elemWidth = 400;
    var givenOptions = {margin: 0};
    var options = HeatmapHelper.getOptions(givenOptions);
    var size = HeatmapHelper.calculateCubeSize(elemWidth, 10, options);

    expect(size).toEqual({width:40, height: toInt(40 * options.heightRatio)});

    givenOptions = {margin: 1};
    options = HeatmapHelper.getOptions(givenOptions);
    size = HeatmapHelper.calculateCubeSize(elemWidth, 10, options);

    expect(size).toEqual({width:39, height:  toInt(39 * options.heightRatio)});

    givenOptions = {margin: 2};
    options = HeatmapHelper.getOptions(givenOptions);
    size = HeatmapHelper.calculateCubeSize(elemWidth, 10, options);

    expect(size).toEqual({width:38, height: toInt(38 * options.heightRatio)});


    givenOptions = {margin: 2, heightRatio: 0.5};
    options = HeatmapHelper.getOptions(givenOptions);
    size = HeatmapHelper.calculateCubeSize(elemWidth, 10, options);

    expect(size).toEqual({width:38, height: 19});
  });



  it('should create column labels container', function (){
    var labels = [];
    var givenOptions = {};
    var labelsContainer = HeatmapHelper.createColsLabels(labels, 100, 20, HeatmapHelper.getOptions(givenOptions));

    expect(labelsContainer.children().length).toBe(0);
    expect(labelsContainer.css('height')).toBe('');
    expect(labelsContainer.css('top')).toBe('');
    expect(labelsContainer.css('left')).toBe('');


    labels = ['a', 'b', 'c', 'd'];
    labelsContainer = HeatmapHelper.createColsLabels(labels, 100, 20, HeatmapHelper.getOptions(givenOptions));
    expect(labelsContainer.css('height')).toBe('20px');
    expect(labelsContainer.css('left')).toBe('20px');

    labelsContainer = HeatmapHelper.createColsLabels(labels, 100, 0, HeatmapHelper.getOptions(givenOptions));
    expect(labelsContainer.css('left')).toBe('0px');
  });

  it('should create children column labels', function (){
    var labels = [];
    var givenOptions = {};
    var labelsContainer = HeatmapHelper.createColsLabels(labels, 100, 20, HeatmapHelper.getOptions(givenOptions));
    expect(labelsContainer.children().length).toBe(0);

    labels = ['a', 'b', 'c', 'd'];
    labelsContainer = HeatmapHelper.createColsLabels(labels, 100, 20, HeatmapHelper.getOptions(givenOptions));
    expect(labelsContainer.children().length).toBe(4);

    angular.forEach(labelsContainer.children(), function(child, idx){
      var elem = angular.element(child);
      expect(elem.css('width')).toBe('25px');
      expect(elem.text()).toBe(labels[idx]);
      expect(elem.css('left')).toBe(idx * 25 + 'px');
    });
  });

    it('should create rows labels container', function (){
    var labels = [];
    var givenOptions = {};
    var options = HeatmapHelper.getOptions(givenOptions);
    var labelsContainer = HeatmapHelper.createRowsLabels(labels, 100, 20, HeatmapHelper.getOptions(givenOptions));

    expect(labelsContainer.children().length).toBe(0);
    expect(labelsContainer.css('width')).toBe('');
    expect(labelsContainer.css('top')).toBe('');
    expect(labelsContainer.css('left')).toBe('');


    labels = ['a', 'b', 'c', 'd'];
    labelsContainer = HeatmapHelper.createRowsLabels(labels, 100, 20, HeatmapHelper.getOptions(givenOptions));
    expect(labelsContainer.css('width')).toBe(options.labelsContainerSize.rows + 'px');
    expect(labelsContainer.css('top')).toBe(options.labelsContainerSize.cols + 'px');

    labelsContainer = HeatmapHelper.createRowsLabels(labels, 100, 0, HeatmapHelper.getOptions(givenOptions));
    expect(labelsContainer.css('top')).toBe('0px');
  });

  it('should create children column labels', function (){
    var labels = [];
    var givenOptions = {};
    var labelsContainer = HeatmapHelper.createRowsLabels(labels, 100, 20, HeatmapHelper.getOptions(givenOptions));
    expect(labelsContainer.children().length).toBe(0);

    labels = ['a', 'b', 'c', 'd'];
    labelsContainer = HeatmapHelper.createRowsLabels(labels, 100, 20, HeatmapHelper.getOptions(givenOptions));
    expect(labelsContainer.children().length).toBe(4);

    angular.forEach(labelsContainer.children(), function(child, idx){
      var elem = angular.element(child);
      expect(elem.css('height')).toBe('25px');
      expect(elem.text()).toBe(labels[idx]);
      expect(elem.css('top')).toBe(idx * 25 + 'px');
    });
  });

});
