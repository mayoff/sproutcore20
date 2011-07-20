// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */

require('sproutcore-metal/core');
require('sproutcore-metal/platform');
require('sproutcore-metal/utils');
require('sproutcore-metal/accessors');

var AFTER_OBSERVERS = ':change';
var BEFORE_OBSERVERS = ':before';
var guidFor = SC.guidFor;
var normalizePath = SC.normalizePath;

var suspended = 0;

var ObserverSet = function(iterateable) {
  this.set = {};
  if (iterateable) { this.array = []; }
}

ObserverSet.prototype.add = function(target, name) {
  var set = this.set, guid = SC.guidFor(target), array;

  if (!set[guid]) { set[guid] = {}; }
  set[guid][name] = true;
  if (array = this.array) {
    array.push([target, name]);
  }
};

ObserverSet.prototype.contains = function(target, name) {
  var set = this.set, guid = SC.guidFor(target), nameSet = set[guid];
  return nameSet && nameSet[name];
};

ObserverSet.prototype.empty = function() {
  this.set = {};
  this.array = [];
};

ObserverSet.prototype.forEach = function(fn) {
  var q = this.array;
  this.empty();
  q.forEach(function(item) {
    fn(item[0], item[1]);
  });
};

var queue = new ObserverSet(true), beforeObserverSet = new ObserverSet();

/** @private */
function notifyObservers(obj, eventName, forceNotification) {
  if (suspended && !forceNotification) {
    // if suspended add to the queue to send event later - but only send 
    // event once.
    if (!queue.contains(obj, eventName)) {
      queue.add(obj, eventName);
    }
  } else {
    SC.sendEvent(obj, eventName);
  }
}

/** @private */
function flushObserverQueue() {
  beforeObserverSet.empty();

  if (!queue || queue.array.length === 0) { return; }
  queue.forEach(function(target, event){
    SC.sendEvent(target, event);
  });
}

SC.beginPropertyChanges = function() {
  suspended++;
  return this;
};

SC.endPropertyChanges = function() {
  suspended--;
  if (suspended<=0) { flushObserverQueue(); }
};

/** @private */
function changeEvent(keyName) {
  return keyName + AFTER_OBSERVERS;
}

/** @private */
function beforeEvent(keyName) {
  return keyName + BEFORE_OBSERVERS;
} 

/** @private */
function changeKey(eventName) {
  return eventName.slice(0, -7);
}

/** @private */
function beforeKey(eventName) {
  return eventName.slice(0, -7);
}

/** @private */
function xformChange(target, method, params) {
  var obj = params[0],
      keyName = changeKey(params[1]), val;

  if (method.length > 2) { val = SC.getPath(obj, keyName); }
  method.call(target, obj, keyName, val);
}

/** @private */
function xformBefore(target, method, params) {
  var obj = params[0], keyName = beforeKey(params[1]), val;
  if (method.length>2) { val = SC.getPath(obj, keyName); }
  method.call(target, obj, keyName, val);
}

SC.addObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  SC.addListener(obj, changeEvent(path), target, method, xformChange);
  SC.watch(obj, path);
  return this;
};

SC.observersFor = function(obj, path) {
  return SC.listenersFor(obj, changeEvent(path));
};

SC.removeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  SC.unwatch(obj, path);
  SC.removeListener(obj, changeEvent(path), target, method);
  return this;
};

SC.addBeforeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  SC.addListener(obj, beforeEvent(path), target, method, xformBefore);
  SC.watch(obj, path);
  return this;
};

SC.beforeObserversFor = function(obj, path) {
  return SC.listenersFor(obj, beforeEvent(path));
};

SC.removeBeforeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  SC.unwatch(obj, path);
  SC.removeListener(obj, beforeEvent(path), target, method);
  return this;
};

/** @private */
SC.notifyObservers = function(obj, keyName) {
  notifyObservers(obj, changeEvent(keyName));
};

/** @private */
SC.notifyBeforeObservers = function(obj, keyName) {
  var guid, set, forceNotification = false;

  if (suspended) {
    if (!beforeObserverSet.contains(obj, keyName)) {
      beforeObserverSet.add(obj, keyName);
      forceNotification = true;
    } else {
      return;
    }
  }

  notifyObservers(obj, beforeEvent(keyName), forceNotification);
};
