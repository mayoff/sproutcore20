// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require('sproutcore-runtime/system/core_object');
require('sproutcore-runtime/system/set');

SC.CoreObject.subclasses = new SC.Set();

/**
  @class
  @extends SC.CoreObject
  @extends SC.Observable
*/
SC.Object = SC.CoreObject.extend(SC.Observable);
