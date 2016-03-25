"use strict";

var neume = require("../../src");

neume.use(require("../../src/ugen/osc"));

describe("ugen/osc", function() {
  var neu = null;

  beforeEach(function() {
    neu = neume({
      scheduleInterval: 0.05,
      scheduleAheadTime: 0.05,
      scheduleOffsetTime: 0.00,
    });
  });

  describe("graph", function() {
    it("$('sin')", function() {
      var synth = neu.Synth(function($) {
        return $("sin");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "sine",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('square')", function() {
      var synth = neu.Synth(function($) {
        return $("square");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "square",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('saw')", function() {
      var synth = neu.Synth(function($) {
        return $("saw");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
        {
          name: "OscillatorNode",
          type: "sawtooth",
          frequency: {
            value: 440,
            inputs: []
          },
          detune: {
            value: 0,
            inputs: []
          },
          inputs: []
        }
        ]
      });
    });
    it("$('tri')", function() {
      var synth = neu.Synth(function($) {
        return $("tri");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "triangle",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$(PeriodicWave)", function() {
      var synth = neu.Synth(function($) {
        var wave = neu.context.createPeriodicWave(
          new Float32Array(2048), new Float32Array(2048)
        );
        return $(wave);
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "custom",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('PeriodicWave', {value:PeriodicWave})", function() {
      var synth = neu.Synth(function($) {
        var wave = neu.context.createPeriodicWave(
          new Float32Array(2048), new Float32Array(2048)
        );
        return $("PeriodicWave", { value: wave });
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "custom",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('PeriodicWave', {value:!PeriodicWave})", function() {
      var synth = neu.Synth(function($) {
        return $("PeriodicWave", { value: "not periodic wave" });
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "sine",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('osc', {type:'sin'})", function() {
      var synth = neu.Synth(function($) {
        return $("osc", { type: "sin" });
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "sine",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('osc', {type:'square'})", function() {
      var synth = neu.Synth(function($) {
        return $("osc", { type: "square" });
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "square",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('osc', {type:'saw'})", function() {
      var synth = neu.Synth(function($) {
        return $("osc", { type: "saw" });
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "sawtooth",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('osc', {type:'tri'})", function() {
      var synth = neu.Synth(function($) {
        return $("osc", { type: "tri" });
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "triangle",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('osc', {type:'unknown'})", function() {
      var synth = neu.Synth(function($) {
        return $("osc", { type: "unknown" });
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "sine",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('osc', {type:PeriodicWave})", function() {
      var synth = neu.Synth(function($) {
        var wave = neu.context.createPeriodicWave(
          new Float32Array(2048), new Float32Array(2048)
        );
        return $("osc", { type: wave });
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [
          {
            name: "OscillatorNode",
            type: "custom",
            frequency: {
              value: 440,
              inputs: []
            },
            detune: {
              value: 0,
              inputs: []
            },
            inputs: []
          }
        ]
      });
    });
    it("$('osc', $('osc'))", function() {
      var synth = neu.Synth(function($) {
        return $("osc", $("osc"));
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
              value: 0,
              inputs: [
                {
                  name: "OscillatorNode",
                  type: "sine",
                  frequency: {
                    value: 2,
                    inputs: []
                  },
                  detune: {
                    value: 0,
                    inputs: []
                  },
                  inputs: []
                }
              ]
            },
            inputs: [
              {
                name: "OscillatorNode",
                type: "sine",
                frequency: {
                  value: 440,
                  inputs: []
                },
                detune: {
                  value: 0,
                  inputs: []
                },
                inputs: []
              }
            ]
          }
        ]
      });
    });
  });

  describe("works", function() {
    it("start/stop", function() {
      var synth = neu.Synth(function($) {
        return $("sin");
      });

      var outlet = synth.toAudioNode().$inputs[0];

      useTimer(neu.context, function(tick) {
        synth.start(0.100);
        synth.stop(0.200);

        tick(300);
        assert(outlet.$stateAtTime(0.000) === "SCHEDULED");
        assert(outlet.$stateAtTime(0.050) === "SCHEDULED");
        assert(outlet.$stateAtTime(0.100) === "PLAYING");
        assert(outlet.$stateAtTime(0.150) === "PLAYING");
        assert(outlet.$stateAtTime(0.200) === "FINISHED");
        assert(outlet.$stateAtTime(0.250) === "FINISHED");
      });
    });
  });

});
