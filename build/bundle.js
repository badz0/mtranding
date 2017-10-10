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
'use strict';

var _index = require('../node_modules/lodash.debounce/index');

var _index2 = _interopRequireDefault(_index);

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
  initModelsSlider();
  initMenuBtn();
  initToolsBtns();
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
    if (!event.target.matches('.breadcrumbs__dd-btn')) {
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

    setTimeout(function () {
      fullscreen.css('display', 'none');
      slider.slick('unslick');
    }, 300);
  });
}
function initMenuBtn() {
  var menu = $('.mobile-menu');
  $('.header__menu-btn').click(function () {
    menu.css('display', 'flex');
    setTimeout(function () {
      menu.css('opacity', 1);
    }, 0);
  });

  $('.mobile-menu__close-btn').click(function () {
    menu.css('opacity', 0);

    setTimeout(function () {
      menu.css('display', 'none');
    }, 300);
  });
}

},{"../node_modules/lodash.debounce/index":1}]},{},[2])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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R0FBdUI7QUFDckIsTUFBTSxPQUFPLEVBQUUsY0FBRixDQUFiO0FBQ0EsSUFBRSxtQkFBRixFQUF1QixLQUF2QixDQUE2QixZQUFNO0FBQ2pDLFNBQUssR0FBTCxDQUFTLFNBQVQsRUFBb0IsTUFBcEI7QUFDQSxlQUFXLFlBQU07QUFDZixXQUFLLEdBQUwsQ0FBUyxTQUFULEVBQW9CLENBQXBCO0FBQ0QsS0FGRCxFQUVHLENBRkg7QUFHRCxHQUxEOztBQU9BLElBQUUseUJBQUYsRUFBNkIsS0FBN0IsQ0FBbUMsWUFBTTtBQUN2QyxTQUFLLEdBQUwsQ0FBUyxTQUFULEVBQW9CLENBQXBCOztBQUVBLGVBQVcsWUFBTTtBQUNmLFdBQUssR0FBTCxDQUFTLFNBQVQsRUFBb0IsTUFBcEI7QUFDRCxLQUZELEVBRUcsR0FGSDtBQUdELEdBTkQ7QUFPRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsImltcG9ydCBkZWJvdW5jZSBmcm9tICcuLi9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4JztcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcclxuICBBT1MuaW5pdCh7XHJcbiAgICBkaXNhYmxlOiAnbW9iaWxlJyxcclxuICAgIGVhc2luZzogJ2Vhc2UtaW4tb3V0JyxcclxuICAgIGRlbGF5OiAxMDAsXHJcbiAgICBkdXJhdGlvbjogMTAwMCxcclxuICAgIG9mZnNldDogMTAwLFxyXG4gICAgb25jZTogdHJ1ZVxyXG4gIH0pO1xyXG4gIHNjcm9sbEJ0bkluaXQoKTtcclxuICBkcm9wRG93bkluaXQoKTtcclxuICB0b2dnbGVDb2xsYXBzZSgpO1xyXG4gIGluaXRQcm9qZWN0U2xpZGVyKCk7XHJcbiAgaW5pdE1vZGVsc1NsaWRlcigpO1xyXG4gIGluaXRNZW51QnRuKCk7XHJcbiAgaW5pdFRvb2xzQnRucygpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNjcm9sbEJ0bkluaXQoKSB7XHJcbiAgJCgnLmZvb3Rlcl9fdXAtYnRuJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG4gICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICBzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuICAgICAgfSwgMTAwMCwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgJHRhcmdldCA9ICQodGFyZ2V0KTtcclxuICAgICAgICAkdGFyZ2V0LmZvY3VzKCk7XHJcbiAgICAgICAgaWYgKCR0YXJnZXQuaXMoXCI6Zm9jdXNcIikpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHRhcmdldC5hdHRyKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgICAgICAgJHRhcmdldC5mb2N1cygpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcm9wRG93bkluaXQoKSB7XHJcbiAgJCgnLmJyZWFkY3J1bWJzX19kZC1idG4nKS5jbGljaygoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGhhc0NsYXNzID0gJChldmVudC50YXJnZXQucGFyZW50RWxlbWVudCkuaGFzQ2xhc3MoJ2JyZWFkY3J1bWJzX19kZC1idG4tc2hvdycpO1xyXG4gICAgY29uc3QgZWxlbWVudHNDb3VudCA9ICQoJy5icmVhZGNydW1ic19fZGQtYnRuLXNob3cnKS5sZW5ndGg7XHJcbiAgICBpZiAoaGFzQ2xhc3MgJiYgZWxlbWVudHNDb3VudCkge1xyXG4gICAgICAkKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50KS5yZW1vdmVDbGFzcygnYnJlYWRjcnVtYnNfX2RkLWJ0bi1zaG93Jyk7XHJcbiAgICB9IGVsc2UgaWYgKCFoYXNDbGFzcyAmJiBlbGVtZW50c0NvdW50KSB7XHJcbiAgICAgICQoJy5icmVhZGNydW1ic19fZGQtYnRuLXNob3cnKS5yZW1vdmVDbGFzcygnYnJlYWRjcnVtYnNfX2RkLWJ0bi1zaG93Jyk7XHJcbiAgICAgICQoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQpLmFkZENsYXNzKCdicmVhZGNydW1ic19fZGQtYnRuLXNob3cnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQpLmFkZENsYXNzKCdicmVhZGNydW1ic19fZGQtYnRuLXNob3cnKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLmNsaWNrKChldmVudCkgPT4ge1xyXG4gICAgaWYgKCFldmVudC50YXJnZXQubWF0Y2hlcygnLmJyZWFkY3J1bWJzX19kZC1idG4nKSkge1xyXG4gICAgICAkKCcuYnJlYWRjcnVtYnNfX2RkLWJ0bi1zaG93JykucmVtb3ZlQ2xhc3MoJ2JyZWFkY3J1bWJzX19kZC1idG4tc2hvdycpO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvZ2dsZUNvbGxhcHNlKCkge1xyXG4gIGxldCB0aW1lb3V0O1xyXG4gICQoJy5kZXNjX190aXRsZS1jb2xsYXBzZS1idG4nKS5jbGljaygoZXZlbnQpID0+IHtcclxuICAgICQoJy5kZXNjX19tb2JpbGUtdGl0bGUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBjb25zdCBwYW5lbCA9ICQoJy5kZXNjX19jb2xsYXBzZS1jb250YWluZXInKVswXTtcclxuICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIH0sIDYwMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIHBhbmVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyBcInB4XCI7XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdFByb2plY3RTbGlkZXIoKSB7XHJcbiAgY29uc3QgcHJvamVjdHMgPSAkKCcucHJvamVjdHNfX3NsaWRlcicpO1xyXG4gIHByb2plY3RzLmxlbmd0aCAmJiBwcm9qZWN0cy5zbGljayh7XHJcbiAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgIHByZXZBcnJvdzogYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjRweFwiIGhlaWdodD1cIjI0cHhcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgYXJpYS1sYWJlbD1cIlNsaWRlciBwcmV2IGJ1dHRvbiBpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD1cIiM3NTc1NzVcIiBwb2ludHM9XCIxMCA2IDguNTkgNy40MSAxMy4xNyAxMiA4LjU5IDE2LjU5IDEwIDE4IDE2IDEyXCI+PC9wb2x5Z29uPlxyXG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPmAsXHJcbiAgICBuZXh0QXJyb3c6IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj5cclxuICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtbGFiZWw9XCJTbGlkZXIgbmV4dCBidXR0b24gaWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGZpbGw9XCIjNzU3NTc1XCIgcG9pbnRzPVwiMTAgNiA4LjU5IDcuNDEgMTMuMTcgMTIgOC41OSAxNi41OSAxMCAxOCAxNiAxMlwiPjwvcG9seWdvbj5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5gLFxyXG4gICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgYnJlYWtwb2ludDogOTkyLFxyXG4gICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgc2xpZGVzVG9TaG93OiA1LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdE1vZGVsc1NsaWRlcigpIHtcclxuICBjb25zdCBtb2RlbHMgPSAkKCcubW9kZWxzJyk7XHJcbiAgaWYgKCFtb2RlbHMubGVuZ3RoKSByZXR1cm47XHJcbiAgY29uc3Qgc2xpZGVyID0gbW9kZWxzLnNsaWNrKHtcclxuICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgIHNsaWRlc1RvU2hvdzogY2FsY01vZGVsc1NsaWRlcygpLFxyXG4gICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgIHByZXZBcnJvdzogYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBhcmlhLWxhYmVsPVwiU2xpZGVyIHByZXYgYnV0dG9uIGljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBmaWxsPVwiIzc1NzU3NVwiIHBvaW50cz1cIjEwIDYgOC41OSA3LjQxIDEzLjE3IDEyIDguNTkgMTYuNTkgMTAgMTggMTYgMTJcIj48L3BvbHlnb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+YCxcclxuICAgIG5leHRBcnJvdzogYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBhcmlhLWxhYmVsPVwiU2xpZGVyIG5leHQgYnV0dG9uIGljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBmaWxsPVwiIzc1NzU3NVwiIHBvaW50cz1cIjEwIDYgOC41OSA3LjQxIDEzLjE3IDEyIDguNTkgMTYuNTkgMTAgMTggMTYgMTJcIj48L3BvbHlnb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+YCxcclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLnJlc2l6ZShkZWJvdW5jZSgoKSA9PiB7XHJcbiAgICBzbGlkZXIuc2xpY2soJ3NsaWNrU2V0T3B0aW9uJywgJ3NsaWRlc1RvU2hvdycsIGNhbGNNb2RlbHNTbGlkZXMoKSwgdHJ1ZSk7XHJcbiAgfSwgMTUwKSk7XHJcbn1cclxuZnVuY3Rpb24gY2FsY01vZGVsc1NsaWRlcygpIHtcclxuICBjb25zdCBoZWFkZXJIZWlnaHQgPSA4MDtcclxuICBjb25zdCBzbGlkZXJCdG5zID0gNjg7XHJcbiAgY29uc3QgdG9wUGFkZGluZyA9IDEwO1xyXG4gIGNvbnN0IHNsaWRlSGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggPCAxNjAwID8gMTAwIDogMTUwO1xyXG5cclxuICBjb25zdCBzbGlkZXJIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBzbGlkZXJCdG5zICsgdG9wUGFkZGluZztcclxuICByZXR1cm4gTWF0aC5mbG9vcigod2luZG93LmlubmVySGVpZ2h0IC0gaGVhZGVySGVpZ2h0IC0gc2xpZGVyQnRucyAtIHRvcFBhZGRpbmcpIC8gc2xpZGVIZWlnaHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0VG9vbHNCdG5zKCkge1xyXG4gIGxldCBzbGlkZXI7XHJcbiAgY29uc3QgZnVsbHNjcmVlbiA9ICQoJy5mdWxsc2NyZWVuJylcclxuICAkKCcubW9kZWwtM2RfX2Z1bGxzY3JlZW4tYnRuJykuY2xpY2soKCkgPT4ge1xyXG4gICAgZnVsbHNjcmVlbi5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgXHJcbiAgICAgIGZ1bGxzY3JlZW4uY3NzKCdvcGFjaXR5JywgMSk7XHJcbiAgICB9LCAwKTtcclxuICAgIHNsaWRlciA9ICQoJy5mdWxsc2NyZWVuX19zbGlkZXInKS5zbGljayh7XHJcbiAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgcHJldkFycm93OiBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1wcmV2XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgYXJpYS1sYWJlbD1cIlNsaWRlciBwcmV2IGJ1dHRvbiBpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBmaWxsPVwiIzc1NzU3NVwiIHBvaW50cz1cIjEwIDYgOC41OSA3LjQxIDEzLjE3IDEyIDguNTkgMTYuNTkgMTAgMTggMTYgMTJcIj48L3BvbHlnb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPmAsXHJcbiAgICAgIG5leHRBcnJvdzogYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtbGFiZWw9XCJTbGlkZXIgbmV4dCBidXR0b24gaWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD1cIiM3NTc1NzVcIiBwb2ludHM9XCIxMCA2IDguNTkgNy40MSAxMy4xNyAxMiA4LjU5IDE2LjU5IDEwIDE4IDE2IDEyXCI+PC9wb2x5Z29uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5gXHJcbiAgICB9KTtcclxuICB9KTtcclxuICAkKCcuZnVsbHNjcmVlbl9fY2xvc2UtYnRuJykuY2xpY2soKCkgPT4ge1xyXG4gICAgZnVsbHNjcmVlbi5jc3MoJ29wYWNpdHknLCAwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBmdWxsc2NyZWVuLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAgIHNsaWRlci5zbGljaygndW5zbGljaycpO1xyXG4gICAgfSwgMzAwKTtcclxuICB9KTtcclxufVxyXG5mdW5jdGlvbiBpbml0TWVudUJ0bigpIHtcclxuICBjb25zdCBtZW51ID0gJCgnLm1vYmlsZS1tZW51JylcclxuICAkKCcuaGVhZGVyX19tZW51LWJ0bicpLmNsaWNrKCgpID0+IHtcclxuICAgIG1lbnUuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IFxyXG4gICAgICBtZW51LmNzcygnb3BhY2l0eScsIDEpO1xyXG4gICAgfSwgMCk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5tb2JpbGUtbWVudV9fY2xvc2UtYnRuJykuY2xpY2soKCkgPT4ge1xyXG4gICAgbWVudS5jc3MoJ29wYWNpdHknLCAwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBtZW51LmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICB9LCAzMDApO1xyXG4gIH0pO1xyXG59Il0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p1YjJSbFgyMXZaSFZzWlhNdmJHOWtZWE5vTG1SbFltOTFibU5sTDJsdVpHVjRMbXB6SWl3aWMzSmpYRnhwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVTkJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096czdPenRCUTNwWVFUczdPenM3TzBGQlJVRXNSVUZCUlN4UlFVRkdMRVZCUVZrc1MwRkJXaXhEUVVGclFpeFpRVUZOTzBGQlEzUkNMRTFCUVVrc1NVRkJTaXhEUVVGVE8wRkJRMUFzWVVGQlV5eFJRVVJHTzBGQlJWQXNXVUZCVVN4aFFVWkVPMEZCUjFBc1YwRkJUeXhIUVVoQk8wRkJTVkFzWTBGQlZTeEpRVXBJTzBGQlMxQXNXVUZCVVN4SFFVeEVPMEZCVFZBc1ZVRkJUVHRCUVU1RExFZEJRVlE3UVVGUlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVORUxFTkJhRUpFT3p0QlFXdENRU3hUUVVGVExHRkJRVlFzUjBGQmVVSTdRVUZEZGtJc1NVRkJSU3hwUWtGQlJpeEZRVUZ4UWl4TFFVRnlRaXhEUVVFeVFpeFZRVUZWTEV0QlFWWXNSVUZCYVVJN1FVRkRNVU1zVVVGQlNTeFRRVUZUTEVWQlFVVXNTMEZCU3l4SlFVRlFMRU5CUVdJN1FVRkRRU3hSUVVGSkxFOUJRVThzVFVGQldDeEZRVUZ0UWp0QlFVTnFRaXhaUVVGTkxHTkJRVTQ3TzBGQlJVRXNVVUZCUlN4WlFVRkdMRVZCUVdkQ0xFOUJRV2hDTEVOQlFYZENPMEZCUTNSQ0xHMUNRVUZYTEU5QlFVOHNUVUZCVUN4SFFVRm5RanRCUVVSTUxFOUJRWGhDTEVWQlJVY3NTVUZHU0N4RlFVVlRMRmxCUVZrN08wRkJSVzVDTEZsQlFVa3NWVUZCVlN4RlFVRkZMRTFCUVVZc1EwRkJaRHRCUVVOQkxHZENRVUZSTEV0QlFWSTdRVUZEUVN4WlFVRkpMRkZCUVZFc1JVRkJVaXhEUVVGWExGRkJRVmdzUTBGQlNpeEZRVUV3UWp0QlFVTjRRaXhwUWtGQlR5eExRVUZRTzBGQlEwUXNVMEZHUkN4TlFVVlBPMEZCUTB3c2EwSkJRVkVzU1VGQlVpeERRVUZoTEZWQlFXSXNSVUZCZVVJc1NVRkJla0k3UVVGRFFTeHJRa0ZCVVN4TFFVRlNPMEZCUTBRN1FVRkRSaXhQUVZwRU8wRkJZVVE3UVVGRFJpeEhRVzVDUkR0QlFXOUNSRHM3UVVGRlJDeFRRVUZUTEZsQlFWUXNSMEZCZDBJN1FVRkRkRUlzU1VGQlJTeHpRa0ZCUml4RlFVRXdRaXhMUVVFeFFpeERRVUZuUXl4VlFVRkRMRXRCUVVRc1JVRkJWenRCUVVONlF5eFJRVUZOTEZkQlFWY3NSVUZCUlN4TlFVRk5MRTFCUVU0c1EwRkJZU3hoUVVGbUxFVkJRVGhDTEZGQlFUbENMRU5CUVhWRExEQkNRVUYyUXl4RFFVRnFRanRCUVVOQkxGRkJRVTBzWjBKQlFXZENMRVZCUVVVc01rSkJRVVlzUlVGQkswSXNUVUZCY2tRN1FVRkRRU3hSUVVGSkxGbEJRVmtzWVVGQmFFSXNSVUZCSzBJN1FVRkROMElzVVVGQlJTeE5RVUZOTEUxQlFVNHNRMEZCWVN4aFFVRm1MRVZCUVRoQ0xGZEJRVGxDTEVOQlFUQkRMREJDUVVFeFF6dEJRVU5FTEV0QlJrUXNUVUZGVHl4SlFVRkpMRU5CUVVNc1VVRkJSQ3hKUVVGaExHRkJRV3BDTEVWQlFXZERPMEZCUTNKRExGRkJRVVVzTWtKQlFVWXNSVUZCSzBJc1YwRkJMMElzUTBGQk1rTXNNRUpCUVRORE8wRkJRMEVzVVVGQlJTeE5RVUZOTEUxQlFVNHNRMEZCWVN4aFFVRm1MRVZCUVRoQ0xGRkJRVGxDTEVOQlFYVkRMREJDUVVGMlF6dEJRVU5FTEV0QlNFMHNUVUZIUVR0QlFVTk1MRkZCUVVVc1RVRkJUU3hOUVVGT0xFTkJRV0VzWVVGQlppeEZRVUU0UWl4UlFVRTVRaXhEUVVGMVF5d3dRa0ZCZGtNN1FVRkRSRHRCUVVOR0xFZEJXRVE3TzBGQllVRXNTVUZCUlN4TlFVRkdMRVZCUVZVc1MwRkJWaXhEUVVGblFpeFZRVUZETEV0QlFVUXNSVUZCVnp0QlFVTjZRaXhSUVVGSkxFTkJRVU1zVFVGQlRTeE5RVUZPTEVOQlFXRXNUMEZCWWl4RFFVRnhRaXh6UWtGQmNrSXNRMEZCVEN4RlFVRnRSRHRCUVVOcVJDeFJRVUZGTERKQ1FVRkdMRVZCUVN0Q0xGZEJRUzlDTEVOQlFUSkRMREJDUVVFelF6dEJRVU5FTzBGQlEwWXNSMEZLUkR0QlFVdEVPenRCUVVWRUxGTkJRVk1zWTBGQlZDeEhRVUV3UWp0QlFVTjRRaXhOUVVGSkxHZENRVUZLTzBGQlEwRXNTVUZCUlN3eVFrRkJSaXhGUVVFclFpeExRVUV2UWl4RFFVRnhReXhWUVVGRExFdEJRVVFzUlVGQlZ6dEJRVU01UXl4TlFVRkZMSEZDUVVGR0xFVkJRWGxDTEZkQlFYcENMRU5CUVhGRExGRkJRWEpETzBGQlEwRXNVVUZCVFN4UlFVRlJMRVZCUVVVc01rSkJRVVlzUlVGQkswSXNRMEZCTDBJc1EwRkJaRHRCUVVOQkxGRkJRVWtzVFVGQlRTeExRVUZPTEVOQlFWa3NVMEZCYUVJc1JVRkJNa0k3UVVGRGVrSXNXVUZCVFN4TFFVRk9MRU5CUVZrc1UwRkJXaXhIUVVGM1FpeEpRVUY0UWp0QlFVTkJMR2RDUVVGVkxGZEJRVmNzV1VGQlRUdEJRVU42UWl4alFVRk5MRXRCUVU0c1EwRkJXU3hQUVVGYUxFZEJRWE5DTEUxQlFYUkNPMEZCUTBRc1QwRkdVeXhGUVVWUUxFZEJSazhzUTBGQlZqdEJRVWRFTEV0QlRFUXNUVUZMVHp0QlFVTk1MRzFDUVVGaExFOUJRV0k3UVVGRFFTeFpRVUZOTEV0QlFVNHNRMEZCV1N4UFFVRmFMRWRCUVhOQ0xFOUJRWFJDTzBGQlEwRXNXVUZCVFN4TFFVRk9MRU5CUVZrc1UwRkJXaXhIUVVGM1FpeE5RVUZOTEZsQlFVNHNSMEZCY1VJc1NVRkJOME03UVVGRFJEdEJRVU5HTEVkQllrUTdRVUZqUkRzN1FVRkZSQ3hUUVVGVExHbENRVUZVTEVkQlFUWkNPMEZCUXpOQ0xFMUJRVTBzVjBGQlZ5eEZRVUZGTEcxQ1FVRkdMRU5CUVdwQ08wRkJRMEVzVjBGQlV5eE5RVUZVTEVsQlFXMUNMRk5CUVZNc1MwRkJWQ3hEUVVGbE8wRkJRMmhETEdOQlFWVXNTMEZFYzBJN1FVRkZhRU1zYTBKQlFXTXNRMEZHYTBJN1FVRkhhRU1zYjBKQlFXZENMRU5CU0dkQ08wRkJTV2hETERSVlFVcG5RenRCUVZOb1F5dzBWVUZVWjBNN1FVRmphRU1zWjBKQlFWa3NRMEZEVmp0QlFVTkZMR3RDUVVGWkxFZEJSR1E3UVVGRlJTeG5Ra0ZCVlR0QlFVTlNMSE5DUVVGak8wRkJSRTQ3UVVGR1dpeExRVVJWTEVWQlQxWTdRVUZEUlN4clFrRkJXU3hIUVVSa08wRkJSVVVzWjBKQlFWVTdRVUZEVWl4elFrRkJZenRCUVVST08wRkJSbG9zUzBGUVZUdEJRV1J2UWl4SFFVRm1MRU5CUVc1Q08wRkJOa0pFT3p0QlFVVkVMRk5CUVZNc1owSkJRVlFzUjBGQk5FSTdRVUZETVVJc1RVRkJUU3hUUVVGVExFVkJRVVVzVTBGQlJpeERRVUZtTzBGQlEwRXNUVUZCU1N4RFFVRkRMRTlCUVU4c1RVRkJXaXhGUVVGdlFqdEJRVU53UWl4TlFVRk5MRk5CUVZNc1QwRkJUeXhMUVVGUUxFTkJRV0U3UVVGRE1VSXNZMEZCVlN4TFFVUm5RanRCUVVVeFFpeHJRa0ZCWXl4clFrRkdXVHRCUVVjeFFpeHZRa0ZCWjBJc1EwRklWVHRCUVVreFFpeGpRVUZWTEVsQlNtZENPMEZCU3pGQ0xHbFVRVXd3UWp0QlFWVXhRanRCUVZZd1FpeEhRVUZpTEVOQlFXWTdPMEZCYVVKQkxFbEJRVVVzVFVGQlJpeEZRVUZWTEUxQlFWWXNRMEZCYVVJc2NVSkJRVk1zV1VGQlRUdEJRVU01UWl4WFFVRlBMRXRCUVZBc1EwRkJZU3huUWtGQllpeEZRVUVyUWl4alFVRXZRaXhGUVVFclF5eHJRa0ZCTDBNc1JVRkJiVVVzU1VGQmJrVTdRVUZEUkN4SFFVWm5RaXhGUVVWa0xFZEJSbU1zUTBGQmFrSTdRVUZIUkR0QlFVTkVMRk5CUVZNc1owSkJRVlFzUjBGQk5FSTdRVUZETVVJc1RVRkJUU3hsUVVGbExFVkJRWEpDTzBGQlEwRXNUVUZCVFN4aFFVRmhMRVZCUVc1Q08wRkJRMEVzVFVGQlRTeGhRVUZoTEVWQlFXNUNPMEZCUTBFc1RVRkJUU3hqUVVGakxFOUJRVThzVlVGQlVDeEhRVUZ2UWl4SlFVRndRaXhIUVVFeVFpeEhRVUV6UWl4SFFVRnBReXhIUVVGeVJEczdRVUZGUVN4TlFVRk5MR1ZCUVdVc1pVRkJaU3hWUVVGbUxFZEJRVFJDTEZWQlFXcEVPMEZCUTBFc1UwRkJUeXhMUVVGTExFdEJRVXdzUTBGQlZ5eERRVUZETEU5QlFVOHNWMEZCVUN4SFFVRnhRaXhaUVVGeVFpeEhRVUZ2UXl4VlFVRndReXhIUVVGcFJDeFZRVUZzUkN4SlFVRm5SU3hYUVVFelJTeERRVUZRTzBGQlEwUTdPMEZCUlVRc1UwRkJVeXhoUVVGVUxFZEJRWGxDTzBGQlEzWkNMRTFCUVVrc1pVRkJTanRCUVVOQkxFMUJRVTBzWVVGQllTeEZRVUZGTEdGQlFVWXNRMEZCYmtJN1FVRkRRU3hKUVVGRkxESkNRVUZHTEVWQlFTdENMRXRCUVM5Q0xFTkJRWEZETEZsQlFVMDdRVUZEZWtNc1pVRkJWeXhIUVVGWUxFTkJRV1VzVTBGQlppeEZRVUV3UWl4TlFVRXhRanRCUVVOQkxHVkJRVmNzV1VGQlRUdEJRVU5tTEdsQ1FVRlhMRWRCUVZnc1EwRkJaU3hUUVVGbUxFVkJRVEJDTEVOQlFURkNPMEZCUTBRc1MwRkdSQ3hGUVVWSExFTkJSa2c3UVVGSFFTeGhRVUZUTEVWQlFVVXNjVUpCUVVZc1JVRkJlVUlzUzBGQmVrSXNRMEZCSzBJN1FVRkRkRU1zWjBKQlFWVXNTMEZFTkVJN1FVRkZkRU1zYjBKQlFXTXNRMEZHZDBJN1FVRkhkRU1zYzBKQlFXZENMRU5CU0hOQ08wRkJTWFJETEd0Q1FVRlpMRWxCU2pCQ08wRkJTM1JETERKVVFVeHpRenRCUVZWMFF6dEJRVlp6UXl4TFFVRXZRaXhEUVVGVU8wRkJaMEpFTEVkQmNrSkVPMEZCYzBKQkxFbEJRVVVzZDBKQlFVWXNSVUZCTkVJc1MwRkJOVUlzUTBGQmEwTXNXVUZCVFR0QlFVTjBReXhsUVVGWExFZEJRVmdzUTBGQlpTeFRRVUZtTEVWQlFUQkNMRU5CUVRGQ096dEJRVVZCTEdWQlFWY3NXVUZCVFR0QlFVTm1MR2xDUVVGWExFZEJRVmdzUTBGQlpTeFRRVUZtTEVWQlFUQkNMRTFCUVRGQ08wRkJRMEVzWVVGQlR5eExRVUZRTEVOQlFXRXNVMEZCWWp0QlFVTkVMRXRCU0VRc1JVRkhSeXhIUVVoSU8wRkJTVVFzUjBGUVJEdEJRVkZFTzBGQlEwUXNVMEZCVXl4WFFVRlVMRWRCUVhWQ08wRkJRM0pDTEUxQlFVMHNUMEZCVHl4RlFVRkZMR05CUVVZc1EwRkJZanRCUVVOQkxFbEJRVVVzYlVKQlFVWXNSVUZCZFVJc1MwRkJka0lzUTBGQk5rSXNXVUZCVFR0QlFVTnFReXhUUVVGTExFZEJRVXdzUTBGQlV5eFRRVUZVTEVWQlFXOUNMRTFCUVhCQ08wRkJRMEVzWlVGQlZ5eFpRVUZOTzBGQlEyWXNWMEZCU3l4SFFVRk1MRU5CUVZNc1UwRkJWQ3hGUVVGdlFpeERRVUZ3UWp0QlFVTkVMRXRCUmtRc1JVRkZSeXhEUVVaSU8wRkJSMFFzUjBGTVJEczdRVUZQUVN4SlFVRkZMSGxDUVVGR0xFVkJRVFpDTEV0QlFUZENMRU5CUVcxRExGbEJRVTA3UVVGRGRrTXNVMEZCU3l4SFFVRk1MRU5CUVZNc1UwRkJWQ3hGUVVGdlFpeERRVUZ3UWpzN1FVRkZRU3hsUVVGWExGbEJRVTA3UVVGRFppeFhRVUZMTEVkQlFVd3NRMEZCVXl4VFFVRlVMRVZCUVc5Q0xFMUJRWEJDTzBGQlEwUXNTMEZHUkN4RlFVVkhMRWRCUmtnN1FVRkhSQ3hIUVU1RU8wRkJUMFFpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpaG1kVzVqZEdsdmJpQmxLSFFzYml4eUtYdG1kVzVqZEdsdmJpQnpLRzhzZFNsN2FXWW9JVzViYjEwcGUybG1LQ0YwVzI5ZEtYdDJZWElnWVQxMGVYQmxiMllnY21WeGRXbHlaVDA5WENKbWRXNWpkR2x2Ymx3aUppWnlaWEYxYVhKbE8ybG1LQ0YxSmlaaEtYSmxkSFZ5YmlCaEtHOHNJVEFwTzJsbUtHa3BjbVYwZFhKdUlHa29ieXdoTUNrN2RtRnlJR1k5Ym1WM0lFVnljbTl5S0Z3aVEyRnVibTkwSUdacGJtUWdiVzlrZFd4bElDZGNJaXR2SzF3aUoxd2lLVHQwYUhKdmR5Qm1MbU52WkdVOVhDSk5UMFJWVEVWZlRrOVVYMFpQVlU1RVhDSXNabjEyWVhJZ2JEMXVXMjlkUFh0bGVIQnZjblJ6T250OWZUdDBXMjlkV3pCZExtTmhiR3dvYkM1bGVIQnZjblJ6TEdaMWJtTjBhVzl1S0dVcGUzWmhjaUJ1UFhSYmIxMWJNVjFiWlYwN2NtVjBkWEp1SUhNb2JqOXVPbVVwZlN4c0xHd3VaWGh3YjNKMGN5eGxMSFFzYml4eUtYMXlaWFIxY200Z2JsdHZYUzVsZUhCdmNuUnpmWFpoY2lCcFBYUjVjR1Z2WmlCeVpYRjFhWEpsUFQxY0ltWjFibU4wYVc5dVhDSW1KbkpsY1hWcGNtVTdabTl5S0haaGNpQnZQVEE3Ynp4eUxteGxibWQwYUR0dkt5c3BjeWh5VzI5ZEtUdHlaWFIxY200Z2MzMHBJaXdpTHlvcVhHNGdLaUJzYjJSaGMyZ2dLRU4xYzNSdmJTQkNkV2xzWkNrZ1BHaDBkSEJ6T2k4dmJHOWtZWE5vTG1OdmJTOCtYRzRnS2lCQ2RXbHNaRG9nWUd4dlpHRnphQ0J0YjJSMWJHRnlhWHBsSUdWNGNHOXlkSE05WENKdWNHMWNJaUF0YnlBdUwyQmNiaUFxSUVOdmNIbHlhV2RvZENCcVVYVmxjbmtnUm05MWJtUmhkR2x2YmlCaGJtUWdiM1JvWlhJZ1kyOXVkSEpwWW5WMGIzSnpJRHhvZEhSd2N6b3ZMMnB4ZFdWeWVTNXZjbWN2UGx4dUlDb2dVbVZzWldGelpXUWdkVzVrWlhJZ1RVbFVJR3hwWTJWdWMyVWdQR2gwZEhCek9pOHZiRzlrWVhOb0xtTnZiUzlzYVdObGJuTmxQbHh1SUNvZ1FtRnpaV1FnYjI0Z1ZXNWtaWEp6WTI5eVpTNXFjeUF4TGpndU15QThhSFIwY0RvdkwzVnVaR1Z5YzJOdmNtVnFjeTV2Y21jdlRFbERSVTVUUlQ1Y2JpQXFJRU52Y0hseWFXZG9kQ0JLWlhKbGJYa2dRWE5vYTJWdVlYTXNJRVJ2WTNWdFpXNTBRMnh2ZFdRZ1lXNWtJRWx1ZG1WemRHbG5ZWFJwZG1VZ1VtVndiM0owWlhKeklDWWdSV1JwZEc5eWMxeHVJQ292WEc1Y2JpOHFLaUJWYzJWa0lHRnpJSFJvWlNCZ1ZIbHdaVVZ5Y205eVlDQnRaWE56WVdkbElHWnZjaUJjSWtaMWJtTjBhVzl1YzF3aUlHMWxkR2h2WkhNdUlDb3ZYRzUyWVhJZ1JsVk9RMTlGVWxKUFVsOVVSVmhVSUQwZ0owVjRjR1ZqZEdWa0lHRWdablZ1WTNScGIyNG5PMXh1WEc0dktpb2dWWE5sWkNCaGN5QnlaV1psY21WdVkyVnpJR1p2Y2lCMllYSnBiM1Z6SUdCT2RXMWlaWEpnSUdOdmJuTjBZVzUwY3k0Z0tpOWNiblpoY2lCT1FVNGdQU0F3SUM4Z01EdGNibHh1THlvcUlHQlBZbXBsWTNRamRHOVRkSEpwYm1kZ0lISmxjM1ZzZENCeVpXWmxjbVZ1WTJWekxpQXFMMXh1ZG1GeUlITjViV0p2YkZSaFp5QTlJQ2RiYjJKcVpXTjBJRk41YldKdmJGMG5PMXh1WEc0dktpb2dWWE5sWkNCMGJ5QnRZWFJqYUNCc1pXRmthVzVuSUdGdVpDQjBjbUZwYkdsdVp5QjNhR2wwWlhOd1lXTmxMaUFxTDF4dWRtRnlJSEpsVkhKcGJTQTlJQzllWEZ4ekszeGNYSE1ySkM5bk8xeHVYRzR2S2lvZ1ZYTmxaQ0IwYnlCa1pYUmxZM1FnWW1Ga0lITnBaMjVsWkNCb1pYaGhaR1ZqYVcxaGJDQnpkSEpwYm1jZ2RtRnNkV1Z6TGlBcUwxeHVkbUZ5SUhKbFNYTkNZV1JJWlhnZ1BTQXZYbHN0SzEwd2VGc3dMVGxoTFdaZEt5UXZhVHRjYmx4dUx5b3FJRlZ6WldRZ2RHOGdaR1YwWldOMElHSnBibUZ5ZVNCemRISnBibWNnZG1Gc2RXVnpMaUFxTDF4dWRtRnlJSEpsU1hOQ2FXNWhjbmtnUFNBdlhqQmlXekF4WFNza0wyazdYRzVjYmk4cUtpQlZjMlZrSUhSdklHUmxkR1ZqZENCdlkzUmhiQ0J6ZEhKcGJtY2dkbUZzZFdWekxpQXFMMXh1ZG1GeUlISmxTWE5QWTNSaGJDQTlJQzllTUc5Yk1DMDNYU3NrTDJrN1hHNWNiaThxS2lCQ2RXbHNkQzFwYmlCdFpYUm9iMlFnY21WbVpYSmxibU5sY3lCM2FYUm9iM1YwSUdFZ1pHVndaVzVrWlc1amVTQnZiaUJnY205dmRHQXVJQ292WEc1MllYSWdabkpsWlZCaGNuTmxTVzUwSUQwZ2NHRnljMlZKYm5RN1hHNWNiaThxS2lCRVpYUmxZM1FnWm5KbFpTQjJZWEpwWVdKc1pTQmdaMnh2WW1Gc1lDQm1jbTl0SUU1dlpHVXVhbk11SUNvdlhHNTJZWElnWm5KbFpVZHNiMkpoYkNBOUlIUjVjR1Z2WmlCbmJHOWlZV3dnUFQwZ0oyOWlhbVZqZENjZ0ppWWdaMnh2WW1Gc0lDWW1JR2RzYjJKaGJDNVBZbXBsWTNRZ1BUMDlJRTlpYW1WamRDQW1KaUJuYkc5aVlXdzdYRzVjYmk4cUtpQkVaWFJsWTNRZ1puSmxaU0IyWVhKcFlXSnNaU0JnYzJWc1ptQXVJQ292WEc1MllYSWdabkpsWlZObGJHWWdQU0IwZVhCbGIyWWdjMlZzWmlBOVBTQW5iMkpxWldOMEp5QW1KaUJ6Wld4bUlDWW1JSE5sYkdZdVQySnFaV04wSUQwOVBTQlBZbXBsWTNRZ0ppWWdjMlZzWmp0Y2JseHVMeW9xSUZWelpXUWdZWE1nWVNCeVpXWmxjbVZ1WTJVZ2RHOGdkR2hsSUdkc2IySmhiQ0J2WW1wbFkzUXVJQ292WEc1MllYSWdjbTl2ZENBOUlHWnlaV1ZIYkc5aVlXd2dmSHdnWm5KbFpWTmxiR1lnZkh3Z1JuVnVZM1JwYjI0b0ozSmxkSFZ5YmlCMGFHbHpKeWtvS1R0Y2JseHVMeW9xSUZWelpXUWdabTl5SUdKMWFXeDBMV2x1SUcxbGRHaHZaQ0J5WldabGNtVnVZMlZ6TGlBcUwxeHVkbUZ5SUc5aWFtVmpkRkJ5YjNSdklEMGdUMkpxWldOMExuQnliM1J2ZEhsd1pUdGNibHh1THlvcVhHNGdLaUJWYzJWa0lIUnZJSEpsYzI5c2RtVWdkR2hsWEc0Z0tpQmJZSFJ2VTNSeWFXNW5WR0ZuWUYwb2FIUjBjRG92TDJWamJXRXRhVzUwWlhKdVlYUnBiMjVoYkM1dmNtY3ZaV050WVMweU5qSXZOeTR3THlOelpXTXRiMkpxWldOMExuQnliM1J2ZEhsd1pTNTBiM04wY21sdVp5bGNiaUFxSUc5bUlIWmhiSFZsY3k1Y2JpQXFMMXh1ZG1GeUlHOWlhbVZqZEZSdlUzUnlhVzVuSUQwZ2IySnFaV04wVUhKdmRHOHVkRzlUZEhKcGJtYzdYRzVjYmk4cUlFSjFhV3gwTFdsdUlHMWxkR2h2WkNCeVpXWmxjbVZ1WTJWeklHWnZjaUIwYUc5elpTQjNhWFJvSUhSb1pTQnpZVzFsSUc1aGJXVWdZWE1nYjNSb1pYSWdZR3h2WkdGemFHQWdiV1YwYUc5a2N5NGdLaTljYm5aaGNpQnVZWFJwZG1WTllYZ2dQU0JOWVhSb0xtMWhlQ3hjYmlBZ0lDQnVZWFJwZG1WTmFXNGdQU0JOWVhSb0xtMXBianRjYmx4dUx5b3FYRzRnS2lCSFpYUnpJSFJvWlNCMGFXMWxjM1JoYlhBZ2IyWWdkR2hsSUc1MWJXSmxjaUJ2WmlCdGFXeHNhWE5sWTI5dVpITWdkR2hoZENCb1lYWmxJR1ZzWVhCelpXUWdjMmx1WTJWY2JpQXFJSFJvWlNCVmJtbDRJR1Z3YjJOb0lDZ3hJRXBoYm5WaGNua2dNVGszTUNBd01Eb3dNRG93TUNCVlZFTXBMbHh1SUNwY2JpQXFJRUJ6ZEdGMGFXTmNiaUFxSUVCdFpXMWlaWEpQWmlCZlhHNGdLaUJBYzJsdVkyVWdNaTQwTGpCY2JpQXFJRUJqWVhSbFoyOXllU0JFWVhSbFhHNGdLaUJBY21WMGRYSnVjeUI3Ym5WdFltVnlmU0JTWlhSMWNtNXpJSFJvWlNCMGFXMWxjM1JoYlhBdVhHNGdLaUJBWlhoaGJYQnNaVnh1SUNwY2JpQXFJRjh1WkdWbVpYSW9ablZ1WTNScGIyNG9jM1JoYlhBcElIdGNiaUFxSUNBZ1kyOXVjMjlzWlM1c2IyY29YeTV1YjNjb0tTQXRJSE4wWVcxd0tUdGNiaUFxSUgwc0lGOHVibTkzS0NrcE8xeHVJQ29nTHk4Z1BUNGdURzluY3lCMGFHVWdiblZ0WW1WeUlHOW1JRzFwYkd4cGMyVmpiMjVrY3lCcGRDQjBiMjlySUdadmNpQjBhR1VnWkdWbVpYSnlaV1FnYVc1MmIyTmhkR2x2Ymk1Y2JpQXFMMXh1ZG1GeUlHNXZkeUE5SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0J5WlhSMWNtNGdjbTl2ZEM1RVlYUmxMbTV2ZHlncE8xeHVmVHRjYmx4dUx5b3FYRzRnS2lCRGNtVmhkR1Z6SUdFZ1pHVmliM1Z1WTJWa0lHWjFibU4wYVc5dUlIUm9ZWFFnWkdWc1lYbHpJR2x1ZG05cmFXNW5JR0JtZFc1allDQjFiblJwYkNCaFpuUmxjaUJnZDJGcGRHQmNiaUFxSUcxcGJHeHBjMlZqYjI1a2N5Qm9ZWFpsSUdWc1lYQnpaV1FnYzJsdVkyVWdkR2hsSUd4aGMzUWdkR2x0WlNCMGFHVWdaR1ZpYjNWdVkyVmtJR1oxYm1OMGFXOXVJSGRoYzF4dUlDb2dhVzUyYjJ0bFpDNGdWR2hsSUdSbFltOTFibU5sWkNCbWRXNWpkR2x2YmlCamIyMWxjeUIzYVhSb0lHRWdZR05oYm1ObGJHQWdiV1YwYUc5a0lIUnZJR05oYm1ObGJGeHVJQ29nWkdWc1lYbGxaQ0JnWm5WdVkyQWdhVzUyYjJOaGRHbHZibk1nWVc1a0lHRWdZR1pzZFhOb1lDQnRaWFJvYjJRZ2RHOGdhVzF0WldScFlYUmxiSGtnYVc1MmIydGxJSFJvWlcwdVhHNGdLaUJRY205MmFXUmxJR0J2Y0hScGIyNXpZQ0IwYnlCcGJtUnBZMkYwWlNCM2FHVjBhR1Z5SUdCbWRXNWpZQ0J6YUc5MWJHUWdZbVVnYVc1MmIydGxaQ0J2YmlCMGFHVmNiaUFxSUd4bFlXUnBibWNnWVc1a0wyOXlJSFJ5WVdsc2FXNW5JR1ZrWjJVZ2IyWWdkR2hsSUdCM1lXbDBZQ0IwYVcxbGIzVjBMaUJVYUdVZ1lHWjFibU5nSUdseklHbHVkbTlyWldSY2JpQXFJSGRwZEdnZ2RHaGxJR3hoYzNRZ1lYSm5kVzFsYm5SeklIQnliM1pwWkdWa0lIUnZJSFJvWlNCa1pXSnZkVzVqWldRZ1puVnVZM1JwYjI0dUlGTjFZbk5sY1hWbGJuUmNiaUFxSUdOaGJHeHpJSFJ2SUhSb1pTQmtaV0p2ZFc1alpXUWdablZ1WTNScGIyNGdjbVYwZFhKdUlIUm9aU0J5WlhOMWJIUWdiMllnZEdobElHeGhjM1FnWUdaMWJtTmdYRzRnS2lCcGJuWnZZMkYwYVc5dUxseHVJQ3BjYmlBcUlDb3FUbTkwWlRvcUtpQkpaaUJnYkdWaFpHbHVaMkFnWVc1a0lHQjBjbUZwYkdsdVoyQWdiM0IwYVc5dWN5QmhjbVVnWUhSeWRXVmdMQ0JnWm5WdVkyQWdhWE5jYmlBcUlHbHVkbTlyWldRZ2IyNGdkR2hsSUhSeVlXbHNhVzVuSUdWa1oyVWdiMllnZEdobElIUnBiV1Z2ZFhRZ2IyNXNlU0JwWmlCMGFHVWdaR1ZpYjNWdVkyVmtJR1oxYm1OMGFXOXVYRzRnS2lCcGN5QnBiblp2YTJWa0lHMXZjbVVnZEdoaGJpQnZibU5sSUdSMWNtbHVaeUIwYUdVZ1lIZGhhWFJnSUhScGJXVnZkWFF1WEc0Z0tseHVJQ29nU1dZZ1lIZGhhWFJnSUdseklHQXdZQ0JoYm1RZ1lHeGxZV1JwYm1kZ0lHbHpJR0JtWVd4elpXQXNJR0JtZFc1allDQnBiblp2WTJGMGFXOXVJR2x6SUdSbFptVnljbVZrWEc0Z0tpQjFiblJwYkNCMGJ5QjBhR1VnYm1WNGRDQjBhV05yTENCemFXMXBiR0Z5SUhSdklHQnpaWFJVYVcxbGIzVjBZQ0IzYVhSb0lHRWdkR2x0Wlc5MWRDQnZaaUJnTUdBdVhHNGdLbHh1SUNvZ1UyVmxJRnRFWVhacFpDQkRiM0ppWVdOb2J5ZHpJR0Z5ZEdsamJHVmRLR2gwZEhCek9pOHZZM056TFhSeWFXTnJjeTVqYjIwdlpHVmliM1Z1WTJsdVp5MTBhSEp2ZEhSc2FXNW5MV1Y0Y0d4aGFXNWxaQzFsZUdGdGNHeGxjeThwWEc0Z0tpQm1iM0lnWkdWMFlXbHNjeUJ2ZG1WeUlIUm9aU0JrYVdabVpYSmxibU5sY3lCaVpYUjNaV1Z1SUdCZkxtUmxZbTkxYm1ObFlDQmhibVFnWUY4dWRHaHliM1IwYkdWZ0xseHVJQ3BjYmlBcUlFQnpkR0YwYVdOY2JpQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0tpQkFjMmx1WTJVZ01DNHhMakJjYmlBcUlFQmpZWFJsWjI5eWVTQkdkVzVqZEdsdmJseHVJQ29nUUhCaGNtRnRJSHRHZFc1amRHbHZibjBnWm5WdVl5QlVhR1VnWm5WdVkzUnBiMjRnZEc4Z1pHVmliM1Z1WTJVdVhHNGdLaUJBY0dGeVlXMGdlMjUxYldKbGNuMGdXM2RoYVhROU1GMGdWR2hsSUc1MWJXSmxjaUJ2WmlCdGFXeHNhWE5sWTI5dVpITWdkRzhnWkdWc1lYa3VYRzRnS2lCQWNHRnlZVzBnZTA5aWFtVmpkSDBnVzI5d2RHbHZibk05ZTMxZElGUm9aU0J2Y0hScGIyNXpJRzlpYW1WamRDNWNiaUFxSUVCd1lYSmhiU0I3WW05dmJHVmhibjBnVzI5d2RHbHZibk11YkdWaFpHbHVaejFtWVd4elpWMWNiaUFxSUNCVGNHVmphV1o1SUdsdWRtOXJhVzVuSUc5dUlIUm9aU0JzWldGa2FXNW5JR1ZrWjJVZ2IyWWdkR2hsSUhScGJXVnZkWFF1WEc0Z0tpQkFjR0Z5WVcwZ2UyNTFiV0psY24wZ1cyOXdkR2x2Ym5NdWJXRjRWMkZwZEYxY2JpQXFJQ0JVYUdVZ2JXRjRhVzExYlNCMGFXMWxJR0JtZFc1allDQnBjeUJoYkd4dmQyVmtJSFJ2SUdKbElHUmxiR0Y1WldRZ1ltVm1iM0psSUdsMEozTWdhVzUyYjJ0bFpDNWNiaUFxSUVCd1lYSmhiU0I3WW05dmJHVmhibjBnVzI5d2RHbHZibk11ZEhKaGFXeHBibWM5ZEhKMVpWMWNiaUFxSUNCVGNHVmphV1o1SUdsdWRtOXJhVzVuSUc5dUlIUm9aU0IwY21GcGJHbHVaeUJsWkdkbElHOW1JSFJvWlNCMGFXMWxiM1YwTGx4dUlDb2dRSEpsZEhWeWJuTWdlMFoxYm1OMGFXOXVmU0JTWlhSMWNtNXpJSFJvWlNCdVpYY2daR1ZpYjNWdVkyVmtJR1oxYm1OMGFXOXVMbHh1SUNvZ1FHVjRZVzF3YkdWY2JpQXFYRzRnS2lBdkx5QkJkbTlwWkNCamIzTjBiSGtnWTJGc1kzVnNZWFJwYjI1eklIZG9hV3hsSUhSb1pTQjNhVzVrYjNjZ2MybDZaU0JwY3lCcGJpQm1iSFY0TGx4dUlDb2dhbEYxWlhKNUtIZHBibVJ2ZHlrdWIyNG9KM0psYzJsNlpTY3NJRjh1WkdWaWIzVnVZMlVvWTJGc1kzVnNZWFJsVEdGNWIzVjBMQ0F4TlRBcEtUdGNiaUFxWEc0Z0tpQXZMeUJKYm5admEyVWdZSE5sYm1STllXbHNZQ0IzYUdWdUlHTnNhV05yWldRc0lHUmxZbTkxYm1OcGJtY2djM1ZpYzJWeGRXVnVkQ0JqWVd4c2N5NWNiaUFxSUdwUmRXVnllU2hsYkdWdFpXNTBLUzV2YmlnblkyeHBZMnNuTENCZkxtUmxZbTkxYm1ObEtITmxibVJOWVdsc0xDQXpNREFzSUh0Y2JpQXFJQ0FnSjJ4bFlXUnBibWNuT2lCMGNuVmxMRnh1SUNvZ0lDQW5kSEpoYVd4cGJtY25PaUJtWVd4elpWeHVJQ29nZlNrcE8xeHVJQ3BjYmlBcUlDOHZJRVZ1YzNWeVpTQmdZbUYwWTJoTWIyZGdJR2x6SUdsdWRtOXJaV1FnYjI1alpTQmhablJsY2lBeElITmxZMjl1WkNCdlppQmtaV0p2ZFc1alpXUWdZMkZzYkhNdVhHNGdLaUIyWVhJZ1pHVmliM1Z1WTJWa0lEMGdYeTVrWldKdmRXNWpaU2hpWVhSamFFeHZaeXdnTWpVd0xDQjdJQ2R0WVhoWFlXbDBKem9nTVRBd01DQjlLVHRjYmlBcUlIWmhjaUJ6YjNWeVkyVWdQU0J1WlhjZ1JYWmxiblJUYjNWeVkyVW9KeTl6ZEhKbFlXMG5LVHRjYmlBcUlHcFJkV1Z5ZVNoemIzVnlZMlVwTG05dUtDZHRaWE56WVdkbEp5d2daR1ZpYjNWdVkyVmtLVHRjYmlBcVhHNGdLaUF2THlCRFlXNWpaV3dnZEdobElIUnlZV2xzYVc1bklHUmxZbTkxYm1ObFpDQnBiblp2WTJGMGFXOXVMbHh1SUNvZ2FsRjFaWEo1S0hkcGJtUnZkeWt1YjI0b0ozQnZjSE4wWVhSbEp5d2daR1ZpYjNWdVkyVmtMbU5oYm1ObGJDazdYRzRnS2k5Y2JtWjFibU4wYVc5dUlHUmxZbTkxYm1ObEtHWjFibU1zSUhkaGFYUXNJRzl3ZEdsdmJuTXBJSHRjYmlBZ2RtRnlJR3hoYzNSQmNtZHpMRnh1SUNBZ0lDQWdiR0Z6ZEZSb2FYTXNYRzRnSUNBZ0lDQnRZWGhYWVdsMExGeHVJQ0FnSUNBZ2NtVnpkV3gwTEZ4dUlDQWdJQ0FnZEdsdFpYSkpaQ3hjYmlBZ0lDQWdJR3hoYzNSRFlXeHNWR2x0WlN4Y2JpQWdJQ0FnSUd4aGMzUkpiblp2YTJWVWFXMWxJRDBnTUN4Y2JpQWdJQ0FnSUd4bFlXUnBibWNnUFNCbVlXeHpaU3hjYmlBZ0lDQWdJRzFoZUdsdVp5QTlJR1poYkhObExGeHVJQ0FnSUNBZ2RISmhhV3hwYm1jZ1BTQjBjblZsTzF4dVhHNGdJR2xtSUNoMGVYQmxiMllnWm5WdVl5QWhQU0FuWm5WdVkzUnBiMjRuS1NCN1hHNGdJQ0FnZEdoeWIzY2dibVYzSUZSNWNHVkZjbkp2Y2loR1ZVNURYMFZTVWs5U1gxUkZXRlFwTzF4dUlDQjlYRzRnSUhkaGFYUWdQU0IwYjA1MWJXSmxjaWgzWVdsMEtTQjhmQ0F3TzF4dUlDQnBaaUFvYVhOUFltcGxZM1FvYjNCMGFXOXVjeWtwSUh0Y2JpQWdJQ0JzWldGa2FXNW5JRDBnSVNGdmNIUnBiMjV6TG14bFlXUnBibWM3WEc0Z0lDQWdiV0Y0YVc1bklEMGdKMjFoZUZkaGFYUW5JR2x1SUc5d2RHbHZibk03WEc0Z0lDQWdiV0Y0VjJGcGRDQTlJRzFoZUdsdVp5QS9JRzVoZEdsMlpVMWhlQ2gwYjA1MWJXSmxjaWh2Y0hScGIyNXpMbTFoZUZkaGFYUXBJSHg4SURBc0lIZGhhWFFwSURvZ2JXRjRWMkZwZER0Y2JpQWdJQ0IwY21GcGJHbHVaeUE5SUNkMGNtRnBiR2x1WnljZ2FXNGdiM0IwYVc5dWN5QS9JQ0VoYjNCMGFXOXVjeTUwY21GcGJHbHVaeUE2SUhSeVlXbHNhVzVuTzF4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z2FXNTJiMnRsUm5WdVl5aDBhVzFsS1NCN1hHNGdJQ0FnZG1GeUlHRnlaM01nUFNCc1lYTjBRWEpuY3l4Y2JpQWdJQ0FnSUNBZ2RHaHBjMEZ5WnlBOUlHeGhjM1JVYUdsek8xeHVYRzRnSUNBZ2JHRnpkRUZ5WjNNZ1BTQnNZWE4wVkdocGN5QTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQnNZWE4wU1c1MmIydGxWR2x0WlNBOUlIUnBiV1U3WEc0Z0lDQWdjbVZ6ZFd4MElEMGdablZ1WXk1aGNIQnNlU2gwYUdselFYSm5MQ0JoY21kektUdGNiaUFnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh1SUNCOVhHNWNiaUFnWm5WdVkzUnBiMjRnYkdWaFpHbHVaMFZrWjJVb2RHbHRaU2tnZTF4dUlDQWdJQzh2SUZKbGMyVjBJR0Z1ZVNCZ2JXRjRWMkZwZEdBZ2RHbHRaWEl1WEc0Z0lDQWdiR0Z6ZEVsdWRtOXJaVlJwYldVZ1BTQjBhVzFsTzF4dUlDQWdJQzh2SUZOMFlYSjBJSFJvWlNCMGFXMWxjaUJtYjNJZ2RHaGxJSFJ5WVdsc2FXNW5JR1ZrWjJVdVhHNGdJQ0FnZEdsdFpYSkpaQ0E5SUhObGRGUnBiV1Z2ZFhRb2RHbHRaWEpGZUhCcGNtVmtMQ0IzWVdsMEtUdGNiaUFnSUNBdkx5Qkpiblp2YTJVZ2RHaGxJR3hsWVdScGJtY2daV1JuWlM1Y2JpQWdJQ0J5WlhSMWNtNGdiR1ZoWkdsdVp5QS9JR2x1ZG05clpVWjFibU1vZEdsdFpTa2dPaUJ5WlhOMWJIUTdYRzRnSUgxY2JseHVJQ0JtZFc1amRHbHZiaUJ5WlcxaGFXNXBibWRYWVdsMEtIUnBiV1VwSUh0Y2JpQWdJQ0IyWVhJZ2RHbHRaVk5wYm1ObFRHRnpkRU5oYkd3Z1BTQjBhVzFsSUMwZ2JHRnpkRU5oYkd4VWFXMWxMRnh1SUNBZ0lDQWdJQ0IwYVcxbFUybHVZMlZNWVhOMFNXNTJiMnRsSUQwZ2RHbHRaU0F0SUd4aGMzUkpiblp2YTJWVWFXMWxMRnh1SUNBZ0lDQWdJQ0J5WlhOMWJIUWdQU0IzWVdsMElDMGdkR2x0WlZOcGJtTmxUR0Z6ZEVOaGJHdzdYRzVjYmlBZ0lDQnlaWFIxY200Z2JXRjRhVzVuSUQ4Z2JtRjBhWFpsVFdsdUtISmxjM1ZzZEN3Z2JXRjRWMkZwZENBdElIUnBiV1ZUYVc1alpVeGhjM1JKYm5admEyVXBJRG9nY21WemRXeDBPMXh1SUNCOVhHNWNiaUFnWm5WdVkzUnBiMjRnYzJodmRXeGtTVzUyYjJ0bEtIUnBiV1VwSUh0Y2JpQWdJQ0IyWVhJZ2RHbHRaVk5wYm1ObFRHRnpkRU5oYkd3Z1BTQjBhVzFsSUMwZ2JHRnpkRU5oYkd4VWFXMWxMRnh1SUNBZ0lDQWdJQ0IwYVcxbFUybHVZMlZNWVhOMFNXNTJiMnRsSUQwZ2RHbHRaU0F0SUd4aGMzUkpiblp2YTJWVWFXMWxPMXh1WEc0Z0lDQWdMeThnUldsMGFHVnlJSFJvYVhNZ2FYTWdkR2hsSUdacGNuTjBJR05oYkd3c0lHRmpkR2wyYVhSNUlHaGhjeUJ6ZEc5d2NHVmtJR0Z1WkNCM1pTZHlaU0JoZENCMGFHVmNiaUFnSUNBdkx5QjBjbUZwYkdsdVp5QmxaR2RsTENCMGFHVWdjM2x6ZEdWdElIUnBiV1VnYUdGeklHZHZibVVnWW1GamEzZGhjbVJ6SUdGdVpDQjNaU2R5WlNCMGNtVmhkR2x1WjF4dUlDQWdJQzh2SUdsMElHRnpJSFJvWlNCMGNtRnBiR2x1WnlCbFpHZGxMQ0J2Y2lCM1pTZDJaU0JvYVhRZ2RHaGxJR0J0WVhoWFlXbDBZQ0JzYVcxcGRDNWNiaUFnSUNCeVpYUjFjbTRnS0d4aGMzUkRZV3hzVkdsdFpTQTlQVDBnZFc1a1pXWnBibVZrSUh4OElDaDBhVzFsVTJsdVkyVk1ZWE4wUTJGc2JDQStQU0IzWVdsMEtTQjhmRnh1SUNBZ0lDQWdLSFJwYldWVGFXNWpaVXhoYzNSRFlXeHNJRHdnTUNrZ2ZId2dLRzFoZUdsdVp5QW1KaUIwYVcxbFUybHVZMlZNWVhOMFNXNTJiMnRsSUQ0OUlHMWhlRmRoYVhRcEtUdGNiaUFnZlZ4dVhHNGdJR1oxYm1OMGFXOXVJSFJwYldWeVJYaHdhWEpsWkNncElIdGNiaUFnSUNCMllYSWdkR2x0WlNBOUlHNXZkeWdwTzF4dUlDQWdJR2xtSUNoemFHOTFiR1JKYm5admEyVW9kR2x0WlNrcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCMGNtRnBiR2x1WjBWa1oyVW9kR2x0WlNrN1hHNGdJQ0FnZlZ4dUlDQWdJQzh2SUZKbGMzUmhjblFnZEdobElIUnBiV1Z5TGx4dUlDQWdJSFJwYldWeVNXUWdQU0J6WlhSVWFXMWxiM1YwS0hScGJXVnlSWGh3YVhKbFpDd2djbVZ0WVdsdWFXNW5WMkZwZENoMGFXMWxLU2s3WEc0Z0lIMWNibHh1SUNCbWRXNWpkR2x2YmlCMGNtRnBiR2x1WjBWa1oyVW9kR2x0WlNrZ2UxeHVJQ0FnSUhScGJXVnlTV1FnUFNCMWJtUmxabWx1WldRN1hHNWNiaUFnSUNBdkx5QlBibXg1SUdsdWRtOXJaU0JwWmlCM1pTQm9ZWFpsSUdCc1lYTjBRWEpuYzJBZ2QyaHBZMmdnYldWaGJuTWdZR1oxYm1OZ0lHaGhjeUJpWldWdVhHNGdJQ0FnTHk4Z1pHVmliM1Z1WTJWa0lHRjBJR3hsWVhOMElHOXVZMlV1WEc0Z0lDQWdhV1lnS0hSeVlXbHNhVzVuSUNZbUlHeGhjM1JCY21kektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2FXNTJiMnRsUm5WdVl5aDBhVzFsS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdiR0Z6ZEVGeVozTWdQU0JzWVhOMFZHaHBjeUE5SUhWdVpHVm1hVzVsWkR0Y2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0I5WEc1Y2JpQWdablZ1WTNScGIyNGdZMkZ1WTJWc0tDa2dlMXh1SUNBZ0lHbG1JQ2gwYVcxbGNrbGtJQ0U5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lHTnNaV0Z5VkdsdFpXOTFkQ2gwYVcxbGNrbGtLVHRjYmlBZ0lDQjlYRzRnSUNBZ2JHRnpkRWx1ZG05clpWUnBiV1VnUFNBd08xeHVJQ0FnSUd4aGMzUkJjbWR6SUQwZ2JHRnpkRU5oYkd4VWFXMWxJRDBnYkdGemRGUm9hWE1nUFNCMGFXMWxja2xrSUQwZ2RXNWtaV1pwYm1Wa08xeHVJQ0I5WEc1Y2JpQWdablZ1WTNScGIyNGdabXgxYzJnb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhScGJXVnlTV1FnUFQwOUlIVnVaR1ZtYVc1bFpDQS9JSEpsYzNWc2RDQTZJSFJ5WVdsc2FXNW5SV1JuWlNodWIzY29LU2s3WEc0Z0lIMWNibHh1SUNCbWRXNWpkR2x2YmlCa1pXSnZkVzVqWldRb0tTQjdYRzRnSUNBZ2RtRnlJSFJwYldVZ1BTQnViM2NvS1N4Y2JpQWdJQ0FnSUNBZ2FYTkpiblp2YTJsdVp5QTlJSE5vYjNWc1pFbHVkbTlyWlNoMGFXMWxLVHRjYmx4dUlDQWdJR3hoYzNSQmNtZHpJRDBnWVhKbmRXMWxiblJ6TzF4dUlDQWdJR3hoYzNSVWFHbHpJRDBnZEdocGN6dGNiaUFnSUNCc1lYTjBRMkZzYkZScGJXVWdQU0IwYVcxbE8xeHVYRzRnSUNBZ2FXWWdLR2x6U1c1MmIydHBibWNwSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhVzFsY2tsa0lEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUd4bFlXUnBibWRGWkdkbEtHeGhjM1JEWVd4c1ZHbHRaU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JwWmlBb2JXRjRhVzVuS1NCN1hHNGdJQ0FnSUNBZ0lDOHZJRWhoYm1Sc1pTQnBiblp2WTJGMGFXOXVjeUJwYmlCaElIUnBaMmgwSUd4dmIzQXVYRzRnSUNBZ0lDQWdJSFJwYldWeVNXUWdQU0J6WlhSVWFXMWxiM1YwS0hScGJXVnlSWGh3YVhKbFpDd2dkMkZwZENrN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCcGJuWnZhMlZHZFc1aktHeGhjM1JEWVd4c1ZHbHRaU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNBZ0lHbG1JQ2gwYVcxbGNrbGtJRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lIUnBiV1Z5U1dRZ1BTQnpaWFJVYVcxbGIzVjBLSFJwYldWeVJYaHdhWEpsWkN3Z2QyRnBkQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc0Z0lIMWNiaUFnWkdWaWIzVnVZMlZrTG1OaGJtTmxiQ0E5SUdOaGJtTmxiRHRjYmlBZ1pHVmliM1Z1WTJWa0xtWnNkWE5vSUQwZ1pteDFjMmc3WEc0Z0lISmxkSFZ5YmlCa1pXSnZkVzVqWldRN1hHNTlYRzVjYmk4cUtseHVJQ29nUTJobFkydHpJR2xtSUdCMllXeDFaV0FnYVhNZ2RHaGxYRzRnS2lCYmJHRnVaM1ZoWjJVZ2RIbHdaVjBvYUhSMGNEb3ZMM2QzZHk1bFkyMWhMV2x1ZEdWeWJtRjBhVzl1WVd3dWIzSm5MMlZqYldFdE1qWXlMemN1TUM4amMyVmpMV1ZqYldGelkzSnBjSFF0YkdGdVozVmhaMlV0ZEhsd1pYTXBYRzRnS2lCdlppQmdUMkpxWldOMFlDNGdLR1V1Wnk0Z1lYSnlZWGx6TENCbWRXNWpkR2x2Ym5Nc0lHOWlhbVZqZEhNc0lISmxaMlY0WlhNc0lHQnVaWGNnVG5WdFltVnlLREFwWUN3Z1lXNWtJR0J1WlhjZ1UzUnlhVzVuS0NjbktXQXBYRzRnS2x4dUlDb2dRSE4wWVhScFkxeHVJQ29nUUcxbGJXSmxjazltSUY5Y2JpQXFJRUJ6YVc1alpTQXdMakV1TUZ4dUlDb2dRR05oZEdWbmIzSjVJRXhoYm1kY2JpQXFJRUJ3WVhKaGJTQjdLbjBnZG1Gc2RXVWdWR2hsSUhaaGJIVmxJSFJ2SUdOb1pXTnJMbHh1SUNvZ1FISmxkSFZ5Ym5NZ2UySnZiMnhsWVc1OUlGSmxkSFZ5Ym5NZ1lIUnlkV1ZnSUdsbUlHQjJZV3gxWldBZ2FYTWdZVzRnYjJKcVpXTjBMQ0JsYkhObElHQm1ZV3h6WldBdVhHNGdLaUJBWlhoaGJYQnNaVnh1SUNwY2JpQXFJRjh1YVhOUFltcGxZM1FvZTMwcE8xeHVJQ29nTHk4Z1BUNGdkSEoxWlZ4dUlDcGNiaUFxSUY4dWFYTlBZbXBsWTNRb1d6RXNJRElzSUROZEtUdGNiaUFxSUM4dklEMCtJSFJ5ZFdWY2JpQXFYRzRnS2lCZkxtbHpUMkpxWldOMEtGOHVibTl2Y0NrN1hHNGdLaUF2THlBOVBpQjBjblZsWEc0Z0tseHVJQ29nWHk1cGMwOWlhbVZqZENodWRXeHNLVHRjYmlBcUlDOHZJRDArSUdaaGJITmxYRzRnS2k5Y2JtWjFibU4wYVc5dUlHbHpUMkpxWldOMEtIWmhiSFZsS1NCN1hHNGdJSFpoY2lCMGVYQmxJRDBnZEhsd1pXOW1JSFpoYkhWbE8xeHVJQ0J5WlhSMWNtNGdJU0YyWVd4MVpTQW1KaUFvZEhsd1pTQTlQU0FuYjJKcVpXTjBKeUI4ZkNCMGVYQmxJRDA5SUNkbWRXNWpkR2x2YmljcE8xeHVmVnh1WEc0dktpcGNiaUFxSUVOb1pXTnJjeUJwWmlCZ2RtRnNkV1ZnSUdseklHOWlhbVZqZEMxc2FXdGxMaUJCSUhaaGJIVmxJR2x6SUc5aWFtVmpkQzFzYVd0bElHbG1JR2wwSjNNZ2JtOTBJR0J1ZFd4c1lGeHVJQ29nWVc1a0lHaGhjeUJoSUdCMGVYQmxiMlpnSUhKbGMzVnNkQ0J2WmlCY0ltOWlhbVZqZEZ3aUxseHVJQ3BjYmlBcUlFQnpkR0YwYVdOY2JpQXFJRUJ0WlcxaVpYSlBaaUJmWEc0Z0tpQkFjMmx1WTJVZ05DNHdMakJjYmlBcUlFQmpZWFJsWjI5eWVTQk1ZVzVuWEc0Z0tpQkFjR0Z5WVcwZ2V5cDlJSFpoYkhWbElGUm9aU0IyWVd4MVpTQjBieUJqYUdWamF5NWNiaUFxSUVCeVpYUjFjbTV6SUh0aWIyOXNaV0Z1ZlNCU1pYUjFjbTV6SUdCMGNuVmxZQ0JwWmlCZ2RtRnNkV1ZnSUdseklHOWlhbVZqZEMxc2FXdGxMQ0JsYkhObElHQm1ZV3h6WldBdVhHNGdLaUJBWlhoaGJYQnNaVnh1SUNwY2JpQXFJRjh1YVhOUFltcGxZM1JNYVd0bEtIdDlLVHRjYmlBcUlDOHZJRDArSUhSeWRXVmNiaUFxWEc0Z0tpQmZMbWx6VDJKcVpXTjBUR2xyWlNoYk1Td2dNaXdnTTEwcE8xeHVJQ29nTHk4Z1BUNGdkSEoxWlZ4dUlDcGNiaUFxSUY4dWFYTlBZbXBsWTNSTWFXdGxLRjh1Ym05dmNDazdYRzRnS2lBdkx5QTlQaUJtWVd4elpWeHVJQ3BjYmlBcUlGOHVhWE5QWW1wbFkzUk1hV3RsS0c1MWJHd3BPMXh1SUNvZ0x5OGdQVDRnWm1Gc2MyVmNiaUFxTDF4dVpuVnVZM1JwYjI0Z2FYTlBZbXBsWTNSTWFXdGxLSFpoYkhWbEtTQjdYRzRnSUhKbGRIVnliaUFoSVhaaGJIVmxJQ1ltSUhSNWNHVnZaaUIyWVd4MVpTQTlQU0FuYjJKcVpXTjBKenRjYm4xY2JseHVMeW9xWEc0Z0tpQkRhR1ZqYTNNZ2FXWWdZSFpoYkhWbFlDQnBjeUJqYkdGemMybG1hV1ZrSUdGeklHRWdZRk41YldKdmJHQWdjSEpwYldsMGFYWmxJRzl5SUc5aWFtVmpkQzVjYmlBcVhHNGdLaUJBYzNSaGRHbGpYRzRnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ29nUUhOcGJtTmxJRFF1TUM0d1hHNGdLaUJBWTJGMFpXZHZjbmtnVEdGdVoxeHVJQ29nUUhCaGNtRnRJSHNxZlNCMllXeDFaU0JVYUdVZ2RtRnNkV1VnZEc4Z1kyaGxZMnN1WEc0Z0tpQkFjbVYwZFhKdWN5QjdZbTl2YkdWaGJuMGdVbVYwZFhKdWN5QmdkSEoxWldBZ2FXWWdZSFpoYkhWbFlDQnBjeUJoSUhONWJXSnZiQ3dnWld4elpTQmdabUZzYzJWZ0xseHVJQ29nUUdWNFlXMXdiR1ZjYmlBcVhHNGdLaUJmTG1selUzbHRZbTlzS0ZONWJXSnZiQzVwZEdWeVlYUnZjaWs3WEc0Z0tpQXZMeUE5UGlCMGNuVmxYRzRnS2x4dUlDb2dYeTVwYzFONWJXSnZiQ2duWVdKakp5azdYRzRnS2lBdkx5QTlQaUJtWVd4elpWeHVJQ292WEc1bWRXNWpkR2x2YmlCcGMxTjViV0p2YkNoMllXeDFaU2tnZTF4dUlDQnlaWFIxY200Z2RIbHdaVzltSUhaaGJIVmxJRDA5SUNkemVXMWliMnduSUh4OFhHNGdJQ0FnS0dselQySnFaV04wVEdsclpTaDJZV3gxWlNrZ0ppWWdiMkpxWldOMFZHOVRkSEpwYm1jdVkyRnNiQ2gyWVd4MVpTa2dQVDBnYzNsdFltOXNWR0ZuS1R0Y2JuMWNibHh1THlvcVhHNGdLaUJEYjI1MlpYSjBjeUJnZG1Gc2RXVmdJSFJ2SUdFZ2JuVnRZbVZ5TGx4dUlDcGNiaUFxSUVCemRHRjBhV05jYmlBcUlFQnRaVzFpWlhKUFppQmZYRzRnS2lCQWMybHVZMlVnTkM0d0xqQmNiaUFxSUVCallYUmxaMjl5ZVNCTVlXNW5YRzRnS2lCQWNHRnlZVzBnZXlwOUlIWmhiSFZsSUZSb1pTQjJZV3gxWlNCMGJ5QndjbTlqWlhOekxseHVJQ29nUUhKbGRIVnlibk1nZTI1MWJXSmxjbjBnVW1WMGRYSnVjeUIwYUdVZ2JuVnRZbVZ5TGx4dUlDb2dRR1Y0WVcxd2JHVmNiaUFxWEc0Z0tpQmZMblJ2VG5WdFltVnlLRE11TWlrN1hHNGdLaUF2THlBOVBpQXpMakpjYmlBcVhHNGdLaUJmTG5SdlRuVnRZbVZ5S0U1MWJXSmxjaTVOU1U1ZlZrRk1WVVVwTzF4dUlDb2dMeThnUFQ0Z05XVXRNekkwWEc0Z0tseHVJQ29nWHk1MGIwNTFiV0psY2loSmJtWnBibWwwZVNrN1hHNGdLaUF2THlBOVBpQkpibVpwYm1sMGVWeHVJQ3BjYmlBcUlGOHVkRzlPZFcxaVpYSW9Kek11TWljcE8xeHVJQ29nTHk4Z1BUNGdNeTR5WEc0Z0tpOWNibVoxYm1OMGFXOXVJSFJ2VG5WdFltVnlLSFpoYkhWbEtTQjdYRzRnSUdsbUlDaDBlWEJsYjJZZ2RtRnNkV1VnUFQwZ0oyNTFiV0psY2ljcElIdGNiaUFnSUNCeVpYUjFjbTRnZG1Gc2RXVTdYRzRnSUgxY2JpQWdhV1lnS0dselUzbHRZbTlzS0haaGJIVmxLU2tnZTF4dUlDQWdJSEpsZEhWeWJpQk9RVTQ3WEc0Z0lIMWNiaUFnYVdZZ0tHbHpUMkpxWldOMEtIWmhiSFZsS1NrZ2UxeHVJQ0FnSUhaaGNpQnZkR2hsY2lBOUlIUjVjR1Z2WmlCMllXeDFaUzUyWVd4MVpVOW1JRDA5SUNkbWRXNWpkR2x2YmljZ1B5QjJZV3gxWlM1MllXeDFaVTltS0NrZ09pQjJZV3gxWlR0Y2JpQWdJQ0IyWVd4MVpTQTlJR2x6VDJKcVpXTjBLRzkwYUdWeUtTQS9JQ2h2ZEdobGNpQXJJQ2NuS1NBNklHOTBhR1Z5TzF4dUlDQjlYRzRnSUdsbUlDaDBlWEJsYjJZZ2RtRnNkV1VnSVQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNCeVpYUjFjbTRnZG1Gc2RXVWdQVDA5SURBZ1B5QjJZV3gxWlNBNklDdDJZV3gxWlR0Y2JpQWdmVnh1SUNCMllXeDFaU0E5SUhaaGJIVmxMbkpsY0d4aFkyVW9jbVZVY21sdExDQW5KeWs3WEc0Z0lIWmhjaUJwYzBKcGJtRnllU0E5SUhKbFNYTkNhVzVoY25rdWRHVnpkQ2gyWVd4MVpTazdYRzRnSUhKbGRIVnliaUFvYVhOQ2FXNWhjbmtnZkh3Z2NtVkpjMDlqZEdGc0xuUmxjM1FvZG1Gc2RXVXBLVnh1SUNBZ0lEOGdabkpsWlZCaGNuTmxTVzUwS0haaGJIVmxMbk5zYVdObEtESXBMQ0JwYzBKcGJtRnllU0EvSURJZ09pQTRLVnh1SUNBZ0lEb2dLSEpsU1hOQ1lXUklaWGd1ZEdWemRDaDJZV3gxWlNrZ1B5Qk9RVTRnT2lBcmRtRnNkV1VwTzF4dWZWeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1JsWW05MWJtTmxPMXh1SWl3aWFXMXdiM0owSUdSbFltOTFibU5sSUdaeWIyMGdKeTR1TDI1dlpHVmZiVzlrZFd4bGN5OXNiMlJoYzJndVpHVmliM1Z1WTJVdmFXNWtaWGduTzF4eVhHNWNjbHh1SkNoa2IyTjFiV1Z1ZENrdWNtVmhaSGtvS0NrZ1BUNGdlMXh5WEc0Z0lFRlBVeTVwYm1sMEtIdGNjbHh1SUNBZ0lHUnBjMkZpYkdVNklDZHRiMkpwYkdVbkxGeHlYRzRnSUNBZ1pXRnphVzVuT2lBblpXRnpaUzFwYmkxdmRYUW5MRnh5WEc0Z0lDQWdaR1ZzWVhrNklERXdNQ3hjY2x4dUlDQWdJR1IxY21GMGFXOXVPaUF4TURBd0xGeHlYRzRnSUNBZ2IyWm1jMlYwT2lBeE1EQXNYSEpjYmlBZ0lDQnZibU5sT2lCMGNuVmxYSEpjYmlBZ2ZTazdYSEpjYmlBZ2MyTnliMnhzUW5SdVNXNXBkQ2dwTzF4eVhHNGdJR1J5YjNCRWIzZHVTVzVwZENncE8xeHlYRzRnSUhSdloyZHNaVU52Ykd4aGNITmxLQ2s3WEhKY2JpQWdhVzVwZEZCeWIycGxZM1JUYkdsa1pYSW9LVHRjY2x4dUlDQnBibWwwVFc5a1pXeHpVMnhwWkdWeUtDazdYSEpjYmlBZ2FXNXBkRTFsYm5WQ2RHNG9LVHRjY2x4dUlDQnBibWwwVkc5dmJITkNkRzV6S0NrN1hISmNibjBwTzF4eVhHNWNjbHh1Wm5WdVkzUnBiMjRnYzJOeWIyeHNRblJ1U1c1cGRDZ3BJSHRjY2x4dUlDQWtLQ2N1Wm05dmRHVnlYMTkxY0MxaWRHNG5LUzVqYkdsamF5aG1kVzVqZEdsdmJpQW9aWFpsYm5RcElIdGNjbHh1SUNBZ0lIWmhjaUIwWVhKblpYUWdQU0FrS0hSb2FYTXVhR0Z6YUNrN1hISmNiaUFnSUNCcFppQW9kR0Z5WjJWMExteGxibWQwYUNrZ2UxeHlYRzRnSUNBZ0lDQmxkbVZ1ZEM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4eVhHNWNjbHh1SUNBZ0lDQWdKQ2duYUhSdGJDd2dZbTlrZVNjcExtRnVhVzFoZEdVb2UxeHlYRzRnSUNBZ0lDQWdJSE5qY205c2JGUnZjRG9nZEdGeVoyVjBMbTltWm5ObGRDZ3BMblJ2Y0Z4eVhHNGdJQ0FnSUNCOUxDQXhNREF3TENCbWRXNWpkR2x2YmlBb0tTQjdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIWmhjaUFrZEdGeVoyVjBJRDBnSkNoMFlYSm5aWFFwTzF4eVhHNGdJQ0FnSUNBZ0lDUjBZWEpuWlhRdVptOWpkWE1vS1R0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSkhSaGNtZGxkQzVwY3loY0lqcG1iMk4xYzF3aUtTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWtkR0Z5WjJWMExtRjBkSElvSjNSaFltbHVaR1Y0Snl3Z0p5MHhKeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQWtkR0Z5WjJWMExtWnZZM1Z6S0NrN1hISmNiaUFnSUNBZ0lDQWdmVHRjY2x4dUlDQWdJQ0FnZlNrN1hISmNiaUFnSUNCOVhISmNiaUFnZlNrN1hISmNibjFjY2x4dVhISmNibVoxYm1OMGFXOXVJR1J5YjNCRWIzZHVTVzVwZENncElIdGNjbHh1SUNBa0tDY3VZbkpsWVdSamNuVnRZbk5mWDJSa0xXSjBiaWNwTG1Oc2FXTnJLQ2hsZG1WdWRDa2dQVDRnZTF4eVhHNGdJQ0FnWTI5dWMzUWdhR0Z6UTJ4aGMzTWdQU0FrS0dWMlpXNTBMblJoY21kbGRDNXdZWEpsYm5SRmJHVnRaVzUwS1M1b1lYTkRiR0Z6Y3lnblluSmxZV1JqY25WdFluTmZYMlJrTFdKMGJpMXphRzkzSnlrN1hISmNiaUFnSUNCamIyNXpkQ0JsYkdWdFpXNTBjME52ZFc1MElEMGdKQ2duTG1KeVpXRmtZM0oxYldKelgxOWtaQzFpZEc0dGMyaHZkeWNwTG14bGJtZDBhRHRjY2x4dUlDQWdJR2xtSUNob1lYTkRiR0Z6Y3lBbUppQmxiR1Z0Wlc1MGMwTnZkVzUwS1NCN1hISmNiaUFnSUNBZ0lDUW9aWFpsYm5RdWRHRnlaMlYwTG5CaGNtVnVkRVZzWlcxbGJuUXBMbkpsYlc5MlpVTnNZWE56S0NkaWNtVmhaR055ZFcxaWMxOWZaR1F0WW5SdUxYTm9iM2NuS1R0Y2NseHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb0lXaGhjME5zWVhOeklDWW1JR1ZzWlcxbGJuUnpRMjkxYm5RcElIdGNjbHh1SUNBZ0lDQWdKQ2duTG1KeVpXRmtZM0oxYldKelgxOWtaQzFpZEc0dGMyaHZkeWNwTG5KbGJXOTJaVU5zWVhOektDZGljbVZoWkdOeWRXMWljMTlmWkdRdFluUnVMWE5vYjNjbktUdGNjbHh1SUNBZ0lDQWdKQ2hsZG1WdWRDNTBZWEpuWlhRdWNHRnlaVzUwUld4bGJXVnVkQ2t1WVdSa1EyeGhjM01vSjJKeVpXRmtZM0oxYldKelgxOWtaQzFpZEc0dGMyaHZkeWNwTzF4eVhHNGdJQ0FnZlNCbGJITmxJSHRjY2x4dUlDQWdJQ0FnSkNobGRtVnVkQzUwWVhKblpYUXVjR0Z5Wlc1MFJXeGxiV1Z1ZENrdVlXUmtRMnhoYzNNb0oySnlaV0ZrWTNKMWJXSnpYMTlrWkMxaWRHNHRjMmh2ZHljcE8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUgwcE8xeHlYRzVjY2x4dUlDQWtLSGRwYm1SdmR5a3VZMnhwWTJzb0tHVjJaVzUwS1NBOVBpQjdYSEpjYmlBZ0lDQnBaaUFvSVdWMlpXNTBMblJoY21kbGRDNXRZWFJqYUdWektDY3VZbkpsWVdSamNuVnRZbk5mWDJSa0xXSjBiaWNwS1NCN1hISmNiaUFnSUNBZ0lDUW9KeTVpY21WaFpHTnlkVzFpYzE5ZlpHUXRZblJ1TFhOb2IzY25LUzV5WlcxdmRtVkRiR0Z6Y3lnblluSmxZV1JqY25WdFluTmZYMlJrTFdKMGJpMXphRzkzSnlrN1hISmNiaUFnSUNCOVhISmNiaUFnZlNsY2NseHVmVnh5WEc1Y2NseHVablZ1WTNScGIyNGdkRzluWjJ4bFEyOXNiR0Z3YzJVb0tTQjdYSEpjYmlBZ2JHVjBJSFJwYldWdmRYUTdYSEpjYmlBZ0pDZ25MbVJsYzJOZlgzUnBkR3hsTFdOdmJHeGhjSE5sTFdKMGJpY3BMbU5zYVdOcktDaGxkbVZ1ZENrZ1BUNGdlMXh5WEc0Z0lDQWdKQ2duTG1SbGMyTmZYMjF2WW1sc1pTMTBhWFJzWlNjcExuUnZaMmRzWlVOc1lYTnpLQ2RoWTNScGRtVW5LVHRjY2x4dUlDQWdJR052Ym5OMElIQmhibVZzSUQwZ0pDZ25MbVJsYzJOZlgyTnZiR3hoY0hObExXTnZiblJoYVc1bGNpY3BXekJkTzF4eVhHNGdJQ0FnYVdZZ0tIQmhibVZzTG5OMGVXeGxMbTFoZUVobGFXZG9kQ2tnZTF4eVhHNGdJQ0FnSUNCd1lXNWxiQzV6ZEhsc1pTNXRZWGhJWldsbmFIUWdQU0J1ZFd4c08xeHlYRzRnSUNBZ0lDQjBhVzFsYjNWMElEMGdjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnY0dGdVpXd3VjM1I1YkdVdVpHbHpjR3hoZVNBOUlDZHViMjVsSnp0Y2NseHVJQ0FnSUNBZ2ZTd2dOakF3S1R0Y2NseHVJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUdOc1pXRnlWR2x0Wlc5MWRDaDBhVzFsYjNWMEtUdGNjbHh1SUNBZ0lDQWdjR0Z1Wld3dWMzUjViR1V1WkdsemNHeGhlU0E5SUNkaWJHOWpheWM3WEhKY2JpQWdJQ0FnSUhCaGJtVnNMbk4wZVd4bExtMWhlRWhsYVdkb2RDQTlJSEJoYm1Wc0xuTmpjbTlzYkVobGFXZG9kQ0FySUZ3aWNIaGNJanRjY2x4dUlDQWdJSDFjY2x4dUlDQjlLVnh5WEc1OVhISmNibHh5WEc1bWRXNWpkR2x2YmlCcGJtbDBVSEp2YW1WamRGTnNhV1JsY2lncElIdGNjbHh1SUNCamIyNXpkQ0J3Y205cVpXTjBjeUE5SUNRb0p5NXdjbTlxWldOMGMxOWZjMnhwWkdWeUp5azdYSEpjYmlBZ2NISnZhbVZqZEhNdWJHVnVaM1JvSUNZbUlIQnliMnBsWTNSekxuTnNhV05yS0h0Y2NseHVJQ0FnSUdsdVptbHVhWFJsT2lCbVlXeHpaU3hjY2x4dUlDQWdJSE5zYVdSbGMxUnZVMmh2ZHpvZ015eGNjbHh1SUNBZ0lITnNhV1JsYzFSdlUyTnliMnhzT2lBeExGeHlYRzRnSUNBZ2NISmxka0Z5Y205M09pQmdQR0oxZEhSdmJpQjBlWEJsUFZ3aVluVjBkRzl1WENJZ1kyeGhjM005WENKemJHbGpheTF3Y21WMlhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRtY2dkMmxrZEdnOVhDSXlOSEI0WENJZ2FHVnBaMmgwUFZ3aU1qUndlRndpSUhacFpYZENiM2c5WENJd0lEQWdNalFnTWpSY0lpQmhjbWxoTFd4aFltVnNQVndpVTJ4cFpHVnlJSEJ5WlhZZ1luVjBkRzl1SUdsamIyNWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjRzlzZVdkdmJpQm1hV3hzUFZ3aUl6YzFOelUzTlZ3aUlIQnZhVzUwY3oxY0lqRXdJRFlnT0M0MU9TQTNMalF4SURFekxqRTNJREV5SURndU5Ua2dNVFl1TlRrZ01UQWdNVGdnTVRZZ01USmNJajQ4TDNCdmJIbG5iMjQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjM1puUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWlkWFIwYjI0K1lDeGNjbHh1SUNBZ0lHNWxlSFJCY25KdmR6b2dZRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56UFZ3aWMyeHBZMnN0Ym1WNGRGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzWm5JSGRwWkhSb1BWd2lNalJ3ZUZ3aUlHaGxhV2RvZEQxY0lqSTBjSGhjSWlCMmFXVjNRbTk0UFZ3aU1DQXdJREkwSURJMFhDSWdZWEpwWVMxc1lXSmxiRDFjSWxOc2FXUmxjaUJ1WlhoMElHSjFkSFJ2YmlCcFkyOXVYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEJ2YkhsbmIyNGdabWxzYkQxY0lpTTNOVGMxTnpWY0lpQndiMmx1ZEhNOVhDSXhNQ0EySURndU5Ua2dOeTQwTVNBeE15NHhOeUF4TWlBNExqVTVJREUyTGpVNUlERXdJREU0SURFMklERXlYQ0krUEM5d2IyeDVaMjl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM04yWno1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBtQXNYSEpjYmlBZ0lDQnlaWE53YjI1emFYWmxPaUJiWEhKY2JpQWdJQ0FnSUh0Y2NseHVJQ0FnSUNBZ0lDQmljbVZoYTNCdmFXNTBPaUE1T1RJc1hISmNiaUFnSUNBZ0lDQWdjMlYwZEdsdVozTTZJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lITnNhV1JsYzFSdlUyaHZkem9nTWl4Y2NseHVJQ0FnSUNBZ0lDQjlMRnh5WEc0Z0lDQWdJQ0I5TEZ4eVhHNGdJQ0FnSUNCN1hISmNiaUFnSUNBZ0lDQWdZbkpsWVd0d2IybHVkRG9nTnpZNExGeHlYRzRnSUNBZ0lDQWdJSE5sZEhScGJtZHpPaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQnpiR2xrWlhOVWIxTm9iM2M2SURVc1hISmNiaUFnSUNBZ0lDQWdmU3hjY2x4dUlDQWdJQ0FnZlZ4eVhHNGdJQ0FnWFZ4eVhHNGdJSDBwTzF4eVhHNTlYSEpjYmx4eVhHNW1kVzVqZEdsdmJpQnBibWwwVFc5a1pXeHpVMnhwWkdWeUtDa2dlMXh5WEc0Z0lHTnZibk4wSUcxdlpHVnNjeUE5SUNRb0p5NXRiMlJsYkhNbktUdGNjbHh1SUNCcFppQW9JVzF2WkdWc2N5NXNaVzVuZEdncElISmxkSFZ5Ymp0Y2NseHVJQ0JqYjI1emRDQnpiR2xrWlhJZ1BTQnRiMlJsYkhNdWMyeHBZMnNvZTF4eVhHNGdJQ0FnYVc1bWFXNXBkR1U2SUdaaGJITmxMRnh5WEc0Z0lDQWdjMnhwWkdWelZHOVRhRzkzT2lCallXeGpUVzlrWld4elUyeHBaR1Z6S0Nrc1hISmNiaUFnSUNCemJHbGtaWE5VYjFOamNtOXNiRG9nTVN4Y2NseHVJQ0FnSUhabGNuUnBZMkZzT2lCMGNuVmxMRnh5WEc0Z0lDQWdjSEpsZGtGeWNtOTNPaUJnUEdKMWRIUnZiaUIwZVhCbFBWd2lZblYwZEc5dVhDSWdZMnhoYzNNOVhDSnpiR2xqYXkxd2NtVjJYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkbWNnZG1sbGQwSnZlRDFjSWpBZ01DQXlOQ0F5TkZ3aUlHRnlhV0V0YkdGaVpXdzlYQ0pUYkdsa1pYSWdjSEpsZGlCaWRYUjBiMjRnYVdOdmJsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHdiMng1WjI5dUlHWnBiR3c5WENJak56VTNOVGMxWENJZ2NHOXBiblJ6UFZ3aU1UQWdOaUE0TGpVNUlEY3VOREVnTVRNdU1UY2dNVElnT0M0MU9TQXhOaTQxT1NBeE1DQXhPQ0F4TmlBeE1sd2lQand2Y0c5c2VXZHZiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwySjFkSFJ2Ymo1Z0xGeHlYRzRnSUNBZ2JtVjRkRUZ5Y205M09pQmdQR0oxZEhSdmJpQjBlWEJsUFZ3aVluVjBkRzl1WENJZ1kyeGhjM005WENKemJHbGpheTF1WlhoMFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRtY2dkbWxsZDBKdmVEMWNJakFnTUNBeU5DQXlORndpSUdGeWFXRXRiR0ZpWld3OVhDSlRiR2xrWlhJZ2JtVjRkQ0JpZFhSMGIyNGdhV052Ymx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4d2IyeDVaMjl1SUdacGJHdzlYQ0lqTnpVM05UYzFYQ0lnY0c5cGJuUnpQVndpTVRBZ05pQTRMalU1SURjdU5ERWdNVE11TVRjZ01USWdPQzQxT1NBeE5pNDFPU0F4TUNBeE9DQXhOaUF4TWx3aVBqd3ZjRzlzZVdkdmJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emRtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJKMWRIUnZiajVnTEZ4eVhHNGdJSDBwTzF4eVhHNWNjbHh1SUNBa0tIZHBibVJ2ZHlrdWNtVnphWHBsS0dSbFltOTFibU5sS0NncElEMCtJSHRjY2x4dUlDQWdJSE5zYVdSbGNpNXpiR2xqYXlnbmMyeHBZMnRUWlhSUGNIUnBiMjRuTENBbmMyeHBaR1Z6Vkc5VGFHOTNKeXdnWTJGc1kwMXZaR1ZzYzFOc2FXUmxjeWdwTENCMGNuVmxLVHRjY2x4dUlDQjlMQ0F4TlRBcEtUdGNjbHh1ZlZ4eVhHNW1kVzVqZEdsdmJpQmpZV3hqVFc5a1pXeHpVMnhwWkdWektDa2dlMXh5WEc0Z0lHTnZibk4wSUdobFlXUmxja2hsYVdkb2RDQTlJRGd3TzF4eVhHNGdJR052Ym5OMElITnNhV1JsY2tKMGJuTWdQU0EyT0R0Y2NseHVJQ0JqYjI1emRDQjBiM0JRWVdSa2FXNW5JRDBnTVRBN1hISmNiaUFnWTI5dWMzUWdjMnhwWkdWSVpXbG5hSFFnUFNCM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBOElERTJNREFnUHlBeE1EQWdPaUF4TlRBN1hISmNibHh5WEc0Z0lHTnZibk4wSUhOc2FXUmxja2hsYVdkb2RDQTlJR2hsWVdSbGNraGxhV2RvZENBcklITnNhV1JsY2tKMGJuTWdLeUIwYjNCUVlXUmthVzVuTzF4eVhHNGdJSEpsZEhWeWJpQk5ZWFJvTG1ac2IyOXlLQ2gzYVc1a2IzY3VhVzV1WlhKSVpXbG5hSFFnTFNCb1pXRmtaWEpJWldsbmFIUWdMU0J6Ykdsa1pYSkNkRzV6SUMwZ2RHOXdVR0ZrWkdsdVp5a2dMeUJ6Ykdsa1pVaGxhV2RvZENrN1hISmNibjFjY2x4dVhISmNibVoxYm1OMGFXOXVJR2x1YVhSVWIyOXNjMEowYm5Nb0tTQjdYSEpjYmlBZ2JHVjBJSE5zYVdSbGNqdGNjbHh1SUNCamIyNXpkQ0JtZFd4c2MyTnlaV1Z1SUQwZ0pDZ25MbVoxYkd4elkzSmxaVzRuS1Z4eVhHNGdJQ1FvSnk1dGIyUmxiQzB6WkY5ZlpuVnNiSE5qY21WbGJpMWlkRzRuS1M1amJHbGpheWdvS1NBOVBpQjdYSEpjYmlBZ0lDQm1kV3hzYzJOeVpXVnVMbU56Y3lnblpHbHpjR3hoZVNjc0lDZG1iR1Y0SnlsY2NseHVJQ0FnSUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZXlCY2NseHVJQ0FnSUNBZ1puVnNiSE5qY21WbGJpNWpjM01vSjI5d1lXTnBkSGtuTENBeEtUdGNjbHh1SUNBZ0lIMHNJREFwTzF4eVhHNGdJQ0FnYzJ4cFpHVnlJRDBnSkNnbkxtWjFiR3h6WTNKbFpXNWZYM05zYVdSbGNpY3BMbk5zYVdOcktIdGNjbHh1SUNBZ0lDQWdhVzVtYVc1cGRHVTZJR1poYkhObExGeHlYRzRnSUNBZ0lDQnpiR2xrWlhOVWIxTm9iM2M2SURFc1hISmNiaUFnSUNBZ0lITnNhV1JsYzFSdlUyTnliMnhzT2lBeExGeHlYRzRnSUNBZ0lDQmpaVzUwWlhKTmIyUmxPaUIwY25WbExGeHlYRzRnSUNBZ0lDQndjbVYyUVhKeWIzYzZJR0E4WW5WMGRHOXVJSFI1Y0dVOVhDSmlkWFIwYjI1Y0lpQmpiR0Z6Y3oxY0luTnNhV05yTFhCeVpYWmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1puSUhacFpYZENiM2c5WENJd0lEQWdNalFnTWpSY0lpQmhjbWxoTFd4aFltVnNQVndpVTJ4cFpHVnlJSEJ5WlhZZ1luVjBkRzl1SUdsamIyNWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh3YjJ4NVoyOXVJR1pwYkd3OVhDSWpOelUzTlRjMVhDSWdjRzlwYm5SelBWd2lNVEFnTmlBNExqVTVJRGN1TkRFZ01UTXVNVGNnTVRJZ09DNDFPU0F4Tmk0MU9TQXhNQ0F4T0NBeE5pQXhNbHdpUGp3dmNHOXNlV2R2Ymo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNOMlp6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5aWRYUjBiMjQrWUN4Y2NseHVJQ0FnSUNBZ2JtVjRkRUZ5Y205M09pQmdQR0oxZEhSdmJpQjBlWEJsUFZ3aVluVjBkRzl1WENJZ1kyeGhjM005WENKemJHbGpheTF1WlhoMFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjJaeUIyYVdWM1FtOTRQVndpTUNBd0lESTBJREkwWENJZ1lYSnBZUzFzWVdKbGJEMWNJbE5zYVdSbGNpQnVaWGgwSUdKMWRIUnZiaUJwWTI5dVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjRzlzZVdkdmJpQm1hV3hzUFZ3aUl6YzFOelUzTlZ3aUlIQnZhVzUwY3oxY0lqRXdJRFlnT0M0MU9TQTNMalF4SURFekxqRTNJREV5SURndU5Ua2dNVFl1TlRrZ01UQWdNVGdnTVRZZ01USmNJajQ4TDNCdmJIbG5iMjQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6ZG1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WW5WMGRHOXVQbUJjY2x4dUlDQWdJSDBwTzF4eVhHNGdJSDBwTzF4eVhHNGdJQ1FvSnk1bWRXeHNjMk55WldWdVgxOWpiRzl6WlMxaWRHNG5LUzVqYkdsamF5Z29LU0E5UGlCN1hISmNiaUFnSUNCbWRXeHNjMk55WldWdUxtTnpjeWduYjNCaFkybDBlU2NzSURBcFhISmNibHh5WEc0Z0lDQWdjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYSEpjYmlBZ0lDQWdJR1oxYkd4elkzSmxaVzR1WTNOektDZGthWE53YkdGNUp5d2dKMjV2Ym1VbktUdGNjbHh1SUNBZ0lDQWdjMnhwWkdWeUxuTnNhV05yS0NkMWJuTnNhV05ySnlrN1hISmNiaUFnSUNCOUxDQXpNREFwTzF4eVhHNGdJSDBwTzF4eVhHNTlYSEpjYm1aMWJtTjBhVzl1SUdsdWFYUk5aVzUxUW5SdUtDa2dlMXh5WEc0Z0lHTnZibk4wSUcxbGJuVWdQU0FrS0NjdWJXOWlhV3hsTFcxbGJuVW5LVnh5WEc0Z0lDUW9KeTVvWldGa1pYSmZYMjFsYm5VdFluUnVKeWt1WTJ4cFkyc29LQ2tnUFQ0Z2UxeHlYRzRnSUNBZ2JXVnVkUzVqYzNNb0oyUnBjM0JzWVhrbkxDQW5abXhsZUNjcFhISmNiaUFnSUNCelpYUlVhVzFsYjNWMEtDZ3BJRDArSUhzZ1hISmNiaUFnSUNBZ0lHMWxiblV1WTNOektDZHZjR0ZqYVhSNUp5d2dNU2s3WEhKY2JpQWdJQ0I5TENBd0tUdGNjbHh1SUNCOUtUdGNjbHh1WEhKY2JpQWdKQ2duTG0xdlltbHNaUzF0Wlc1MVgxOWpiRzl6WlMxaWRHNG5LUzVqYkdsamF5Z29LU0E5UGlCN1hISmNiaUFnSUNCdFpXNTFMbU56Y3lnbmIzQmhZMmwwZVNjc0lEQXBYSEpjYmx4eVhHNGdJQ0FnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3WEhKY2JpQWdJQ0FnSUcxbGJuVXVZM056S0Nka2FYTndiR0Y1Snl3Z0oyNXZibVVuS1R0Y2NseHVJQ0FnSUgwc0lETXdNQ2s3WEhKY2JpQWdmU2s3WEhKY2JuMGlYWDA9In0=
