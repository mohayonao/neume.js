"use strict";

var neume = require("../../src");

neume.use(require("../../src/ugen/osc"));
neume.use(require("../../src/ugen/add"));

describe("ugen/add", function() {
  var neu = null;

  beforeEach(function() {
    neu = neume({
      scheduleInterval: 0.05,
      scheduleAheadTime: 0.05,
      scheduleOffsetTime: 0.00,
    });
  });

  describe("graph", function() {
    it("$('+', 0)", function() {
      var synth = neu.Synth(function($) {
        return $("+", 0);
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: [],
        },
        inputs: []
      });
    });
    it("$('+', 1, 2, 3)", function() {
      var synth = neu.Synth(function($) {
        return $("+", 1, 2, 3);
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "GainNode",
            gain: {
              value: 6,
              inputs: []
            },
            inputs: [ BUFSRC(128) ]
          }
        ]
      });
      assert(synth.toAudioNode().$inputs[0].$inputs[0].buffer.getChannelData(0)[0] === 1);
    });
    it("$('+', $('sin', {freq:1}), $('sin', {freq:2}), $('sin', {freq:3}))", function() {
      var synth = neu.Synth(function($) {
        return $("+", $("sin", { freq: 1 }), $("sin", { freq: 2 }), $("sin", { freq: 3 }));
      });

      function oscillator(freq) {
        var node = neu.context.createOscillator();
        node.frequency.value = freq;
        return node.toJSON();
      }

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ oscillator(1), oscillator(2), oscillator(3) ]
      });
    });
    it("$([ $('sin'), $('sin') ])", function() {
      var synth = neu.Synth(function($) {
        return $([ $("sin", { freq: 1 }), $("sin", { freq: 2 }), $("sin", { freq: 3 }) ]);
      });

      function oscillator(freq) {
        var node = neu.context.createOscillator();
        node.frequency.value = freq;
        return node.toJSON();
      }

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ oscillator(1), oscillator(2), oscillator(3) ]
      });
    });
  });

});
