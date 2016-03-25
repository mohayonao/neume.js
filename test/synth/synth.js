"use strict";

var neume = require("../../src");

neume.use(require("../../src/ugen"));

describe("neume.Synth", function() {
  var audioContext = null;
  var context = null;

  beforeEach(function() {
    audioContext = new global.AudioContext();
    context = new neume.Context(audioContext.destination, {
      scheduleInterval: 0.05, scheduleAheadTime: 0.05, scheduleOffsetTime: 0.00
    });
  });

  describe("constructor", function() {
    it("(context: neume.Context, func: function, args:Array<any>)", function() {
      assert(new neume.Synth(context, NOP, []) instanceof neume.Synth);
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
    });
  });

  describe("#context", function() {
    it("\\getter: neume.Context", function() {
      var synth = new neume.Synth(context, NOP, []);

      assert(synth.context instanceof neume.SynthContext);
    });
  });

  describe("#methods", function() {
    it("\\getter: Array<string>", sinon.test(function() {
      var synth = new neume.Synth(context, function($) {
        return $("iter", $("env"));
      }, []);

      assert.deepEqual(synth.methods, [ "next", "release" ]);
    }));
  });

  describe("#hasClass", function() {
    it("(className: string): boolean", function() {
      var synth = new neume.Synth(context, function($) {
        return $([ $("sin.foo"), $("sin.bar") ]);
      }, []);

      assert(synth.hasClass("foo") === true);
      assert(synth.hasClass("bar") === true);
      assert(synth.hasClass("baz") === false);
    });
  });

  describe("#query", function() {
    it("(selector: string): Array<neume.UGen>", function() {
      var a, b, c, d, spy;
      var synth = new neume.Synth(context, function($) {
        a = $("sin");
        b = $("tri");
        c = $("sin");
        d = $("iter");
        spy = sinon.spy(a, "on");
        return $("+", a, b, c, d);
      }, []);

      assert.deepEqual(synth.query("sin").slice(), [ a, c ]);
      assert.deepEqual(synth.query("tri").slice(), [ b ]);
      assert.deepEqual(synth.query("saw").slice(), []);

      assert(synth.query("sin").on("foo", it).slice(), [ a, c ]);
      assert(synth.query("sin").next().slice(), [ a, c ]);
      assert(spy.calledOnce);
      assert(spy.calledWith("foo", it));
    });
  });

  describe("#start", function() {
    it("([startTime: timevalue]): self", sinon.test(function() {
      var synth = new neume.Synth(context, NOP, []);

      assert(synth.start() === synth);
    }));
    it("calls each ugen._unit.start(t) only once", function() {
      var onstart = sinon.spy();
      var synth = new neume.Synth(context, function($) {
        return $("+", $("sin"), $("sin"), $("sin"));
      }, []).on("start", onstart);

      var ugens = synth._db.all();
      ugens.forEach(function(ugen) {
        sinon.spy(ugen._unit, "start");
      });

      ugens.forEach(function(ugen) {
        assert(ugen._unit.start.called === false, "00:00.000");
      });

      useTimer(context, function(tick) {
        synth.start(1.000);
        synth.start(1.250);

        tick(500);
        ugens.forEach(function(ugen) {
          assert(ugen._unit.start.called === false, "00:00.500");
        });

        tick(500);
        ugens.forEach(function(ugen) {
          assert(ugen._unit.start.called === true, "00:01.000");
          assert(ugen._unit.start.calledOnce === true, "00:01.000");
          assert.deepEqual(ugen._unit.start.firstCall.args, [ 1 ]);
        });

        tick(500);
        ugens.forEach(function(ugen) {
          assert(ugen._unit.start.calledTwice === false, "00:01.500");
        });

        assert(onstart.calledOnce);
        assert(onstart.calledWith({
          type: "start",
          playbackTime: 1.000
        }));
      });
    });
  });

  describe("#stop", function() {
    it("([startTime: timevalue]): self", sinon.test(function() {
      var synth = new neume.Synth(context, NOP, []);

      assert(synth.stop() === synth);
    }));
    it("calls each ugen._unit.stop(t) only once with calling start first", function() {
      var onstop = sinon.spy();
      var synth = new neume.Synth(context, function($) {
        return $("+", $("sin"), $("sin"), $("sin"));
      }, []).on("stop", onstop);

      var ugens = synth._db.all();
      ugens.forEach(function(ugen) {
        sinon.spy(ugen._unit, "stop");
      });

      ugens.forEach(function(ugen) {
        assert(ugen._unit.stop.called === false, "00:00.000");
      });

      useTimer(context, function(tick) {
        synth.stop(0.000);
        synth.start(1.000);
        synth.stop(2.000);

        tick(500);
        ugens.forEach(function(ugen) {
          assert(ugen._unit.stop.called === false, "00:00.500");
        });

        tick(500);
        ugens.forEach(function(ugen) {
          assert(ugen._unit.stop.called === false, "00:01.000");
        });

        tick(500);
        ugens.forEach(function(ugen) {
          assert(ugen._unit.stop.called === false, "00:01.500");
        });

        tick(500);
        ugens.forEach(function(ugen) {
          assert(ugen._unit.stop.calledOnce === true, "00:02.000");
          assert.deepEqual(ugen._unit.stop.firstCall.args, [ 2 ]);
        });

        tick(500);

        assert(onstop.calledOnce);
        assert(onstop.calledWith({
          type: "stop",
          playbackTime: 2.000
        }));
      });
    });
  });

  describe("#trig", function() {
    it("(startTime: timevalue): self", function() {
      var spy1, spy2;
      var synth = new neume.Synth(context, function($) {
        var a = $("sin"), b = $("saw");
        spy1 = sinon.spy(a, "trig");
        spy2 = sinon.spy(b, "trig");
        return $("+", a, b);
      });

      assert(synth.trig(0.5) === synth);

      assert(spy1.calledOnce);
      assert(spy1.calledWith(0.5));
      assert(spy2.calledOnce);
      assert(spy2.calledWith(0.5));
    });
  });

  describe("#fadeIn", function() {
    it("([startTime: timevalue, duration: timevalue]): self", function() {
      var synth = new neume.Synth(context, NOP, []);

      useTimer(context, function() {
        assert(synth.fadeIn() === synth);
      });
    });
    it("works", function() {
      var synth = new neume.Synth(context, function($) {
        return $("sin");
      }, []);

      var outlet = synth.toAudioNode();

      useTimer(context, function(tick) {
        synth.fadeIn(1.000, 2);
        synth.fadeIn(1.250, 5);

        tick(5000);
      });

      assert(closeTo(outlet.gain.$valueAtTime(1.000), 0.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.250), 0.125, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.500), 0.250, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.750), 0.375, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.000), 0.500, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.250), 0.625, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.500), 0.750, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.750), 0.875, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.000), 1.000, 1e-2));
    });
  });

  describe("#fadeOut", function() {
    it("([startTime: timevalue, duration: timevalue]): self", function() {
      var synth = new neume.Synth(context, NOP, []);
      useTimer(context, function() {
        synth.start();
      });
      assert(synth.fadeOut() === synth);
    });
    it("works", function() {
      var synth = new neume.Synth(context, function($) {
        return $("sin");
      }, []);

      var outlet = synth.toAudioNode();

      useTimer(context, function(tick) {
        synth.fadeOut(0.000, 2);
        synth.start(1.000);
        synth.fadeOut(2.000, 2);

        tick(5000);
      });

      assert(closeTo(outlet.gain.$valueAtTime(1.000), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.250), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.500), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.750), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.000), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.250), 0.875, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.500), 0.750, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.750), 0.625, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.000), 0.500, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.250), 0.375, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.500), 0.250, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.750), 0.125, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(4.000), 0.000, 1e-2));
    });
  });

  describe("#fade", function() {
    it("([startTime: timevalue, value: number, duration: timevalue]): self", function() {
      var synth = new neume.Synth(context, NOP, []);
      useTimer(context, function() {
        synth.start();
      });
      assert(synth.fade() === synth);
    });
    it("works", function() {
      var synth = new neume.Synth(context, function($) {
        return $("sin");
      }, []);

      var outlet = synth.toAudioNode();

      useTimer(context, function(tick) {
        synth.fade(0.000, 0.5, 2);
        synth.start(1.000);
        synth.fade(2.000, 0.5, 2);

        tick(5000);
      });

      assert(closeTo(outlet.gain.$valueAtTime(1.000), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.250), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.500), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(1.750), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.000), 1.000, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.250), 0.937, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.500), 0.875, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(2.750), 0.812, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.000), 0.750, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.250), 0.687, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.500), 0.625, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(3.750), 0.562, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(4.000), 0.500, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(4.500), 0.500, 1e-2));
      assert(closeTo(outlet.gain.$valueAtTime(5.000), 0.500, 1e-2));
    });
  });

  describe("#toAudioNode", function() {
    it("(index: number): AudioNode", function() {
      var synth = new neume.Synth(context, function($) {
        $("sin").$("out", { bus: 1 });
        return $("sin");
      });

      assert(synth.toAudioNode(0) instanceof global.AudioNode);
      assert(synth.toAudioNode(1) instanceof global.AudioNode);
      assert(synth.toAudioNode(2) === null);
      assert(synth.toAudioNode(0) === synth.toAudioNode(0));
      assert(synth.toAudioNode(1) === synth.toAudioNode(1));
      assert(synth.toAudioNode(0) !== synth.toAudioNode(1));
    });
  });

  describe("#_dispatchNode", function() {
    it("(node: signal, index: number)", function() {
      var synth = new neume.Synth(context, function($) {
        $("sin", { freq: 220 }).$("out", { bus: 0 });
        $("sin", { freq: 660 }).$("out", { bus: 0 });
      });

      // This method is ignored when not constructor.
      synth._dispatchNode(context.createBufferSource());

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          OSCILLATOR("sine", 220),
          OSCILLATOR("sine", 660),
        ]
      });
    });
  });

  describe("method bindings", function() {
    it("works", function() {
      var synth = new neume.Synth(context, function($) {
        return $("sin").$("env");
      });

      assert(synth.release() === synth);
      assert(synth.release(0) === synth);
    });
  });

});
