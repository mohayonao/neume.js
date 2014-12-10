"use strict";

var util = require("../util");
var NeuSynthDB = require("./db");
var NeuSynthDollar = require("./dollar");

var EMPTY_DB = new NeuSynthDB();
var INIT = 0;
var START = 1;
var STOP = 2;

function NeuSynth(context, func, args) {
  this.$context = context;
  this.$routes = [];
  this.$localBuses = [];

  var $ = new NeuSynthDollar(this);

  this.$builder = $.builder;

  var result = func.apply(null, [ $.builder ].concat(args));

  if (result && result.toAudioNode && !result.$isOutput) {
    this.$routes[0] = result;
  }

  this.$routes = this.$routes.map(function(node) {
    var gain = context.createGain();

    context.connect(node, gain);

    return gain;
  });

  this._connected = false;
  this._db = this.$routes.length ? $.db : /* istanbul ignore next */ EMPTY_DB;
  this._state = INIT;
  this._stateString = "UNSCHEDULED";
  this._timers = $.timers;

  var methodNames = [];

  Object.keys($.methods).forEach(function(methodName) {
    var method = $.methods[methodName];

    methodNames.push(methodName);

    Object.defineProperty(this, methodName, {
      value: function() {
        method.apply(this, util.toArray(arguments));
        return this;
      }
    });
  }, this);

  this._db.all().forEach(function(ugen) {
    Object.keys(ugen.$unit.$methods).forEach(function(methodName) {
      if (!this.hasOwnProperty(methodName)) {
        methodNames.push(methodName);
        Object.defineProperty(this, methodName, {
          value: function(t, v) {
            var e;
            if (t != null && typeof t !== "object") {
              e = { playbackTime: t, value: v };
            } else {
              e = t || {};
            }
            this.call(methodName, e);
            return this;
          }
        });
      }
    }, this);
  }, this);

  Object.defineProperties(this, {
    context: {
      value: this.$context,
      enumerable: true
    },
    currentTime: {
      get: function() {
        return this.$context.currentTime;
      },
      enumerable: true
    },
    state: {
      get: function() {
        return this._stateString;
      },
      enumerable: true
    },
    methods: {
      value: methodNames.sort(),
      enumerable: true
    }
  });
}
NeuSynth.$name = "NeuSynth";

NeuSynth.prototype.find = function(selector) {
  return this._db.find(selector);
};

NeuSynth.prototype.start = function(startTime) {
  var context = this.$context;

  startTime = util.defaults(context.toSeconds(startTime), context.currentTime);
  startTime = util.finite(startTime);

  if (this._state === INIT) {
    this._state = START;
    this._stateString = "SCHEDULED";

    context.sched(startTime, function() {
      this._stateString = "PLAYING";
    }, this);

    this.$routes.forEach(function(node, index) {
      this.connect(node, this.getAudioBus(index));
    }, context);

    this._db.all().forEach(function(ugen) {
      ugen.$unit.start(startTime);
    });

    this._timers.forEach(function(timer) {
      timer.start(startTime);
    });

    context.start(); // auto start(?)
  }

  return this;
};

NeuSynth.prototype.stop = function(startTime) {
  var context = this.$context;

  startTime = util.defaults(context.toSeconds(startTime), context.currentTime);
  startTime = util.finite(startTime);

  if (this._state === START) {
    this._state = STOP;

    context.sched(startTime, function(t0) {
      this._stateString = "FINISHED";

      context.nextTick(function() {
        this.$routes.forEach(function(node) {
          context.disconnect(node);
        });
      }, this);

      this._db.all().forEach(function(ugen) {
        ugen.$unit.stop(t0);
      });

      this._timers.forEach(function(timer) {
        timer.stop(t0);
      });
    }, this);
  }

  return this;
};

NeuSynth.prototype.fadeIn = function(startTime, duration) {
  var context = this.$context;

  startTime = util.defaults(context.toSeconds(startTime), context.currentTime);
  duration = util.defaults(context.toSeconds(duration), 0.5);

  startTime = util.finite(startTime);
  duration = util.finite(duration);

  if (this._state === INIT) {
    var tC = -Math.max(1e-6, duration) / -4.605170185988091;
    this.$routes.forEach(function(node) {
      node.gain.value = 0;
      node.gain.setTargetAtTime(1, startTime, tC);
    });
    this.start(startTime);
  }

  return this;
};

NeuSynth.prototype.fadeOut = function(startTime, duration) {
  var context = this.$context;

  startTime = util.defaults(context.toSeconds(startTime), context.currentTime);
  duration = util.defaults(context.toSeconds(duration), 0.5);

  startTime = util.finite(startTime);
  duration = util.finite(duration);

  if (this._state === START) {
    if (this.$routes.length) {
      context.sched(startTime, function(t0) {
        var startValue = this.$routes[0].gain.value;
        if (startValue !== 0) {
          var tC = -Math.max(1e-6, duration) / Math.log(0.01 / startValue);
          this.$routes.forEach(function(node) {
            node.gain.setTargetAtTime(0, t0, tC);
          });
        }
      }, this);
    }
    this.stop(startTime + duration);
  }

  return this;
};

NeuSynth.prototype.fade = function(startTime, value, duration) {
  var context = this.$context;

  startTime = util.defaults(context.toSeconds(startTime), context.currentTime);
  duration = util.defaults(context.toSeconds(duration), 0.5);

  startTime = util.finite(startTime);
  value = util.finite(value);
  duration = util.finite(duration);

  if (this._state === START) {
    if (this.$routes.length) {
      context.sched(startTime, function(t0) {
        var v0 = this.$routes[0].gain.value;
        if (v0 !== value) {
          var v1 = value;
          var vT = v0 + (v1 - v0) * 0.99;
          var tC = -Math.max(1e-6, duration) / Math.log((vT - v1) / (v0 - v1));
          this.$routes.forEach(function(node) {
            node.gain.setTargetAtTime(v1, t0, tC);
            node.gain.setValueAtTime(v1, t0 + duration);
          });
        }
      }, this);
    }
  }

  return this;
};

NeuSynth.prototype.apply = function(method, args) {
  iterateOverTargets(this._db, method, function(ugen, method) {
    ugen.$unit.apply(method, args);
  });
  return this;
};

NeuSynth.prototype.call = function() {
  var args = util.toArray(arguments);
  var method = args.shift();

  return this.apply(method, args);
};

NeuSynth.prototype.toAudioNode = function() {
  return this.$context.toAudioNode(this.$routes[0]);
};

NeuSynth.prototype.hasListeners = function(event) {
  var result = false;

  iterateOverTargets(this._db, event, function(ugen, event) {
    result = result || ugen.hasListeners(event);
  });

  return result;
};

NeuSynth.prototype.listeners = function(event) {
  var listeners = [];

  iterateOverTargets(this._db, event, function(ugen, event) {
    ugen.listeners(event).forEach(function(listener) {
      if (listeners.indexOf(listener) === -1) {
        listeners.push(listener);
      }
    });
  });

  return listeners;
};

NeuSynth.prototype.on = function(event, listener) {
  iterateOverTargets(this._db, event, function(ugen, event) {
    ugen.on(event, listener);
  });
  return this;
};

NeuSynth.prototype.once = function(event, listener) {
  iterateOverTargets(this._db, event, function(ugen, event) {
    ugen.once(event, listener);
  });
  return this;
};

NeuSynth.prototype.off = function(event, listener) {
  iterateOverTargets(this._db, event, function(ugen, event) {
    ugen.off(event, listener);
  });
  return this;
};

function getTargets(db, selector) {
  return selector ? db.find(selector) : db.all();
}

function iterateOverTargets(db, event, callback) {
  var parsed = parseEvent(event);

  if (parsed) {
    getTargets(db, parsed.selector).forEach(function(ugen) {
      callback(ugen, parsed.name);
    });
  }
}

function parseEvent(event) {
  var matched = /^(?:(.*?):([a-z]\w+)|([a-z]\w+))$/.exec(event);

  if (!matched) {
    return null;
  }

  if (matched[3] != null) {
    return { selector: null, name: matched[3] };
  }

  return { selector: matched[1], name: matched[2] };
}

module.exports = NeuSynth;
