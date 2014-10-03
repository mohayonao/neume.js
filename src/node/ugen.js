"use strict";

var _       = require("../utils");
var NeuNode = require("./node");
var NeuUnit = require("./unit");
var NeuDC   = require("../component/dc");
var SelectorParser = require("../parser/selector");
var makeOutlet     = require("./ugen-makeOutlet");

function NeuUGen(synth, key, spec, inputs) {
  NeuNode.call(this, synth);

  var parsed = SelectorParser.parse(key);

  if (!NeuUGen.registered.hasOwnProperty(parsed.key)) {
    throw new Error("unknown key: " + key);
  }

  this.$key   = parsed.key;
  this.$class = parsed.class;
  this.$id    = parsed.id;

  var unit = NeuUGen.registered[parsed.key](this, spec, inputs);

  if (!(unit instanceof NeuUnit)) {
    throw new Error("invalid key: " + key);
  }

  var outlet = makeOutlet(this.$context, unit, spec);

  this.$unit   = unit;
  this.$outlet = outlet.outlet;
  this.$offset = outlet.offset;

  _.each(unit.$methods, function(method, name) {
    _.definePropertyIfNotExists(this, name, {
      value: method
    });
  }, this);
}
_.inherits(NeuUGen, NeuNode);

NeuUGen.$name = "NeuUGen";

NeuUGen.registered = {};

NeuUGen.register = function(name, func) {
  if (!SelectorParser.isValidUGenName(name)) {
    throw new Error("invalid ugen name: " + name);
  }
  if (typeof func !== "function") {
    throw new TypeError("ugen must be a function");
  }
  NeuUGen.registered[name] = func;
};

NeuUGen.build = function(synth, key, spec, inputs) {
  if (typeof key !== "string") {
    spec.value = key;
    key = _.typeOf(key);
  }

  return new NeuUGen(synth, key, spec, inputs);
};

NeuUGen.prototype.toAudioNode = function() {
  return this.$outlet;
};

NeuUGen.prototype._connect = function(to) {
  this.$context.connect(this.$outlet, to);
  if (this.$offset !== 0) {
    if (to instanceof window.AudioParam) {
      to.value = this.$offset;
    } else {
      this.$context.connect(createGainDC(this.$context, this.$offset), to);
    }
  }
};

function createGainDC(context, offset) {
  var gain = context.createGain();

  gain.gain.value = offset;

  context.connect(new NeuDC(context, 1), gain);

  return gain;
}

module.exports = _.NeuUGen = NeuUGen;