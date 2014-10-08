(function(plugin) {
  "use strict";

  // Module systems magic dance.

  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    // NodeJS
    module.exports = plugin;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
        return plugin;
    });
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    neume.use(plugin);
  }

})(function(neume, _) {
  "use strict";

  // Freeverb
  // https://ccrma.stanford.edu/~jos/pasp/Freeverb.html

  neume.register("freeverb", function(ugen, spec, inputs) {
    var context = ugen.$context;
    var outlet  = null;

    var room = context.createComponent(_.defaults(spec.room, 0.5)).madd(0.28, 0.7);
    var damp = context.createComponent(_.defaults(spec.damp, 0.20)).mul(0.5);
    var mix  = _.defaults(spec.mix , 0.33);
    var inlet = context.createGain();

    context.createSum(inputs).connect(inlet);

    var lbfc = [
      createLBCF(context, 1557/44100, room, damp),
      createLBCF(context, 1617/44100, room, damp),
      createLBCF(context, 1491/44100, room, damp),
      createLBCF(context, 1422/44100, room, damp),
      createLBCF(context, 1277/44100, room, damp),
      createLBCF(context, 1356/44100, room, damp),
      createLBCF(context, 1188/44100, room, damp),
      createLBCF(context, 1116/44100, room, damp),
    ];

    var ap = [
      createAP(context, 255/44100),
      createAP(context, 556/44100),
      createAP(context, 441/44100),
      createAP(context, 341/44100),
    ];

    lbfc.forEach(function(lbfc) {
      context.connect(inlet, lbfc.inlet);
      context.connect(lbfc.outlet, ap[0].inlet);
    });

    context.connect(ap[0].outlet, ap[1].inlet);
    context.connect(ap[1].outlet, ap[2].inlet);
    context.connect(ap[2].outlet, ap[3].inlet);

    outlet = context.createDryWet(inputs, ap[3].outlet, mix);

    return new neume.Unit({
      outlet: outlet
    });
  });

  function createLBCF(context, delayTime, room, damp) {
    var inlet = context.createGain();
    var delay = context.createDelay(delayTime);
    var fNode = context.createGain();
    var dNode = context.createGain();

    delay.delayTime.value = delayTime;

    fNode.gain.value = 0;
    context.connect(room, fNode.gain);

    dNode.gain.value = 0;
    context.connect(damp, dNode.gain);

    context.connect(inlet, delay);
    context.connect(delay, fNode);
    context.connect(fNode, inlet);
    context.connect(inlet, dNode);

    return { inlet: inlet, outlet: dNode };
  }

  function createAP(context, delayTime) {
    var node = context.createBiquadFilter();

    node.type = "allpass";
    node.frequency.value = delayTime * 44100;

    return { inlet: node, outlet: node };
  }
});
