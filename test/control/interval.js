"use strict";

var neume = require("../../src");

describe("neume.Interval", function() {
  var context = null;

  beforeEach(function() {
    context = new neume.Context(new global.AudioContext().destination, {
      scheduleInterval: 0.05, scheduleAheadTime: 0.05, scheduleOffsetTime: 0.00
    });
  });

  describe("constructor", function() {
    it("(context: neume.Context, interval: timevalue, callback: function)", function() {
      assert(new neume.Interval(context, 1, NOP) instanceof neume.Interval);
    });
  });

  describe("#start", function() {
    it("(startTime: timevalue): neume.Interval", function() {
      var sched = new neume.Interval(context, 1, NOP);

      useTimer(context, function() {
        assert(sched.start() === sched);
      });
    });
  });

  describe("#stop", function() {
    it("(startTime: timevalue): neume.Interval", function() {
      var sched = new neume.Interval(context, 1, NOP);

      useTimer(context, function() {
        assert(sched.stop() === sched);
      });
    });
  });

  it("works", function() {
    var passed = null;
    var sched = new neume.Interval(context, 0.05, function(e) {
      assert(this === sched);
      passed = e;
    });

    useTimer(context, function(tick) {
      context.start();

      assert(passed === null);

      sched.stop(0.095);
      sched.start(0.195);
      sched.start(0.095);
      sched.stop(0.390);

      tick(50);
      assert(passed === null, "00:00.050");

      tick(50);
      assert(passed === null, "00:00.100");

      tick(50);
      assert(passed === null, "00:00.150");

      tick(50);
      assert(passed !== null, "00:00.200");
      assert(passed.count === 0, "00:00.200");
      assert(passed.done === false, "00:00.200");
      assert(closeTo(passed.playbackTime, 0.195, 1e-6), "00:00.200");

      tick(50);
      assert(passed !== null, "00:00.250");
      assert(passed.count === 1, "00:00.250");
      assert(passed.done === false, "00:00.250");
      assert(closeTo(passed.playbackTime, 0.245, 1e-6), "00:00.250");

      tick(50);
      assert(passed.count === 2, "00:00.300");
      assert(passed.done === false, "00:00.300");
      assert(closeTo(passed.playbackTime, 0.295, 1e-6), "00:00.300");

      tick(50);
      assert(passed.count === 3, "00:00.350");
      assert(passed.done === false, "00:00.350");
      assert(closeTo(passed.playbackTime, 0.345, 1e-6), "00:00.350");

      tick(50);
      assert(passed.count === 3, "00:00.400");
      assert(passed.done === false, "00:00.400");
      assert(closeTo(passed.playbackTime, 0.345, 1e-6), "00:00.400");
    });
  });

});
