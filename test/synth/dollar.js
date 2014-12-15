"use strict";

var neume = require("../../src");

var NOP = function() {};

describe("neume.SynthDollar", function() {
  var audioContext = null;
  var context = null;

  beforeEach(function() {
    audioContext = new global.AudioContext();
    context = new neume.Context(audioContext.destination);
  });

  describe("$", function() {
    it("works", sinon.test(function() {
      var spy = this.spy(neume.UGen, "build");

      var synth = new neume.Synth(context, function($) {
        return $("sin", { freq: 880 }, 1, 2, 3);
      }, []);

      assert(spy.calledOnce === true);
      assert.deepEqual(spy.firstCall.args, [
        synth, "sin", { freq: 880 }, [ 1, 2, 3 ]
      ]);
    }));
    describe(".params", function() {
      it("(name:string, defaultValue: number): neume.Param", function() {
        var params = {};

        var synth = new neume.Synth(context, function($) {
          params.freq = $.param("freq", 440);
          params.amp = $.param("amp", 0.25);
          params.amp2 = $.param("amp");
        }, []);

        assert(params.freq instanceof neume.Param);
        assert(params.amp  instanceof neume.Param);
        assert(params.freq === synth.freq);
        assert(params.amp === synth.amp );
        assert(params.amp === params.amp2);

        synth.freq.value = 880;

        assert(params.freq.value === 880);
      });
      it("(invalidName:string, defaultValue: number): throw an error", function() {
        var func = function($) {
          $.param("*", Infinity);
        };

        assert.throws(function() {
          new neume.Synth(context, func, []);
        }, TypeError);
      });
    });
    describe(".timeout", function() {
      it("(timeout: number, ...callbacks: Array<function>): void", function() {
        var passed = [];
        var synth = new neume.Synth(context, function($) {
          $.timeout(0.030, function(e) {
            passed.push([ "fizz", e.playbackTime, e.count ]);
          });
          $.timeout(0.050, function(e) {
            passed.push([ "buzz", e.playbackTime, e.count ]);
          });
          $.timeout(0.150, function(e) {
            passed.push([ "fizzbuzz", e.playbackTime, e.count ]);
          });
        }, []);

        synth.start(0.010);
        synth.stop(0.100);

        audioContext.$processTo("00:00.200");

        assert.deepEqual(passed, [
          [ "fizz", 0.040, 1 ],
          [ "buzz", 0.060000000000000005, 1 ],
        ]);
      });
    });
    describe(".interval", function() {
      it("(interval: number, ...callbacks: Array<function>): void", function() {
        var passed = [];
        var synth = new neume.Synth(context, function($) {
          $.interval(0.030, function(e) {
            passed.push([ "fizz", e.playbackTime, e.count ]);
          });
          $.interval(0.050, function(e) {
            passed.push([ "buzz", e.playbackTime, e.count ]);
          });
        }, []);

        synth.start(0.010);
        synth.stop(0.100);

        audioContext.$processTo("00:00.200");

        assert.deepEqual(passed, [
          [ "fizz", 0.04, 1 ],
          [ "buzz", 0.060000000000000005, 1 ],
          [ "fizz", 0.06999999999999999, 2 ],
          [ "fizz", 0.09999999999999999, 3 ]
        ]);
      });
      it("works", function() {
        var passed = [];
        var synth = new neume.Synth(context, function($) {
          $.interval("32n", function(e) {
            passed.push([ "fizz", e.playbackTime, e.count ]);
          });
        }, []);

        synth.start(0.010);
        synth.stop(0.200);

        audioContext.$processTo("00:00.500");

        assert.deepEqual(passed, [
          [ "fizz", 0.0725, 1 ],
          [ "fizz", 0.1350, 2 ],
          [ "fizz", 0.1975, 3 ]
        ]);
      });
    });
  });
  describe(".stop", function() {
    it("(t: number|string): void", function() {
      var synth = new neume.Synth(context, function($) {
        $.stop("+0.100");
      }, []);

      var spy = sinon.spy(synth, "stop");

      synth.start(0.100);

      audioContext.$processTo("00:00.500");

      assert(spy.calledOnce);
      assert(spy.calledWith(0.100));
    });
  });

});
