"use strict";

var neume = require("../../src");

neume.use(require("../../src/ugen/osc"));
neume.use(require("../../src/ugen/biquad"));

describe("ugen/biquad", function() {
  var neu = null;

  beforeEach(function() {
    neu = neume({
      scheduleInterval: 0.05,
      scheduleAheadTime: 0.05,
      scheduleOffsetTime: 0.00,
    });
  });

  function biquad(type) {
    var node = neu.context.createBiquadFilter();
    node.type = type;
    return node.toJSON();
  }

  describe("graph", function() {
    it("$('biquad')", function() {
      var synth = neu.Synth(function($) {
        return $("biquad");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("lowpass") ]
      });
    });
    it("$('lowpass')", function() {
      var synth = neu.Synth(function($) {
        return $("lowpass");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("lowpass") ]
      });
    });
    it("$('highpass')", function() {
      var synth = neu.Synth(function($) {
        return $("highpass");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("highpass") ]
      });
    });
    it("$('bandpass')", function() {
      var synth = neu.Synth(function($) {
        return $("bandpass");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("bandpass") ]
      });
    });
    it("$('lowshelf')", function() {
      var synth = neu.Synth(function($) {
        return $("lowshelf");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("lowshelf") ]
      });
    });
    it("$('highshelf')", function() {
      var synth = neu.Synth(function($) {
        return $("highshelf");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("highshelf") ]
      });
    });
    it("$('peaking')", function() {
      var synth = neu.Synth(function($) {
        return $("peaking");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("peaking") ]
      });
    });
    it("$('notch')", function() {
      var synth = neu.Synth(function($) {
        return $("notch");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("notch") ]
      });
    });
    it("$('allpass')", function() {
      var synth = neu.Synth(function($) {
        return $("allpass");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("allpass") ]
      });
    });
    it("$('lpf')", function() {
      var synth = neu.Synth(function($) {
        return $("lpf");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("lowpass") ]
      });
    });
    it("$('hpf')", function() {
      var synth = neu.Synth(function($) {
        return $("hpf");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("highpass") ]
      });
    });
    it("$('bpf')", function() {
      var synth = neu.Synth(function($) {
        return $("bpf");
      });

      assert.deepEqual(synth.toAudioNode().toJSON(), {
        name: "GainNode",
        gain: {
          value: 1,
          inputs: []
        },
        inputs: [ biquad("bandpass") ]
      });
    });
  });

  describe("parameters", function() {
    it("full name", function() {
      var json = neu.Synth(function($) {
        return $("biquad", { frequency: 220, detune: 1200, Q: 10, gain: 5 });
      }).toAudioNode().toJSON().inputs[0];

      assert(json.frequency.value === 220);
      assert(json.detune.value === 1200);
      assert(json.Q.value === 10);
      assert(json.gain.value === 5);
    });
    it("short name", function() {
      var json = neu.Synth(function($) {
        return $("biquad", { freq: 220, dt: 1200 });
      }).toAudioNode().toJSON().inputs[0];

      assert(json.frequency.value === 220);
      assert(json.detune.value === 1200);
    });
  });

});
