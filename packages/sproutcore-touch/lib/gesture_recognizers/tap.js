// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get;
var set = SC.set;

SC.TapGestureRecognizer = SC.Gesture.extend({

  numberOfTouches: 1,

  startLocation: null,
  _moveThreshold: 10,

  touchStart: function(evt, view) {
    var touches = evt.originalEvent.targetTouches,
        numberOfTouches = this.numberOfTouches;

    if (touches.length === numberOfTouches) {
      var touch = touches[0];

      this.startLocation = {pageX:touch.pageX,pageY:touch.pageY};
      this.state = SC.Gesture.POSSIBLE;
      this.notifyViewOfGestureEvent(view,'tapStart');
    }

    console.log('  TAP RECOGNIZER: redispatching touchstart to view');
    window.foo=true;
    this.redispatchEventToView(view,'touchstart');
    console.log('  TAP RECOGNIZER: finished redispatching');
  },

  touchEnd: function(evt, view) {
    var touches = evt.originalEvent.changedTouches;
    if(touches.length !== get(this, 'numberOfTouches')) {
      return;
    }

    var distance = this.distance(this.startLocation,touches[0]);

    if (this.state === SC.Gesture.POSSIBLE && distance <= this._moveThreshold) {
      this.notifyViewOfGestureEvent(view,'tapEnd');
      this.state = SC.Gesture.ENDED;
    }
    else {
      this.notifyViewOfGestureEvent(view,'tapCancel');
      this.state = SC.Gesture.CANCELLED;
    }

  },

  touchCancel: function(evt, view) {
    this.redispatchEventToView(view,'touchcancel');
  }
});

SC.Gestures.register('tap', SC.TapGestureRecognizer);