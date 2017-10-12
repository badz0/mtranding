(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
'use strict';

var _index = require('../node_modules/lodash.debounce/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../node_modules/lodash.throttle/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
  AOS.init({
    disable: 'mobile',
    easing: 'ease-in-out',
    delay: 100,
    duration: 1000,
    offset: 100,
    once: true
  });
  scrollBtnInit();
  dropDownInit();
  toggleCollapse();
  initProjectSlider();
  initMenuBtn();
  initToolsBtns();
  initScrollBtns();
  setModelsHeight();
  selectModel();
  $(window).resize((0, _index2.default)(setModelsHeight, 150));
});

function scrollBtnInit() {
  $('.footer__up-btn').click(function (event) {
    var target = $(this.hash);
    if (target.length) {
      event.preventDefault();

      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000, function () {

        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) {
          return false;
        } else {
          $target.attr('tabindex', '-1');
          $target.focus();
        };
      });
    }
  });
}

function dropDownInit() {
  $('.breadcrumbs__dd-btn').click(function (event) {
    var hasClass = $(event.target.parentElement).hasClass('breadcrumbs__dd-btn-show');
    var elementsCount = $('.breadcrumbs__dd-btn-show').length;
    if (hasClass && elementsCount) {
      $(event.target.parentElement).removeClass('breadcrumbs__dd-btn-show');
    } else if (!hasClass && elementsCount) {
      $('.breadcrumbs__dd-btn-show').removeClass('breadcrumbs__dd-btn-show');
      $(event.target.parentElement).addClass('breadcrumbs__dd-btn-show');
    } else {
      $(event.target.parentElement).addClass('breadcrumbs__dd-btn-show');
    }
  });

  $(window).click(function (event) {
    if (!$(event.target).is('.breadcrumbs__dd-btn')) {
      $('.breadcrumbs__dd-btn-show').removeClass('breadcrumbs__dd-btn-show');
    }
  });
}

function toggleCollapse() {
  var timeout = void 0;
  $('.desc__title-collapse-btn').click(function (event) {
    $('.desc__mobile-title').toggleClass('active');
    var panel = $('.desc__collapse-container')[0];
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      timeout = setTimeout(function () {
        panel.style.display = 'none';
      }, 600);
    } else {
      clearTimeout(timeout);
      panel.style.display = 'block';
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

function initProjectSlider() {
  var projects = $('.projects__slider');
  projects.length && projects.slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="slick-prev">\n                  <svg width="24px" height="24px" viewBox="0 0 24 24" aria-label="Slider prev button icon">\n                    <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>\n                  </svg>\n                </button>',
    nextArrow: '<button type="button" class="slick-next">\n                  <svg width="24px" height="24px" viewBox="0 0 24 24" aria-label="Slider next button icon">\n                    <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>\n                  </svg>\n                </button>',
    responsive: [{
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 768,
      settings: {
        slidesToShow: 5
      }
    }]
  });
}

function initModelsSlider() {
  var models = $('.models');
  if (!models.length) return;
  var slider = models.slick({
    infinite: false,
    slidesToShow: calcModelsSlides(),
    slidesToScroll: 1,
    vertical: true,
    prevArrow: '<button type="button" class="slick-prev">\n                  <svg viewBox="0 0 24 24" aria-label="Slider prev button icon">\n                    <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>\n                  </svg>\n                </button>',
    nextArrow: '<button type="button" class="slick-next">\n                  <svg viewBox="0 0 24 24" aria-label="Slider next button icon">\n                    <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>\n                  </svg>\n                </button>'
  });

  $(window).resize((0, _index2.default)(function () {
    slider.slick('slickSetOption', 'slidesToShow', calcModelsSlides(), true);
  }, 150));
}
function calcModelsSlides() {
  var headerHeight = 80;
  var sliderBtns = 68;
  var topPadding = 10;
  var slideHeight = window.innerWidth < 1600 ? 100 : 150;

  var sliderHeight = headerHeight + sliderBtns + topPadding;
  return Math.floor((window.innerHeight - headerHeight - sliderBtns - topPadding) / slideHeight);
}

function initToolsBtns() {
  var slider = void 0;
  var fullscreen = $('.fullscreen');
  $('.model-3d__fullscreen-btn').click(function () {
    fullscreen.css('display', 'flex');
    setTimeout(function () {
      fullscreen.css('opacity', 1);
    }, 0);
    $('.gallery-container').css('display', 'none');

    slider = $('.fullscreen__slider').slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      prevArrow: '<button type="button" class="slick-prev">\n                    <svg viewBox="0 0 24 24" aria-label="Slider prev button icon">\n                      <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>\n                    </svg>\n                  </button>',
      nextArrow: '<button type="button" class="slick-next">\n                    <svg viewBox="0 0 24 24" aria-label="Slider next button icon">\n                      <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>\n                    </svg>\n                  </button>'
    });
  });
  $('.fullscreen__close-btn').click(function () {
    fullscreen.css('opacity', 0);
    $('.gallery-container').css('display', 'flex');

    setTimeout(function () {
      fullscreen.css('display', 'none');
      slider.slick('unslick');
    }, 300);
  });
}
function initMenuBtn() {
  var menu = $('.mobile-menu');
  var wasFullscreen = false;
  $('.header__menu-btn').click(function () {
    menu.css('display', 'flex');
    setTimeout(function () {
      menu.css('opacity', 1);
    }, 0);
    $('.gallery-container').css('display', 'none');
    $('.header').css('display', 'none');

    if ($('.fullscreen').css('display') === 'flex') {
      wasFullscreen = true;
      $('.fullscreen').css('display', 'none');
    } else {
      wasFullscreen = false;
    }
  });

  $('.mobile-menu__close-btn').click(function () {
    menu.css('opacity', 0);
    $('.header').css('display', 'block');
    $('.gallery-container').css('display', 'flex');

    if (wasFullscreen) {
      $('.fullscreen').css('display', 'flex');
    }

    setTimeout(function () {
      menu.css('display', 'none');
    }, 300);
  });
}

function initScrollBtns() {
  $('.models__container').scroll((0, _index2.default)(function (event) {
    event.stopPropagation;
    var container = $(event.target);
    var itemHeight = window.innerWidth < 1600 ? 100 : 160;
    var top = container.scrollTop();
    var extra = top % itemHeight;
    if (extra) {
      container.animate({
        scrollTop: extra < itemHeight / 2 ? top - extra : top + itemHeight - extra
      }, 300);
    }
  }, 100));

  $('.models__scroll-down').click(function () {
    var container = $('.models__container');
    var itemHeight = window.innerWidth < 1600 ? 100 : 160;
    var top = container.scrollTop();
    container.animate({
      scrollTop: top - top % itemHeight + itemHeight
    }, 300);
  });
  $('.models__scroll-up').click(function () {
    var itemHeight = window.innerWidth < 1600 ? 100 : 160;
    var container = $('.models__container');
    var top = container.scrollTop();
    container.animate({
      scrollTop: top - (top % itemHeight || itemHeight)
    }, 300);
  });
}

function setModelsHeight() {
  var itemHeight = window.innerWidth < 1600 ? 100 : 160;
  var modelsHeight = window.innerHeight - 186;
  $('.models__container').height(modelsHeight - modelsHeight % itemHeight);
}

function selectModel() {
  $('.models__model').click(function (event) {
    console.log(111);
    $('.models__model').removeClass('isSelected');
    $(event.currentTarget).addClass('isSelected');
  });
}

},{"../node_modules/lodash.debounce/index":1,"../node_modules/lodash.throttle/index":2}]},{},[3])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9pbmRleC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDelhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Z0MsWUFBaEM7QUFDQSxNQUFFLE1BQU0sYUFBUixFQUF3QixRQUF4QixDQUFpQyxZQUFqQztBQUNELEdBSkQ7QUFLRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcbiIsImltcG9ydCBkZWJvdW5jZSBmcm9tICcuLi9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4JztcclxuaW1wb3J0IHRocm90dGxlIGZyb20gJy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gudGhyb3R0bGUvaW5kZXgnO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gIEFPUy5pbml0KHtcclxuICAgIGRpc2FibGU6ICdtb2JpbGUnLFxyXG4gICAgZWFzaW5nOiAnZWFzZS1pbi1vdXQnLFxyXG4gICAgZGVsYXk6IDEwMCxcclxuICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4gICAgb2Zmc2V0OiAxMDAsXHJcbiAgICBvbmNlOiB0cnVlXHJcbiAgfSk7XHJcbiAgc2Nyb2xsQnRuSW5pdCgpO1xyXG4gIGRyb3BEb3duSW5pdCgpO1xyXG4gIHRvZ2dsZUNvbGxhcHNlKCk7XHJcbiAgaW5pdFByb2plY3RTbGlkZXIoKTtcclxuICBpbml0TWVudUJ0bigpO1xyXG4gIGluaXRUb29sc0J0bnMoKTtcclxuICBpbml0U2Nyb2xsQnRucygpO1xyXG4gIHNldE1vZGVsc0hlaWdodCgpO1xyXG4gIHNlbGVjdE1vZGVsKCk7XHJcbiAgJCh3aW5kb3cpLnJlc2l6ZShkZWJvdW5jZShzZXRNb2RlbHNIZWlnaHQsIDE1MCkpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNjcm9sbEJ0bkluaXQoKSB7XHJcbiAgJCgnLmZvb3Rlcl9fdXAtYnRuJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG4gICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICBzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuICAgICAgfSwgMTAwMCwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgJHRhcmdldCA9ICQodGFyZ2V0KTtcclxuICAgICAgICAkdGFyZ2V0LmZvY3VzKCk7XHJcbiAgICAgICAgaWYgKCR0YXJnZXQuaXMoXCI6Zm9jdXNcIikpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHRhcmdldC5hdHRyKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgICAgICAgJHRhcmdldC5mb2N1cygpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcm9wRG93bkluaXQoKSB7XHJcbiAgJCgnLmJyZWFkY3J1bWJzX19kZC1idG4nKS5jbGljaygoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGhhc0NsYXNzID0gJChldmVudC50YXJnZXQucGFyZW50RWxlbWVudCkuaGFzQ2xhc3MoJ2JyZWFkY3J1bWJzX19kZC1idG4tc2hvdycpO1xyXG4gICAgY29uc3QgZWxlbWVudHNDb3VudCA9ICQoJy5icmVhZGNydW1ic19fZGQtYnRuLXNob3cnKS5sZW5ndGg7XHJcbiAgICBpZiAoaGFzQ2xhc3MgJiYgZWxlbWVudHNDb3VudCkge1xyXG4gICAgICAkKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50KS5yZW1vdmVDbGFzcygnYnJlYWRjcnVtYnNfX2RkLWJ0bi1zaG93Jyk7XHJcbiAgICB9IGVsc2UgaWYgKCFoYXNDbGFzcyAmJiBlbGVtZW50c0NvdW50KSB7XHJcbiAgICAgICQoJy5icmVhZGNydW1ic19fZGQtYnRuLXNob3cnKS5yZW1vdmVDbGFzcygnYnJlYWRjcnVtYnNfX2RkLWJ0bi1zaG93Jyk7XHJcbiAgICAgICQoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQpLmFkZENsYXNzKCdicmVhZGNydW1ic19fZGQtYnRuLXNob3cnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQpLmFkZENsYXNzKCdicmVhZGNydW1ic19fZGQtYnRuLXNob3cnKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLmNsaWNrKChldmVudCkgPT4ge1xyXG4gICAgaWYgKCEkKGV2ZW50LnRhcmdldCkuaXMoJy5icmVhZGNydW1ic19fZGQtYnRuJykpIHtcclxuICAgICAgJCgnLmJyZWFkY3J1bWJzX19kZC1idG4tc2hvdycpLnJlbW92ZUNsYXNzKCdicmVhZGNydW1ic19fZGQtYnRuLXNob3cnKTtcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVDb2xsYXBzZSgpIHtcclxuICBsZXQgdGltZW91dDtcclxuICAkKCcuZGVzY19fdGl0bGUtY29sbGFwc2UtYnRuJykuY2xpY2soKGV2ZW50KSA9PiB7XHJcbiAgICAkKCcuZGVzY19fbW9iaWxlLXRpdGxlJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgY29uc3QgcGFuZWwgPSAkKCcuZGVzY19fY29sbGFwc2UtY29udGFpbmVyJylbMF07XHJcbiAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KSB7XHJcbiAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBwYW5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICB9LCA2MDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICBwYW5lbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRQcm9qZWN0U2xpZGVyKCkge1xyXG4gIGNvbnN0IHByb2plY3RzID0gJCgnLnByb2plY3RzX19zbGlkZXInKTtcclxuICBwcm9qZWN0cy5sZW5ndGggJiYgcHJvamVjdHMuc2xpY2soe1xyXG4gICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICBwcmV2QXJyb3c6IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj5cclxuICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtbGFiZWw9XCJTbGlkZXIgcHJldiBidXR0b24gaWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGZpbGw9XCIjNzU3NTc1XCIgcG9pbnRzPVwiMTAgNiA4LjU5IDcuNDEgMTMuMTcgMTIgOC41OSAxNi41OSAxMCAxOCAxNiAxMlwiPjwvcG9seWdvbj5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5gLFxyXG4gICAgbmV4dEFycm93OiBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyNHB4XCIgaGVpZ2h0PVwiMjRweFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBhcmlhLWxhYmVsPVwiU2xpZGVyIG5leHQgYnV0dG9uIGljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBmaWxsPVwiIzc1NzU3NVwiIHBvaW50cz1cIjEwIDYgOC41OSA3LjQxIDEzLjE3IDEyIDguNTkgMTYuNTkgMTAgMTggMTYgMTJcIj48L3BvbHlnb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+YCxcclxuICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAge1xyXG4gICAgICAgIGJyZWFrcG9pbnQ6IDk5MixcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBicmVha3BvaW50OiA3NjgsXHJcbiAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgIHNsaWRlc1RvU2hvdzogNSxcclxuICAgICAgICB9LFxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRNb2RlbHNTbGlkZXIoKSB7XHJcbiAgY29uc3QgbW9kZWxzID0gJCgnLm1vZGVscycpO1xyXG4gIGlmICghbW9kZWxzLmxlbmd0aCkgcmV0dXJuO1xyXG4gIGNvbnN0IHNsaWRlciA9IG1vZGVscy5zbGljayh7XHJcbiAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICBzbGlkZXNUb1Nob3c6IGNhbGNNb2RlbHNTbGlkZXMoKSxcclxuICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgdmVydGljYWw6IHRydWUsXHJcbiAgICBwcmV2QXJyb3c6IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj5cclxuICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgYXJpYS1sYWJlbD1cIlNsaWRlciBwcmV2IGJ1dHRvbiBpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD1cIiM3NTc1NzVcIiBwb2ludHM9XCIxMCA2IDguNTkgNy40MSAxMy4xNyAxMiA4LjU5IDE2LjU5IDEwIDE4IDE2IDEyXCI+PC9wb2x5Z29uPlxyXG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPmAsXHJcbiAgICBuZXh0QXJyb3c6IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj5cclxuICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgYXJpYS1sYWJlbD1cIlNsaWRlciBuZXh0IGJ1dHRvbiBpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD1cIiM3NTc1NzVcIiBwb2ludHM9XCIxMCA2IDguNTkgNy40MSAxMy4xNyAxMiA4LjU5IDE2LjU5IDEwIDE4IDE2IDEyXCI+PC9wb2x5Z29uPlxyXG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPmAsXHJcbiAgfSk7XHJcblxyXG4gICQod2luZG93KS5yZXNpemUoZGVib3VuY2UoKCkgPT4ge1xyXG4gICAgc2xpZGVyLnNsaWNrKCdzbGlja1NldE9wdGlvbicsICdzbGlkZXNUb1Nob3cnLCBjYWxjTW9kZWxzU2xpZGVzKCksIHRydWUpO1xyXG4gIH0sIDE1MCkpO1xyXG59XHJcbmZ1bmN0aW9uIGNhbGNNb2RlbHNTbGlkZXMoKSB7XHJcbiAgY29uc3QgaGVhZGVySGVpZ2h0ID0gODA7XHJcbiAgY29uc3Qgc2xpZGVyQnRucyA9IDY4O1xyXG4gIGNvbnN0IHRvcFBhZGRpbmcgPSAxMDtcclxuICBjb25zdCBzbGlkZUhlaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoIDwgMTYwMCA/IDEwMCA6IDE1MDtcclxuXHJcbiAgY29uc3Qgc2xpZGVySGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgc2xpZGVyQnRucyArIHRvcFBhZGRpbmc7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoKHdpbmRvdy5pbm5lckhlaWdodCAtIGhlYWRlckhlaWdodCAtIHNsaWRlckJ0bnMgLSB0b3BQYWRkaW5nKSAvIHNsaWRlSGVpZ2h0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdFRvb2xzQnRucygpIHtcclxuICBsZXQgc2xpZGVyO1xyXG4gIGNvbnN0IGZ1bGxzY3JlZW4gPSAkKCcuZnVsbHNjcmVlbicpXHJcbiAgJCgnLm1vZGVsLTNkX19mdWxsc2NyZWVuLWJ0bicpLmNsaWNrKCgpID0+IHtcclxuICAgIGZ1bGxzY3JlZW4uY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IFxyXG4gICAgICBmdWxsc2NyZWVuLmNzcygnb3BhY2l0eScsIDEpO1xyXG4gICAgfSwgMCk7XHJcbiAgICAkKCcuZ2FsbGVyeS1jb250YWluZXInKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cclxuICAgIHNsaWRlciA9ICQoJy5mdWxsc2NyZWVuX19zbGlkZXInKS5zbGljayh7XHJcbiAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgcHJldkFycm93OiBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgYXJpYS1sYWJlbD1cIlNsaWRlciBwcmV2IGJ1dHRvbiBpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBmaWxsPVwiIzc1NzU3NVwiIHBvaW50cz1cIjEwIDYgOC41OSA3LjQxIDEzLjE3IDEyIDguNTkgMTYuNTkgMTAgMTggMTYgMTJcIj48L3BvbHlnb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPmAsXHJcbiAgICAgIG5leHRBcnJvdzogYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtbGFiZWw9XCJTbGlkZXIgbmV4dCBidXR0b24gaWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD1cIiM3NTc1NzVcIiBwb2ludHM9XCIxMCA2IDguNTkgNy40MSAxMy4xNyAxMiA4LjU5IDE2LjU5IDEwIDE4IDE2IDEyXCI+PC9wb2x5Z29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5gXHJcbiAgICB9KTtcclxuICB9KTtcclxuICAkKCcuZnVsbHNjcmVlbl9fY2xvc2UtYnRuJykuY2xpY2soKCkgPT4ge1xyXG4gICAgZnVsbHNjcmVlbi5jc3MoJ29wYWNpdHknLCAwKVxyXG4gICAgJCgnLmdhbGxlcnktY29udGFpbmVyJykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcclxuICAgIFxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGZ1bGxzY3JlZW4uY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgICAgc2xpZGVyLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICB9LCAzMDApO1xyXG4gIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGluaXRNZW51QnRuKCkge1xyXG4gIGNvbnN0IG1lbnUgPSAkKCcubW9iaWxlLW1lbnUnKTtcclxuICBsZXQgd2FzRnVsbHNjcmVlbiA9IGZhbHNlO1xyXG4gICQoJy5oZWFkZXJfX21lbnUtYnRuJykuY2xpY2soKCkgPT4ge1xyXG4gICAgbWVudS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgXHJcbiAgICAgIG1lbnUuY3NzKCdvcGFjaXR5JywgMSk7XHJcbiAgICB9LCAwKTtcclxuICAgICQoJy5nYWxsZXJ5LWNvbnRhaW5lcicpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAkKCcuaGVhZGVyJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuXHJcbiAgICBpZiAoJCgnLmZ1bGxzY3JlZW4nKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ2ZsZXgnKSB7XHJcbiAgICAgIHdhc0Z1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgICAkKCcuZnVsbHNjcmVlbicpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3YXNGdWxsc2NyZWVuID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJy5tb2JpbGUtbWVudV9fY2xvc2UtYnRuJykuY2xpY2soKCkgPT4ge1xyXG4gICAgbWVudS5jc3MoJ29wYWNpdHknLCAwKTtcclxuICAgICQoJy5oZWFkZXInKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICQoJy5nYWxsZXJ5LWNvbnRhaW5lcicpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcblxyXG4gICAgaWYgKHdhc0Z1bGxzY3JlZW4pIHtcclxuICAgICAgJCgnLmZ1bGxzY3JlZW4nKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgbWVudS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgfSwgMzAwKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdFNjcm9sbEJ0bnMoKSB7XHJcbiAgJCgnLm1vZGVsc19fY29udGFpbmVyJykuc2Nyb2xsKGRlYm91bmNlKChldmVudCkgPT4ge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uXHJcbiAgICBjb25zdCBjb250YWluZXIgPSAkKGV2ZW50LnRhcmdldCk7XHJcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggPCAxNjAwID8gMTAwIDogMTYwO1xyXG4gICAgY29uc3QgdG9wID0gIGNvbnRhaW5lci5zY3JvbGxUb3AoKTtcclxuICAgIGNvbnN0IGV4dHJhID0gdG9wICUgaXRlbUhlaWdodDtcclxuICAgIGlmIChleHRyYSkge1xyXG4gICAgICBjb250YWluZXIuYW5pbWF0ZSh7XHJcbiAgICAgICAgc2Nyb2xsVG9wOiBleHRyYSA8IGl0ZW1IZWlnaHQgLyAyID8gdG9wIC0gZXh0cmEgOiB0b3AgKyBpdGVtSGVpZ2h0IC0gZXh0cmFcclxuICAgICAgfSwgMzAwKTtcclxuICAgIH1cclxuICB9LCAxMDApKTtcclxuXHJcbiAgJCgnLm1vZGVsc19fc2Nyb2xsLWRvd24nKS5jbGljaygoKSA9PiB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSAkKCcubW9kZWxzX19jb250YWluZXInKTtcclxuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDE2MDAgPyAxMDAgOiAxNjA7XHJcbiAgICBjb25zdCB0b3AgPSBjb250YWluZXIuc2Nyb2xsVG9wKCk7XHJcbiAgICBjb250YWluZXIuYW5pbWF0ZSh7XHJcbiAgICAgIHNjcm9sbFRvcDogdG9wIC0gKHRvcCAlIGl0ZW1IZWlnaHQpICsgaXRlbUhlaWdodFxyXG4gICAgfSwgMzAwKTtcclxuICB9KTtcclxuICAkKCcubW9kZWxzX19zY3JvbGwtdXAnKS5jbGljaygoKSA9PiB7XHJcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggPCAxNjAwID8gMTAwIDogMTYwO1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gJCgnLm1vZGVsc19fY29udGFpbmVyJyk7XHJcbiAgICBjb25zdCB0b3AgPSBjb250YWluZXIuc2Nyb2xsVG9wKCk7XHJcbiAgICBjb250YWluZXIuYW5pbWF0ZSh7XHJcbiAgICAgIHNjcm9sbFRvcDogdG9wIC0gKHRvcCAlIGl0ZW1IZWlnaHQgfHwgaXRlbUhlaWdodClcclxuICAgIH0sIDMwMCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldE1vZGVsc0hlaWdodCgpIHtcclxuICBjb25zdCBpdGVtSGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggPCAxNjAwID8gMTAwIDogMTYwO1xyXG4gIGNvbnN0IG1vZGVsc0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDE4NjtcclxuICAkKCcubW9kZWxzX19jb250YWluZXInKS5oZWlnaHQobW9kZWxzSGVpZ2h0IC0gKG1vZGVsc0hlaWdodCAlIGl0ZW1IZWlnaHQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VsZWN0TW9kZWwoKSB7XHJcbiAgJCgnLm1vZGVsc19fbW9kZWwnKS5jbGljaygoZXZlbnQpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKDExMSk7XHJcbiAgICAkKCcubW9kZWxzX19tb2RlbCcpLnJlbW92ZUNsYXNzKCdpc1NlbGVjdGVkJyk7XHJcbiAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQgKS5hZGRDbGFzcygnaXNTZWxlY3RlZCcpO1xyXG4gIH0pO1xyXG59Il0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p1YjJSbFgyMXZaSFZzWlhNdmJHOWtZWE5vTG1SbFltOTFibU5sTDJsdVpHVjRMbXB6SWl3aWJtOWtaVjl0YjJSMWJHVnpMMnh2WkdGemFDNTBhSEp2ZEhSc1pTOXBibVJsZUM1cWN5SXNJbk55WTF4Y2FXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZEUVVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenM3T3p0QlEzcFlRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenM3T3pzN1FVTjJZa0U3T3pzN1FVRkRRVHM3T3pzN08wRkJSVUVzUlVGQlJTeFJRVUZHTEVWQlFWa3NTMEZCV2l4RFFVRnJRaXhaUVVGTk8wRkJRM1JDTEUxQlFVa3NTVUZCU2l4RFFVRlRPMEZCUTFBc1lVRkJVeXhSUVVSR08wRkJSVkFzV1VGQlVTeGhRVVpFTzBGQlIxQXNWMEZCVHl4SFFVaEJPMEZCU1ZBc1kwRkJWU3hKUVVwSU8wRkJTMUFzV1VGQlVTeEhRVXhFTzBGQlRWQXNWVUZCVFR0QlFVNURMRWRCUVZRN1FVRlJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hKUVVGRkxFMUJRVVlzUlVGQlZTeE5RVUZXTEVOQlFXbENMSEZDUVVGVExHVkJRVlFzUlVGQk1FSXNSMEZCTVVJc1EwRkJha0k3UVVGRFJDeERRVzVDUkRzN1FVRnhRa0VzVTBGQlV5eGhRVUZVTEVkQlFYbENPMEZCUTNaQ0xFbEJRVVVzYVVKQlFVWXNSVUZCY1VJc1MwRkJja0lzUTBGQk1rSXNWVUZCVlN4TFFVRldMRVZCUVdsQ08wRkJRekZETEZGQlFVa3NVMEZCVXl4RlFVRkZMRXRCUVVzc1NVRkJVQ3hEUVVGaU8wRkJRMEVzVVVGQlNTeFBRVUZQTEUxQlFWZ3NSVUZCYlVJN1FVRkRha0lzV1VGQlRTeGpRVUZPT3p0QlFVVkJMRkZCUVVVc1dVRkJSaXhGUVVGblFpeFBRVUZvUWl4RFFVRjNRanRCUVVOMFFpeHRRa0ZCVnl4UFFVRlBMRTFCUVZBc1IwRkJaMEk3UVVGRVRDeFBRVUY0UWl4RlFVVkhMRWxCUmtnc1JVRkZVeXhaUVVGWk96dEJRVVZ1UWl4WlFVRkpMRlZCUVZVc1JVRkJSU3hOUVVGR0xFTkJRV1E3UVVGRFFTeG5Ra0ZCVVN4TFFVRlNPMEZCUTBFc1dVRkJTU3hSUVVGUkxFVkJRVklzUTBGQlZ5eFJRVUZZTEVOQlFVb3NSVUZCTUVJN1FVRkRlRUlzYVVKQlFVOHNTMEZCVUR0QlFVTkVMRk5CUmtRc1RVRkZUenRCUVVOTUxHdENRVUZSTEVsQlFWSXNRMEZCWVN4VlFVRmlMRVZCUVhsQ0xFbEJRWHBDTzBGQlEwRXNhMEpCUVZFc1MwRkJVanRCUVVORU8wRkJRMFlzVDBGYVJEdEJRV0ZFTzBGQlEwWXNSMEZ1UWtRN1FVRnZRa1E3TzBGQlJVUXNVMEZCVXl4WlFVRlVMRWRCUVhkQ08wRkJRM1JDTEVsQlFVVXNjMEpCUVVZc1JVRkJNRUlzUzBGQk1VSXNRMEZCWjBNc1ZVRkJReXhMUVVGRUxFVkJRVmM3UVVGRGVrTXNVVUZCVFN4WFFVRlhMRVZCUVVVc1RVRkJUU3hOUVVGT0xFTkJRV0VzWVVGQlppeEZRVUU0UWl4UlFVRTVRaXhEUVVGMVF5d3dRa0ZCZGtNc1EwRkJha0k3UVVGRFFTeFJRVUZOTEdkQ1FVRm5RaXhGUVVGRkxESkNRVUZHTEVWQlFTdENMRTFCUVhKRU8wRkJRMEVzVVVGQlNTeFpRVUZaTEdGQlFXaENMRVZCUVN0Q08wRkJRemRDTEZGQlFVVXNUVUZCVFN4TlFVRk9MRU5CUVdFc1lVRkJaaXhGUVVFNFFpeFhRVUU1UWl4RFFVRXdReXd3UWtGQk1VTTdRVUZEUkN4TFFVWkVMRTFCUlU4c1NVRkJTU3hEUVVGRExGRkJRVVFzU1VGQllTeGhRVUZxUWl4RlFVRm5RenRCUVVOeVF5eFJRVUZGTERKQ1FVRkdMRVZCUVN0Q0xGZEJRUzlDTEVOQlFUSkRMREJDUVVFelF6dEJRVU5CTEZGQlFVVXNUVUZCVFN4TlFVRk9MRU5CUVdFc1lVRkJaaXhGUVVFNFFpeFJRVUU1UWl4RFFVRjFReXd3UWtGQmRrTTdRVUZEUkN4TFFVaE5MRTFCUjBFN1FVRkRUQ3hSUVVGRkxFMUJRVTBzVFVGQlRpeERRVUZoTEdGQlFXWXNSVUZCT0VJc1VVRkJPVUlzUTBGQmRVTXNNRUpCUVhaRE8wRkJRMFE3UVVGRFJpeEhRVmhFT3p0QlFXRkJMRWxCUVVVc1RVRkJSaXhGUVVGVkxFdEJRVllzUTBGQlowSXNWVUZCUXl4TFFVRkVMRVZCUVZjN1FVRkRla0lzVVVGQlNTeERRVUZETEVWQlFVVXNUVUZCVFN4TlFVRlNMRVZCUVdkQ0xFVkJRV2hDTEVOQlFXMUNMSE5DUVVGdVFpeERRVUZNTEVWQlFXbEVPMEZCUXk5RExGRkJRVVVzTWtKQlFVWXNSVUZCSzBJc1YwRkJMMElzUTBGQk1rTXNNRUpCUVRORE8wRkJRMFE3UVVGRFJpeEhRVXBFTzBGQlMwUTdPMEZCUlVRc1UwRkJVeXhqUVVGVUxFZEJRVEJDTzBGQlEzaENMRTFCUVVrc1owSkJRVW83UVVGRFFTeEpRVUZGTERKQ1FVRkdMRVZCUVN0Q0xFdEJRUzlDTEVOQlFYRkRMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRemxETEUxQlFVVXNjVUpCUVVZc1JVRkJlVUlzVjBGQmVrSXNRMEZCY1VNc1VVRkJja003UVVGRFFTeFJRVUZOTEZGQlFWRXNSVUZCUlN3eVFrRkJSaXhGUVVFclFpeERRVUV2UWl4RFFVRmtPMEZCUTBFc1VVRkJTU3hOUVVGTkxFdEJRVTRzUTBGQldTeFRRVUZvUWl4RlFVRXlRanRCUVVONlFpeFpRVUZOTEV0QlFVNHNRMEZCV1N4VFFVRmFMRWRCUVhkQ0xFbEJRWGhDTzBGQlEwRXNaMEpCUVZVc1YwRkJWeXhaUVVGTk8wRkJRM3BDTEdOQlFVMHNTMEZCVGl4RFFVRlpMRTlCUVZvc1IwRkJjMElzVFVGQmRFSTdRVUZEUkN4UFFVWlRMRVZCUlZBc1IwRkdUeXhEUVVGV08wRkJSMFFzUzBGTVJDeE5RVXRQTzBGQlEwd3NiVUpCUVdFc1QwRkJZanRCUVVOQkxGbEJRVTBzUzBGQlRpeERRVUZaTEU5QlFWb3NSMEZCYzBJc1QwRkJkRUk3UVVGRFFTeFpRVUZOTEV0QlFVNHNRMEZCV1N4VFFVRmFMRWRCUVhkQ0xFMUJRVTBzV1VGQlRpeEhRVUZ4UWl4SlFVRTNRenRCUVVORU8wRkJRMFlzUjBGaVJEdEJRV05FT3p0QlFVVkVMRk5CUVZNc2FVSkJRVlFzUjBGQk5rSTdRVUZETTBJc1RVRkJUU3hYUVVGWExFVkJRVVVzYlVKQlFVWXNRMEZCYWtJN1FVRkRRU3hYUVVGVExFMUJRVlFzU1VGQmJVSXNVMEZCVXl4TFFVRlVMRU5CUVdVN1FVRkRhRU1zWTBGQlZTeExRVVJ6UWp0QlFVVm9ReXhyUWtGQll5eERRVVpyUWp0QlFVZG9ReXh2UWtGQlowSXNRMEZJWjBJN1FVRkphRU1zTkZWQlNtZERPMEZCVTJoRExEUlZRVlJuUXp0QlFXTm9ReXhuUWtGQldTeERRVU5XTzBGQlEwVXNhMEpCUVZrc1IwRkVaRHRCUVVWRkxHZENRVUZWTzBGQlExSXNjMEpCUVdNN1FVRkVUanRCUVVaYUxFdEJSRlVzUlVGUFZqdEJRVU5GTEd0Q1FVRlpMRWRCUkdRN1FVRkZSU3huUWtGQlZUdEJRVU5TTEhOQ1FVRmpPMEZCUkU0N1FVRkdXaXhMUVZCVk8wRkJaRzlDTEVkQlFXWXNRMEZCYmtJN1FVRTJRa1E3TzBGQlJVUXNVMEZCVXl4blFrRkJWQ3hIUVVFMFFqdEJRVU14UWl4TlFVRk5MRk5CUVZNc1JVRkJSU3hUUVVGR0xFTkJRV1k3UVVGRFFTeE5RVUZKTEVOQlFVTXNUMEZCVHl4TlFVRmFMRVZCUVc5Q08wRkJRM0JDTEUxQlFVMHNVMEZCVXl4UFFVRlBMRXRCUVZBc1EwRkJZVHRCUVVNeFFpeGpRVUZWTEV0QlJHZENPMEZCUlRGQ0xHdENRVUZqTEd0Q1FVWlpPMEZCUnpGQ0xHOUNRVUZuUWl4RFFVaFZPMEZCU1RGQ0xHTkJRVlVzU1VGS1owSTdRVUZMTVVJc2FWUkJUREJDTzBGQlZURkNPMEZCVmpCQ0xFZEJRV0lzUTBGQlpqczdRVUZwUWtFc1NVRkJSU3hOUVVGR0xFVkJRVlVzVFVGQlZpeERRVUZwUWl4eFFrRkJVeXhaUVVGTk8wRkJRemxDTEZkQlFVOHNTMEZCVUN4RFFVRmhMR2RDUVVGaUxFVkJRU3RDTEdOQlFTOUNMRVZCUVN0RExHdENRVUV2UXl4RlFVRnRSU3hKUVVGdVJUdEJRVU5FTEVkQlJtZENMRVZCUldRc1IwRkdZeXhEUVVGcVFqdEJRVWRFTzBGQlEwUXNVMEZCVXl4blFrRkJWQ3hIUVVFMFFqdEJRVU14UWl4TlFVRk5MR1ZCUVdVc1JVRkJja0k3UVVGRFFTeE5RVUZOTEdGQlFXRXNSVUZCYmtJN1FVRkRRU3hOUVVGTkxHRkJRV0VzUlVGQmJrSTdRVUZEUVN4TlFVRk5MR05CUVdNc1QwRkJUeXhWUVVGUUxFZEJRVzlDTEVsQlFYQkNMRWRCUVRKQ0xFZEJRVE5DTEVkQlFXbERMRWRCUVhKRU96dEJRVVZCTEUxQlFVMHNaVUZCWlN4bFFVRmxMRlZCUVdZc1IwRkJORUlzVlVGQmFrUTdRVUZEUVN4VFFVRlBMRXRCUVVzc1MwRkJUQ3hEUVVGWExFTkJRVU1zVDBGQlR5eFhRVUZRTEVkQlFYRkNMRmxCUVhKQ0xFZEJRVzlETEZWQlFYQkRMRWRCUVdsRUxGVkJRV3hFTEVsQlFXZEZMRmRCUVRORkxFTkJRVkE3UVVGRFJEczdRVUZGUkN4VFFVRlRMR0ZCUVZRc1IwRkJlVUk3UVVGRGRrSXNUVUZCU1N4bFFVRktPMEZCUTBFc1RVRkJUU3hoUVVGaExFVkJRVVVzWVVGQlJpeERRVUZ1UWp0QlFVTkJMRWxCUVVVc01rSkJRVVlzUlVGQkswSXNTMEZCTDBJc1EwRkJjVU1zV1VGQlRUdEJRVU42UXl4bFFVRlhMRWRCUVZnc1EwRkJaU3hUUVVGbUxFVkJRVEJDTEUxQlFURkNPMEZCUTBFc1pVRkJWeXhaUVVGTk8wRkJRMllzYVVKQlFWY3NSMEZCV0N4RFFVRmxMRk5CUVdZc1JVRkJNRUlzUTBGQk1VSTdRVUZEUkN4TFFVWkVMRVZCUlVjc1EwRkdTRHRCUVVkQkxFMUJRVVVzYjBKQlFVWXNSVUZCZDBJc1IwRkJlRUlzUTBGQk5FSXNVMEZCTlVJc1JVRkJkVU1zVFVGQmRrTTdPMEZCUlVFc1lVRkJVeXhGUVVGRkxIRkNRVUZHTEVWQlFYbENMRXRCUVhwQ0xFTkJRU3RDTzBGQlEzUkRMR2RDUVVGVkxFdEJSRFJDTzBGQlJYUkRMRzlDUVVGakxFTkJSbmRDTzBGQlIzUkRMSE5DUVVGblFpeERRVWh6UWp0QlFVbDBReXhyUWtGQldTeEpRVW93UWp0QlFVdDBReXd5VkVGTWMwTTdRVUZWZEVNN1FVRldjME1zUzBGQkwwSXNRMEZCVkR0QlFXZENSQ3hIUVhaQ1JEdEJRWGRDUVN4SlFVRkZMSGRDUVVGR0xFVkJRVFJDTEV0QlFUVkNMRU5CUVd0RExGbEJRVTA3UVVGRGRFTXNaVUZCVnl4SFFVRllMRU5CUVdVc1UwRkJaaXhGUVVFd1FpeERRVUV4UWp0QlFVTkJMRTFCUVVVc2IwSkJRVVlzUlVGQmQwSXNSMEZCZUVJc1EwRkJORUlzVTBGQk5VSXNSVUZCZFVNc1RVRkJka003TzBGQlJVRXNaVUZCVnl4WlFVRk5PMEZCUTJZc2FVSkJRVmNzUjBGQldDeERRVUZsTEZOQlFXWXNSVUZCTUVJc1RVRkJNVUk3UVVGRFFTeGhRVUZQTEV0QlFWQXNRMEZCWVN4VFFVRmlPMEZCUTBRc1MwRklSQ3hGUVVkSExFZEJTRWc3UVVGSlJDeEhRVkpFTzBGQlUwUTdRVUZEUkN4VFFVRlRMRmRCUVZRc1IwRkJkVUk3UVVGRGNrSXNUVUZCVFN4UFFVRlBMRVZCUVVVc1kwRkJSaXhEUVVGaU8wRkJRMEVzVFVGQlNTeG5Ra0ZCWjBJc1MwRkJjRUk3UVVGRFFTeEpRVUZGTEcxQ1FVRkdMRVZCUVhWQ0xFdEJRWFpDTEVOQlFUWkNMRmxCUVUwN1FVRkRha01zVTBGQlN5eEhRVUZNTEVOQlFWTXNVMEZCVkN4RlFVRnZRaXhOUVVGd1FqdEJRVU5CTEdWQlFWY3NXVUZCVFR0QlFVTm1MRmRCUVVzc1IwRkJUQ3hEUVVGVExGTkJRVlFzUlVGQmIwSXNRMEZCY0VJN1FVRkRSQ3hMUVVaRUxFVkJSVWNzUTBGR1NEdEJRVWRCTEUxQlFVVXNiMEpCUVVZc1JVRkJkMElzUjBGQmVFSXNRMEZCTkVJc1UwRkJOVUlzUlVGQmRVTXNUVUZCZGtNN1FVRkRRU3hOUVVGRkxGTkJRVVlzUlVGQllTeEhRVUZpTEVOQlFXbENMRk5CUVdwQ0xFVkJRVFJDTEUxQlFUVkNPenRCUVVWQkxGRkJRVWtzUlVGQlJTeGhRVUZHTEVWQlFXbENMRWRCUVdwQ0xFTkJRWEZDTEZOQlFYSkNMRTFCUVc5RExFMUJRWGhETEVWQlFXZEVPMEZCUXpsRExITkNRVUZuUWl4SlFVRm9RanRCUVVOQkxGRkJRVVVzWVVGQlJpeEZRVUZwUWl4SFFVRnFRaXhEUVVGeFFpeFRRVUZ5UWl4RlFVRm5ReXhOUVVGb1F6dEJRVU5FTEV0QlNFUXNUVUZIVHp0QlFVTk1MSE5DUVVGblFpeExRVUZvUWp0QlFVTkVPMEZCUTBZc1IwRmtSRHM3UVVGblFrRXNTVUZCUlN4NVFrRkJSaXhGUVVFMlFpeExRVUUzUWl4RFFVRnRReXhaUVVGTk8wRkJRM1pETEZOQlFVc3NSMEZCVEN4RFFVRlRMRk5CUVZRc1JVRkJiMElzUTBGQmNFSTdRVUZEUVN4TlFVRkZMRk5CUVVZc1JVRkJZU3hIUVVGaUxFTkJRV2xDTEZOQlFXcENMRVZCUVRSQ0xFOUJRVFZDTzBGQlEwRXNUVUZCUlN4dlFrRkJSaXhGUVVGM1FpeEhRVUY0UWl4RFFVRTBRaXhUUVVFMVFpeEZRVUYxUXl4TlFVRjJRenM3UVVGRlFTeFJRVUZKTEdGQlFVb3NSVUZCYlVJN1FVRkRha0lzVVVGQlJTeGhRVUZHTEVWQlFXbENMRWRCUVdwQ0xFTkJRWEZDTEZOQlFYSkNMRVZCUVdkRExFMUJRV2hETzBGQlEwUTdPMEZCUlVRc1pVRkJWeXhaUVVGTk8wRkJRMllzVjBGQlN5eEhRVUZNTEVOQlFWTXNVMEZCVkN4RlFVRnZRaXhOUVVGd1FqdEJRVU5FTEV0QlJrUXNSVUZGUnl4SFFVWklPMEZCUjBRc1IwRmFSRHRCUVdGRU96dEJRVVZFTEZOQlFWTXNZMEZCVkN4SFFVRXdRanRCUVVONFFpeEpRVUZGTEc5Q1FVRkdMRVZCUVhkQ0xFMUJRWGhDTEVOQlFTdENMSEZDUVVGVExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlEycEVMRlZCUVUwc1pVRkJUanRCUVVOQkxGRkJRVTBzV1VGQldTeEZRVUZGTEUxQlFVMHNUVUZCVWl4RFFVRnNRanRCUVVOQkxGRkJRVTBzWVVGQllTeFBRVUZQTEZWQlFWQXNSMEZCYjBJc1NVRkJjRUlzUjBGQk1rSXNSMEZCTTBJc1IwRkJhVU1zUjBGQmNFUTdRVUZEUVN4UlFVRk5MRTFCUVU4c1ZVRkJWU3hUUVVGV0xFVkJRV0k3UVVGRFFTeFJRVUZOTEZGQlFWRXNUVUZCVFN4VlFVRndRanRCUVVOQkxGRkJRVWtzUzBGQlNpeEZRVUZYTzBGQlExUXNaMEpCUVZVc1QwRkJWaXhEUVVGclFqdEJRVU5vUWl4dFFrRkJWeXhSUVVGUkxHRkJRV0VzUTBGQmNrSXNSMEZCZVVJc1RVRkJUU3hMUVVFdlFpeEhRVUYxUXl4TlFVRk5MRlZCUVU0c1IwRkJiVUk3UVVGRWNrUXNUMEZCYkVJc1JVRkZSeXhIUVVaSU8wRkJSMFE3UVVGRFJpeEhRVmc0UWl4RlFWYzFRaXhIUVZnMFFpeERRVUV2UWpzN1FVRmhRU3hKUVVGRkxITkNRVUZHTEVWQlFUQkNMRXRCUVRGQ0xFTkJRV2RETEZsQlFVMDdRVUZEY0VNc1VVRkJUU3haUVVGWkxFVkJRVVVzYjBKQlFVWXNRMEZCYkVJN1FVRkRRU3hSUVVGTkxHRkJRV0VzVDBGQlR5eFZRVUZRTEVkQlFXOUNMRWxCUVhCQ0xFZEJRVEpDTEVkQlFUTkNMRWRCUVdsRExFZEJRWEJFTzBGQlEwRXNVVUZCVFN4TlFVRk5MRlZCUVZVc1UwRkJWaXhGUVVGYU8wRkJRMEVzWTBGQlZTeFBRVUZXTEVOQlFXdENPMEZCUTJoQ0xHbENRVUZYTEUxQlFVOHNUVUZCVFN4VlFVRmlMRWRCUVRKQ08wRkJSSFJDTEV0QlFXeENMRVZCUlVjc1IwRkdTRHRCUVVkRUxFZEJVRVE3UVVGUlFTeEpRVUZGTEc5Q1FVRkdMRVZCUVhkQ0xFdEJRWGhDTEVOQlFUaENMRmxCUVUwN1FVRkRiRU1zVVVGQlRTeGhRVUZoTEU5QlFVOHNWVUZCVUN4SFFVRnZRaXhKUVVGd1FpeEhRVUV5UWl4SFFVRXpRaXhIUVVGcFF5eEhRVUZ3UkR0QlFVTkJMRkZCUVUwc1dVRkJXU3hGUVVGRkxHOUNRVUZHTEVOQlFXeENPMEZCUTBFc1VVRkJUU3hOUVVGTkxGVkJRVlVzVTBGQlZpeEZRVUZhTzBGQlEwRXNZMEZCVlN4UFFVRldMRU5CUVd0Q08wRkJRMmhDTEdsQ1FVRlhMRTlCUVU4c1RVRkJUU3hWUVVGT0xFbEJRVzlDTEZWQlFUTkNPMEZCUkVzc1MwRkJiRUlzUlVGRlJ5eEhRVVpJTzBGQlIwUXNSMEZRUkR0QlFWRkVPenRCUVVWRUxGTkJRVk1zWlVGQlZDeEhRVUV5UWp0QlFVTjZRaXhOUVVGTkxHRkJRV0VzVDBGQlR5eFZRVUZRTEVkQlFXOUNMRWxCUVhCQ0xFZEJRVEpDTEVkQlFUTkNMRWRCUVdsRExFZEJRWEJFTzBGQlEwRXNUVUZCVFN4bFFVRmxMRTlCUVU4c1YwRkJVQ3hIUVVGeFFpeEhRVUV4UXp0QlFVTkJMRWxCUVVVc2IwSkJRVVlzUlVGQmQwSXNUVUZCZUVJc1EwRkJLMElzWlVGQlowSXNaVUZCWlN4VlFVRTVSRHRCUVVORU96dEJRVVZFTEZOQlFWTXNWMEZCVkN4SFFVRjFRanRCUVVOeVFpeEpRVUZGTEdkQ1FVRkdMRVZCUVc5Q0xFdEJRWEJDTEVOQlFUQkNMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRMjVETEZsQlFWRXNSMEZCVWl4RFFVRlpMRWRCUVZvN1FVRkRRU3hOUVVGRkxHZENRVUZHTEVWQlFXOUNMRmRCUVhCQ0xFTkJRV2RETEZsQlFXaERPMEZCUTBFc1RVRkJSU3hOUVVGTkxHRkJRVklzUlVGQmQwSXNVVUZCZUVJc1EwRkJhVU1zV1VGQmFrTTdRVUZEUkN4SFFVcEVPMEZCUzBRaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWhtZFc1amRHbHZiaUJsS0hRc2JpeHlLWHRtZFc1amRHbHZiaUJ6S0c4c2RTbDdhV1lvSVc1YmIxMHBlMmxtS0NGMFcyOWRLWHQyWVhJZ1lUMTBlWEJsYjJZZ2NtVnhkV2x5WlQwOVhDSm1kVzVqZEdsdmJsd2lKaVp5WlhGMWFYSmxPMmxtS0NGMUppWmhLWEpsZEhWeWJpQmhLRzhzSVRBcE8ybG1LR2twY21WMGRYSnVJR2tvYnl3aE1DazdkbUZ5SUdZOWJtVjNJRVZ5Y205eUtGd2lRMkZ1Ym05MElHWnBibVFnYlc5a2RXeGxJQ2RjSWl0dksxd2lKMXdpS1R0MGFISnZkeUJtTG1OdlpHVTlYQ0pOVDBSVlRFVmZUazlVWDBaUFZVNUVYQ0lzWm4xMllYSWdiRDF1VzI5ZFBYdGxlSEJ2Y25Sek9udDlmVHQwVzI5ZFd6QmRMbU5oYkd3b2JDNWxlSEJ2Y25SekxHWjFibU4wYVc5dUtHVXBlM1poY2lCdVBYUmJiMTFiTVYxYlpWMDdjbVYwZFhKdUlITW9iajl1T21VcGZTeHNMR3d1Wlhod2IzSjBjeXhsTEhRc2JpeHlLWDF5WlhSMWNtNGdibHR2WFM1bGVIQnZjblJ6ZlhaaGNpQnBQWFI1Y0dWdlppQnlaWEYxYVhKbFBUMWNJbVoxYm1OMGFXOXVYQ0ltSm5KbGNYVnBjbVU3Wm05eUtIWmhjaUJ2UFRBN2J6eHlMbXhsYm1kMGFEdHZLeXNwY3loeVcyOWRLVHR5WlhSMWNtNGdjMzBwSWl3aUx5b3FYRzRnS2lCc2IyUmhjMmdnS0VOMWMzUnZiU0JDZFdsc1pDa2dQR2gwZEhCek9pOHZiRzlrWVhOb0xtTnZiUzgrWEc0Z0tpQkNkV2xzWkRvZ1lHeHZaR0Z6YUNCdGIyUjFiR0Z5YVhwbElHVjRjRzl5ZEhNOVhDSnVjRzFjSWlBdGJ5QXVMMkJjYmlBcUlFTnZjSGx5YVdkb2RDQnFVWFZsY25rZ1JtOTFibVJoZEdsdmJpQmhibVFnYjNSb1pYSWdZMjl1ZEhKcFluVjBiM0p6SUR4b2RIUndjem92TDJweGRXVnllUzV2Y21jdlBseHVJQ29nVW1Wc1pXRnpaV1FnZFc1a1pYSWdUVWxVSUd4cFkyVnVjMlVnUEdoMGRIQnpPaTh2Ykc5a1lYTm9MbU52YlM5c2FXTmxibk5sUGx4dUlDb2dRbUZ6WldRZ2IyNGdWVzVrWlhKelkyOXlaUzVxY3lBeExqZ3VNeUE4YUhSMGNEb3ZMM1Z1WkdWeWMyTnZjbVZxY3k1dmNtY3ZURWxEUlU1VFJUNWNiaUFxSUVOdmNIbHlhV2RvZENCS1pYSmxiWGtnUVhOb2EyVnVZWE1zSUVSdlkzVnRaVzUwUTJ4dmRXUWdZVzVrSUVsdWRtVnpkR2xuWVhScGRtVWdVbVZ3YjNKMFpYSnpJQ1lnUldScGRHOXljMXh1SUNvdlhHNWNiaThxS2lCVmMyVmtJR0Z6SUhSb1pTQmdWSGx3WlVWeWNtOXlZQ0J0WlhOellXZGxJR1p2Y2lCY0lrWjFibU4wYVc5dWMxd2lJRzFsZEdodlpITXVJQ292WEc1MllYSWdSbFZPUTE5RlVsSlBVbDlVUlZoVUlEMGdKMFY0Y0dWamRHVmtJR0VnWm5WdVkzUnBiMjRuTzF4dVhHNHZLaW9nVlhObFpDQmhjeUJ5WldabGNtVnVZMlZ6SUdadmNpQjJZWEpwYjNWeklHQk9kVzFpWlhKZ0lHTnZibk4wWVc1MGN5NGdLaTljYm5aaGNpQk9RVTRnUFNBd0lDOGdNRHRjYmx4dUx5b3FJR0JQWW1wbFkzUWpkRzlUZEhKcGJtZGdJSEpsYzNWc2RDQnlaV1psY21WdVkyVnpMaUFxTDF4dWRtRnlJSE41YldKdmJGUmhaeUE5SUNkYmIySnFaV04wSUZONWJXSnZiRjBuTzF4dVhHNHZLaW9nVlhObFpDQjBieUJ0WVhSamFDQnNaV0ZrYVc1bklHRnVaQ0IwY21GcGJHbHVaeUIzYUdsMFpYTndZV05sTGlBcUwxeHVkbUZ5SUhKbFZISnBiU0E5SUM5ZVhGeHpLM3hjWEhNckpDOW5PMXh1WEc0dktpb2dWWE5sWkNCMGJ5QmtaWFJsWTNRZ1ltRmtJSE5wWjI1bFpDQm9aWGhoWkdWamFXMWhiQ0J6ZEhKcGJtY2dkbUZzZFdWekxpQXFMMXh1ZG1GeUlISmxTWE5DWVdSSVpYZ2dQU0F2WGxzdEsxMHdlRnN3TFRsaExXWmRLeVF2YVR0Y2JseHVMeW9xSUZWelpXUWdkRzhnWkdWMFpXTjBJR0pwYm1GeWVTQnpkSEpwYm1jZ2RtRnNkV1Z6TGlBcUwxeHVkbUZ5SUhKbFNYTkNhVzVoY25rZ1BTQXZYakJpV3pBeFhTc2tMMms3WEc1Y2JpOHFLaUJWYzJWa0lIUnZJR1JsZEdWamRDQnZZM1JoYkNCemRISnBibWNnZG1Gc2RXVnpMaUFxTDF4dWRtRnlJSEpsU1hOUFkzUmhiQ0E5SUM5ZU1HOWJNQzAzWFNza0wyazdYRzVjYmk4cUtpQkNkV2xzZEMxcGJpQnRaWFJvYjJRZ2NtVm1aWEpsYm1ObGN5QjNhWFJvYjNWMElHRWdaR1Z3Wlc1a1pXNWplU0J2YmlCZ2NtOXZkR0F1SUNvdlhHNTJZWElnWm5KbFpWQmhjbk5sU1c1MElEMGdjR0Z5YzJWSmJuUTdYRzVjYmk4cUtpQkVaWFJsWTNRZ1puSmxaU0IyWVhKcFlXSnNaU0JnWjJ4dlltRnNZQ0JtY205dElFNXZaR1V1YW5NdUlDb3ZYRzUyWVhJZ1puSmxaVWRzYjJKaGJDQTlJSFI1Y0dWdlppQm5iRzlpWVd3Z1BUMGdKMjlpYW1WamRDY2dKaVlnWjJ4dlltRnNJQ1ltSUdkc2IySmhiQzVQWW1wbFkzUWdQVDA5SUU5aWFtVmpkQ0FtSmlCbmJHOWlZV3c3WEc1Y2JpOHFLaUJFWlhSbFkzUWdabkpsWlNCMllYSnBZV0pzWlNCZ2MyVnNabUF1SUNvdlhHNTJZWElnWm5KbFpWTmxiR1lnUFNCMGVYQmxiMllnYzJWc1ppQTlQU0FuYjJKcVpXTjBKeUFtSmlCelpXeG1JQ1ltSUhObGJHWXVUMkpxWldOMElEMDlQU0JQWW1wbFkzUWdKaVlnYzJWc1pqdGNibHh1THlvcUlGVnpaV1FnWVhNZ1lTQnlaV1psY21WdVkyVWdkRzhnZEdobElHZHNiMkpoYkNCdlltcGxZM1F1SUNvdlhHNTJZWElnY205dmRDQTlJR1p5WldWSGJHOWlZV3dnZkh3Z1puSmxaVk5sYkdZZ2ZId2dSblZ1WTNScGIyNG9KM0psZEhWeWJpQjBhR2x6Snlrb0tUdGNibHh1THlvcUlGVnpaV1FnWm05eUlHSjFhV3gwTFdsdUlHMWxkR2h2WkNCeVpXWmxjbVZ1WTJWekxpQXFMMXh1ZG1GeUlHOWlhbVZqZEZCeWIzUnZJRDBnVDJKcVpXTjBMbkJ5YjNSdmRIbHdaVHRjYmx4dUx5b3FYRzRnS2lCVmMyVmtJSFJ2SUhKbGMyOXNkbVVnZEdobFhHNGdLaUJiWUhSdlUzUnlhVzVuVkdGbllGMG9hSFIwY0RvdkwyVmpiV0V0YVc1MFpYSnVZWFJwYjI1aGJDNXZjbWN2WldOdFlTMHlOakl2Tnk0d0x5TnpaV010YjJKcVpXTjBMbkJ5YjNSdmRIbHdaUzUwYjNOMGNtbHVaeWxjYmlBcUlHOW1JSFpoYkhWbGN5NWNiaUFxTDF4dWRtRnlJRzlpYW1WamRGUnZVM1J5YVc1bklEMGdiMkpxWldOMFVISnZkRzh1ZEc5VGRISnBibWM3WEc1Y2JpOHFJRUoxYVd4MExXbHVJRzFsZEdodlpDQnlaV1psY21WdVkyVnpJR1p2Y2lCMGFHOXpaU0IzYVhSb0lIUm9aU0J6WVcxbElHNWhiV1VnWVhNZ2IzUm9aWElnWUd4dlpHRnphR0FnYldWMGFHOWtjeTRnS2k5Y2JuWmhjaUJ1WVhScGRtVk5ZWGdnUFNCTllYUm9MbTFoZUN4Y2JpQWdJQ0J1WVhScGRtVk5hVzRnUFNCTllYUm9MbTFwYmp0Y2JseHVMeW9xWEc0Z0tpQkhaWFJ6SUhSb1pTQjBhVzFsYzNSaGJYQWdiMllnZEdobElHNTFiV0psY2lCdlppQnRhV3hzYVhObFkyOXVaSE1nZEdoaGRDQm9ZWFpsSUdWc1lYQnpaV1FnYzJsdVkyVmNiaUFxSUhSb1pTQlZibWw0SUdWd2IyTm9JQ2d4SUVwaGJuVmhjbmtnTVRrM01DQXdNRG93TURvd01DQlZWRU1wTGx4dUlDcGNiaUFxSUVCemRHRjBhV05jYmlBcUlFQnRaVzFpWlhKUFppQmZYRzRnS2lCQWMybHVZMlVnTWk0MExqQmNiaUFxSUVCallYUmxaMjl5ZVNCRVlYUmxYRzRnS2lCQWNtVjBkWEp1Y3lCN2JuVnRZbVZ5ZlNCU1pYUjFjbTV6SUhSb1pTQjBhVzFsYzNSaGJYQXVYRzRnS2lCQVpYaGhiWEJzWlZ4dUlDcGNiaUFxSUY4dVpHVm1aWElvWm5WdVkzUnBiMjRvYzNSaGJYQXBJSHRjYmlBcUlDQWdZMjl1YzI5c1pTNXNiMmNvWHk1dWIzY29LU0F0SUhOMFlXMXdLVHRjYmlBcUlIMHNJRjh1Ym05M0tDa3BPMXh1SUNvZ0x5OGdQVDRnVEc5bmN5QjBhR1VnYm5WdFltVnlJRzltSUcxcGJHeHBjMlZqYjI1a2N5QnBkQ0IwYjI5cklHWnZjaUIwYUdVZ1pHVm1aWEp5WldRZ2FXNTJiMk5oZEdsdmJpNWNiaUFxTDF4dWRtRnlJRzV2ZHlBOUlHWjFibU4wYVc5dUtDa2dlMXh1SUNCeVpYUjFjbTRnY205dmRDNUVZWFJsTG01dmR5Z3BPMXh1ZlR0Y2JseHVMeW9xWEc0Z0tpQkRjbVZoZEdWeklHRWdaR1ZpYjNWdVkyVmtJR1oxYm1OMGFXOXVJSFJvWVhRZ1pHVnNZWGx6SUdsdWRtOXJhVzVuSUdCbWRXNWpZQ0IxYm5ScGJDQmhablJsY2lCZ2QyRnBkR0JjYmlBcUlHMXBiR3hwYzJWamIyNWtjeUJvWVhabElHVnNZWEJ6WldRZ2MybHVZMlVnZEdobElHeGhjM1FnZEdsdFpTQjBhR1VnWkdWaWIzVnVZMlZrSUdaMWJtTjBhVzl1SUhkaGMxeHVJQ29nYVc1MmIydGxaQzRnVkdobElHUmxZbTkxYm1ObFpDQm1kVzVqZEdsdmJpQmpiMjFsY3lCM2FYUm9JR0VnWUdOaGJtTmxiR0FnYldWMGFHOWtJSFJ2SUdOaGJtTmxiRnh1SUNvZ1pHVnNZWGxsWkNCZ1puVnVZMkFnYVc1MmIyTmhkR2x2Ym5NZ1lXNWtJR0VnWUdac2RYTm9ZQ0J0WlhSb2IyUWdkRzhnYVcxdFpXUnBZWFJsYkhrZ2FXNTJiMnRsSUhSb1pXMHVYRzRnS2lCUWNtOTJhV1JsSUdCdmNIUnBiMjV6WUNCMGJ5QnBibVJwWTJGMFpTQjNhR1YwYUdWeUlHQm1kVzVqWUNCemFHOTFiR1FnWW1VZ2FXNTJiMnRsWkNCdmJpQjBhR1ZjYmlBcUlHeGxZV1JwYm1jZ1lXNWtMMjl5SUhSeVlXbHNhVzVuSUdWa1oyVWdiMllnZEdobElHQjNZV2wwWUNCMGFXMWxiM1YwTGlCVWFHVWdZR1oxYm1OZ0lHbHpJR2x1ZG05clpXUmNiaUFxSUhkcGRHZ2dkR2hsSUd4aGMzUWdZWEpuZFcxbGJuUnpJSEJ5YjNacFpHVmtJSFJ2SUhSb1pTQmtaV0p2ZFc1alpXUWdablZ1WTNScGIyNHVJRk4xWW5ObGNYVmxiblJjYmlBcUlHTmhiR3h6SUhSdklIUm9aU0JrWldKdmRXNWpaV1FnWm5WdVkzUnBiMjRnY21WMGRYSnVJSFJvWlNCeVpYTjFiSFFnYjJZZ2RHaGxJR3hoYzNRZ1lHWjFibU5nWEc0Z0tpQnBiblp2WTJGMGFXOXVMbHh1SUNwY2JpQXFJQ29xVG05MFpUb3FLaUJKWmlCZ2JHVmhaR2x1WjJBZ1lXNWtJR0IwY21GcGJHbHVaMkFnYjNCMGFXOXVjeUJoY21VZ1lIUnlkV1ZnTENCZ1puVnVZMkFnYVhOY2JpQXFJR2x1ZG05clpXUWdiMjRnZEdobElIUnlZV2xzYVc1bklHVmtaMlVnYjJZZ2RHaGxJSFJwYldWdmRYUWdiMjVzZVNCcFppQjBhR1VnWkdWaWIzVnVZMlZrSUdaMWJtTjBhVzl1WEc0Z0tpQnBjeUJwYm5admEyVmtJRzF2Y21VZ2RHaGhiaUJ2Ym1ObElHUjFjbWx1WnlCMGFHVWdZSGRoYVhSZ0lIUnBiV1Z2ZFhRdVhHNGdLbHh1SUNvZ1NXWWdZSGRoYVhSZ0lHbHpJR0F3WUNCaGJtUWdZR3hsWVdScGJtZGdJR2x6SUdCbVlXeHpaV0FzSUdCbWRXNWpZQ0JwYm5adlkyRjBhVzl1SUdseklHUmxabVZ5Y21Wa1hHNGdLaUIxYm5ScGJDQjBieUIwYUdVZ2JtVjRkQ0IwYVdOckxDQnphVzFwYkdGeUlIUnZJR0J6WlhSVWFXMWxiM1YwWUNCM2FYUm9JR0VnZEdsdFpXOTFkQ0J2WmlCZ01HQXVYRzRnS2x4dUlDb2dVMlZsSUZ0RVlYWnBaQ0JEYjNKaVlXTm9ieWR6SUdGeWRHbGpiR1ZkS0doMGRIQnpPaTh2WTNOekxYUnlhV05yY3k1amIyMHZaR1ZpYjNWdVkybHVaeTEwYUhKdmRIUnNhVzVuTFdWNGNHeGhhVzVsWkMxbGVHRnRjR3hsY3k4cFhHNGdLaUJtYjNJZ1pHVjBZV2xzY3lCdmRtVnlJSFJvWlNCa2FXWm1aWEpsYm1ObGN5QmlaWFIzWldWdUlHQmZMbVJsWW05MWJtTmxZQ0JoYm1RZ1lGOHVkR2h5YjNSMGJHVmdMbHh1SUNwY2JpQXFJRUJ6ZEdGMGFXTmNiaUFxSUVCdFpXMWlaWEpQWmlCZlhHNGdLaUJBYzJsdVkyVWdNQzR4TGpCY2JpQXFJRUJqWVhSbFoyOXllU0JHZFc1amRHbHZibHh1SUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ1puVnVZeUJVYUdVZ1puVnVZM1JwYjI0Z2RHOGdaR1ZpYjNWdVkyVXVYRzRnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnVzNkaGFYUTlNRjBnVkdobElHNTFiV0psY2lCdlppQnRhV3hzYVhObFkyOXVaSE1nZEc4Z1pHVnNZWGt1WEc0Z0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ1cyOXdkR2x2Ym5NOWUzMWRJRlJvWlNCdmNIUnBiMjV6SUc5aWFtVmpkQzVjYmlBcUlFQndZWEpoYlNCN1ltOXZiR1ZoYm4wZ1cyOXdkR2x2Ym5NdWJHVmhaR2x1WnoxbVlXeHpaVjFjYmlBcUlDQlRjR1ZqYVdaNUlHbHVkbTlyYVc1bklHOXVJSFJvWlNCc1pXRmthVzVuSUdWa1oyVWdiMllnZEdobElIUnBiV1Z2ZFhRdVhHNGdLaUJBY0dGeVlXMGdlMjUxYldKbGNuMGdXMjl3ZEdsdmJuTXViV0Y0VjJGcGRGMWNiaUFxSUNCVWFHVWdiV0Y0YVcxMWJTQjBhVzFsSUdCbWRXNWpZQ0JwY3lCaGJHeHZkMlZrSUhSdklHSmxJR1JsYkdGNVpXUWdZbVZtYjNKbElHbDBKM01nYVc1MmIydGxaQzVjYmlBcUlFQndZWEpoYlNCN1ltOXZiR1ZoYm4wZ1cyOXdkR2x2Ym5NdWRISmhhV3hwYm1jOWRISjFaVjFjYmlBcUlDQlRjR1ZqYVdaNUlHbHVkbTlyYVc1bklHOXVJSFJvWlNCMGNtRnBiR2x1WnlCbFpHZGxJRzltSUhSb1pTQjBhVzFsYjNWMExseHVJQ29nUUhKbGRIVnlibk1nZTBaMWJtTjBhVzl1ZlNCU1pYUjFjbTV6SUhSb1pTQnVaWGNnWkdWaWIzVnVZMlZrSUdaMWJtTjBhVzl1TGx4dUlDb2dRR1Y0WVcxd2JHVmNiaUFxWEc0Z0tpQXZMeUJCZG05cFpDQmpiM04wYkhrZ1kyRnNZM1ZzWVhScGIyNXpJSGRvYVd4bElIUm9aU0IzYVc1a2IzY2djMmw2WlNCcGN5QnBiaUJtYkhWNExseHVJQ29nYWxGMVpYSjVLSGRwYm1SdmR5a3ViMjRvSjNKbGMybDZaU2NzSUY4dVpHVmliM1Z1WTJVb1kyRnNZM1ZzWVhSbFRHRjViM1YwTENBeE5UQXBLVHRjYmlBcVhHNGdLaUF2THlCSmJuWnZhMlVnWUhObGJtUk5ZV2xzWUNCM2FHVnVJR05zYVdOclpXUXNJR1JsWW05MWJtTnBibWNnYzNWaWMyVnhkV1Z1ZENCallXeHNjeTVjYmlBcUlHcFJkV1Z5ZVNobGJHVnRaVzUwS1M1dmJpZ25ZMnhwWTJzbkxDQmZMbVJsWW05MWJtTmxLSE5sYm1STllXbHNMQ0F6TURBc0lIdGNiaUFxSUNBZ0oyeGxZV1JwYm1jbk9pQjBjblZsTEZ4dUlDb2dJQ0FuZEhKaGFXeHBibWNuT2lCbVlXeHpaVnh1SUNvZ2ZTa3BPMXh1SUNwY2JpQXFJQzh2SUVWdWMzVnlaU0JnWW1GMFkyaE1iMmRnSUdseklHbHVkbTlyWldRZ2IyNWpaU0JoWm5SbGNpQXhJSE5sWTI5dVpDQnZaaUJrWldKdmRXNWpaV1FnWTJGc2JITXVYRzRnS2lCMllYSWdaR1ZpYjNWdVkyVmtJRDBnWHk1a1pXSnZkVzVqWlNoaVlYUmphRXh2Wnl3Z01qVXdMQ0I3SUNkdFlYaFhZV2wwSnpvZ01UQXdNQ0I5S1R0Y2JpQXFJSFpoY2lCemIzVnlZMlVnUFNCdVpYY2dSWFpsYm5SVGIzVnlZMlVvSnk5emRISmxZVzBuS1R0Y2JpQXFJR3BSZFdWeWVTaHpiM1Z5WTJVcExtOXVLQ2R0WlhOellXZGxKeXdnWkdWaWIzVnVZMlZrS1R0Y2JpQXFYRzRnS2lBdkx5QkRZVzVqWld3Z2RHaGxJSFJ5WVdsc2FXNW5JR1JsWW05MWJtTmxaQ0JwYm5adlkyRjBhVzl1TGx4dUlDb2dhbEYxWlhKNUtIZHBibVJ2ZHlrdWIyNG9KM0J2Y0hOMFlYUmxKeXdnWkdWaWIzVnVZMlZrTG1OaGJtTmxiQ2s3WEc0Z0tpOWNibVoxYm1OMGFXOXVJR1JsWW05MWJtTmxLR1oxYm1Nc0lIZGhhWFFzSUc5d2RHbHZibk1wSUh0Y2JpQWdkbUZ5SUd4aGMzUkJjbWR6TEZ4dUlDQWdJQ0FnYkdGemRGUm9hWE1zWEc0Z0lDQWdJQ0J0WVhoWFlXbDBMRnh1SUNBZ0lDQWdjbVZ6ZFd4MExGeHVJQ0FnSUNBZ2RHbHRaWEpKWkN4Y2JpQWdJQ0FnSUd4aGMzUkRZV3hzVkdsdFpTeGNiaUFnSUNBZ0lHeGhjM1JKYm5admEyVlVhVzFsSUQwZ01DeGNiaUFnSUNBZ0lHeGxZV1JwYm1jZ1BTQm1ZV3h6WlN4Y2JpQWdJQ0FnSUcxaGVHbHVaeUE5SUdaaGJITmxMRnh1SUNBZ0lDQWdkSEpoYVd4cGJtY2dQU0IwY25WbE8xeHVYRzRnSUdsbUlDaDBlWEJsYjJZZ1puVnVZeUFoUFNBblpuVnVZM1JwYjI0bktTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lGUjVjR1ZGY25KdmNpaEdWVTVEWDBWU1VrOVNYMVJGV0ZRcE8xeHVJQ0I5WEc0Z0lIZGhhWFFnUFNCMGIwNTFiV0psY2loM1lXbDBLU0I4ZkNBd08xeHVJQ0JwWmlBb2FYTlBZbXBsWTNRb2IzQjBhVzl1Y3lrcElIdGNiaUFnSUNCc1pXRmthVzVuSUQwZ0lTRnZjSFJwYjI1ekxteGxZV1JwYm1jN1hHNGdJQ0FnYldGNGFXNW5JRDBnSjIxaGVGZGhhWFFuSUdsdUlHOXdkR2x2Ym5NN1hHNGdJQ0FnYldGNFYyRnBkQ0E5SUcxaGVHbHVaeUEvSUc1aGRHbDJaVTFoZUNoMGIwNTFiV0psY2lodmNIUnBiMjV6TG0xaGVGZGhhWFFwSUh4OElEQXNJSGRoYVhRcElEb2diV0Y0VjJGcGREdGNiaUFnSUNCMGNtRnBiR2x1WnlBOUlDZDBjbUZwYkdsdVp5Y2dhVzRnYjNCMGFXOXVjeUEvSUNFaGIzQjBhVzl1Y3k1MGNtRnBiR2x1WnlBNklIUnlZV2xzYVc1bk8xeHVJQ0I5WEc1Y2JpQWdablZ1WTNScGIyNGdhVzUyYjJ0bFJuVnVZeWgwYVcxbEtTQjdYRzRnSUNBZ2RtRnlJR0Z5WjNNZ1BTQnNZWE4wUVhKbmN5eGNiaUFnSUNBZ0lDQWdkR2hwYzBGeVp5QTlJR3hoYzNSVWFHbHpPMXh1WEc0Z0lDQWdiR0Z6ZEVGeVozTWdQU0JzWVhOMFZHaHBjeUE5SUhWdVpHVm1hVzVsWkR0Y2JpQWdJQ0JzWVhOMFNXNTJiMnRsVkdsdFpTQTlJSFJwYldVN1hHNGdJQ0FnY21WemRXeDBJRDBnWm5WdVl5NWhjSEJzZVNoMGFHbHpRWEpuTENCaGNtZHpLVHRjYmlBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z2JHVmhaR2x1WjBWa1oyVW9kR2x0WlNrZ2UxeHVJQ0FnSUM4dklGSmxjMlYwSUdGdWVTQmdiV0Y0VjJGcGRHQWdkR2x0WlhJdVhHNGdJQ0FnYkdGemRFbHVkbTlyWlZScGJXVWdQU0IwYVcxbE8xeHVJQ0FnSUM4dklGTjBZWEowSUhSb1pTQjBhVzFsY2lCbWIzSWdkR2hsSUhSeVlXbHNhVzVuSUdWa1oyVXVYRzRnSUNBZ2RHbHRaWEpKWkNBOUlITmxkRlJwYldWdmRYUW9kR2x0WlhKRmVIQnBjbVZrTENCM1lXbDBLVHRjYmlBZ0lDQXZMeUJKYm5admEyVWdkR2hsSUd4bFlXUnBibWNnWldSblpTNWNiaUFnSUNCeVpYUjFjbTRnYkdWaFpHbHVaeUEvSUdsdWRtOXJaVVoxYm1Nb2RHbHRaU2tnT2lCeVpYTjFiSFE3WEc0Z0lIMWNibHh1SUNCbWRXNWpkR2x2YmlCeVpXMWhhVzVwYm1kWFlXbDBLSFJwYldVcElIdGNiaUFnSUNCMllYSWdkR2x0WlZOcGJtTmxUR0Z6ZEVOaGJHd2dQU0IwYVcxbElDMGdiR0Z6ZEVOaGJHeFVhVzFsTEZ4dUlDQWdJQ0FnSUNCMGFXMWxVMmx1WTJWTVlYTjBTVzUyYjJ0bElEMGdkR2x0WlNBdElHeGhjM1JKYm5admEyVlVhVzFsTEZ4dUlDQWdJQ0FnSUNCeVpYTjFiSFFnUFNCM1lXbDBJQzBnZEdsdFpWTnBibU5sVEdGemRFTmhiR3c3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdiV0Y0YVc1bklEOGdibUYwYVhabFRXbHVLSEpsYzNWc2RDd2diV0Y0VjJGcGRDQXRJSFJwYldWVGFXNWpaVXhoYzNSSmJuWnZhMlVwSURvZ2NtVnpkV3gwTzF4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z2MyaHZkV3hrU1c1MmIydGxLSFJwYldVcElIdGNiaUFnSUNCMllYSWdkR2x0WlZOcGJtTmxUR0Z6ZEVOaGJHd2dQU0IwYVcxbElDMGdiR0Z6ZEVOaGJHeFVhVzFsTEZ4dUlDQWdJQ0FnSUNCMGFXMWxVMmx1WTJWTVlYTjBTVzUyYjJ0bElEMGdkR2x0WlNBdElHeGhjM1JKYm5admEyVlVhVzFsTzF4dVhHNGdJQ0FnTHk4Z1JXbDBhR1Z5SUhSb2FYTWdhWE1nZEdobElHWnBjbk4wSUdOaGJHd3NJR0ZqZEdsMmFYUjVJR2hoY3lCemRHOXdjR1ZrSUdGdVpDQjNaU2R5WlNCaGRDQjBhR1ZjYmlBZ0lDQXZMeUIwY21GcGJHbHVaeUJsWkdkbExDQjBhR1VnYzNsemRHVnRJSFJwYldVZ2FHRnpJR2R2Ym1VZ1ltRmphM2RoY21SeklHRnVaQ0IzWlNkeVpTQjBjbVZoZEdsdVoxeHVJQ0FnSUM4dklHbDBJR0Z6SUhSb1pTQjBjbUZwYkdsdVp5QmxaR2RsTENCdmNpQjNaU2QyWlNCb2FYUWdkR2hsSUdCdFlYaFhZV2wwWUNCc2FXMXBkQzVjYmlBZ0lDQnlaWFIxY200Z0tHeGhjM1JEWVd4c1ZHbHRaU0E5UFQwZ2RXNWtaV1pwYm1Wa0lIeDhJQ2gwYVcxbFUybHVZMlZNWVhOMFEyRnNiQ0ErUFNCM1lXbDBLU0I4ZkZ4dUlDQWdJQ0FnS0hScGJXVlRhVzVqWlV4aGMzUkRZV3hzSUR3Z01Da2dmSHdnS0cxaGVHbHVaeUFtSmlCMGFXMWxVMmx1WTJWTVlYTjBTVzUyYjJ0bElENDlJRzFoZUZkaGFYUXBLVHRjYmlBZ2ZWeHVYRzRnSUdaMWJtTjBhVzl1SUhScGJXVnlSWGh3YVhKbFpDZ3BJSHRjYmlBZ0lDQjJZWElnZEdsdFpTQTlJRzV2ZHlncE8xeHVJQ0FnSUdsbUlDaHphRzkxYkdSSmJuWnZhMlVvZEdsdFpTa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBjbUZwYkdsdVowVmtaMlVvZEdsdFpTazdYRzRnSUNBZ2ZWeHVJQ0FnSUM4dklGSmxjM1JoY25RZ2RHaGxJSFJwYldWeUxseHVJQ0FnSUhScGJXVnlTV1FnUFNCelpYUlVhVzFsYjNWMEtIUnBiV1Z5Ulhod2FYSmxaQ3dnY21WdFlXbHVhVzVuVjJGcGRDaDBhVzFsS1NrN1hHNGdJSDFjYmx4dUlDQm1kVzVqZEdsdmJpQjBjbUZwYkdsdVowVmtaMlVvZEdsdFpTa2dlMXh1SUNBZ0lIUnBiV1Z5U1dRZ1BTQjFibVJsWm1sdVpXUTdYRzVjYmlBZ0lDQXZMeUJQYm14NUlHbHVkbTlyWlNCcFppQjNaU0JvWVhabElHQnNZWE4wUVhKbmMyQWdkMmhwWTJnZ2JXVmhibk1nWUdaMWJtTmdJR2hoY3lCaVpXVnVYRzRnSUNBZ0x5OGdaR1ZpYjNWdVkyVmtJR0YwSUd4bFlYTjBJRzl1WTJVdVhHNGdJQ0FnYVdZZ0tIUnlZV2xzYVc1bklDWW1JR3hoYzNSQmNtZHpLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdhVzUyYjJ0bFJuVnVZeWgwYVcxbEtUdGNiaUFnSUNCOVhHNGdJQ0FnYkdGemRFRnlaM01nUFNCc1lYTjBWR2hwY3lBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNCOVhHNWNiaUFnWm5WdVkzUnBiMjRnWTJGdVkyVnNLQ2tnZTF4dUlDQWdJR2xtSUNoMGFXMWxja2xrSUNFOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJR05zWldGeVZHbHRaVzkxZENoMGFXMWxja2xrS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdiR0Z6ZEVsdWRtOXJaVlJwYldVZ1BTQXdPMXh1SUNBZ0lHeGhjM1JCY21keklEMGdiR0Z6ZEVOaGJHeFVhVzFsSUQwZ2JHRnpkRlJvYVhNZ1BTQjBhVzFsY2tsa0lEMGdkVzVrWldacGJtVmtPMXh1SUNCOVhHNWNiaUFnWm5WdVkzUnBiMjRnWm14MWMyZ29LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUnBiV1Z5U1dRZ1BUMDlJSFZ1WkdWbWFXNWxaQ0EvSUhKbGMzVnNkQ0E2SUhSeVlXbHNhVzVuUldSblpTaHViM2NvS1NrN1hHNGdJSDFjYmx4dUlDQm1kVzVqZEdsdmJpQmtaV0p2ZFc1alpXUW9LU0I3WEc0Z0lDQWdkbUZ5SUhScGJXVWdQU0J1YjNjb0tTeGNiaUFnSUNBZ0lDQWdhWE5KYm5admEybHVaeUE5SUhOb2IzVnNaRWx1ZG05clpTaDBhVzFsS1R0Y2JseHVJQ0FnSUd4aGMzUkJjbWR6SUQwZ1lYSm5kVzFsYm5Sek8xeHVJQ0FnSUd4aGMzUlVhR2x6SUQwZ2RHaHBjenRjYmlBZ0lDQnNZWE4wUTJGc2JGUnBiV1VnUFNCMGFXMWxPMXh1WEc0Z0lDQWdhV1lnS0dselNXNTJiMnRwYm1jcElIdGNiaUFnSUNBZ0lHbG1JQ2gwYVcxbGNrbGtJRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHeGxZV1JwYm1kRlpHZGxLR3hoYzNSRFlXeHNWR2x0WlNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCcFppQW9iV0Y0YVc1bktTQjdYRzRnSUNBZ0lDQWdJQzh2SUVoaGJtUnNaU0JwYm5adlkyRjBhVzl1Y3lCcGJpQmhJSFJwWjJoMElHeHZiM0F1WEc0Z0lDQWdJQ0FnSUhScGJXVnlTV1FnUFNCelpYUlVhVzFsYjNWMEtIUnBiV1Z5Ulhod2FYSmxaQ3dnZDJGcGRDazdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnBiblp2YTJWR2RXNWpLR3hoYzNSRFlXeHNWR2x0WlNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJR2xtSUNoMGFXMWxja2xrSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJSFJwYldWeVNXUWdQU0J6WlhSVWFXMWxiM1YwS0hScGJXVnlSWGh3YVhKbFpDd2dkMkZwZENrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hHNGdJSDFjYmlBZ1pHVmliM1Z1WTJWa0xtTmhibU5sYkNBOUlHTmhibU5sYkR0Y2JpQWdaR1ZpYjNWdVkyVmtMbVpzZFhOb0lEMGdabXgxYzJnN1hHNGdJSEpsZEhWeWJpQmtaV0p2ZFc1alpXUTdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1EyaGxZMnR6SUdsbUlHQjJZV3gxWldBZ2FYTWdkR2hsWEc0Z0tpQmJiR0Z1WjNWaFoyVWdkSGx3WlYwb2FIUjBjRG92TDNkM2R5NWxZMjFoTFdsdWRHVnlibUYwYVc5dVlXd3ViM0puTDJWamJXRXRNall5THpjdU1DOGpjMlZqTFdWamJXRnpZM0pwY0hRdGJHRnVaM1ZoWjJVdGRIbHdaWE1wWEc0Z0tpQnZaaUJnVDJKcVpXTjBZQzRnS0dVdVp5NGdZWEp5WVhsekxDQm1kVzVqZEdsdmJuTXNJRzlpYW1WamRITXNJSEpsWjJWNFpYTXNJR0J1WlhjZ1RuVnRZbVZ5S0RBcFlDd2dZVzVrSUdCdVpYY2dVM1J5YVc1bktDY25LV0FwWEc0Z0tseHVJQ29nUUhOMFlYUnBZMXh1SUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFxSUVCemFXNWpaU0F3TGpFdU1GeHVJQ29nUUdOaGRHVm5iM0o1SUV4aGJtZGNiaUFxSUVCd1lYSmhiU0I3S24wZ2RtRnNkV1VnVkdobElIWmhiSFZsSUhSdklHTm9aV05yTGx4dUlDb2dRSEpsZEhWeWJuTWdlMkp2YjJ4bFlXNTlJRkpsZEhWeWJuTWdZSFJ5ZFdWZ0lHbG1JR0IyWVd4MVpXQWdhWE1nWVc0Z2IySnFaV04wTENCbGJITmxJR0JtWVd4elpXQXVYRzRnS2lCQVpYaGhiWEJzWlZ4dUlDcGNiaUFxSUY4dWFYTlBZbXBsWTNRb2UzMHBPMXh1SUNvZ0x5OGdQVDRnZEhKMVpWeHVJQ3BjYmlBcUlGOHVhWE5QWW1wbFkzUW9XekVzSURJc0lETmRLVHRjYmlBcUlDOHZJRDArSUhSeWRXVmNiaUFxWEc0Z0tpQmZMbWx6VDJKcVpXTjBLRjh1Ym05dmNDazdYRzRnS2lBdkx5QTlQaUIwY25WbFhHNGdLbHh1SUNvZ1h5NXBjMDlpYW1WamRDaHVkV3hzS1R0Y2JpQXFJQzh2SUQwK0lHWmhiSE5sWEc0Z0tpOWNibVoxYm1OMGFXOXVJR2x6VDJKcVpXTjBLSFpoYkhWbEtTQjdYRzRnSUhaaGNpQjBlWEJsSUQwZ2RIbHdaVzltSUhaaGJIVmxPMXh1SUNCeVpYUjFjbTRnSVNGMllXeDFaU0FtSmlBb2RIbHdaU0E5UFNBbmIySnFaV04wSnlCOGZDQjBlWEJsSUQwOUlDZG1kVzVqZEdsdmJpY3BPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlFTm9aV05yY3lCcFppQmdkbUZzZFdWZ0lHbHpJRzlpYW1WamRDMXNhV3RsTGlCQklIWmhiSFZsSUdseklHOWlhbVZqZEMxc2FXdGxJR2xtSUdsMEozTWdibTkwSUdCdWRXeHNZRnh1SUNvZ1lXNWtJR2hoY3lCaElHQjBlWEJsYjJaZ0lISmxjM1ZzZENCdlppQmNJbTlpYW1WamRGd2lMbHh1SUNwY2JpQXFJRUJ6ZEdGMGFXTmNiaUFxSUVCdFpXMWlaWEpQWmlCZlhHNGdLaUJBYzJsdVkyVWdOQzR3TGpCY2JpQXFJRUJqWVhSbFoyOXllU0JNWVc1blhHNGdLaUJBY0dGeVlXMGdleXA5SUhaaGJIVmxJRlJvWlNCMllXeDFaU0IwYnlCamFHVmpheTVjYmlBcUlFQnlaWFIxY201eklIdGliMjlzWldGdWZTQlNaWFIxY201eklHQjBjblZsWUNCcFppQmdkbUZzZFdWZ0lHbHpJRzlpYW1WamRDMXNhV3RsTENCbGJITmxJR0JtWVd4elpXQXVYRzRnS2lCQVpYaGhiWEJzWlZ4dUlDcGNiaUFxSUY4dWFYTlBZbXBsWTNSTWFXdGxLSHQ5S1R0Y2JpQXFJQzh2SUQwK0lIUnlkV1ZjYmlBcVhHNGdLaUJmTG1selQySnFaV04wVEdsclpTaGJNU3dnTWl3Z00xMHBPMXh1SUNvZ0x5OGdQVDRnZEhKMVpWeHVJQ3BjYmlBcUlGOHVhWE5QWW1wbFkzUk1hV3RsS0Y4dWJtOXZjQ2s3WEc0Z0tpQXZMeUE5UGlCbVlXeHpaVnh1SUNwY2JpQXFJRjh1YVhOUFltcGxZM1JNYVd0bEtHNTFiR3dwTzF4dUlDb2dMeThnUFQ0Z1ptRnNjMlZjYmlBcUwxeHVablZ1WTNScGIyNGdhWE5QWW1wbFkzUk1hV3RsS0haaGJIVmxLU0I3WEc0Z0lISmxkSFZ5YmlBaElYWmhiSFZsSUNZbUlIUjVjR1Z2WmlCMllXeDFaU0E5UFNBbmIySnFaV04wSnp0Y2JuMWNibHh1THlvcVhHNGdLaUJEYUdWamEzTWdhV1lnWUhaaGJIVmxZQ0JwY3lCamJHRnpjMmxtYVdWa0lHRnpJR0VnWUZONWJXSnZiR0FnY0hKcGJXbDBhWFpsSUc5eUlHOWlhbVZqZEM1Y2JpQXFYRzRnS2lCQWMzUmhkR2xqWEc0Z0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNvZ1FITnBibU5sSURRdU1DNHdYRzRnS2lCQVkyRjBaV2R2Y25rZ1RHRnVaMXh1SUNvZ1FIQmhjbUZ0SUhzcWZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdZMmhsWTJzdVhHNGdLaUJBY21WMGRYSnVjeUI3WW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQWdhV1lnWUhaaGJIVmxZQ0JwY3lCaElITjViV0p2YkN3Z1pXeHpaU0JnWm1Gc2MyVmdMbHh1SUNvZ1FHVjRZVzF3YkdWY2JpQXFYRzRnS2lCZkxtbHpVM2x0WW05c0tGTjViV0p2YkM1cGRHVnlZWFJ2Y2lrN1hHNGdLaUF2THlBOVBpQjBjblZsWEc0Z0tseHVJQ29nWHk1cGMxTjViV0p2YkNnbllXSmpKeWs3WEc0Z0tpQXZMeUE5UGlCbVlXeHpaVnh1SUNvdlhHNW1kVzVqZEdsdmJpQnBjMU41YldKdmJDaDJZV3gxWlNrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlIWmhiSFZsSUQwOUlDZHplVzFpYjJ3bklIeDhYRzRnSUNBZ0tHbHpUMkpxWldOMFRHbHJaU2gyWVd4MVpTa2dKaVlnYjJKcVpXTjBWRzlUZEhKcGJtY3VZMkZzYkNoMllXeDFaU2tnUFQwZ2MzbHRZbTlzVkdGbktUdGNibjFjYmx4dUx5b3FYRzRnS2lCRGIyNTJaWEowY3lCZ2RtRnNkV1ZnSUhSdklHRWdiblZ0WW1WeUxseHVJQ3BjYmlBcUlFQnpkR0YwYVdOY2JpQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0tpQkFjMmx1WTJVZ05DNHdMakJjYmlBcUlFQmpZWFJsWjI5eWVTQk1ZVzVuWEc0Z0tpQkFjR0Z5WVcwZ2V5cDlJSFpoYkhWbElGUm9aU0IyWVd4MVpTQjBieUJ3Y205alpYTnpMbHh1SUNvZ1FISmxkSFZ5Ym5NZ2UyNTFiV0psY24wZ1VtVjBkWEp1Y3lCMGFHVWdiblZ0WW1WeUxseHVJQ29nUUdWNFlXMXdiR1ZjYmlBcVhHNGdLaUJmTG5SdlRuVnRZbVZ5S0RNdU1pazdYRzRnS2lBdkx5QTlQaUF6TGpKY2JpQXFYRzRnS2lCZkxuUnZUblZ0WW1WeUtFNTFiV0psY2k1TlNVNWZWa0ZNVlVVcE8xeHVJQ29nTHk4Z1BUNGdOV1V0TXpJMFhHNGdLbHh1SUNvZ1h5NTBiMDUxYldKbGNpaEpibVpwYm1sMGVTazdYRzRnS2lBdkx5QTlQaUJKYm1acGJtbDBlVnh1SUNwY2JpQXFJRjh1ZEc5T2RXMWlaWElvSnpNdU1pY3BPMXh1SUNvZ0x5OGdQVDRnTXk0eVhHNGdLaTljYm1aMWJtTjBhVzl1SUhSdlRuVnRZbVZ5S0haaGJIVmxLU0I3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdkbUZzZFdVZ1BUMGdKMjUxYldKbGNpY3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RtRnNkV1U3WEc0Z0lIMWNiaUFnYVdZZ0tHbHpVM2x0WW05c0tIWmhiSFZsS1NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJPUVU0N1hHNGdJSDFjYmlBZ2FXWWdLR2x6VDJKcVpXTjBLSFpoYkhWbEtTa2dlMXh1SUNBZ0lIWmhjaUJ2ZEdobGNpQTlJSFI1Y0dWdlppQjJZV3gxWlM1MllXeDFaVTltSUQwOUlDZG1kVzVqZEdsdmJpY2dQeUIyWVd4MVpTNTJZV3gxWlU5bUtDa2dPaUIyWVd4MVpUdGNiaUFnSUNCMllXeDFaU0E5SUdselQySnFaV04wS0c5MGFHVnlLU0EvSUNodmRHaGxjaUFySUNjbktTQTZJRzkwYUdWeU8xeHVJQ0I5WEc0Z0lHbG1JQ2gwZVhCbGIyWWdkbUZzZFdVZ0lUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RtRnNkV1VnUFQwOUlEQWdQeUIyWVd4MVpTQTZJQ3QyWVd4MVpUdGNiaUFnZlZ4dUlDQjJZV3gxWlNBOUlIWmhiSFZsTG5KbGNHeGhZMlVvY21WVWNtbHRMQ0FuSnlrN1hHNGdJSFpoY2lCcGMwSnBibUZ5ZVNBOUlISmxTWE5DYVc1aGNua3VkR1Z6ZENoMllXeDFaU2s3WEc0Z0lISmxkSFZ5YmlBb2FYTkNhVzVoY25rZ2ZId2djbVZKYzA5amRHRnNMblJsYzNRb2RtRnNkV1VwS1Z4dUlDQWdJRDhnWm5KbFpWQmhjbk5sU1c1MEtIWmhiSFZsTG5Oc2FXTmxLRElwTENCcGMwSnBibUZ5ZVNBL0lESWdPaUE0S1Z4dUlDQWdJRG9nS0hKbFNYTkNZV1JJWlhndWRHVnpkQ2gyWVd4MVpTa2dQeUJPUVU0Z09pQXJkbUZzZFdVcE8xeHVmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdSbFltOTFibU5sTzF4dUlpd2lMeW9xWEc0Z0tpQnNiMlJoYzJnZ0tFTjFjM1J2YlNCQ2RXbHNaQ2tnUEdoMGRIQnpPaTh2Ykc5a1lYTm9MbU52YlM4K1hHNGdLaUJDZFdsc1pEb2dZR3h2WkdGemFDQnRiMlIxYkdGeWFYcGxJR1Y0Y0c5eWRITTlYQ0p1Y0cxY0lpQXRieUF1TDJCY2JpQXFJRU52Y0hseWFXZG9kQ0JxVVhWbGNua2dSbTkxYm1SaGRHbHZiaUJoYm1RZ2IzUm9aWElnWTI5dWRISnBZblYwYjNKeklEeG9kSFJ3Y3pvdkwycHhkV1Z5ZVM1dmNtY3ZQbHh1SUNvZ1VtVnNaV0Z6WldRZ2RXNWtaWElnVFVsVUlHeHBZMlZ1YzJVZ1BHaDBkSEJ6T2k4dmJHOWtZWE5vTG1OdmJTOXNhV05sYm5ObFBseHVJQ29nUW1GelpXUWdiMjRnVlc1a1pYSnpZMjl5WlM1cWN5QXhMamd1TXlBOGFIUjBjRG92TDNWdVpHVnljMk52Y21WcWN5NXZjbWN2VEVsRFJVNVRSVDVjYmlBcUlFTnZjSGx5YVdkb2RDQktaWEpsYlhrZ1FYTm9hMlZ1WVhNc0lFUnZZM1Z0Wlc1MFEyeHZkV1FnWVc1a0lFbHVkbVZ6ZEdsbllYUnBkbVVnVW1Wd2IzSjBaWEp6SUNZZ1JXUnBkRzl5YzF4dUlDb3ZYRzVjYmk4cUtpQlZjMlZrSUdGeklIUm9aU0JnVkhsd1pVVnljbTl5WUNCdFpYTnpZV2RsSUdadmNpQmNJa1oxYm1OMGFXOXVjMXdpSUcxbGRHaHZaSE11SUNvdlhHNTJZWElnUmxWT1ExOUZVbEpQVWw5VVJWaFVJRDBnSjBWNGNHVmpkR1ZrSUdFZ1puVnVZM1JwYjI0bk8xeHVYRzR2S2lvZ1ZYTmxaQ0JoY3lCeVpXWmxjbVZ1WTJWeklHWnZjaUIyWVhKcGIzVnpJR0JPZFcxaVpYSmdJR052Ym5OMFlXNTBjeTRnS2k5Y2JuWmhjaUJPUVU0Z1BTQXdJQzhnTUR0Y2JseHVMeW9xSUdCUFltcGxZM1FqZEc5VGRISnBibWRnSUhKbGMzVnNkQ0J5WldabGNtVnVZMlZ6TGlBcUwxeHVkbUZ5SUhONWJXSnZiRlJoWnlBOUlDZGJiMkpxWldOMElGTjViV0p2YkYwbk8xeHVYRzR2S2lvZ1ZYTmxaQ0IwYnlCdFlYUmphQ0JzWldGa2FXNW5JR0Z1WkNCMGNtRnBiR2x1WnlCM2FHbDBaWE53WVdObExpQXFMMXh1ZG1GeUlISmxWSEpwYlNBOUlDOWVYRnh6SzN4Y1hITXJKQzluTzF4dVhHNHZLaW9nVlhObFpDQjBieUJrWlhSbFkzUWdZbUZrSUhOcFoyNWxaQ0JvWlhoaFpHVmphVzFoYkNCemRISnBibWNnZG1Gc2RXVnpMaUFxTDF4dWRtRnlJSEpsU1hOQ1lXUklaWGdnUFNBdlhsc3RLMTB3ZUZzd0xUbGhMV1pkS3lRdmFUdGNibHh1THlvcUlGVnpaV1FnZEc4Z1pHVjBaV04wSUdKcGJtRnllU0J6ZEhKcGJtY2dkbUZzZFdWekxpQXFMMXh1ZG1GeUlISmxTWE5DYVc1aGNua2dQU0F2WGpCaVd6QXhYU3NrTDJrN1hHNWNiaThxS2lCVmMyVmtJSFJ2SUdSbGRHVmpkQ0J2WTNSaGJDQnpkSEpwYm1jZ2RtRnNkV1Z6TGlBcUwxeHVkbUZ5SUhKbFNYTlBZM1JoYkNBOUlDOWVNRzliTUMwM1hTc2tMMms3WEc1Y2JpOHFLaUJDZFdsc2RDMXBiaUJ0WlhSb2IyUWdjbVZtWlhKbGJtTmxjeUIzYVhSb2IzVjBJR0VnWkdWd1pXNWtaVzVqZVNCdmJpQmdjbTl2ZEdBdUlDb3ZYRzUyWVhJZ1puSmxaVkJoY25ObFNXNTBJRDBnY0dGeWMyVkpiblE3WEc1Y2JpOHFLaUJFWlhSbFkzUWdabkpsWlNCMllYSnBZV0pzWlNCZ1oyeHZZbUZzWUNCbWNtOXRJRTV2WkdVdWFuTXVJQ292WEc1MllYSWdabkpsWlVkc2IySmhiQ0E5SUhSNWNHVnZaaUJuYkc5aVlXd2dQVDBnSjI5aWFtVmpkQ2NnSmlZZ1oyeHZZbUZzSUNZbUlHZHNiMkpoYkM1UFltcGxZM1FnUFQwOUlFOWlhbVZqZENBbUppQm5iRzlpWVd3N1hHNWNiaThxS2lCRVpYUmxZM1FnWm5KbFpTQjJZWEpwWVdKc1pTQmdjMlZzWm1BdUlDb3ZYRzUyWVhJZ1puSmxaVk5sYkdZZ1BTQjBlWEJsYjJZZ2MyVnNaaUE5UFNBbmIySnFaV04wSnlBbUppQnpaV3htSUNZbUlITmxiR1l1VDJKcVpXTjBJRDA5UFNCUFltcGxZM1FnSmlZZ2MyVnNaanRjYmx4dUx5b3FJRlZ6WldRZ1lYTWdZU0J5WldabGNtVnVZMlVnZEc4Z2RHaGxJR2RzYjJKaGJDQnZZbXBsWTNRdUlDb3ZYRzUyWVhJZ2NtOXZkQ0E5SUdaeVpXVkhiRzlpWVd3Z2ZId2dabkpsWlZObGJHWWdmSHdnUm5WdVkzUnBiMjRvSjNKbGRIVnliaUIwYUdsekp5a29LVHRjYmx4dUx5b3FJRlZ6WldRZ1ptOXlJR0oxYVd4MExXbHVJRzFsZEdodlpDQnlaV1psY21WdVkyVnpMaUFxTDF4dWRtRnlJRzlpYW1WamRGQnliM1J2SUQwZ1QySnFaV04wTG5CeWIzUnZkSGx3WlR0Y2JseHVMeW9xWEc0Z0tpQlZjMlZrSUhSdklISmxjMjlzZG1VZ2RHaGxYRzRnS2lCYllIUnZVM1J5YVc1blZHRm5ZRjBvYUhSMGNEb3ZMMlZqYldFdGFXNTBaWEp1WVhScGIyNWhiQzV2Y21jdlpXTnRZUzB5TmpJdk55NHdMeU56WldNdGIySnFaV04wTG5CeWIzUnZkSGx3WlM1MGIzTjBjbWx1WnlsY2JpQXFJRzltSUhaaGJIVmxjeTVjYmlBcUwxeHVkbUZ5SUc5aWFtVmpkRlJ2VTNSeWFXNW5JRDBnYjJKcVpXTjBVSEp2ZEc4dWRHOVRkSEpwYm1jN1hHNWNiaThxSUVKMWFXeDBMV2x1SUcxbGRHaHZaQ0J5WldabGNtVnVZMlZ6SUdadmNpQjBhRzl6WlNCM2FYUm9JSFJvWlNCellXMWxJRzVoYldVZ1lYTWdiM1JvWlhJZ1lHeHZaR0Z6YUdBZ2JXVjBhRzlrY3k0Z0tpOWNiblpoY2lCdVlYUnBkbVZOWVhnZ1BTQk5ZWFJvTG0xaGVDeGNiaUFnSUNCdVlYUnBkbVZOYVc0Z1BTQk5ZWFJvTG0xcGJqdGNibHh1THlvcVhHNGdLaUJIWlhSeklIUm9aU0IwYVcxbGMzUmhiWEFnYjJZZ2RHaGxJRzUxYldKbGNpQnZaaUJ0YVd4c2FYTmxZMjl1WkhNZ2RHaGhkQ0JvWVhabElHVnNZWEJ6WldRZ2MybHVZMlZjYmlBcUlIUm9aU0JWYm1sNElHVndiMk5vSUNneElFcGhiblZoY25rZ01UazNNQ0F3TURvd01Eb3dNQ0JWVkVNcExseHVJQ3BjYmlBcUlFQnpkR0YwYVdOY2JpQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0tpQkFjMmx1WTJVZ01pNDBMakJjYmlBcUlFQmpZWFJsWjI5eWVTQkVZWFJsWEc0Z0tpQkFjbVYwZFhKdWN5QjdiblZ0WW1WeWZTQlNaWFIxY201eklIUm9aU0IwYVcxbGMzUmhiWEF1WEc0Z0tpQkFaWGhoYlhCc1pWeHVJQ3BjYmlBcUlGOHVaR1ZtWlhJb1puVnVZM1JwYjI0b2MzUmhiWEFwSUh0Y2JpQXFJQ0FnWTI5dWMyOXNaUzVzYjJjb1h5NXViM2NvS1NBdElITjBZVzF3S1R0Y2JpQXFJSDBzSUY4dWJtOTNLQ2twTzF4dUlDb2dMeThnUFQ0Z1RHOW5jeUIwYUdVZ2JuVnRZbVZ5SUc5bUlHMXBiR3hwYzJWamIyNWtjeUJwZENCMGIyOXJJR1p2Y2lCMGFHVWdaR1ZtWlhKeVpXUWdhVzUyYjJOaGRHbHZiaTVjYmlBcUwxeHVkbUZ5SUc1dmR5QTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQnlaWFIxY200Z2NtOXZkQzVFWVhSbExtNXZkeWdwTzF4dWZUdGNibHh1THlvcVhHNGdLaUJEY21WaGRHVnpJR0VnWkdWaWIzVnVZMlZrSUdaMWJtTjBhVzl1SUhSb1lYUWdaR1ZzWVhseklHbHVkbTlyYVc1bklHQm1kVzVqWUNCMWJuUnBiQ0JoWm5SbGNpQmdkMkZwZEdCY2JpQXFJRzFwYkd4cGMyVmpiMjVrY3lCb1lYWmxJR1ZzWVhCelpXUWdjMmx1WTJVZ2RHaGxJR3hoYzNRZ2RHbHRaU0IwYUdVZ1pHVmliM1Z1WTJWa0lHWjFibU4wYVc5dUlIZGhjMXh1SUNvZ2FXNTJiMnRsWkM0Z1ZHaGxJR1JsWW05MWJtTmxaQ0JtZFc1amRHbHZiaUJqYjIxbGN5QjNhWFJvSUdFZ1lHTmhibU5sYkdBZ2JXVjBhRzlrSUhSdklHTmhibU5sYkZ4dUlDb2daR1ZzWVhsbFpDQmdablZ1WTJBZ2FXNTJiMk5oZEdsdmJuTWdZVzVrSUdFZ1lHWnNkWE5vWUNCdFpYUm9iMlFnZEc4Z2FXMXRaV1JwWVhSbGJIa2dhVzUyYjJ0bElIUm9aVzB1WEc0Z0tpQlFjbTkyYVdSbElHQnZjSFJwYjI1ellDQjBieUJwYm1ScFkyRjBaU0IzYUdWMGFHVnlJR0JtZFc1allDQnphRzkxYkdRZ1ltVWdhVzUyYjJ0bFpDQnZiaUIwYUdWY2JpQXFJR3hsWVdScGJtY2dZVzVrTDI5eUlIUnlZV2xzYVc1bklHVmtaMlVnYjJZZ2RHaGxJR0IzWVdsMFlDQjBhVzFsYjNWMExpQlVhR1VnWUdaMWJtTmdJR2x6SUdsdWRtOXJaV1JjYmlBcUlIZHBkR2dnZEdobElHeGhjM1FnWVhKbmRXMWxiblJ6SUhCeWIzWnBaR1ZrSUhSdklIUm9aU0JrWldKdmRXNWpaV1FnWm5WdVkzUnBiMjR1SUZOMVluTmxjWFZsYm5SY2JpQXFJR05oYkd4eklIUnZJSFJvWlNCa1pXSnZkVzVqWldRZ1puVnVZM1JwYjI0Z2NtVjBkWEp1SUhSb1pTQnlaWE4xYkhRZ2IyWWdkR2hsSUd4aGMzUWdZR1oxYm1OZ1hHNGdLaUJwYm5adlkyRjBhVzl1TGx4dUlDcGNiaUFxSUNvcVRtOTBaVG9xS2lCSlppQmdiR1ZoWkdsdVoyQWdZVzVrSUdCMGNtRnBiR2x1WjJBZ2IzQjBhVzl1Y3lCaGNtVWdZSFJ5ZFdWZ0xDQmdablZ1WTJBZ2FYTmNiaUFxSUdsdWRtOXJaV1FnYjI0Z2RHaGxJSFJ5WVdsc2FXNW5JR1ZrWjJVZ2IyWWdkR2hsSUhScGJXVnZkWFFnYjI1c2VTQnBaaUIwYUdVZ1pHVmliM1Z1WTJWa0lHWjFibU4wYVc5dVhHNGdLaUJwY3lCcGJuWnZhMlZrSUcxdmNtVWdkR2hoYmlCdmJtTmxJR1IxY21sdVp5QjBhR1VnWUhkaGFYUmdJSFJwYldWdmRYUXVYRzRnS2x4dUlDb2dTV1lnWUhkaGFYUmdJR2x6SUdBd1lDQmhibVFnWUd4bFlXUnBibWRnSUdseklHQm1ZV3h6WldBc0lHQm1kVzVqWUNCcGJuWnZZMkYwYVc5dUlHbHpJR1JsWm1WeWNtVmtYRzRnS2lCMWJuUnBiQ0IwYnlCMGFHVWdibVY0ZENCMGFXTnJMQ0J6YVcxcGJHRnlJSFJ2SUdCelpYUlVhVzFsYjNWMFlDQjNhWFJvSUdFZ2RHbHRaVzkxZENCdlppQmdNR0F1WEc0Z0tseHVJQ29nVTJWbElGdEVZWFpwWkNCRGIzSmlZV05vYnlkeklHRnlkR2xqYkdWZEtHaDBkSEJ6T2k4dlkzTnpMWFJ5YVdOcmN5NWpiMjB2WkdWaWIzVnVZMmx1WnkxMGFISnZkSFJzYVc1bkxXVjRjR3hoYVc1bFpDMWxlR0Z0Y0d4bGN5OHBYRzRnS2lCbWIzSWdaR1YwWVdsc2N5QnZkbVZ5SUhSb1pTQmthV1ptWlhKbGJtTmxjeUJpWlhSM1pXVnVJR0JmTG1SbFltOTFibU5sWUNCaGJtUWdZRjh1ZEdoeWIzUjBiR1ZnTGx4dUlDcGNiaUFxSUVCemRHRjBhV05jYmlBcUlFQnRaVzFpWlhKUFppQmZYRzRnS2lCQWMybHVZMlVnTUM0eExqQmNiaUFxSUVCallYUmxaMjl5ZVNCR2RXNWpkR2x2Ymx4dUlDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJuMGdablZ1WXlCVWFHVWdablZ1WTNScGIyNGdkRzhnWkdWaWIzVnVZMlV1WEc0Z0tpQkFjR0Z5WVcwZ2UyNTFiV0psY24wZ1czZGhhWFE5TUYwZ1ZHaGxJRzUxYldKbGNpQnZaaUJ0YVd4c2FYTmxZMjl1WkhNZ2RHOGdaR1ZzWVhrdVhHNGdLaUJBY0dGeVlXMGdlMDlpYW1WamRIMGdXMjl3ZEdsdmJuTTllMzFkSUZSb1pTQnZjSFJwYjI1eklHOWlhbVZqZEM1Y2JpQXFJRUJ3WVhKaGJTQjdZbTl2YkdWaGJuMGdXMjl3ZEdsdmJuTXViR1ZoWkdsdVp6MW1ZV3h6WlYxY2JpQXFJQ0JUY0dWamFXWjVJR2x1ZG05cmFXNW5JRzl1SUhSb1pTQnNaV0ZrYVc1bklHVmtaMlVnYjJZZ2RHaGxJSFJwYldWdmRYUXVYRzRnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnVzI5d2RHbHZibk11YldGNFYyRnBkRjFjYmlBcUlDQlVhR1VnYldGNGFXMTFiU0IwYVcxbElHQm1kVzVqWUNCcGN5QmhiR3h2ZDJWa0lIUnZJR0psSUdSbGJHRjVaV1FnWW1WbWIzSmxJR2wwSjNNZ2FXNTJiMnRsWkM1Y2JpQXFJRUJ3WVhKaGJTQjdZbTl2YkdWaGJuMGdXMjl3ZEdsdmJuTXVkSEpoYVd4cGJtYzlkSEoxWlYxY2JpQXFJQ0JUY0dWamFXWjVJR2x1ZG05cmFXNW5JRzl1SUhSb1pTQjBjbUZwYkdsdVp5QmxaR2RsSUc5bUlIUm9aU0IwYVcxbGIzVjBMbHh1SUNvZ1FISmxkSFZ5Ym5NZ2UwWjFibU4wYVc5dWZTQlNaWFIxY201eklIUm9aU0J1WlhjZ1pHVmliM1Z1WTJWa0lHWjFibU4wYVc5dUxseHVJQ29nUUdWNFlXMXdiR1ZjYmlBcVhHNGdLaUF2THlCQmRtOXBaQ0JqYjNOMGJIa2dZMkZzWTNWc1lYUnBiMjV6SUhkb2FXeGxJSFJvWlNCM2FXNWtiM2NnYzJsNlpTQnBjeUJwYmlCbWJIVjRMbHh1SUNvZ2FsRjFaWEo1S0hkcGJtUnZkeWt1YjI0b0ozSmxjMmw2WlNjc0lGOHVaR1ZpYjNWdVkyVW9ZMkZzWTNWc1lYUmxUR0Y1YjNWMExDQXhOVEFwS1R0Y2JpQXFYRzRnS2lBdkx5Qkpiblp2YTJVZ1lITmxibVJOWVdsc1lDQjNhR1Z1SUdOc2FXTnJaV1FzSUdSbFltOTFibU5wYm1jZ2MzVmljMlZ4ZFdWdWRDQmpZV3hzY3k1Y2JpQXFJR3BSZFdWeWVTaGxiR1Z0Wlc1MEtTNXZiaWduWTJ4cFkyc25MQ0JmTG1SbFltOTFibU5sS0hObGJtUk5ZV2xzTENBek1EQXNJSHRjYmlBcUlDQWdKMnhsWVdScGJtY25PaUIwY25WbExGeHVJQ29nSUNBbmRISmhhV3hwYm1jbk9pQm1ZV3h6WlZ4dUlDb2dmU2twTzF4dUlDcGNiaUFxSUM4dklFVnVjM1Z5WlNCZ1ltRjBZMmhNYjJkZ0lHbHpJR2x1ZG05clpXUWdiMjVqWlNCaFpuUmxjaUF4SUhObFkyOXVaQ0J2WmlCa1pXSnZkVzVqWldRZ1kyRnNiSE11WEc0Z0tpQjJZWElnWkdWaWIzVnVZMlZrSUQwZ1h5NWtaV0p2ZFc1alpTaGlZWFJqYUV4dlp5d2dNalV3TENCN0lDZHRZWGhYWVdsMEp6b2dNVEF3TUNCOUtUdGNiaUFxSUhaaGNpQnpiM1Z5WTJVZ1BTQnVaWGNnUlhabGJuUlRiM1Z5WTJVb0p5OXpkSEpsWVcwbktUdGNiaUFxSUdwUmRXVnllU2h6YjNWeVkyVXBMbTl1S0NkdFpYTnpZV2RsSnl3Z1pHVmliM1Z1WTJWa0tUdGNiaUFxWEc0Z0tpQXZMeUJEWVc1alpXd2dkR2hsSUhSeVlXbHNhVzVuSUdSbFltOTFibU5sWkNCcGJuWnZZMkYwYVc5dUxseHVJQ29nYWxGMVpYSjVLSGRwYm1SdmR5a3ViMjRvSjNCdmNITjBZWFJsSnl3Z1pHVmliM1Z1WTJWa0xtTmhibU5sYkNrN1hHNGdLaTljYm1aMWJtTjBhVzl1SUdSbFltOTFibU5sS0daMWJtTXNJSGRoYVhRc0lHOXdkR2x2Ym5NcElIdGNiaUFnZG1GeUlHeGhjM1JCY21kekxGeHVJQ0FnSUNBZ2JHRnpkRlJvYVhNc1hHNGdJQ0FnSUNCdFlYaFhZV2wwTEZ4dUlDQWdJQ0FnY21WemRXeDBMRnh1SUNBZ0lDQWdkR2x0WlhKSlpDeGNiaUFnSUNBZ0lHeGhjM1JEWVd4c1ZHbHRaU3hjYmlBZ0lDQWdJR3hoYzNSSmJuWnZhMlZVYVcxbElEMGdNQ3hjYmlBZ0lDQWdJR3hsWVdScGJtY2dQU0JtWVd4elpTeGNiaUFnSUNBZ0lHMWhlR2x1WnlBOUlHWmhiSE5sTEZ4dUlDQWdJQ0FnZEhKaGFXeHBibWNnUFNCMGNuVmxPMXh1WEc0Z0lHbG1JQ2gwZVhCbGIyWWdablZ1WXlBaFBTQW5ablZ1WTNScGIyNG5LU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRlI1Y0dWRmNuSnZjaWhHVlU1RFgwVlNVazlTWDFSRldGUXBPMXh1SUNCOVhHNGdJSGRoYVhRZ1BTQjBiMDUxYldKbGNpaDNZV2wwS1NCOGZDQXdPMXh1SUNCcFppQW9hWE5QWW1wbFkzUW9iM0IwYVc5dWN5a3BJSHRjYmlBZ0lDQnNaV0ZrYVc1bklEMGdJU0Z2Y0hScGIyNXpMbXhsWVdScGJtYzdYRzRnSUNBZ2JXRjRhVzVuSUQwZ0oyMWhlRmRoYVhRbklHbHVJRzl3ZEdsdmJuTTdYRzRnSUNBZ2JXRjRWMkZwZENBOUlHMWhlR2x1WnlBL0lHNWhkR2wyWlUxaGVDaDBiMDUxYldKbGNpaHZjSFJwYjI1ekxtMWhlRmRoYVhRcElIeDhJREFzSUhkaGFYUXBJRG9nYldGNFYyRnBkRHRjYmlBZ0lDQjBjbUZwYkdsdVp5QTlJQ2QwY21GcGJHbHVaeWNnYVc0Z2IzQjBhVzl1Y3lBL0lDRWhiM0IwYVc5dWN5NTBjbUZwYkdsdVp5QTZJSFJ5WVdsc2FXNW5PMXh1SUNCOVhHNWNiaUFnWm5WdVkzUnBiMjRnYVc1MmIydGxSblZ1WXloMGFXMWxLU0I3WEc0Z0lDQWdkbUZ5SUdGeVozTWdQU0JzWVhOMFFYSm5jeXhjYmlBZ0lDQWdJQ0FnZEdocGMwRnlaeUE5SUd4aGMzUlVhR2x6TzF4dVhHNGdJQ0FnYkdGemRFRnlaM01nUFNCc1lYTjBWR2hwY3lBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnSUNCc1lYTjBTVzUyYjJ0bFZHbHRaU0E5SUhScGJXVTdYRzRnSUNBZ2NtVnpkV3gwSUQwZ1puVnVZeTVoY0hCc2VTaDBhR2x6UVhKbkxDQmhjbWR6S1R0Y2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0I5WEc1Y2JpQWdablZ1WTNScGIyNGdiR1ZoWkdsdVowVmtaMlVvZEdsdFpTa2dlMXh1SUNBZ0lDOHZJRkpsYzJWMElHRnVlU0JnYldGNFYyRnBkR0FnZEdsdFpYSXVYRzRnSUNBZ2JHRnpkRWx1ZG05clpWUnBiV1VnUFNCMGFXMWxPMXh1SUNBZ0lDOHZJRk4wWVhKMElIUm9aU0IwYVcxbGNpQm1iM0lnZEdobElIUnlZV2xzYVc1bklHVmtaMlV1WEc0Z0lDQWdkR2x0WlhKSlpDQTlJSE5sZEZScGJXVnZkWFFvZEdsdFpYSkZlSEJwY21Wa0xDQjNZV2wwS1R0Y2JpQWdJQ0F2THlCSmJuWnZhMlVnZEdobElHeGxZV1JwYm1jZ1pXUm5aUzVjYmlBZ0lDQnlaWFIxY200Z2JHVmhaR2x1WnlBL0lHbHVkbTlyWlVaMWJtTW9kR2x0WlNrZ09pQnlaWE4xYkhRN1hHNGdJSDFjYmx4dUlDQm1kVzVqZEdsdmJpQnlaVzFoYVc1cGJtZFhZV2wwS0hScGJXVXBJSHRjYmlBZ0lDQjJZWElnZEdsdFpWTnBibU5sVEdGemRFTmhiR3dnUFNCMGFXMWxJQzBnYkdGemRFTmhiR3hVYVcxbExGeHVJQ0FnSUNBZ0lDQjBhVzFsVTJsdVkyVk1ZWE4wU1c1MmIydGxJRDBnZEdsdFpTQXRJR3hoYzNSSmJuWnZhMlZVYVcxbExGeHVJQ0FnSUNBZ0lDQnlaWE4xYkhRZ1BTQjNZV2wwSUMwZ2RHbHRaVk5wYm1ObFRHRnpkRU5oYkd3N1hHNWNiaUFnSUNCeVpYUjFjbTRnYldGNGFXNW5JRDhnYm1GMGFYWmxUV2x1S0hKbGMzVnNkQ3dnYldGNFYyRnBkQ0F0SUhScGJXVlRhVzVqWlV4aGMzUkpiblp2YTJVcElEb2djbVZ6ZFd4ME8xeHVJQ0I5WEc1Y2JpQWdablZ1WTNScGIyNGdjMmh2ZFd4a1NXNTJiMnRsS0hScGJXVXBJSHRjYmlBZ0lDQjJZWElnZEdsdFpWTnBibU5sVEdGemRFTmhiR3dnUFNCMGFXMWxJQzBnYkdGemRFTmhiR3hVYVcxbExGeHVJQ0FnSUNBZ0lDQjBhVzFsVTJsdVkyVk1ZWE4wU1c1MmIydGxJRDBnZEdsdFpTQXRJR3hoYzNSSmJuWnZhMlZVYVcxbE8xeHVYRzRnSUNBZ0x5OGdSV2wwYUdWeUlIUm9hWE1nYVhNZ2RHaGxJR1pwY25OMElHTmhiR3dzSUdGamRHbDJhWFI1SUdoaGN5QnpkRzl3Y0dWa0lHRnVaQ0IzWlNkeVpTQmhkQ0IwYUdWY2JpQWdJQ0F2THlCMGNtRnBiR2x1WnlCbFpHZGxMQ0IwYUdVZ2MzbHpkR1Z0SUhScGJXVWdhR0Z6SUdkdmJtVWdZbUZqYTNkaGNtUnpJR0Z1WkNCM1pTZHlaU0IwY21WaGRHbHVaMXh1SUNBZ0lDOHZJR2wwSUdGeklIUm9aU0IwY21GcGJHbHVaeUJsWkdkbExDQnZjaUIzWlNkMlpTQm9hWFFnZEdobElHQnRZWGhYWVdsMFlDQnNhVzFwZEM1Y2JpQWdJQ0J5WlhSMWNtNGdLR3hoYzNSRFlXeHNWR2x0WlNBOVBUMGdkVzVrWldacGJtVmtJSHg4SUNoMGFXMWxVMmx1WTJWTVlYTjBRMkZzYkNBK1BTQjNZV2wwS1NCOGZGeHVJQ0FnSUNBZ0tIUnBiV1ZUYVc1alpVeGhjM1JEWVd4c0lEd2dNQ2tnZkh3Z0tHMWhlR2x1WnlBbUppQjBhVzFsVTJsdVkyVk1ZWE4wU1c1MmIydGxJRDQ5SUcxaGVGZGhhWFFwS1R0Y2JpQWdmVnh1WEc0Z0lHWjFibU4wYVc5dUlIUnBiV1Z5Ulhod2FYSmxaQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2RHbHRaU0E5SUc1dmR5Z3BPMXh1SUNBZ0lHbG1JQ2h6YUc5MWJHUkpiblp2YTJVb2RHbHRaU2twSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwY21GcGJHbHVaMFZrWjJVb2RHbHRaU2s3WEc0Z0lDQWdmVnh1SUNBZ0lDOHZJRkpsYzNSaGNuUWdkR2hsSUhScGJXVnlMbHh1SUNBZ0lIUnBiV1Z5U1dRZ1BTQnpaWFJVYVcxbGIzVjBLSFJwYldWeVJYaHdhWEpsWkN3Z2NtVnRZV2x1YVc1blYyRnBkQ2gwYVcxbEtTazdYRzRnSUgxY2JseHVJQ0JtZFc1amRHbHZiaUIwY21GcGJHbHVaMFZrWjJVb2RHbHRaU2tnZTF4dUlDQWdJSFJwYldWeVNXUWdQU0IxYm1SbFptbHVaV1E3WEc1Y2JpQWdJQ0F2THlCUGJteDVJR2x1ZG05clpTQnBaaUIzWlNCb1lYWmxJR0JzWVhOMFFYSm5jMkFnZDJocFkyZ2diV1ZoYm5NZ1lHWjFibU5nSUdoaGN5QmlaV1Z1WEc0Z0lDQWdMeThnWkdWaWIzVnVZMlZrSUdGMElHeGxZWE4wSUc5dVkyVXVYRzRnSUNBZ2FXWWdLSFJ5WVdsc2FXNW5JQ1ltSUd4aGMzUkJjbWR6S1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYVc1MmIydGxSblZ1WXloMGFXMWxLVHRjYmlBZ0lDQjlYRzRnSUNBZ2JHRnpkRUZ5WjNNZ1BTQnNZWE4wVkdocGN5QTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z1kyRnVZMlZzS0NrZ2UxeHVJQ0FnSUdsbUlDaDBhVzFsY2tsa0lDRTlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUdOc1pXRnlWR2x0Wlc5MWRDaDBhVzFsY2tsa0tUdGNiaUFnSUNCOVhHNGdJQ0FnYkdGemRFbHVkbTlyWlZScGJXVWdQU0F3TzF4dUlDQWdJR3hoYzNSQmNtZHpJRDBnYkdGemRFTmhiR3hVYVcxbElEMGdiR0Z6ZEZSb2FYTWdQU0IwYVcxbGNrbGtJRDBnZFc1a1pXWnBibVZrTzF4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z1pteDFjMmdvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJwYldWeVNXUWdQVDA5SUhWdVpHVm1hVzVsWkNBL0lISmxjM1ZzZENBNklIUnlZV2xzYVc1blJXUm5aU2h1YjNjb0tTazdYRzRnSUgxY2JseHVJQ0JtZFc1amRHbHZiaUJrWldKdmRXNWpaV1FvS1NCN1hHNGdJQ0FnZG1GeUlIUnBiV1VnUFNCdWIzY29LU3hjYmlBZ0lDQWdJQ0FnYVhOSmJuWnZhMmx1WnlBOUlITm9iM1ZzWkVsdWRtOXJaU2gwYVcxbEtUdGNibHh1SUNBZ0lHeGhjM1JCY21keklEMGdZWEpuZFcxbGJuUnpPMXh1SUNBZ0lHeGhjM1JVYUdseklEMGdkR2hwY3p0Y2JpQWdJQ0JzWVhOMFEyRnNiRlJwYldVZ1BTQjBhVzFsTzF4dVhHNGdJQ0FnYVdZZ0tHbHpTVzUyYjJ0cGJtY3BJSHRjYmlBZ0lDQWdJR2xtSUNoMGFXMWxja2xrSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR3hsWVdScGJtZEZaR2RsS0d4aGMzUkRZV3hzVkdsdFpTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQnBaaUFvYldGNGFXNW5LU0I3WEc0Z0lDQWdJQ0FnSUM4dklFaGhibVJzWlNCcGJuWnZZMkYwYVc5dWN5QnBiaUJoSUhScFoyaDBJR3h2YjNBdVhHNGdJQ0FnSUNBZ0lIUnBiV1Z5U1dRZ1BTQnpaWFJVYVcxbGIzVjBLSFJwYldWeVJYaHdhWEpsWkN3Z2QyRnBkQ2s3WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJwYm5admEyVkdkVzVqS0d4aGMzUkRZV3hzVkdsdFpTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0FnSUdsbUlDaDBhVzFsY2tsa0lEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUhScGJXVnlTV1FnUFNCelpYUlVhVzFsYjNWMEtIUnBiV1Z5Ulhod2FYSmxaQ3dnZDJGcGRDazdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYRzRnSUgxY2JpQWdaR1ZpYjNWdVkyVmtMbU5oYm1ObGJDQTlJR05oYm1ObGJEdGNiaUFnWkdWaWIzVnVZMlZrTG1ac2RYTm9JRDBnWm14MWMyZzdYRzRnSUhKbGRIVnliaUJrWldKdmRXNWpaV1E3WEc1OVhHNWNiaThxS2x4dUlDb2dRM0psWVhSbGN5QmhJSFJvY205MGRHeGxaQ0JtZFc1amRHbHZiaUIwYUdGMElHOXViSGtnYVc1MmIydGxjeUJnWm5WdVkyQWdZWFFnYlc5emRDQnZibU5sSUhCbGNseHVJQ29nWlhabGNua2dZSGRoYVhSZ0lHMXBiR3hwYzJWamIyNWtjeTRnVkdobElIUm9jbTkwZEd4bFpDQm1kVzVqZEdsdmJpQmpiMjFsY3lCM2FYUm9JR0VnWUdOaGJtTmxiR0JjYmlBcUlHMWxkR2h2WkNCMGJ5QmpZVzVqWld3Z1pHVnNZWGxsWkNCZ1puVnVZMkFnYVc1MmIyTmhkR2x2Ym5NZ1lXNWtJR0VnWUdac2RYTm9ZQ0J0WlhSb2IyUWdkRzljYmlBcUlHbHRiV1ZrYVdGMFpXeDVJR2x1ZG05clpTQjBhR1Z0TGlCUWNtOTJhV1JsSUdCdmNIUnBiMjV6WUNCMGJ5QnBibVJwWTJGMFpTQjNhR1YwYUdWeUlHQm1kVzVqWUZ4dUlDb2djMmh2ZFd4a0lHSmxJR2x1ZG05clpXUWdiMjRnZEdobElHeGxZV1JwYm1jZ1lXNWtMMjl5SUhSeVlXbHNhVzVuSUdWa1oyVWdiMllnZEdobElHQjNZV2wwWUZ4dUlDb2dkR2x0Wlc5MWRDNGdWR2hsSUdCbWRXNWpZQ0JwY3lCcGJuWnZhMlZrSUhkcGRHZ2dkR2hsSUd4aGMzUWdZWEpuZFcxbGJuUnpJSEJ5YjNacFpHVmtJSFJ2SUhSb1pWeHVJQ29nZEdoeWIzUjBiR1ZrSUdaMWJtTjBhVzl1TGlCVGRXSnpaWEYxWlc1MElHTmhiR3h6SUhSdklIUm9aU0IwYUhKdmRIUnNaV1FnWm5WdVkzUnBiMjRnY21WMGRYSnVJSFJvWlZ4dUlDb2djbVZ6ZFd4MElHOW1JSFJvWlNCc1lYTjBJR0JtZFc1allDQnBiblp2WTJGMGFXOXVMbHh1SUNwY2JpQXFJQ29xVG05MFpUb3FLaUJKWmlCZ2JHVmhaR2x1WjJBZ1lXNWtJR0IwY21GcGJHbHVaMkFnYjNCMGFXOXVjeUJoY21VZ1lIUnlkV1ZnTENCZ1puVnVZMkFnYVhOY2JpQXFJR2x1ZG05clpXUWdiMjRnZEdobElIUnlZV2xzYVc1bklHVmtaMlVnYjJZZ2RHaGxJSFJwYldWdmRYUWdiMjVzZVNCcFppQjBhR1VnZEdoeWIzUjBiR1ZrSUdaMWJtTjBhVzl1WEc0Z0tpQnBjeUJwYm5admEyVmtJRzF2Y21VZ2RHaGhiaUJ2Ym1ObElHUjFjbWx1WnlCMGFHVWdZSGRoYVhSZ0lIUnBiV1Z2ZFhRdVhHNGdLbHh1SUNvZ1NXWWdZSGRoYVhSZ0lHbHpJR0F3WUNCaGJtUWdZR3hsWVdScGJtZGdJR2x6SUdCbVlXeHpaV0FzSUdCbWRXNWpZQ0JwYm5adlkyRjBhVzl1SUdseklHUmxabVZ5Y21Wa1hHNGdLaUIxYm5ScGJDQjBieUIwYUdVZ2JtVjRkQ0IwYVdOckxDQnphVzFwYkdGeUlIUnZJR0J6WlhSVWFXMWxiM1YwWUNCM2FYUm9JR0VnZEdsdFpXOTFkQ0J2WmlCZ01HQXVYRzRnS2x4dUlDb2dVMlZsSUZ0RVlYWnBaQ0JEYjNKaVlXTm9ieWR6SUdGeWRHbGpiR1ZkS0doMGRIQnpPaTh2WTNOekxYUnlhV05yY3k1amIyMHZaR1ZpYjNWdVkybHVaeTEwYUhKdmRIUnNhVzVuTFdWNGNHeGhhVzVsWkMxbGVHRnRjR3hsY3k4cFhHNGdLaUJtYjNJZ1pHVjBZV2xzY3lCdmRtVnlJSFJvWlNCa2FXWm1aWEpsYm1ObGN5QmlaWFIzWldWdUlHQmZMblJvY205MGRHeGxZQ0JoYm1RZ1lGOHVaR1ZpYjNWdVkyVmdMbHh1SUNwY2JpQXFJRUJ6ZEdGMGFXTmNiaUFxSUVCdFpXMWlaWEpQWmlCZlhHNGdLaUJBYzJsdVkyVWdNQzR4TGpCY2JpQXFJRUJqWVhSbFoyOXllU0JHZFc1amRHbHZibHh1SUNvZ1FIQmhjbUZ0SUh0R2RXNWpkR2x2Ym4wZ1puVnVZeUJVYUdVZ1puVnVZM1JwYjI0Z2RHOGdkR2h5YjNSMGJHVXVYRzRnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnVzNkaGFYUTlNRjBnVkdobElHNTFiV0psY2lCdlppQnRhV3hzYVhObFkyOXVaSE1nZEc4Z2RHaHliM1IwYkdVZ2FXNTJiMk5oZEdsdmJuTWdkRzh1WEc0Z0tpQkFjR0Z5WVcwZ2UwOWlhbVZqZEgwZ1cyOXdkR2x2Ym5NOWUzMWRJRlJvWlNCdmNIUnBiMjV6SUc5aWFtVmpkQzVjYmlBcUlFQndZWEpoYlNCN1ltOXZiR1ZoYm4wZ1cyOXdkR2x2Ym5NdWJHVmhaR2x1WnoxMGNuVmxYVnh1SUNvZ0lGTndaV05wWm5rZ2FXNTJiMnRwYm1jZ2IyNGdkR2hsSUd4bFlXUnBibWNnWldSblpTQnZaaUIwYUdVZ2RHbHRaVzkxZEM1Y2JpQXFJRUJ3WVhKaGJTQjdZbTl2YkdWaGJuMGdXMjl3ZEdsdmJuTXVkSEpoYVd4cGJtYzlkSEoxWlYxY2JpQXFJQ0JUY0dWamFXWjVJR2x1ZG05cmFXNW5JRzl1SUhSb1pTQjBjbUZwYkdsdVp5QmxaR2RsSUc5bUlIUm9aU0IwYVcxbGIzVjBMbHh1SUNvZ1FISmxkSFZ5Ym5NZ2UwWjFibU4wYVc5dWZTQlNaWFIxY201eklIUm9aU0J1WlhjZ2RHaHliM1IwYkdWa0lHWjFibU4wYVc5dUxseHVJQ29nUUdWNFlXMXdiR1ZjYmlBcVhHNGdLaUF2THlCQmRtOXBaQ0JsZUdObGMzTnBkbVZzZVNCMWNHUmhkR2x1WnlCMGFHVWdjRzl6YVhScGIyNGdkMmhwYkdVZ2MyTnliMnhzYVc1bkxseHVJQ29nYWxGMVpYSjVLSGRwYm1SdmR5a3ViMjRvSjNOamNtOXNiQ2NzSUY4dWRHaHliM1IwYkdVb2RYQmtZWFJsVUc5emFYUnBiMjRzSURFd01Da3BPMXh1SUNwY2JpQXFJQzh2SUVsdWRtOXJaU0JnY21WdVpYZFViMnRsYm1BZ2QyaGxiaUIwYUdVZ1kyeHBZMnNnWlhabGJuUWdhWE1nWm1seVpXUXNJR0oxZENCdWIzUWdiVzl5WlNCMGFHRnVJRzl1WTJVZ1pYWmxjbmtnTlNCdGFXNTFkR1Z6TGx4dUlDb2dkbUZ5SUhSb2NtOTBkR3hsWkNBOUlGOHVkR2h5YjNSMGJHVW9jbVZ1WlhkVWIydGxiaXdnTXpBd01EQXdMQ0I3SUNkMGNtRnBiR2x1WnljNklHWmhiSE5sSUgwcE8xeHVJQ29nYWxGMVpYSjVLR1ZzWlcxbGJuUXBMbTl1S0NkamJHbGpheWNzSUhSb2NtOTBkR3hsWkNrN1hHNGdLbHh1SUNvZ0x5OGdRMkZ1WTJWc0lIUm9aU0IwY21GcGJHbHVaeUIwYUhKdmRIUnNaV1FnYVc1MmIyTmhkR2x2Ymk1Y2JpQXFJR3BSZFdWeWVTaDNhVzVrYjNjcExtOXVLQ2R3YjNCemRHRjBaU2NzSUhSb2NtOTBkR3hsWkM1allXNWpaV3dwTzF4dUlDb3ZYRzVtZFc1amRHbHZiaUIwYUhKdmRIUnNaU2htZFc1akxDQjNZV2wwTENCdmNIUnBiMjV6S1NCN1hHNGdJSFpoY2lCc1pXRmthVzVuSUQwZ2RISjFaU3hjYmlBZ0lDQWdJSFJ5WVdsc2FXNW5JRDBnZEhKMVpUdGNibHh1SUNCcFppQW9kSGx3Wlc5bUlHWjFibU1nSVQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QlVlWEJsUlhKeWIzSW9SbFZPUTE5RlVsSlBVbDlVUlZoVUtUdGNiaUFnZlZ4dUlDQnBaaUFvYVhOUFltcGxZM1FvYjNCMGFXOXVjeWtwSUh0Y2JpQWdJQ0JzWldGa2FXNW5JRDBnSjJ4bFlXUnBibWNuSUdsdUlHOXdkR2x2Ym5NZ1B5QWhJVzl3ZEdsdmJuTXViR1ZoWkdsdVp5QTZJR3hsWVdScGJtYzdYRzRnSUNBZ2RISmhhV3hwYm1jZ1BTQW5kSEpoYVd4cGJtY25JR2x1SUc5d2RHbHZibk1nUHlBaElXOXdkR2x2Ym5NdWRISmhhV3hwYm1jZ09pQjBjbUZwYkdsdVp6dGNiaUFnZlZ4dUlDQnlaWFIxY200Z1pHVmliM1Z1WTJVb1puVnVZeXdnZDJGcGRDd2dlMXh1SUNBZ0lDZHNaV0ZrYVc1bkp6b2diR1ZoWkdsdVp5eGNiaUFnSUNBbmJXRjRWMkZwZENjNklIZGhhWFFzWEc0Z0lDQWdKM1J5WVdsc2FXNW5Kem9nZEhKaGFXeHBibWRjYmlBZ2ZTazdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1EyaGxZMnR6SUdsbUlHQjJZV3gxWldBZ2FYTWdkR2hsWEc0Z0tpQmJiR0Z1WjNWaFoyVWdkSGx3WlYwb2FIUjBjRG92TDNkM2R5NWxZMjFoTFdsdWRHVnlibUYwYVc5dVlXd3ViM0puTDJWamJXRXRNall5THpjdU1DOGpjMlZqTFdWamJXRnpZM0pwY0hRdGJHRnVaM1ZoWjJVdGRIbHdaWE1wWEc0Z0tpQnZaaUJnVDJKcVpXTjBZQzRnS0dVdVp5NGdZWEp5WVhsekxDQm1kVzVqZEdsdmJuTXNJRzlpYW1WamRITXNJSEpsWjJWNFpYTXNJR0J1WlhjZ1RuVnRZbVZ5S0RBcFlDd2dZVzVrSUdCdVpYY2dVM1J5YVc1bktDY25LV0FwWEc0Z0tseHVJQ29nUUhOMFlYUnBZMXh1SUNvZ1FHMWxiV0psY2s5bUlGOWNiaUFxSUVCemFXNWpaU0F3TGpFdU1GeHVJQ29nUUdOaGRHVm5iM0o1SUV4aGJtZGNiaUFxSUVCd1lYSmhiU0I3S24wZ2RtRnNkV1VnVkdobElIWmhiSFZsSUhSdklHTm9aV05yTGx4dUlDb2dRSEpsZEhWeWJuTWdlMkp2YjJ4bFlXNTlJRkpsZEhWeWJuTWdZSFJ5ZFdWZ0lHbG1JR0IyWVd4MVpXQWdhWE1nWVc0Z2IySnFaV04wTENCbGJITmxJR0JtWVd4elpXQXVYRzRnS2lCQVpYaGhiWEJzWlZ4dUlDcGNiaUFxSUY4dWFYTlBZbXBsWTNRb2UzMHBPMXh1SUNvZ0x5OGdQVDRnZEhKMVpWeHVJQ3BjYmlBcUlGOHVhWE5QWW1wbFkzUW9XekVzSURJc0lETmRLVHRjYmlBcUlDOHZJRDArSUhSeWRXVmNiaUFxWEc0Z0tpQmZMbWx6VDJKcVpXTjBLRjh1Ym05dmNDazdYRzRnS2lBdkx5QTlQaUIwY25WbFhHNGdLbHh1SUNvZ1h5NXBjMDlpYW1WamRDaHVkV3hzS1R0Y2JpQXFJQzh2SUQwK0lHWmhiSE5sWEc0Z0tpOWNibVoxYm1OMGFXOXVJR2x6VDJKcVpXTjBLSFpoYkhWbEtTQjdYRzRnSUhaaGNpQjBlWEJsSUQwZ2RIbHdaVzltSUhaaGJIVmxPMXh1SUNCeVpYUjFjbTRnSVNGMllXeDFaU0FtSmlBb2RIbHdaU0E5UFNBbmIySnFaV04wSnlCOGZDQjBlWEJsSUQwOUlDZG1kVzVqZEdsdmJpY3BPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlFTm9aV05yY3lCcFppQmdkbUZzZFdWZ0lHbHpJRzlpYW1WamRDMXNhV3RsTGlCQklIWmhiSFZsSUdseklHOWlhbVZqZEMxc2FXdGxJR2xtSUdsMEozTWdibTkwSUdCdWRXeHNZRnh1SUNvZ1lXNWtJR2hoY3lCaElHQjBlWEJsYjJaZ0lISmxjM1ZzZENCdlppQmNJbTlpYW1WamRGd2lMbHh1SUNwY2JpQXFJRUJ6ZEdGMGFXTmNiaUFxSUVCdFpXMWlaWEpQWmlCZlhHNGdLaUJBYzJsdVkyVWdOQzR3TGpCY2JpQXFJRUJqWVhSbFoyOXllU0JNWVc1blhHNGdLaUJBY0dGeVlXMGdleXA5SUhaaGJIVmxJRlJvWlNCMllXeDFaU0IwYnlCamFHVmpheTVjYmlBcUlFQnlaWFIxY201eklIdGliMjlzWldGdWZTQlNaWFIxY201eklHQjBjblZsWUNCcFppQmdkbUZzZFdWZ0lHbHpJRzlpYW1WamRDMXNhV3RsTENCbGJITmxJR0JtWVd4elpXQXVYRzRnS2lCQVpYaGhiWEJzWlZ4dUlDcGNiaUFxSUY4dWFYTlBZbXBsWTNSTWFXdGxLSHQ5S1R0Y2JpQXFJQzh2SUQwK0lIUnlkV1ZjYmlBcVhHNGdLaUJmTG1selQySnFaV04wVEdsclpTaGJNU3dnTWl3Z00xMHBPMXh1SUNvZ0x5OGdQVDRnZEhKMVpWeHVJQ3BjYmlBcUlGOHVhWE5QWW1wbFkzUk1hV3RsS0Y4dWJtOXZjQ2s3WEc0Z0tpQXZMeUE5UGlCbVlXeHpaVnh1SUNwY2JpQXFJRjh1YVhOUFltcGxZM1JNYVd0bEtHNTFiR3dwTzF4dUlDb2dMeThnUFQ0Z1ptRnNjMlZjYmlBcUwxeHVablZ1WTNScGIyNGdhWE5QWW1wbFkzUk1hV3RsS0haaGJIVmxLU0I3WEc0Z0lISmxkSFZ5YmlBaElYWmhiSFZsSUNZbUlIUjVjR1Z2WmlCMllXeDFaU0E5UFNBbmIySnFaV04wSnp0Y2JuMWNibHh1THlvcVhHNGdLaUJEYUdWamEzTWdhV1lnWUhaaGJIVmxZQ0JwY3lCamJHRnpjMmxtYVdWa0lHRnpJR0VnWUZONWJXSnZiR0FnY0hKcGJXbDBhWFpsSUc5eUlHOWlhbVZqZEM1Y2JpQXFYRzRnS2lCQWMzUmhkR2xqWEc0Z0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNvZ1FITnBibU5sSURRdU1DNHdYRzRnS2lCQVkyRjBaV2R2Y25rZ1RHRnVaMXh1SUNvZ1FIQmhjbUZ0SUhzcWZTQjJZV3gxWlNCVWFHVWdkbUZzZFdVZ2RHOGdZMmhsWTJzdVhHNGdLaUJBY21WMGRYSnVjeUI3WW05dmJHVmhibjBnVW1WMGRYSnVjeUJnZEhKMVpXQWdhV1lnWUhaaGJIVmxZQ0JwY3lCaElITjViV0p2YkN3Z1pXeHpaU0JnWm1Gc2MyVmdMbHh1SUNvZ1FHVjRZVzF3YkdWY2JpQXFYRzRnS2lCZkxtbHpVM2x0WW05c0tGTjViV0p2YkM1cGRHVnlZWFJ2Y2lrN1hHNGdLaUF2THlBOVBpQjBjblZsWEc0Z0tseHVJQ29nWHk1cGMxTjViV0p2YkNnbllXSmpKeWs3WEc0Z0tpQXZMeUE5UGlCbVlXeHpaVnh1SUNvdlhHNW1kVzVqZEdsdmJpQnBjMU41YldKdmJDaDJZV3gxWlNrZ2UxeHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlIWmhiSFZsSUQwOUlDZHplVzFpYjJ3bklIeDhYRzRnSUNBZ0tHbHpUMkpxWldOMFRHbHJaU2gyWVd4MVpTa2dKaVlnYjJKcVpXTjBWRzlUZEhKcGJtY3VZMkZzYkNoMllXeDFaU2tnUFQwZ2MzbHRZbTlzVkdGbktUdGNibjFjYmx4dUx5b3FYRzRnS2lCRGIyNTJaWEowY3lCZ2RtRnNkV1ZnSUhSdklHRWdiblZ0WW1WeUxseHVJQ3BjYmlBcUlFQnpkR0YwYVdOY2JpQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0tpQkFjMmx1WTJVZ05DNHdMakJjYmlBcUlFQmpZWFJsWjI5eWVTQk1ZVzVuWEc0Z0tpQkFjR0Z5WVcwZ2V5cDlJSFpoYkhWbElGUm9aU0IyWVd4MVpTQjBieUJ3Y205alpYTnpMbHh1SUNvZ1FISmxkSFZ5Ym5NZ2UyNTFiV0psY24wZ1VtVjBkWEp1Y3lCMGFHVWdiblZ0WW1WeUxseHVJQ29nUUdWNFlXMXdiR1ZjYmlBcVhHNGdLaUJmTG5SdlRuVnRZbVZ5S0RNdU1pazdYRzRnS2lBdkx5QTlQaUF6TGpKY2JpQXFYRzRnS2lCZkxuUnZUblZ0WW1WeUtFNTFiV0psY2k1TlNVNWZWa0ZNVlVVcE8xeHVJQ29nTHk4Z1BUNGdOV1V0TXpJMFhHNGdLbHh1SUNvZ1h5NTBiMDUxYldKbGNpaEpibVpwYm1sMGVTazdYRzRnS2lBdkx5QTlQaUJKYm1acGJtbDBlVnh1SUNwY2JpQXFJRjh1ZEc5T2RXMWlaWElvSnpNdU1pY3BPMXh1SUNvZ0x5OGdQVDRnTXk0eVhHNGdLaTljYm1aMWJtTjBhVzl1SUhSdlRuVnRZbVZ5S0haaGJIVmxLU0I3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdkbUZzZFdVZ1BUMGdKMjUxYldKbGNpY3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RtRnNkV1U3WEc0Z0lIMWNiaUFnYVdZZ0tHbHpVM2x0WW05c0tIWmhiSFZsS1NrZ2UxeHVJQ0FnSUhKbGRIVnliaUJPUVU0N1hHNGdJSDFjYmlBZ2FXWWdLR2x6VDJKcVpXTjBLSFpoYkhWbEtTa2dlMXh1SUNBZ0lIWmhjaUJ2ZEdobGNpQTlJSFI1Y0dWdlppQjJZV3gxWlM1MllXeDFaVTltSUQwOUlDZG1kVzVqZEdsdmJpY2dQeUIyWVd4MVpTNTJZV3gxWlU5bUtDa2dPaUIyWVd4MVpUdGNiaUFnSUNCMllXeDFaU0E5SUdselQySnFaV04wS0c5MGFHVnlLU0EvSUNodmRHaGxjaUFySUNjbktTQTZJRzkwYUdWeU8xeHVJQ0I5WEc0Z0lHbG1JQ2gwZVhCbGIyWWdkbUZzZFdVZ0lUMGdKM04wY21sdVp5Y3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RtRnNkV1VnUFQwOUlEQWdQeUIyWVd4MVpTQTZJQ3QyWVd4MVpUdGNiaUFnZlZ4dUlDQjJZV3gxWlNBOUlIWmhiSFZsTG5KbGNHeGhZMlVvY21WVWNtbHRMQ0FuSnlrN1hHNGdJSFpoY2lCcGMwSnBibUZ5ZVNBOUlISmxTWE5DYVc1aGNua3VkR1Z6ZENoMllXeDFaU2s3WEc0Z0lISmxkSFZ5YmlBb2FYTkNhVzVoY25rZ2ZId2djbVZKYzA5amRHRnNMblJsYzNRb2RtRnNkV1VwS1Z4dUlDQWdJRDhnWm5KbFpWQmhjbk5sU1c1MEtIWmhiSFZsTG5Oc2FXTmxLRElwTENCcGMwSnBibUZ5ZVNBL0lESWdPaUE0S1Z4dUlDQWdJRG9nS0hKbFNYTkNZV1JJWlhndWRHVnpkQ2gyWVd4MVpTa2dQeUJPUVU0Z09pQXJkbUZzZFdVcE8xeHVmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhSb2NtOTBkR3hsTzF4dUlpd2lhVzF3YjNKMElHUmxZbTkxYm1ObElHWnliMjBnSnk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlzYjJSaGMyZ3VaR1ZpYjNWdVkyVXZhVzVrWlhnbk8xeHlYRzVwYlhCdmNuUWdkR2h5YjNSMGJHVWdabkp2YlNBbkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJ4dlpHRnphQzUwYUhKdmRIUnNaUzlwYm1SbGVDYzdYSEpjYmx4eVhHNGtLR1J2WTNWdFpXNTBLUzV5WldGa2VTZ29LU0E5UGlCN1hISmNiaUFnUVU5VExtbHVhWFFvZTF4eVhHNGdJQ0FnWkdsellXSnNaVG9nSjIxdlltbHNaU2NzWEhKY2JpQWdJQ0JsWVhOcGJtYzZJQ2RsWVhObExXbHVMVzkxZENjc1hISmNiaUFnSUNCa1pXeGhlVG9nTVRBd0xGeHlYRzRnSUNBZ1pIVnlZWFJwYjI0NklERXdNREFzWEhKY2JpQWdJQ0J2Wm1aelpYUTZJREV3TUN4Y2NseHVJQ0FnSUc5dVkyVTZJSFJ5ZFdWY2NseHVJQ0I5S1R0Y2NseHVJQ0J6WTNKdmJHeENkRzVKYm1sMEtDazdYSEpjYmlBZ1pISnZjRVJ2ZDI1SmJtbDBLQ2s3WEhKY2JpQWdkRzluWjJ4bFEyOXNiR0Z3YzJVb0tUdGNjbHh1SUNCcGJtbDBVSEp2YW1WamRGTnNhV1JsY2lncE8xeHlYRzRnSUdsdWFYUk5aVzUxUW5SdUtDazdYSEpjYmlBZ2FXNXBkRlJ2YjJ4elFuUnVjeWdwTzF4eVhHNGdJR2x1YVhSVFkzSnZiR3hDZEc1ektDazdYSEpjYmlBZ2MyVjBUVzlrWld4elNHVnBaMmgwS0NrN1hISmNiaUFnYzJWc1pXTjBUVzlrWld3b0tUdGNjbHh1SUNBa0tIZHBibVJ2ZHlrdWNtVnphWHBsS0dSbFltOTFibU5sS0hObGRFMXZaR1ZzYzBobGFXZG9kQ3dnTVRVd0tTazdYSEpjYm4wcE8xeHlYRzVjY2x4dVpuVnVZM1JwYjI0Z2MyTnliMnhzUW5SdVNXNXBkQ2dwSUh0Y2NseHVJQ0FrS0NjdVptOXZkR1Z5WDE5MWNDMWlkRzRuS1M1amJHbGpheWhtZFc1amRHbHZiaUFvWlhabGJuUXBJSHRjY2x4dUlDQWdJSFpoY2lCMFlYSm5aWFFnUFNBa0tIUm9hWE11YUdGemFDazdYSEpjYmlBZ0lDQnBaaUFvZEdGeVoyVjBMbXhsYm1kMGFDa2dlMXh5WEc0Z0lDQWdJQ0JsZG1WdWRDNXdjbVYyWlc1MFJHVm1ZWFZzZENncE8xeHlYRzVjY2x4dUlDQWdJQ0FnSkNnbmFIUnRiQ3dnWW05a2VTY3BMbUZ1YVcxaGRHVW9lMXh5WEc0Z0lDQWdJQ0FnSUhOamNtOXNiRlJ2Y0RvZ2RHRnlaMlYwTG05bVpuTmxkQ2dwTG5SdmNGeHlYRzRnSUNBZ0lDQjlMQ0F4TURBd0xDQm1kVzVqZEdsdmJpQW9LU0I3WEhKY2JseHlYRzRnSUNBZ0lDQWdJSFpoY2lBa2RHRnlaMlYwSUQwZ0pDaDBZWEpuWlhRcE8xeHlYRzRnSUNBZ0lDQWdJQ1IwWVhKblpYUXVabTlqZFhNb0tUdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb0pIUmhjbWRsZEM1cGN5aGNJanBtYjJOMWMxd2lLU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4eVhHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hISmNiaUFnSUNBZ0lDQWdJQ0FrZEdGeVoyVjBMbUYwZEhJb0ozUmhZbWx1WkdWNEp5d2dKeTB4SnlrN1hISmNiaUFnSUNBZ0lDQWdJQ0FrZEdGeVoyVjBMbVp2WTNWektDazdYSEpjYmlBZ0lDQWdJQ0FnZlR0Y2NseHVJQ0FnSUNBZ2ZTazdYSEpjYmlBZ0lDQjlYSEpjYmlBZ2ZTazdYSEpjYm4xY2NseHVYSEpjYm1aMWJtTjBhVzl1SUdSeWIzQkViM2R1U1c1cGRDZ3BJSHRjY2x4dUlDQWtLQ2N1WW5KbFlXUmpjblZ0WW5OZlgyUmtMV0owYmljcExtTnNhV05yS0NobGRtVnVkQ2tnUFQ0Z2UxeHlYRzRnSUNBZ1kyOXVjM1FnYUdGelEyeGhjM01nUFNBa0tHVjJaVzUwTG5SaGNtZGxkQzV3WVhKbGJuUkZiR1Z0Wlc1MEtTNW9ZWE5EYkdGemN5Z25ZbkpsWVdSamNuVnRZbk5mWDJSa0xXSjBiaTF6YUc5M0p5azdYSEpjYmlBZ0lDQmpiMjV6ZENCbGJHVnRaVzUwYzBOdmRXNTBJRDBnSkNnbkxtSnlaV0ZrWTNKMWJXSnpYMTlrWkMxaWRHNHRjMmh2ZHljcExteGxibWQwYUR0Y2NseHVJQ0FnSUdsbUlDaG9ZWE5EYkdGemN5QW1KaUJsYkdWdFpXNTBjME52ZFc1MEtTQjdYSEpjYmlBZ0lDQWdJQ1FvWlhabGJuUXVkR0Z5WjJWMExuQmhjbVZ1ZEVWc1pXMWxiblFwTG5KbGJXOTJaVU5zWVhOektDZGljbVZoWkdOeWRXMWljMTlmWkdRdFluUnVMWE5vYjNjbktUdGNjbHh1SUNBZ0lIMGdaV3h6WlNCcFppQW9JV2hoYzBOc1lYTnpJQ1ltSUdWc1pXMWxiblJ6UTI5MWJuUXBJSHRjY2x4dUlDQWdJQ0FnSkNnbkxtSnlaV0ZrWTNKMWJXSnpYMTlrWkMxaWRHNHRjMmh2ZHljcExuSmxiVzkyWlVOc1lYTnpLQ2RpY21WaFpHTnlkVzFpYzE5ZlpHUXRZblJ1TFhOb2IzY25LVHRjY2x4dUlDQWdJQ0FnSkNobGRtVnVkQzUwWVhKblpYUXVjR0Z5Wlc1MFJXeGxiV1Z1ZENrdVlXUmtRMnhoYzNNb0oySnlaV0ZrWTNKMWJXSnpYMTlrWkMxaWRHNHRjMmh2ZHljcE8xeHlYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2NseHVJQ0FnSUNBZ0pDaGxkbVZ1ZEM1MFlYSm5aWFF1Y0dGeVpXNTBSV3hsYldWdWRDa3VZV1JrUTJ4aGMzTW9KMkp5WldGa1kzSjFiV0p6WDE5a1pDMWlkRzR0YzJodmR5Y3BPMXh5WEc0Z0lDQWdmVnh5WEc0Z0lIMHBPMXh5WEc1Y2NseHVJQ0FrS0hkcGJtUnZkeWt1WTJ4cFkyc29LR1YyWlc1MEtTQTlQaUI3WEhKY2JpQWdJQ0JwWmlBb0lTUW9aWFpsYm5RdWRHRnlaMlYwS1M1cGN5Z25MbUp5WldGa1kzSjFiV0p6WDE5a1pDMWlkRzRuS1NrZ2UxeHlYRzRnSUNBZ0lDQWtLQ2N1WW5KbFlXUmpjblZ0WW5OZlgyUmtMV0owYmkxemFHOTNKeWt1Y21WdGIzWmxRMnhoYzNNb0oySnlaV0ZrWTNKMWJXSnpYMTlrWkMxaWRHNHRjMmh2ZHljcE8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUgwcFhISmNibjFjY2x4dVhISmNibVoxYm1OMGFXOXVJSFJ2WjJkc1pVTnZiR3hoY0hObEtDa2dlMXh5WEc0Z0lHeGxkQ0IwYVcxbGIzVjBPMXh5WEc0Z0lDUW9KeTVrWlhOalgxOTBhWFJzWlMxamIyeHNZWEJ6WlMxaWRHNG5LUzVqYkdsamF5Z29aWFpsYm5RcElEMCtJSHRjY2x4dUlDQWdJQ1FvSnk1a1pYTmpYMTl0YjJKcGJHVXRkR2wwYkdVbktTNTBiMmRuYkdWRGJHRnpjeWduWVdOMGFYWmxKeWs3WEhKY2JpQWdJQ0JqYjI1emRDQndZVzVsYkNBOUlDUW9KeTVrWlhOalgxOWpiMnhzWVhCelpTMWpiMjUwWVdsdVpYSW5LVnN3WFR0Y2NseHVJQ0FnSUdsbUlDaHdZVzVsYkM1emRIbHNaUzV0WVhoSVpXbG5hSFFwSUh0Y2NseHVJQ0FnSUNBZ2NHRnVaV3d1YzNSNWJHVXViV0Y0U0dWcFoyaDBJRDBnYm5Wc2JEdGNjbHh1SUNBZ0lDQWdkR2x0Wlc5MWRDQTlJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUhCaGJtVnNMbk4wZVd4bExtUnBjM0JzWVhrZ1BTQW5ibTl1WlNjN1hISmNiaUFnSUNBZ0lIMHNJRFl3TUNrN1hISmNiaUFnSUNCOUlHVnNjMlVnZTF4eVhHNGdJQ0FnSUNCamJHVmhjbFJwYldWdmRYUW9kR2x0Wlc5MWRDazdYSEpjYmlBZ0lDQWdJSEJoYm1Wc0xuTjBlV3hsTG1ScGMzQnNZWGtnUFNBbllteHZZMnNuTzF4eVhHNGdJQ0FnSUNCd1lXNWxiQzV6ZEhsc1pTNXRZWGhJWldsbmFIUWdQU0J3WVc1bGJDNXpZM0p2Ykd4SVpXbG5hSFFnS3lCY0luQjRYQ0k3WEhKY2JpQWdJQ0I5WEhKY2JpQWdmU2xjY2x4dWZWeHlYRzVjY2x4dVpuVnVZM1JwYjI0Z2FXNXBkRkJ5YjJwbFkzUlRiR2xrWlhJb0tTQjdYSEpjYmlBZ1kyOXVjM1FnY0hKdmFtVmpkSE1nUFNBa0tDY3VjSEp2YW1WamRITmZYM05zYVdSbGNpY3BPMXh5WEc0Z0lIQnliMnBsWTNSekxteGxibWQwYUNBbUppQndjbTlxWldOMGN5NXpiR2xqYXloN1hISmNiaUFnSUNCcGJtWnBibWwwWlRvZ1ptRnNjMlVzWEhKY2JpQWdJQ0J6Ykdsa1pYTlViMU5vYjNjNklETXNYSEpjYmlBZ0lDQnpiR2xrWlhOVWIxTmpjbTlzYkRvZ01TeGNjbHh1SUNBZ0lIQnlaWFpCY25KdmR6b2dZRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56UFZ3aWMyeHBZMnN0Y0hKbGRsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzWm5JSGRwWkhSb1BWd2lNalJ3ZUZ3aUlHaGxhV2RvZEQxY0lqSTBjSGhjSWlCMmFXVjNRbTk0UFZ3aU1DQXdJREkwSURJMFhDSWdZWEpwWVMxc1lXSmxiRDFjSWxOc2FXUmxjaUJ3Y21WMklHSjFkSFJ2YmlCcFkyOXVYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEJ2YkhsbmIyNGdabWxzYkQxY0lpTTNOVGMxTnpWY0lpQndiMmx1ZEhNOVhDSXhNQ0EySURndU5Ua2dOeTQwTVNBeE15NHhOeUF4TWlBNExqVTVJREUyTGpVNUlERXdJREU0SURFMklERXlYQ0krUEM5d2IyeDVaMjl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM04yWno1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBtQXNYSEpjYmlBZ0lDQnVaWGgwUVhKeWIzYzZJR0E4WW5WMGRHOXVJSFI1Y0dVOVhDSmlkWFIwYjI1Y0lpQmpiR0Z6Y3oxY0luTnNhV05yTFc1bGVIUmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjJaeUIzYVdSMGFEMWNJakkwY0hoY0lpQm9aV2xuYUhROVhDSXlOSEI0WENJZ2RtbGxkMEp2ZUQxY0lqQWdNQ0F5TkNBeU5Gd2lJR0Z5YVdFdGJHRmlaV3c5WENKVGJHbGtaWElnYm1WNGRDQmlkWFIwYjI0Z2FXTnZibHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh3YjJ4NVoyOXVJR1pwYkd3OVhDSWpOelUzTlRjMVhDSWdjRzlwYm5SelBWd2lNVEFnTmlBNExqVTVJRGN1TkRFZ01UTXVNVGNnTVRJZ09DNDFPU0F4Tmk0MU9TQXhNQ0F4T0NBeE5pQXhNbHdpUGp3dmNHOXNlV2R2Ymo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6ZG1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMkoxZEhSdmJqNWdMRnh5WEc0Z0lDQWdjbVZ6Y0c5dWMybDJaVG9nVzF4eVhHNGdJQ0FnSUNCN1hISmNiaUFnSUNBZ0lDQWdZbkpsWVd0d2IybHVkRG9nT1RreUxGeHlYRzRnSUNBZ0lDQWdJSE5sZEhScGJtZHpPaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQnpiR2xrWlhOVWIxTm9iM2M2SURJc1hISmNiaUFnSUNBZ0lDQWdmU3hjY2x4dUlDQWdJQ0FnZlN4Y2NseHVJQ0FnSUNBZ2UxeHlYRzRnSUNBZ0lDQWdJR0p5WldGcmNHOXBiblE2SURjMk9DeGNjbHh1SUNBZ0lDQWdJQ0J6WlhSMGFXNW5jem9nZTF4eVhHNGdJQ0FnSUNBZ0lDQWdjMnhwWkdWelZHOVRhRzkzT2lBMUxGeHlYRzRnSUNBZ0lDQWdJSDBzWEhKY2JpQWdJQ0FnSUgxY2NseHVJQ0FnSUYxY2NseHVJQ0I5S1R0Y2NseHVmVnh5WEc1Y2NseHVablZ1WTNScGIyNGdhVzVwZEUxdlpHVnNjMU5zYVdSbGNpZ3BJSHRjY2x4dUlDQmpiMjV6ZENCdGIyUmxiSE1nUFNBa0tDY3ViVzlrWld4ekp5azdYSEpjYmlBZ2FXWWdLQ0Z0YjJSbGJITXViR1Z1WjNSb0tTQnlaWFIxY200N1hISmNiaUFnWTI5dWMzUWdjMnhwWkdWeUlEMGdiVzlrWld4ekxuTnNhV05yS0h0Y2NseHVJQ0FnSUdsdVptbHVhWFJsT2lCbVlXeHpaU3hjY2x4dUlDQWdJSE5zYVdSbGMxUnZVMmh2ZHpvZ1kyRnNZMDF2WkdWc2MxTnNhV1JsY3lncExGeHlYRzRnSUNBZ2MyeHBaR1Z6Vkc5VFkzSnZiR3c2SURFc1hISmNiaUFnSUNCMlpYSjBhV05oYkRvZ2RISjFaU3hjY2x4dUlDQWdJSEJ5WlhaQmNuSnZkem9nWUR4aWRYUjBiMjRnZEhsd1pUMWNJbUoxZEhSdmJsd2lJR05zWVhOelBWd2ljMnhwWTJzdGNISmxkbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1puSUhacFpYZENiM2c5WENJd0lEQWdNalFnTWpSY0lpQmhjbWxoTFd4aFltVnNQVndpVTJ4cFpHVnlJSEJ5WlhZZ1luVjBkRzl1SUdsamIyNWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjRzlzZVdkdmJpQm1hV3hzUFZ3aUl6YzFOelUzTlZ3aUlIQnZhVzUwY3oxY0lqRXdJRFlnT0M0MU9TQTNMalF4SURFekxqRTNJREV5SURndU5Ua2dNVFl1TlRrZ01UQWdNVGdnTVRZZ01USmNJajQ4TDNCdmJIbG5iMjQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjM1puUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWlkWFIwYjI0K1lDeGNjbHh1SUNBZ0lHNWxlSFJCY25KdmR6b2dZRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56UFZ3aWMyeHBZMnN0Ym1WNGRGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzWm5JSFpwWlhkQ2IzZzlYQ0l3SURBZ01qUWdNalJjSWlCaGNtbGhMV3hoWW1Wc1BWd2lVMnhwWkdWeUlHNWxlSFFnWW5WMGRHOXVJR2xqYjI1Y0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNHOXNlV2R2YmlCbWFXeHNQVndpSXpjMU56VTNOVndpSUhCdmFXNTBjejFjSWpFd0lEWWdPQzQxT1NBM0xqUXhJREV6TGpFM0lERXlJRGd1TlRrZ01UWXVOVGtnTVRBZ01UZ2dNVFlnTVRKY0lqNDhMM0J2YkhsbmIyNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmMzWm5QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5aWRYUjBiMjQrWUN4Y2NseHVJQ0I5S1R0Y2NseHVYSEpjYmlBZ0pDaDNhVzVrYjNjcExuSmxjMmw2WlNoa1pXSnZkVzVqWlNnb0tTQTlQaUI3WEhKY2JpQWdJQ0J6Ykdsa1pYSXVjMnhwWTJzb0ozTnNhV05yVTJWMFQzQjBhVzl1Snl3Z0ozTnNhV1JsYzFSdlUyaHZkeWNzSUdOaGJHTk5iMlJsYkhOVGJHbGtaWE1vS1N3Z2RISjFaU2s3WEhKY2JpQWdmU3dnTVRVd0tTazdYSEpjYm4xY2NseHVablZ1WTNScGIyNGdZMkZzWTAxdlpHVnNjMU5zYVdSbGN5Z3BJSHRjY2x4dUlDQmpiMjV6ZENCb1pXRmtaWEpJWldsbmFIUWdQU0E0TUR0Y2NseHVJQ0JqYjI1emRDQnpiR2xrWlhKQ2RHNXpJRDBnTmpnN1hISmNiaUFnWTI5dWMzUWdkRzl3VUdGa1pHbHVaeUE5SURFd08xeHlYRzRnSUdOdmJuTjBJSE5zYVdSbFNHVnBaMmgwSUQwZ2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ1BDQXhOakF3SUQ4Z01UQXdJRG9nTVRVd08xeHlYRzVjY2x4dUlDQmpiMjV6ZENCemJHbGtaWEpJWldsbmFIUWdQU0JvWldGa1pYSklaV2xuYUhRZ0t5QnpiR2xrWlhKQ2RHNXpJQ3NnZEc5d1VHRmtaR2x1Wnp0Y2NseHVJQ0J5WlhSMWNtNGdUV0YwYUM1bWJHOXZjaWdvZDJsdVpHOTNMbWx1Ym1WeVNHVnBaMmgwSUMwZ2FHVmhaR1Z5U0dWcFoyaDBJQzBnYzJ4cFpHVnlRblJ1Y3lBdElIUnZjRkJoWkdScGJtY3BJQzhnYzJ4cFpHVklaV2xuYUhRcE8xeHlYRzU5WEhKY2JseHlYRzVtZFc1amRHbHZiaUJwYm1sMFZHOXZiSE5DZEc1ektDa2dlMXh5WEc0Z0lHeGxkQ0J6Ykdsa1pYSTdYSEpjYmlBZ1kyOXVjM1FnWm5Wc2JITmpjbVZsYmlBOUlDUW9KeTVtZFd4c2MyTnlaV1Z1SnlsY2NseHVJQ0FrS0NjdWJXOWtaV3d0TTJSZlgyWjFiR3h6WTNKbFpXNHRZblJ1SnlrdVkyeHBZMnNvS0NrZ1BUNGdlMXh5WEc0Z0lDQWdablZzYkhOamNtVmxiaTVqYzNNb0oyUnBjM0JzWVhrbkxDQW5abXhsZUNjcFhISmNiaUFnSUNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUhzZ1hISmNiaUFnSUNBZ0lHWjFiR3h6WTNKbFpXNHVZM056S0NkdmNHRmphWFI1Snl3Z01TazdYSEpjYmlBZ0lDQjlMQ0F3S1R0Y2NseHVJQ0FnSUNRb0p5NW5ZV3hzWlhKNUxXTnZiblJoYVc1bGNpY3BMbU56Y3lnblpHbHpjR3hoZVNjc0lDZHViMjVsSnlrN1hISmNibHh5WEc0Z0lDQWdjMnhwWkdWeUlEMGdKQ2duTG1aMWJHeHpZM0psWlc1ZlgzTnNhV1JsY2ljcExuTnNhV05yS0h0Y2NseHVJQ0FnSUNBZ2FXNW1hVzVwZEdVNklHWmhiSE5sTEZ4eVhHNGdJQ0FnSUNCemJHbGtaWE5VYjFOb2IzYzZJREVzWEhKY2JpQWdJQ0FnSUhOc2FXUmxjMVJ2VTJOeWIyeHNPaUF4TEZ4eVhHNGdJQ0FnSUNCalpXNTBaWEpOYjJSbE9pQjBjblZsTEZ4eVhHNGdJQ0FnSUNCd2NtVjJRWEp5YjNjNklHQThZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjejFjSW5Oc2FXTnJMWEJ5WlhaY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzWm5JSFpwWlhkQ2IzZzlYQ0l3SURBZ01qUWdNalJjSWlCaGNtbGhMV3hoWW1Wc1BWd2lVMnhwWkdWeUlIQnlaWFlnWW5WMGRHOXVJR2xqYjI1Y0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHdiMng1WjI5dUlHWnBiR3c5WENJak56VTNOVGMxWENJZ2NHOXBiblJ6UFZ3aU1UQWdOaUE0TGpVNUlEY3VOREVnTVRNdU1UY2dNVElnT0M0MU9TQXhOaTQxT1NBeE1DQXhPQ0F4TmlBeE1sd2lQand2Y0c5c2VXZHZiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM04yWno1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlpZFhSMGIyNCtZQ3hjY2x4dUlDQWdJQ0FnYm1WNGRFRnljbTkzT2lCZ1BHSjFkSFJ2YmlCMGVYQmxQVndpWW5WMGRHOXVYQ0lnWTJ4aGMzTTlYQ0p6YkdsamF5MXVaWGgwWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMlp5QjJhV1YzUW05NFBWd2lNQ0F3SURJMElESTBYQ0lnWVhKcFlTMXNZV0psYkQxY0lsTnNhV1JsY2lCdVpYaDBJR0oxZEhSdmJpQnBZMjl1WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNHOXNlV2R2YmlCbWFXeHNQVndpSXpjMU56VTNOVndpSUhCdmFXNTBjejFjSWpFd0lEWWdPQzQxT1NBM0xqUXhJREV6TGpFM0lERXlJRGd1TlRrZ01UWXVOVGtnTVRBZ01UZ2dNVFlnTVRKY0lqNDhMM0J2YkhsbmIyNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBtQmNjbHh1SUNBZ0lIMHBPMXh5WEc0Z0lIMHBPMXh5WEc0Z0lDUW9KeTVtZFd4c2MyTnlaV1Z1WDE5amJHOXpaUzFpZEc0bktTNWpiR2xqYXlnb0tTQTlQaUI3WEhKY2JpQWdJQ0JtZFd4c2MyTnlaV1Z1TG1OemN5Z25iM0JoWTJsMGVTY3NJREFwWEhKY2JpQWdJQ0FrS0NjdVoyRnNiR1Z5ZVMxamIyNTBZV2x1WlhJbktTNWpjM01vSjJScGMzQnNZWGtuTENBblpteGxlQ2NwTzF4eVhHNGdJQ0FnWEhKY2JpQWdJQ0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjY2x4dUlDQWdJQ0FnWm5Wc2JITmpjbVZsYmk1amMzTW9KMlJwYzNCc1lYa25MQ0FuYm05dVpTY3BPMXh5WEc0Z0lDQWdJQ0J6Ykdsa1pYSXVjMnhwWTJzb0ozVnVjMnhwWTJzbktUdGNjbHh1SUNBZ0lIMHNJRE13TUNrN1hISmNiaUFnZlNrN1hISmNibjFjY2x4dVpuVnVZM1JwYjI0Z2FXNXBkRTFsYm5WQ2RHNG9LU0I3WEhKY2JpQWdZMjl1YzNRZ2JXVnVkU0E5SUNRb0p5NXRiMkpwYkdVdGJXVnVkU2NwTzF4eVhHNGdJR3hsZENCM1lYTkdkV3hzYzJOeVpXVnVJRDBnWm1Gc2MyVTdYSEpjYmlBZ0pDZ25MbWhsWVdSbGNsOWZiV1Z1ZFMxaWRHNG5LUzVqYkdsamF5Z29LU0E5UGlCN1hISmNiaUFnSUNCdFpXNTFMbU56Y3lnblpHbHpjR3hoZVNjc0lDZG1iR1Y0SnlsY2NseHVJQ0FnSUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZXlCY2NseHVJQ0FnSUNBZ2JXVnVkUzVqYzNNb0oyOXdZV05wZEhrbkxDQXhLVHRjY2x4dUlDQWdJSDBzSURBcE8xeHlYRzRnSUNBZ0pDZ25MbWRoYkd4bGNua3RZMjl1ZEdGcGJtVnlKeWt1WTNOektDZGthWE53YkdGNUp5d2dKMjV2Ym1VbktUdGNjbHh1SUNBZ0lDUW9KeTVvWldGa1pYSW5LUzVqYzNNb0oyUnBjM0JzWVhrbkxDQW5ibTl1WlNjcE8xeHlYRzVjY2x4dUlDQWdJR2xtSUNna0tDY3VablZzYkhOamNtVmxiaWNwTG1OemN5Z25aR2x6Y0d4aGVTY3BJRDA5UFNBblpteGxlQ2NwSUh0Y2NseHVJQ0FnSUNBZ2QyRnpSblZzYkhOamNtVmxiaUE5SUhSeWRXVTdYSEpjYmlBZ0lDQWdJQ1FvSnk1bWRXeHNjMk55WldWdUp5a3VZM056S0Nka2FYTndiR0Y1Snl3Z0oyNXZibVVuS1R0Y2NseHVJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUhkaGMwWjFiR3h6WTNKbFpXNGdQU0JtWVd4elpUdGNjbHh1SUNBZ0lIMWNjbHh1SUNCOUtUdGNjbHh1WEhKY2JpQWdKQ2duTG0xdlltbHNaUzF0Wlc1MVgxOWpiRzl6WlMxaWRHNG5LUzVqYkdsamF5Z29LU0E5UGlCN1hISmNiaUFnSUNCdFpXNTFMbU56Y3lnbmIzQmhZMmwwZVNjc0lEQXBPMXh5WEc0Z0lDQWdKQ2duTG1obFlXUmxjaWNwTG1OemN5Z25aR2x6Y0d4aGVTY3NJQ2RpYkc5amF5Y3BPMXh5WEc0Z0lDQWdKQ2duTG1kaGJHeGxjbmt0WTI5dWRHRnBibVZ5SnlrdVkzTnpLQ2RrYVhOd2JHRjVKeXdnSjJac1pYZ25LVHRjY2x4dVhISmNiaUFnSUNCcFppQW9kMkZ6Um5Wc2JITmpjbVZsYmlrZ2UxeHlYRzRnSUNBZ0lDQWtLQ2N1Wm5Wc2JITmpjbVZsYmljcExtTnpjeWduWkdsemNHeGhlU2NzSUNkbWJHVjRKeWs3WEhKY2JpQWdJQ0I5WEhKY2JpQWdJQ0JjY2x4dUlDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0J0Wlc1MUxtTnpjeWduWkdsemNHeGhlU2NzSUNkdWIyNWxKeWs3WEhKY2JpQWdJQ0I5TENBek1EQXBPMXh5WEc0Z0lIMHBPMXh5WEc1OVhISmNibHh5WEc1bWRXNWpkR2x2YmlCcGJtbDBVMk55YjJ4c1FuUnVjeWdwSUh0Y2NseHVJQ0FrS0NjdWJXOWtaV3h6WDE5amIyNTBZV2x1WlhJbktTNXpZM0p2Ykd3b1pHVmliM1Z1WTJVb0tHVjJaVzUwS1NBOVBpQjdYSEpjYmlBZ0lDQmxkbVZ1ZEM1emRHOXdVSEp2Y0dGbllYUnBiMjVjY2x4dUlDQWdJR052Ym5OMElHTnZiblJoYVc1bGNpQTlJQ1FvWlhabGJuUXVkR0Z5WjJWMEtUdGNjbHh1SUNBZ0lHTnZibk4wSUdsMFpXMUlaV2xuYUhRZ1BTQjNhVzVrYjNjdWFXNXVaWEpYYVdSMGFDQThJREUyTURBZ1B5QXhNREFnT2lBeE5qQTdYSEpjYmlBZ0lDQmpiMjV6ZENCMGIzQWdQU0FnWTI5dWRHRnBibVZ5TG5OamNtOXNiRlJ2Y0NncE8xeHlYRzRnSUNBZ1kyOXVjM1FnWlhoMGNtRWdQU0IwYjNBZ0pTQnBkR1Z0U0dWcFoyaDBPMXh5WEc0Z0lDQWdhV1lnS0dWNGRISmhLU0I3WEhKY2JpQWdJQ0FnSUdOdmJuUmhhVzVsY2k1aGJtbHRZWFJsS0h0Y2NseHVJQ0FnSUNBZ0lDQnpZM0p2Ykd4VWIzQTZJR1Y0ZEhKaElEd2dhWFJsYlVobGFXZG9kQ0F2SURJZ1B5QjBiM0FnTFNCbGVIUnlZU0E2SUhSdmNDQXJJR2wwWlcxSVpXbG5hSFFnTFNCbGVIUnlZVnh5WEc0Z0lDQWdJQ0I5TENBek1EQXBPMXh5WEc0Z0lDQWdmVnh5WEc0Z0lIMHNJREV3TUNrcE8xeHlYRzVjY2x4dUlDQWtLQ2N1Ylc5a1pXeHpYMTl6WTNKdmJHd3RaRzkzYmljcExtTnNhV05yS0NncElEMCtJSHRjY2x4dUlDQWdJR052Ym5OMElHTnZiblJoYVc1bGNpQTlJQ1FvSnk1dGIyUmxiSE5mWDJOdmJuUmhhVzVsY2ljcE8xeHlYRzRnSUNBZ1kyOXVjM1FnYVhSbGJVaGxhV2RvZENBOUlIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lEd2dNVFl3TUNBL0lERXdNQ0E2SURFMk1EdGNjbHh1SUNBZ0lHTnZibk4wSUhSdmNDQTlJR052Ym5SaGFXNWxjaTV6WTNKdmJHeFViM0FvS1R0Y2NseHVJQ0FnSUdOdmJuUmhhVzVsY2k1aGJtbHRZWFJsS0h0Y2NseHVJQ0FnSUNBZ2MyTnliMnhzVkc5d09pQjBiM0FnTFNBb2RHOXdJQ1VnYVhSbGJVaGxhV2RvZENrZ0t5QnBkR1Z0U0dWcFoyaDBYSEpjYmlBZ0lDQjlMQ0F6TURBcE8xeHlYRzRnSUgwcE8xeHlYRzRnSUNRb0p5NXRiMlJsYkhOZlgzTmpjbTlzYkMxMWNDY3BMbU5zYVdOcktDZ3BJRDArSUh0Y2NseHVJQ0FnSUdOdmJuTjBJR2wwWlcxSVpXbG5hSFFnUFNCM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBOElERTJNREFnUHlBeE1EQWdPaUF4TmpBN1hISmNiaUFnSUNCamIyNXpkQ0JqYjI1MFlXbHVaWElnUFNBa0tDY3ViVzlrWld4elgxOWpiMjUwWVdsdVpYSW5LVHRjY2x4dUlDQWdJR052Ym5OMElIUnZjQ0E5SUdOdmJuUmhhVzVsY2k1elkzSnZiR3hVYjNBb0tUdGNjbHh1SUNBZ0lHTnZiblJoYVc1bGNpNWhibWx0WVhSbEtIdGNjbHh1SUNBZ0lDQWdjMk55YjJ4c1ZHOXdPaUIwYjNBZ0xTQW9kRzl3SUNVZ2FYUmxiVWhsYVdkb2RDQjhmQ0JwZEdWdFNHVnBaMmgwS1Z4eVhHNGdJQ0FnZlN3Z016QXdLVHRjY2x4dUlDQjlLVHRjY2x4dWZWeHlYRzVjY2x4dVpuVnVZM1JwYjI0Z2MyVjBUVzlrWld4elNHVnBaMmgwS0NrZ2UxeHlYRzRnSUdOdmJuTjBJR2wwWlcxSVpXbG5hSFFnUFNCM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBOElERTJNREFnUHlBeE1EQWdPaUF4TmpBN1hISmNiaUFnWTI5dWMzUWdiVzlrWld4elNHVnBaMmgwSUQwZ2QybHVaRzkzTG1sdWJtVnlTR1ZwWjJoMElDMGdNVGcyTzF4eVhHNGdJQ1FvSnk1dGIyUmxiSE5mWDJOdmJuUmhhVzVsY2ljcExtaGxhV2RvZENodGIyUmxiSE5JWldsbmFIUWdMU0FvYlc5a1pXeHpTR1ZwWjJoMElDVWdhWFJsYlVobGFXZG9kQ2twTzF4eVhHNTlYSEpjYmx4eVhHNW1kVzVqZEdsdmJpQnpaV3hsWTNSTmIyUmxiQ2dwSUh0Y2NseHVJQ0FrS0NjdWJXOWtaV3h6WDE5dGIyUmxiQ2NwTG1Oc2FXTnJLQ2hsZG1WdWRDa2dQVDRnZTF4eVhHNGdJQ0FnWTI5dWMyOXNaUzVzYjJjb01URXhLVHRjY2x4dUlDQWdJQ1FvSnk1dGIyUmxiSE5mWDIxdlpHVnNKeWt1Y21WdGIzWmxRMnhoYzNNb0oybHpVMlZzWldOMFpXUW5LVHRjY2x4dUlDQWdJQ1FvWlhabGJuUXVZM1Z5Y21WdWRGUmhjbWRsZENBcExtRmtaRU5zWVhOektDZHBjMU5sYkdWamRHVmtKeWs3WEhKY2JpQWdmU2s3WEhKY2JuMGlYWDA9In0=
