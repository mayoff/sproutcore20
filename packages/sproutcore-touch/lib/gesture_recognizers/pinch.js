// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get;
var set = SC.set;

/**

  If there are two touches
    at start, calculate distance
    when the touches move, recalculate distance
    calculate scale from change in distance
 
 */
SC.PinchGestureRecognizer = SC.Gesture.extend({
  numberOfTouches: 2,

  _currentDistanceBetweenTouches: null,
  _previousDistanceBetweenTouches: null,
  _deltaThreshold: 10,

  scale: 0,

  touchStart: function(evt, view) {
    console.group('Pinch');
    console.log('1: Pinch got start');
    
    var touches = evt.originalEvent.targetTouches;
    var len = touches.length;

    if (len === 1) {
      this.state = SC.Gesture.WAITING_FOR_TOUCHES;
    }
    else {
      this.state = SC.Gesture.POSSIBLE;
      this._currentDistanceBetweenTouches = Math.round(this.distance(touches[0],touches[1])*10)/10
    }
    
    this.redispatchEventToView(view,'touchstart');
  },

  touchMove: function(evt, view) {
    var touches = evt.originalEvent.targetTouches;

    console.log('Pinch got touchMove');
    if(touches.length !== get(this, 'numberOfTouches')) {
      return;
    }

    var state = this._state;

    this._previousDistanceBetweenTouches = this._currentDistanceBetweenTouches;
    this._currentDistanceBetweenTouches = Math.round(this.distance(touches[0],touches[1])*10)/10 

    var differenceInDistance = this._currentDistanceBetweenTouches - this._previousDistanceBetweenTouches;

    this.scale = Math.round((this._currentDistanceBetweenTouches / this._previousDistanceBetweenTouches)*100)/100;

    console.log(this.scale);

    if (this.state === SC.Gesture.POSSIBLE && Math.abs(differenceInDistance) >= this._deltaThreshold) {
      this.state = SC.Gesture.BEGAN;
      this.notifyViewOfPinchEvent(view,'pinchStart', this.scale);
    }
    else if (this.state === SC.Gesture.BEGAN) {
      this.state = SC.Gesture.CHANGED;
      this.notifyViewOfPinchEvent(view,'pinchChange', this.scale);
    }
    else {
      this.redispatchEventToView(view,'touchmove');
    }
  },

  touchEnd: function(evt, view) {
    this.state = SC.Gesture.ENDED;

    console.groupEnd();
  },

  touchCancel: function(evt, view) {
    this.state = SC.Gesture.CANCELLED;

    console.groupEnd();
  }
});

SC.Gestures.register('pinch', SC.PinchGestureRecognizer);