"use strict";

var NeuContext = require("../src/context");

describe("NeuContext", function() {
  var audioContext = null;
  var context = null;

  beforeEach(function() {
    audioContext = new window.AudioContext();
    context = new NeuContext(audioContext);
  });

  describe("(audioContext)", function() {
    it("returns an instance of NeuContext", function() {
      assert(context instanceof NeuContext);
    });
  });

  describe("#sampleRate", function() {
    it("points to AudioContext#sampleRate", function() {
      assert(context.sampleRate === audioContext.sampleRate);
    });
  });

  describe("#currentTime", function() {
    it("points to AudioContext#currentTime", function() {
      assert(typeof context.currentTime === "number");
    });
  });

  describe("#destination", function() {
    it("points to AudioContext#destination", function() {
      assert(context.destination === audioContext.destination);
    });
  });

  describe("#listener", function() {
    it("points to AudioContext#listener", function() {
      assert(context.listener === audioContext.listener);
    });
  });

  describe("#cureateBuffer()", function() {
    it("call AudioContext#createBuffer()", function() {
      var stub = sinon.stub(context, "createBuffer");

      context.createBuffer(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createBufferSource()", function() {
    it("call AudioContext#createBufferSource()", function() {
      var stub = sinon.stub(context, "createBufferSource");

      context.createBufferSource(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createMediaElementSource()", function() {
    it("call AudioContext#createMediaElementSource()", function() {
      var stub = sinon.stub(context, "createMediaElementSource");

      context.createMediaElementSource(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createMediaStreamSource()", function() {
    it("call AudioContext#createMediaStreamSource()", function() {
      var stub = sinon.stub(context, "createMediaStreamSource");

      context.createMediaStreamSource(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createMediaStreamDestination()", function() {
    it("call AudioContext#createMediaStreamDestination()", function() {
      var stub = sinon.stub(context, "createMediaStreamDestination");

      context.createMediaStreamDestination(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createScriptProcessor()", function() {
    it("call AudioContext#createScriptProcessor()", function() {
      var stub = sinon.stub(context, "createScriptProcessor");

      context.createScriptProcessor(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createAnalyser()", function() {
    it("call AudioContext#createAnalyser()", function() {
      var stub = sinon.stub(context, "createAnalyser");

      context.createAnalyser(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createGain()", function() {
    it("call AudioContext#createGain()", function() {
      var stub = sinon.stub(context, "createGain");

      context.createGain(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createDelay()", function() {
    it("call AudioContext#createDelay()", function() {
      var stub = sinon.stub(context, "createDelay");

      context.createDelay(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createBiquadFilter()", function() {
    it("call AudioContext#createBiquadFilter()", function() {
      var stub = sinon.stub(context, "createBiquadFilter");

      context.createBiquadFilter(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createWaveShaper()", function() {
    it("call AudioContext#createWaveShaper()", function() {
      var stub = sinon.stub(context, "createWaveShaper");

      context.createWaveShaper(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createPanner()", function() {
    it("call AudioContext#createPanner()", function() {
      var stub = sinon.stub(context, "createPanner");

      context.createPanner(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createConvolver()", function() {
    it("call AudioContext#createConvolver()", function() {
      var stub = sinon.stub(context, "createConvolver");

      context.createConvolver(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createChannelSplitter()", function() {
    it("call AudioContext#createChannelSplitter()", function() {
      var stub = sinon.stub(context, "createChannelSplitter");

      context.createChannelSplitter(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createChannelMerger()", function() {
    it("call AudioContext#createChannelMerger()", function() {
      var stub = sinon.stub(context, "createChannelMerger");

      context.createChannelMerger(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createDynamicsCompressor()", function() {
    it("call AudioContext#createDynamicsCompressor()", function() {
      var stub = sinon.stub(context, "createDynamicsCompressor");

      context.createDynamicsCompressor(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createOscillator()", function() {
    it("call AudioContext#createOscillator()", function() {
      var stub = sinon.stub(context, "createOscillator");

      context.createOscillator(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#createPeriodicWave()", function() {
    it("call AudioContext#createPeriodicWave()", function() {
      var stub = sinon.stub(context, "createPeriodicWave");

      context.createPeriodicWave(1, 2, 3);

      assert(stub.calledOnce === true);
      assert.deepEqual(stub.firstCall.args, [ 1, 2, 3 ]);
    });
  });

  describe("#getMasterGain()", function() {
    it("returns a GainNode", function() {
      assert(context.getMasterGain() instanceof window.GainNode);
      assert(context.getMasterGain() === context.getMasterGain());
    });
  });

  describe("#getAnalyser()", function() {
    it("returns an AnalyserNode", function() {
      assert(context.getAnalyser() instanceof window.AnalyserNode);
      assert(context.getAnalyser() === context.getAnalyser());
    });
  });

  describe("#reset()", function() {
    it("returns self", function() {
      assert(context.reset() === context);
      assert(context.reset() === context);
    });
  });

  describe("#start()", function() {
    it("returns self", function() {
      assert(context.start() === context);
      assert(context.start() === context);
    });
  });

  describe("#stop()", function() {
    it("returns self", function() {
      assert(context.stop() === context);
      assert(context.stop() === context);
    });
  });

  describe("#sched(time, callback, ctx)", function() {
    it("do nothing if given an invalid callback", function() {
      assert(context.sched(10, "INVALID") === 0);
    });
    it("append the callback and order by specified time", function() {
      var passed = 0;

      context.start();
      context.sched(0.100, function() { passed = 1; });
      context.sched(0.500, function() { passed = 5; });
      context.sched(0.200, function() { passed = 2; });
      context.sched(0.400, function() { passed = 4; });
      context.sched(0.300, function() { passed = 3; });

      assert(passed === 0, "00:00.000");

      audioContext.$process(0.100);
      assert(passed === 1, "00:00.100");

      audioContext.$process(0.100);
      assert(passed === 2, "00:00.200");

      audioContext.$process(0.110);
      assert(passed === 3, "00:00.310");

      audioContext.$process(0.090);
      assert(passed === 4, "00:00.400");

      audioContext.$process(0.100);
      assert(passed === 5, "00:00.500");
    });
  });

  describe("#unsched(id)", function() {
    it("do nothing if given an invalid id", function() {
      assert(context.unsched("INVALID") === 0);
    });
    it("append the callback and order by specified time", function() {
      var passed = 0;
      var schedIds = [];

      context.start();
      schedIds[1] = context.sched(0.100, function() { passed = 1; });
      schedIds[5] = context.sched(0.500, function() { passed = 5; });
      schedIds[2] = context.sched(0.200, function() { passed = 2; });
      schedIds[4] = context.sched(0.400, function() { passed = 4; });
      schedIds[3] = context.sched(0.300, function() { passed = 3; });

      context.unsched(schedIds[2]);

      assert(passed === 0, "00:00.000");

      audioContext.$process(0.100);
      assert(passed === 1, "00:00.100");

      audioContext.$process(0.100);
      assert(passed === 1, "00:00.200"); // removed callback

      audioContext.$process(0.110);
      assert(passed === 3, "00:00.310");

      audioContext.$process(0.090);
      assert(passed === 4, "00:00.400");

      audioContext.$process(0.100);
      assert(passed === 5, "00:00.500");
    });
  });

  describe("#nextTick(callback, ctx)", function() {
    it("append the callback that executed next tick", function() {
      var passed = 0;

      context.start();

      context.nextTick(function() { passed = 1; });

      assert(passed === 0);

      audioContext.$process(1024 / audioContext.sampleRate);
      assert(passed === 1);
    });
  });

});