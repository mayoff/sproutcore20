// ==========================================================================
// Project:  SproutCore Metal
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ENV sc_assert */

if (typeof SC === 'undefined') {

/**
  @namespace

  All SproutCore methods and functions are defined inside of this namespace.
  You generally should not add new properties to this namespace as it may be
  overwritten by future versions of SproutCore. You can choose to use either
  the `SC` namespace or `SproutCore`.

  SproutCore-Metal is a framework that provides core functions for
  SproutCore including cross-platform functions, support for property
  observing and objects. Its focus is on small size and performance.

  @name SC
  @version 2.0.alpha
*/
SC = {};

// aliases needed to keep minifiers from removing the global context
if (typeof window !== 'undefined') {
  window.SC = window.SproutCore = SproutCore = SC;
}

}

/**
  @static
  @type String
  @default '2.0.alpha'
  @constant
*/
SC.VERSION = '2.0.alpha';

/**
  Standard environmental variables. You can define these in a global `ENV`
  variable before loading SproutCore to control various configuration
  settings.

  @static
  @constant
  @type Hash
*/
SC.ENV = typeof ENV === 'undefined' ? {} : ENV;

/**
  Empty function.  Useful for some operations.

  @returns {Object}
  @private
*/
SC.K = function() { return this; };

/**
  Define an assertion that will throw an exception if the condition is not
  met. SproutCore build tools will remove any calls to sc_assert() when
  doing a production build. sc_assert() is very handy at ensuring that
  required parameters are included in function calls, or that the parameters
  are within the expected ranges.

  ## Examples

  Pass a simple Boolean value:

      #js:
      sc_assert('must pass a valid object', !!obj);

  Pass a function. If the function returns false the assertion fails
  any other return value (including void) will pass.

      #js:
      sc_assert('a passed record must have a firstName', function() {
        if (obj instanceof SC.Record) {
          return !SC.empty(obj.firstName);
        }
      });

  Use it to ensure a required parameter is included:

      #js:
      function myFunc(requiredParam, index) {
        sc_assert('passed requiredParam', requiredParam !== undefined);
        sc_assert('index is greater than 0', index > 0);
        anArray[index];
      }

  @static
  @function

  @param {String} desc
    A description of the assertion. This will become the text of the Error
    thrown if the assertion fails.

  @param {Boolean|Function} test
    Must return true for the assertion to pass. If you pass a function it
    will be executed. If the function returns false an exception will be
    thrown.

  @throws {Error} If test evaluates to false

  @returns {void}
*/
var sc_assert = function sc_assert(desc, test) {
  if (typeof test === 'function') { test = test() !== false; }
  if (!test) { throw new Error("assertion failed: " + desc); }
};

window.sc_assert = sc_assert;

//if ('undefined' === typeof sc_require) sc_require = SC.K;
if ('undefined' === typeof require) require = SC.K;
