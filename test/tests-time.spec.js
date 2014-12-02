//'use strict';
//
//describe('Calendar service', function () {
//  var SECOND = 1000,
//  MINUTE = SECOND * 60,
//  HOUR   = MINUTE * 60,
//  DAY    = HOUR * 24,
//  WEEK   = DAY * 7,
//  YEAR   = DAY * 365;
//
//  var TimeHeatmapHelper,
//  timeData1 = [/*todo*/],
//  timeData2 =[/*todo*/],
//  timeData3 = [/*todo*/];
//
//  beforeEach(function () {
//    module('gg.heatmap');
//    inject(function ($injector) {
//      TimeHeatmapHelper = $injector.get('TimeHeatmapHelper');
//    });
//  });
//
//  it('checks if an input is valid', function(){
//    var validInput = JSON.parse('[{"time":1415397600000,"value":143},{"time":1415433600000,"value":184},{"time":1415469600000,"value":121},{"time":1415505600000,"value":25},{"time":1415541600000,"value":158},{"time":1415577600000,"value":224},{"time":1415613600000,"value":179},{"time":1415649600000,"value":245},{"time":1415685600000,"value":160},{"time":1415721600000,"value":197}]');
//    var badInput1 = JSON.parse('[{"time":1415397600000,"value":95},{"time":1415433600000,"value":229},{"bob":1415469600000,"value":78},{"time":1415505600000,"value":248},{"bob":1415541600000,"value":228}]');
//
//    expect(function(){
//      TimeHeatmapHelper.validateInput(validInput);
//    }).not.toThrow();
//
//    expect(function(){
//      TimeHeatmapHelper.validateInput(badInput1);
//    }).toThrow('invalid data, not all points have a time value');
//  });
//
//  it('it calculates timegaps', function(){
//    var gap1 = TimeHeatmapHelper.calculateTimeUnit(DAY * 2, DAY);
//    var gap2 = TimeHeatmapHelper.calculateTimeUnit(HOUR * 2, HOUR);
//    var gap3 = TimeHeatmapHelper.calculateTimeUnit(HOUR * 10, HOUR * 9);
//
//    expect(gap1).toBe('day');
//    expect(gap2).toBe('hour');
//    expect(gap3).toBe('hour');
//  });
//
//  it('it throw errors when timegaps are different or unsupported', function(){
//      expect(function(){TimeHeatmapHelper.calculateTimeUnit(12,124)})
//      .toThrow('2 Points have unsupported timegaps!');
//      expect(function(){TimeHeatmapHelper.calculateTimeUnit(DAY * 3, DAY)})
//      .toThrow('2 Points have unsupported timegaps!');
//  });
//
//});
