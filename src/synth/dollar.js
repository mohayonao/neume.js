"use strict";

var util = require("../util");
var NeuParam = require("../component/param");
var NeuSynthDB = require("./db");
var NeuUGen = require("./ugen");

function NeuSynthDollar(synth) {
  var db = new NeuSynthDB();

  this.db = db;
  this.params = {};
  this.methods = {};
  this.timers = [];

  function builder() {
    var args = util.toArray(arguments);
    var key = args.shift();
    var spec = util.isDictionary(args[0]) ? args.shift() : {};
    var inputs = Array.prototype.concat.apply([], args);
    var ugen = NeuUGen.build(synth, key, spec, inputs);

    db.append(ugen);

    return ugen;
  }

  builder.param = $param(synth, this.params);
  builder.method = $method(synth, this.methods);
  builder.timeout = $timeout(synth, this.timers);
  builder.interval = $interval(synth, this.timers);

  this.builder = builder;
}

function $param(synth, params) {
  return function(name, defaultValue) {
    if (params.hasOwnProperty(name)) {
      return params[name];
    }

    defaultValue = util.finite(util.defaults(defaultValue, 0));

    validateParam(name, defaultValue);

    var param = new NeuParam(synth.$context, defaultValue);

    Object.defineProperty(synth, name, {
      value: param,
      enumerable: true
    });

    params[name] = param;

    return param;
  };
}

function $method(synth, methods) {
  return function(methodName, func) {
    if (/^[a-z]\w*$/.test(methodName) && typeof func === "function") {
      methods[methodName] = func;
    }
  };
}

function $timeout(synth, timers) {
  var context = synth.$context;

  return function(timeout) {
    timeout = Math.max(0, util.finite(context.toSeconds(timeout)));

    var schedId = 0;
    var callbacks = util.toArray(arguments).slice(1).filter(util.isFunction);

    function sched(t) {
      schedId = context.sched(t, function(playbackTime) {
        schedId = 0;
        for (var i = 0, imax = callbacks.length; i < imax; i++) {
          callbacks[i].call(synth, {
            playbackTime: playbackTime,
            count: 1
          });
        }
      });
    }

    timers.push({
      start: function(t) {
        sched(t + timeout);
      },
      stop: function() {
        context.unsched(schedId);
        schedId = 0;
      }
    });
  };
}

function $interval(synth, timers) {
  var context = synth.$context;
  var minInterval = 1 / context.sampleRate;

  return function(interval) {
    var relative;

    if (/\d+(ticks|n)|\d+\.\d+\.\d+/.test(interval)) {
      relative = true;
    } else {
      relative = false;
      interval = Math.max(minInterval, util.finite(context.toSeconds(interval)));
    }

    var schedId = 0;
    var callbacks = util.toArray(arguments).slice(1).filter(util.isFunction);
    var startTime = 0;
    var count = 0;

    function sched(t) {
      schedId = context.sched(t, function(playbackTime) {
        schedId = 0;
        count += 1;
        for (var i = 0, imax = callbacks.length; i < imax; i++) {
          callbacks[i].call(synth, {
            playbackTime: playbackTime,
            count: count
          });
        }

        var nextTime = relative ?
          playbackTime + Math.max(minInterval, util.finite(context.toSeconds(interval))) :
          startTime + interval * (count + 1);

        sched(nextTime);
      });
    }

    timers.push({
      start: function(t) {
        startTime = t;

        var nextTime = relative ?
          startTime + Math.max(minInterval, util.finite(context.toSeconds(interval))) :
          startTime + interval;

        sched(nextTime);
      },
      stop: function() {
        context.unsched(schedId);
        schedId = 0;
      }
    });
  };
}

function validateParam(name) {
  if (!/^[a-z]\w*$/.test(name)) {
    throw new TypeError(util.format(
      "invalid parameter name: #{name}", { name: name }
    ));
  }
}

module.exports = NeuSynthDollar;
