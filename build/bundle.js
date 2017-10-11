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
  initMenuBtn();
  initToolsBtns();
  initScrollBtns();
  setModelsHeight();
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
  $('.models__scroll-down').click(function () {
    var container = $('.models__container');
    var itemHeight = window.innerWidth < 1600 ? 100 : 150;
    var top = container.scrollTop();
    container.animate({
      scrollTop: top - top % itemHeight + itemHeight
    }, 300);
  });
  $('.models__scroll-up').click(function () {
    var itemHeight = window.innerWidth < 1600 ? 100 : 150;
    var container = $('.models__container');
    var top = container.scrollTop();
    container.animate({
      scrollTop: top - (top % itemHeight || itemHeight)
    }, 300);
  });
}

function setModelsHeight() {
  var itemHeight = window.innerWidth < 1600 ? 100 : 150;
  var modelsHeight = window.innerHeight - 186;
  $('.models__container').height(modelsHeight - modelsHeight % itemHeight);
}

},{"../node_modules/lodash.debounce/index":1}]},{},[2])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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ckIsRUFBZ0MsTUFBaEM7QUFDRDs7QUFFRCxlQUFXLFlBQU07QUFDZixXQUFLLEdBQUwsQ0FBUyxTQUFULEVBQW9CLE1BQXBCO0FBQ0QsS0FGRCxFQUVHLEdBRkg7QUFHRCxHQVpEO0FBYUQ7O0FBRUQsU0FBUyxjQUFULEdBQTBCO0FBQ3hCLElBQUUsc0JBQUYsRUFBMEIsS0FBMUIsQ0FBZ0MsWUFBTTtBQUNwQyxRQUFNLFlBQVksRUFBRSxvQkFBRixDQUFsQjtBQUNBLFFBQU0sYUFBYSxPQUFPLFVBQVAsR0FBb0IsSUFBcEIsR0FBMkIsR0FBM0IsR0FBaUMsR0FBcEQ7QUFDQSxRQUFNLE1BQU0sVUFBVSxTQUFWLEVBQVo7QUFDQSxjQUFVLE9BQVYsQ0FBa0I7QUFDaEIsaUJBQVcsTUFBTyxNQUFNLFVBQWIsR0FBMkI7QUFEdEIsS0FBbEIsRUFFRyxHQUZIO0FBR0QsR0FQRDtBQVFBLElBQUUsb0JBQUYsRUFBd0IsS0FBeEIsQ0FBOEIsWUFBTTtBQUNsQyxRQUFNLGFBQWEsT0FBTyxVQUFQLEdBQW9CLElBQXBCLEdBQTJCLEdBQTNCLEdBQWlDLEdBQXBEO0FBQ0EsUUFBTSxZQUFZLEVBQUUsb0JBQUYsQ0FBbEI7QUFDQSxRQUFNLE1BQU0sVUFBVSxTQUFWLEVBQVo7QUFDQSxjQUFVLE9BQVYsQ0FBa0I7QUFDaEIsaUJBQVcsT0FBTyxNQUFNLFVBQU4sSUFBb0IsVUFBM0I7QUFESyxLQUFsQixFQUVHLEdBRkg7QUFHRCxHQVBEO0FBUUQ7O0FBRUQsU0FBUyxlQUFULEdBQTJCO0FBQ3pCLE1BQU0sYUFBYSxPQUFPLFVBQVAsR0FBb0IsSUFBcEIsR0FBMkIsR0FBM0IsR0FBaUMsR0FBcEQ7QUFDQSxNQUFNLGVBQWUsT0FBTyxXQUFQLEdBQXFCLEdBQTFDO0FBQ0EsSUFBRSxvQkFBRixFQUF3QixNQUF4QixDQUErQixlQUFnQixlQUFlLFVBQTlEO0FBQ0QiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCJpbXBvcnQgZGVib3VuY2UgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC5kZWJvdW5jZS9pbmRleCc7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgQU9TLmluaXQoe1xyXG4gICAgZGlzYWJsZTogJ21vYmlsZScsXHJcbiAgICBlYXNpbmc6ICdlYXNlLWluLW91dCcsXHJcbiAgICBkZWxheTogMTAwLFxyXG4gICAgZHVyYXRpb246IDEwMDAsXHJcbiAgICBvZmZzZXQ6IDEwMCxcclxuICAgIG9uY2U6IHRydWVcclxuICB9KTtcclxuICBzY3JvbGxCdG5Jbml0KCk7XHJcbiAgZHJvcERvd25Jbml0KCk7XHJcbiAgdG9nZ2xlQ29sbGFwc2UoKTtcclxuICBpbml0UHJvamVjdFNsaWRlcigpO1xyXG4gIGluaXRNZW51QnRuKCk7XHJcbiAgaW5pdFRvb2xzQnRucygpO1xyXG4gIGluaXRTY3JvbGxCdG5zKCk7XHJcbiAgc2V0TW9kZWxzSGVpZ2h0KCk7XHJcbiAgJCh3aW5kb3cpLnJlc2l6ZShkZWJvdW5jZShzZXRNb2RlbHNIZWlnaHQsIDE1MCkpO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHNjcm9sbEJ0bkluaXQoKSB7XHJcbiAgJCgnLmZvb3Rlcl9fdXAtYnRuJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG4gICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICBzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuICAgICAgfSwgMTAwMCwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgJHRhcmdldCA9ICQodGFyZ2V0KTtcclxuICAgICAgICAkdGFyZ2V0LmZvY3VzKCk7XHJcbiAgICAgICAgaWYgKCR0YXJnZXQuaXMoXCI6Zm9jdXNcIikpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJHRhcmdldC5hdHRyKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgICAgICAgJHRhcmdldC5mb2N1cygpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcm9wRG93bkluaXQoKSB7XHJcbiAgJCgnLmJyZWFkY3J1bWJzX19kZC1idG4nKS5jbGljaygoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IGhhc0NsYXNzID0gJChldmVudC50YXJnZXQucGFyZW50RWxlbWVudCkuaGFzQ2xhc3MoJ2JyZWFkY3J1bWJzX19kZC1idG4tc2hvdycpO1xyXG4gICAgY29uc3QgZWxlbWVudHNDb3VudCA9ICQoJy5icmVhZGNydW1ic19fZGQtYnRuLXNob3cnKS5sZW5ndGg7XHJcbiAgICBpZiAoaGFzQ2xhc3MgJiYgZWxlbWVudHNDb3VudCkge1xyXG4gICAgICAkKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50KS5yZW1vdmVDbGFzcygnYnJlYWRjcnVtYnNfX2RkLWJ0bi1zaG93Jyk7XHJcbiAgICB9IGVsc2UgaWYgKCFoYXNDbGFzcyAmJiBlbGVtZW50c0NvdW50KSB7XHJcbiAgICAgICQoJy5icmVhZGNydW1ic19fZGQtYnRuLXNob3cnKS5yZW1vdmVDbGFzcygnYnJlYWRjcnVtYnNfX2RkLWJ0bi1zaG93Jyk7XHJcbiAgICAgICQoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQpLmFkZENsYXNzKCdicmVhZGNydW1ic19fZGQtYnRuLXNob3cnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQpLmFkZENsYXNzKCdicmVhZGNydW1ic19fZGQtYnRuLXNob3cnKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLmNsaWNrKChldmVudCkgPT4ge1xyXG4gICAgaWYgKCFldmVudC50YXJnZXQubWF0Y2hlcygnLmJyZWFkY3J1bWJzX19kZC1idG4nKSkge1xyXG4gICAgICAkKCcuYnJlYWRjcnVtYnNfX2RkLWJ0bi1zaG93JykucmVtb3ZlQ2xhc3MoJ2JyZWFkY3J1bWJzX19kZC1idG4tc2hvdycpO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvZ2dsZUNvbGxhcHNlKCkge1xyXG4gIGxldCB0aW1lb3V0O1xyXG4gICQoJy5kZXNjX190aXRsZS1jb2xsYXBzZS1idG4nKS5jbGljaygoZXZlbnQpID0+IHtcclxuICAgICQoJy5kZXNjX19tb2JpbGUtdGl0bGUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBjb25zdCBwYW5lbCA9ICQoJy5kZXNjX19jb2xsYXBzZS1jb250YWluZXInKVswXTtcclxuICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHBhbmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgIH0sIDYwMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIHBhbmVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyBcInB4XCI7XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdFByb2plY3RTbGlkZXIoKSB7XHJcbiAgY29uc3QgcHJvamVjdHMgPSAkKCcucHJvamVjdHNfX3NsaWRlcicpO1xyXG4gIHByb2plY3RzLmxlbmd0aCAmJiBwcm9qZWN0cy5zbGljayh7XHJcbiAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgIHByZXZBcnJvdzogYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjRweFwiIGhlaWdodD1cIjI0cHhcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgYXJpYS1sYWJlbD1cIlNsaWRlciBwcmV2IGJ1dHRvbiBpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gZmlsbD1cIiM3NTc1NzVcIiBwb2ludHM9XCIxMCA2IDguNTkgNy40MSAxMy4xNyAxMiA4LjU5IDE2LjU5IDEwIDE4IDE2IDEyXCI+PC9wb2x5Z29uPlxyXG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPmAsXHJcbiAgICBuZXh0QXJyb3c6IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLW5leHRcIj5cclxuICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtbGFiZWw9XCJTbGlkZXIgbmV4dCBidXR0b24gaWNvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGZpbGw9XCIjNzU3NTc1XCIgcG9pbnRzPVwiMTAgNiA4LjU5IDcuNDEgMTMuMTcgMTIgOC41OSAxNi41OSAxMCAxOCAxNiAxMlwiPjwvcG9seWdvbj5cclxuICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5gLFxyXG4gICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgYnJlYWtwb2ludDogOTkyLFxyXG4gICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgc2xpZGVzVG9TaG93OiA1LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdE1vZGVsc1NsaWRlcigpIHtcclxuICBjb25zdCBtb2RlbHMgPSAkKCcubW9kZWxzJyk7XHJcbiAgaWYgKCFtb2RlbHMubGVuZ3RoKSByZXR1cm47XHJcbiAgY29uc3Qgc2xpZGVyID0gbW9kZWxzLnNsaWNrKHtcclxuICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgIHNsaWRlc1RvU2hvdzogY2FsY01vZGVsc1NsaWRlcygpLFxyXG4gICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgIHByZXZBcnJvdzogYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stcHJldlwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBhcmlhLWxhYmVsPVwiU2xpZGVyIHByZXYgYnV0dG9uIGljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBmaWxsPVwiIzc1NzU3NVwiIHBvaW50cz1cIjEwIDYgOC41OSA3LjQxIDEzLjE3IDEyIDguNTkgMTYuNTkgMTAgMTggMTYgMTJcIj48L3BvbHlnb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+YCxcclxuICAgIG5leHRBcnJvdzogYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic2xpY2stbmV4dFwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBhcmlhLWxhYmVsPVwiU2xpZGVyIG5leHQgYnV0dG9uIGljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBmaWxsPVwiIzc1NzU3NVwiIHBvaW50cz1cIjEwIDYgOC41OSA3LjQxIDEzLjE3IDEyIDguNTkgMTYuNTkgMTAgMTggMTYgMTJcIj48L3BvbHlnb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+YCxcclxuICB9KTtcclxuXHJcbiAgJCh3aW5kb3cpLnJlc2l6ZShkZWJvdW5jZSgoKSA9PiB7XHJcbiAgICBzbGlkZXIuc2xpY2soJ3NsaWNrU2V0T3B0aW9uJywgJ3NsaWRlc1RvU2hvdycsIGNhbGNNb2RlbHNTbGlkZXMoKSwgdHJ1ZSk7XHJcbiAgfSwgMTUwKSk7XHJcbn1cclxuZnVuY3Rpb24gY2FsY01vZGVsc1NsaWRlcygpIHtcclxuICBjb25zdCBoZWFkZXJIZWlnaHQgPSA4MDtcclxuICBjb25zdCBzbGlkZXJCdG5zID0gNjg7XHJcbiAgY29uc3QgdG9wUGFkZGluZyA9IDEwO1xyXG4gIGNvbnN0IHNsaWRlSGVpZ2h0ID0gd2luZG93LmlubmVyV2lkdGggPCAxNjAwID8gMTAwIDogMTUwO1xyXG5cclxuICBjb25zdCBzbGlkZXJIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBzbGlkZXJCdG5zICsgdG9wUGFkZGluZztcclxuICByZXR1cm4gTWF0aC5mbG9vcigod2luZG93LmlubmVySGVpZ2h0IC0gaGVhZGVySGVpZ2h0IC0gc2xpZGVyQnRucyAtIHRvcFBhZGRpbmcpIC8gc2xpZGVIZWlnaHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0VG9vbHNCdG5zKCkge1xyXG4gIGxldCBzbGlkZXI7XHJcbiAgY29uc3QgZnVsbHNjcmVlbiA9ICQoJy5mdWxsc2NyZWVuJylcclxuICAkKCcubW9kZWwtM2RfX2Z1bGxzY3JlZW4tYnRuJykuY2xpY2soKCkgPT4ge1xyXG4gICAgZnVsbHNjcmVlbi5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgXHJcbiAgICAgIGZ1bGxzY3JlZW4uY3NzKCdvcGFjaXR5JywgMSk7XHJcbiAgICB9LCAwKTtcclxuICAgICQoJy5nYWxsZXJ5LWNvbnRhaW5lcicpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcblxyXG4gICAgc2xpZGVyID0gJCgnLmZ1bGxzY3JlZW5fX3NsaWRlcicpLnNsaWNrKHtcclxuICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICBjZW50ZXJNb2RlOiB0cnVlLFxyXG4gICAgICBwcmV2QXJyb3c6IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInNsaWNrLXByZXZcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBhcmlhLWxhYmVsPVwiU2xpZGVyIHByZXYgYnV0dG9uIGljb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGZpbGw9XCIjNzU3NTc1XCIgcG9pbnRzPVwiMTAgNiA4LjU5IDcuNDEgMTMuMTcgMTIgOC41OSAxNi41OSAxMCAxOCAxNiAxMlwiPjwvcG9seWdvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+YCxcclxuICAgICAgbmV4dEFycm93OiBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzbGljay1uZXh0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgYXJpYS1sYWJlbD1cIlNsaWRlciBuZXh0IGJ1dHRvbiBpY29uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBmaWxsPVwiIzc1NzU3NVwiIHBvaW50cz1cIjEwIDYgOC41OSA3LjQxIDEzLjE3IDEyIDguNTkgMTYuNTkgMTAgMTggMTYgMTJcIj48L3BvbHlnb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPmBcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gICQoJy5mdWxsc2NyZWVuX19jbG9zZS1idG4nKS5jbGljaygoKSA9PiB7XHJcbiAgICBmdWxsc2NyZWVuLmNzcygnb3BhY2l0eScsIDApXHJcbiAgICAkKCcuZ2FsbGVyeS1jb250YWluZXInKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xyXG4gICAgXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgZnVsbHNjcmVlbi5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgICBzbGlkZXIuc2xpY2soJ3Vuc2xpY2snKTtcclxuICAgIH0sIDMwMCk7XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gaW5pdE1lbnVCdG4oKSB7XHJcbiAgY29uc3QgbWVudSA9ICQoJy5tb2JpbGUtbWVudScpO1xyXG4gIGxldCB3YXNGdWxsc2NyZWVuID0gZmFsc2U7XHJcbiAgJCgnLmhlYWRlcl9fbWVudS1idG4nKS5jbGljaygoKSA9PiB7XHJcbiAgICBtZW51LmNzcygnZGlzcGxheScsICdmbGV4JylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4geyBcclxuICAgICAgbWVudS5jc3MoJ29wYWNpdHknLCAxKTtcclxuICAgIH0sIDApO1xyXG4gICAgJCgnLmdhbGxlcnktY29udGFpbmVyJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgICQoJy5oZWFkZXInKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG5cclxuICAgIGlmICgkKCcuZnVsbHNjcmVlbicpLmNzcygnZGlzcGxheScpID09PSAnZmxleCcpIHtcclxuICAgICAgd2FzRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICAgICQoJy5mdWxsc2NyZWVuJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdhc0Z1bGxzY3JlZW4gPSBmYWxzZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgJCgnLm1vYmlsZS1tZW51X19jbG9zZS1idG4nKS5jbGljaygoKSA9PiB7XHJcbiAgICBtZW51LmNzcygnb3BhY2l0eScsIDApO1xyXG4gICAgJCgnLmhlYWRlcicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgJCgnLmdhbGxlcnktY29udGFpbmVyJykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKTtcclxuXHJcbiAgICBpZiAod2FzRnVsbHNjcmVlbikge1xyXG4gICAgICAkKCcuZnVsbHNjcmVlbicpLmNzcygnZGlzcGxheScsICdmbGV4Jyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBtZW51LmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICB9LCAzMDApO1xyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0U2Nyb2xsQnRucygpIHtcclxuICAkKCcubW9kZWxzX19zY3JvbGwtZG93bicpLmNsaWNrKCgpID0+IHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9ICQoJy5tb2RlbHNfX2NvbnRhaW5lcicpO1xyXG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoIDwgMTYwMCA/IDEwMCA6IDE1MDtcclxuICAgIGNvbnN0IHRvcCA9IGNvbnRhaW5lci5zY3JvbGxUb3AoKTtcclxuICAgIGNvbnRhaW5lci5hbmltYXRlKHtcclxuICAgICAgc2Nyb2xsVG9wOiB0b3AgLSAodG9wICUgaXRlbUhlaWdodCkgKyBpdGVtSGVpZ2h0XHJcbiAgICB9LCAzMDApO1xyXG4gIH0pO1xyXG4gICQoJy5tb2RlbHNfX3Njcm9sbC11cCcpLmNsaWNrKCgpID0+IHtcclxuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDE2MDAgPyAxMDAgOiAxNTA7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSAkKCcubW9kZWxzX19jb250YWluZXInKTtcclxuICAgIGNvbnN0IHRvcCA9IGNvbnRhaW5lci5zY3JvbGxUb3AoKTtcclxuICAgIGNvbnRhaW5lci5hbmltYXRlKHtcclxuICAgICAgc2Nyb2xsVG9wOiB0b3AgLSAodG9wICUgaXRlbUhlaWdodCB8fCBpdGVtSGVpZ2h0KVxyXG4gICAgfSwgMzAwKTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0TW9kZWxzSGVpZ2h0KCkge1xyXG4gIGNvbnN0IGl0ZW1IZWlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDE2MDAgPyAxMDAgOiAxNTA7XHJcbiAgY29uc3QgbW9kZWxzSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMTg2O1xyXG4gICQoJy5tb2RlbHNfX2NvbnRhaW5lcicpLmhlaWdodChtb2RlbHNIZWlnaHQgLSAobW9kZWxzSGVpZ2h0ICUgaXRlbUhlaWdodCkpO1xyXG59Il0sInByZUV4aXN0aW5nQ29tbWVudCI6Ii8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlpY205M2MyVnlMWEJoWTJzdlgzQnlaV3gxWkdVdWFuTWlMQ0p1YjJSbFgyMXZaSFZzWlhNdmJHOWtZWE5vTG1SbFltOTFibU5sTDJsdVpHVjRMbXB6SWl3aWMzSmpYRnhwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVTkJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096czdPenRCUTNwWVFUczdPenM3TzBGQlJVRXNSVUZCUlN4UlFVRkdMRVZCUVZrc1MwRkJXaXhEUVVGclFpeFpRVUZOTzBGQlEzUkNMRTFCUVVrc1NVRkJTaXhEUVVGVE8wRkJRMUFzWVVGQlV5eFJRVVJHTzBGQlJWQXNXVUZCVVN4aFFVWkVPMEZCUjFBc1YwRkJUeXhIUVVoQk8wRkJTVkFzWTBGQlZTeEpRVXBJTzBGQlMxQXNXVUZCVVN4SFFVeEVPMEZCVFZBc1ZVRkJUVHRCUVU1RExFZEJRVlE3UVVGUlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzU1VGQlJTeE5RVUZHTEVWQlFWVXNUVUZCVml4RFFVRnBRaXh4UWtGQlV5eGxRVUZVTEVWQlFUQkNMRWRCUVRGQ0xFTkJRV3BDTzBGQlEwUXNRMEZzUWtRN08wRkJiMEpCTEZOQlFWTXNZVUZCVkN4SFFVRjVRanRCUVVOMlFpeEpRVUZGTEdsQ1FVRkdMRVZCUVhGQ0xFdEJRWEpDTEVOQlFUSkNMRlZCUVZVc1MwRkJWaXhGUVVGcFFqdEJRVU14UXl4UlFVRkpMRk5CUVZNc1JVRkJSU3hMUVVGTExFbEJRVkFzUTBGQllqdEJRVU5CTEZGQlFVa3NUMEZCVHl4TlFVRllMRVZCUVcxQ08wRkJRMnBDTEZsQlFVMHNZMEZCVGpzN1FVRkZRU3hSUVVGRkxGbEJRVVlzUlVGQlowSXNUMEZCYUVJc1EwRkJkMEk3UVVGRGRFSXNiVUpCUVZjc1QwRkJUeXhOUVVGUUxFZEJRV2RDTzBGQlJFd3NUMEZCZUVJc1JVRkZSeXhKUVVaSUxFVkJSVk1zV1VGQldUczdRVUZGYmtJc1dVRkJTU3hWUVVGVkxFVkJRVVVzVFVGQlJpeERRVUZrTzBGQlEwRXNaMEpCUVZFc1MwRkJVanRCUVVOQkxGbEJRVWtzVVVGQlVTeEZRVUZTTEVOQlFWY3NVVUZCV0N4RFFVRktMRVZCUVRCQ08wRkJRM2hDTEdsQ1FVRlBMRXRCUVZBN1FVRkRSQ3hUUVVaRUxFMUJSVTg3UVVGRFRDeHJRa0ZCVVN4SlFVRlNMRU5CUVdFc1ZVRkJZaXhGUVVGNVFpeEpRVUY2UWp0QlFVTkJMR3RDUVVGUkxFdEJRVkk3UVVGRFJEdEJRVU5HTEU5QldrUTdRVUZoUkR0QlFVTkdMRWRCYmtKRU8wRkJiMEpFT3p0QlFVVkVMRk5CUVZNc1dVRkJWQ3hIUVVGM1FqdEJRVU4wUWl4SlFVRkZMSE5DUVVGR0xFVkJRVEJDTEV0QlFURkNMRU5CUVdkRExGVkJRVU1zUzBGQlJDeEZRVUZYTzBGQlEzcERMRkZCUVUwc1YwRkJWeXhGUVVGRkxFMUJRVTBzVFVGQlRpeERRVUZoTEdGQlFXWXNSVUZCT0VJc1VVRkJPVUlzUTBGQmRVTXNNRUpCUVhaRExFTkJRV3BDTzBGQlEwRXNVVUZCVFN4blFrRkJaMElzUlVGQlJTd3lRa0ZCUml4RlFVRXJRaXhOUVVGeVJEdEJRVU5CTEZGQlFVa3NXVUZCV1N4aFFVRm9RaXhGUVVFclFqdEJRVU0zUWl4UlFVRkZMRTFCUVUwc1RVRkJUaXhEUVVGaExHRkJRV1lzUlVGQk9FSXNWMEZCT1VJc1EwRkJNRU1zTUVKQlFURkRPMEZCUTBRc1MwRkdSQ3hOUVVWUExFbEJRVWtzUTBGQlF5eFJRVUZFTEVsQlFXRXNZVUZCYWtJc1JVRkJaME03UVVGRGNrTXNVVUZCUlN3eVFrRkJSaXhGUVVFclFpeFhRVUV2UWl4RFFVRXlReXd3UWtGQk0wTTdRVUZEUVN4UlFVRkZMRTFCUVUwc1RVRkJUaXhEUVVGaExHRkJRV1lzUlVGQk9FSXNVVUZCT1VJc1EwRkJkVU1zTUVKQlFYWkRPMEZCUTBRc1MwRklUU3hOUVVkQk8wRkJRMHdzVVVGQlJTeE5RVUZOTEUxQlFVNHNRMEZCWVN4aFFVRm1MRVZCUVRoQ0xGRkJRVGxDTEVOQlFYVkRMREJDUVVGMlF6dEJRVU5FTzBGQlEwWXNSMEZZUkRzN1FVRmhRU3hKUVVGRkxFMUJRVVlzUlVGQlZTeExRVUZXTEVOQlFXZENMRlZCUVVNc1MwRkJSQ3hGUVVGWE8wRkJRM3BDTEZGQlFVa3NRMEZCUXl4TlFVRk5MRTFCUVU0c1EwRkJZU3hQUVVGaUxFTkJRWEZDTEhOQ1FVRnlRaXhEUVVGTUxFVkJRVzFFTzBGQlEycEVMRkZCUVVVc01rSkJRVVlzUlVGQkswSXNWMEZCTDBJc1EwRkJNa01zTUVKQlFUTkRPMEZCUTBRN1FVRkRSaXhIUVVwRU8wRkJTMFE3TzBGQlJVUXNVMEZCVXl4alFVRlVMRWRCUVRCQ08wRkJRM2hDTEUxQlFVa3NaMEpCUVVvN1FVRkRRU3hKUVVGRkxESkNRVUZHTEVWQlFTdENMRXRCUVM5Q0xFTkJRWEZETEZWQlFVTXNTMEZCUkN4RlFVRlhPMEZCUXpsRExFMUJRVVVzY1VKQlFVWXNSVUZCZVVJc1YwRkJla0lzUTBGQmNVTXNVVUZCY2tNN1FVRkRRU3hSUVVGTkxGRkJRVkVzUlVGQlJTd3lRa0ZCUml4RlFVRXJRaXhEUVVFdlFpeERRVUZrTzBGQlEwRXNVVUZCU1N4TlFVRk5MRXRCUVU0c1EwRkJXU3hUUVVGb1FpeEZRVUV5UWp0QlFVTjZRaXhaUVVGTkxFdEJRVTRzUTBGQldTeFRRVUZhTEVkQlFYZENMRWxCUVhoQ08wRkJRMEVzWjBKQlFWVXNWMEZCVnl4WlFVRk5PMEZCUTNwQ0xHTkJRVTBzUzBGQlRpeERRVUZaTEU5QlFWb3NSMEZCYzBJc1RVRkJkRUk3UVVGRFJDeFBRVVpUTEVWQlJWQXNSMEZHVHl4RFFVRldPMEZCUjBRc1MwRk1SQ3hOUVV0UE8wRkJRMHdzYlVKQlFXRXNUMEZCWWp0QlFVTkJMRmxCUVUwc1MwRkJUaXhEUVVGWkxFOUJRVm9zUjBGQmMwSXNUMEZCZEVJN1FVRkRRU3haUVVGTkxFdEJRVTRzUTBGQldTeFRRVUZhTEVkQlFYZENMRTFCUVUwc1dVRkJUaXhIUVVGeFFpeEpRVUUzUXp0QlFVTkVPMEZCUTBZc1IwRmlSRHRCUVdORU96dEJRVVZFTEZOQlFWTXNhVUpCUVZRc1IwRkJOa0k3UVVGRE0wSXNUVUZCVFN4WFFVRlhMRVZCUVVVc2JVSkJRVVlzUTBGQmFrSTdRVUZEUVN4WFFVRlRMRTFCUVZRc1NVRkJiVUlzVTBGQlV5eExRVUZVTEVOQlFXVTdRVUZEYUVNc1kwRkJWU3hMUVVSelFqdEJRVVZvUXl4clFrRkJZeXhEUVVaclFqdEJRVWRvUXl4dlFrRkJaMElzUTBGSVowSTdRVUZKYUVNc05GVkJTbWRETzBGQlUyaERMRFJWUVZSblF6dEJRV05vUXl4blFrRkJXU3hEUVVOV08wRkJRMFVzYTBKQlFWa3NSMEZFWkR0QlFVVkZMR2RDUVVGVk8wRkJRMUlzYzBKQlFXTTdRVUZFVGp0QlFVWmFMRXRCUkZVc1JVRlBWanRCUVVORkxHdENRVUZaTEVkQlJHUTdRVUZGUlN4blFrRkJWVHRCUVVOU0xITkNRVUZqTzBGQlJFNDdRVUZHV2l4TFFWQlZPMEZCWkc5Q0xFZEJRV1lzUTBGQmJrSTdRVUUyUWtRN08wRkJSVVFzVTBGQlV5eG5Ra0ZCVkN4SFFVRTBRanRCUVVNeFFpeE5RVUZOTEZOQlFWTXNSVUZCUlN4VFFVRkdMRU5CUVdZN1FVRkRRU3hOUVVGSkxFTkJRVU1zVDBGQlR5eE5RVUZhTEVWQlFXOUNPMEZCUTNCQ0xFMUJRVTBzVTBGQlV5eFBRVUZQTEV0QlFWQXNRMEZCWVR0QlFVTXhRaXhqUVVGVkxFdEJSR2RDTzBGQlJURkNMR3RDUVVGakxHdENRVVpaTzBGQlJ6RkNMRzlDUVVGblFpeERRVWhWTzBGQlNURkNMR05CUVZVc1NVRktaMEk3UVVGTE1VSXNhVlJCVERCQ08wRkJWVEZDTzBGQlZqQkNMRWRCUVdJc1EwRkJaanM3UVVGcFFrRXNTVUZCUlN4TlFVRkdMRVZCUVZVc1RVRkJWaXhEUVVGcFFpeHhRa0ZCVXl4WlFVRk5PMEZCUXpsQ0xGZEJRVThzUzBGQlVDeERRVUZoTEdkQ1FVRmlMRVZCUVN0Q0xHTkJRUzlDTEVWQlFTdERMR3RDUVVFdlF5eEZRVUZ0UlN4SlFVRnVSVHRCUVVORUxFZEJSbWRDTEVWQlJXUXNSMEZHWXl4RFFVRnFRanRCUVVkRU8wRkJRMFFzVTBGQlV5eG5Ra0ZCVkN4SFFVRTBRanRCUVVNeFFpeE5RVUZOTEdWQlFXVXNSVUZCY2tJN1FVRkRRU3hOUVVGTkxHRkJRV0VzUlVGQmJrSTdRVUZEUVN4TlFVRk5MR0ZCUVdFc1JVRkJia0k3UVVGRFFTeE5RVUZOTEdOQlFXTXNUMEZCVHl4VlFVRlFMRWRCUVc5Q0xFbEJRWEJDTEVkQlFUSkNMRWRCUVROQ0xFZEJRV2xETEVkQlFYSkVPenRCUVVWQkxFMUJRVTBzWlVGQlpTeGxRVUZsTEZWQlFXWXNSMEZCTkVJc1ZVRkJha1E3UVVGRFFTeFRRVUZQTEV0QlFVc3NTMEZCVEN4RFFVRlhMRU5CUVVNc1QwRkJUeXhYUVVGUUxFZEJRWEZDTEZsQlFYSkNMRWRCUVc5RExGVkJRWEJETEVkQlFXbEVMRlZCUVd4RUxFbEJRV2RGTEZkQlFUTkZMRU5CUVZBN1FVRkRSRHM3UVVGRlJDeFRRVUZUTEdGQlFWUXNSMEZCZVVJN1FVRkRka0lzVFVGQlNTeGxRVUZLTzBGQlEwRXNUVUZCVFN4aFFVRmhMRVZCUVVVc1lVRkJSaXhEUVVGdVFqdEJRVU5CTEVsQlFVVXNNa0pCUVVZc1JVRkJLMElzUzBGQkwwSXNRMEZCY1VNc1dVRkJUVHRCUVVONlF5eGxRVUZYTEVkQlFWZ3NRMEZCWlN4VFFVRm1MRVZCUVRCQ0xFMUJRVEZDTzBGQlEwRXNaVUZCVnl4WlFVRk5PMEZCUTJZc2FVSkJRVmNzUjBGQldDeERRVUZsTEZOQlFXWXNSVUZCTUVJc1EwRkJNVUk3UVVGRFJDeExRVVpFTEVWQlJVY3NRMEZHU0R0QlFVZEJMRTFCUVVVc2IwSkJRVVlzUlVGQmQwSXNSMEZCZUVJc1EwRkJORUlzVTBGQk5VSXNSVUZCZFVNc1RVRkJka003TzBGQlJVRXNZVUZCVXl4RlFVRkZMSEZDUVVGR0xFVkJRWGxDTEV0QlFYcENMRU5CUVN0Q08wRkJRM1JETEdkQ1FVRlZMRXRCUkRSQ08wRkJSWFJETEc5Q1FVRmpMRU5CUm5kQ08wRkJSM1JETEhOQ1FVRm5RaXhEUVVoelFqdEJRVWwwUXl4clFrRkJXU3hKUVVvd1FqdEJRVXQwUXl3eVZFRk1jME03UVVGVmRFTTdRVUZXYzBNc1MwRkJMMElzUTBGQlZEdEJRV2RDUkN4SFFYWkNSRHRCUVhkQ1FTeEpRVUZGTEhkQ1FVRkdMRVZCUVRSQ0xFdEJRVFZDTEVOQlFXdERMRmxCUVUwN1FVRkRkRU1zWlVGQlZ5eEhRVUZZTEVOQlFXVXNVMEZCWml4RlFVRXdRaXhEUVVFeFFqdEJRVU5CTEUxQlFVVXNiMEpCUVVZc1JVRkJkMElzUjBGQmVFSXNRMEZCTkVJc1UwRkJOVUlzUlVGQmRVTXNUVUZCZGtNN08wRkJSVUVzWlVGQlZ5eFpRVUZOTzBGQlEyWXNhVUpCUVZjc1IwRkJXQ3hEUVVGbExGTkJRV1lzUlVGQk1FSXNUVUZCTVVJN1FVRkRRU3hoUVVGUExFdEJRVkFzUTBGQllTeFRRVUZpTzBGQlEwUXNTMEZJUkN4RlFVZEhMRWRCU0VnN1FVRkpSQ3hIUVZKRU8wRkJVMFE3UVVGRFJDeFRRVUZUTEZkQlFWUXNSMEZCZFVJN1FVRkRja0lzVFVGQlRTeFBRVUZQTEVWQlFVVXNZMEZCUml4RFFVRmlPMEZCUTBFc1RVRkJTU3huUWtGQlowSXNTMEZCY0VJN1FVRkRRU3hKUVVGRkxHMUNRVUZHTEVWQlFYVkNMRXRCUVhaQ0xFTkJRVFpDTEZsQlFVMDdRVUZEYWtNc1UwRkJTeXhIUVVGTUxFTkJRVk1zVTBGQlZDeEZRVUZ2UWl4TlFVRndRanRCUVVOQkxHVkJRVmNzV1VGQlRUdEJRVU5tTEZkQlFVc3NSMEZCVEN4RFFVRlRMRk5CUVZRc1JVRkJiMElzUTBGQmNFSTdRVUZEUkN4TFFVWkVMRVZCUlVjc1EwRkdTRHRCUVVkQkxFMUJRVVVzYjBKQlFVWXNSVUZCZDBJc1IwRkJlRUlzUTBGQk5FSXNVMEZCTlVJc1JVRkJkVU1zVFVGQmRrTTdRVUZEUVN4TlFVRkZMRk5CUVVZc1JVRkJZU3hIUVVGaUxFTkJRV2xDTEZOQlFXcENMRVZCUVRSQ0xFMUJRVFZDT3p0QlFVVkJMRkZCUVVrc1JVRkJSU3hoUVVGR0xFVkJRV2xDTEVkQlFXcENMRU5CUVhGQ0xGTkJRWEpDTEUxQlFXOURMRTFCUVhoRExFVkJRV2RFTzBGQlF6bERMSE5DUVVGblFpeEpRVUZvUWp0QlFVTkJMRkZCUVVVc1lVRkJSaXhGUVVGcFFpeEhRVUZxUWl4RFFVRnhRaXhUUVVGeVFpeEZRVUZuUXl4TlFVRm9RenRCUVVORUxFdEJTRVFzVFVGSFR6dEJRVU5NTEhOQ1FVRm5RaXhMUVVGb1FqdEJRVU5FTzBGQlEwWXNSMEZrUkRzN1FVRm5Ra0VzU1VGQlJTeDVRa0ZCUml4RlFVRTJRaXhMUVVFM1FpeERRVUZ0UXl4WlFVRk5PMEZCUTNaRExGTkJRVXNzUjBGQlRDeERRVUZUTEZOQlFWUXNSVUZCYjBJc1EwRkJjRUk3UVVGRFFTeE5RVUZGTEZOQlFVWXNSVUZCWVN4SFFVRmlMRU5CUVdsQ0xGTkJRV3BDTEVWQlFUUkNMRTlCUVRWQ08wRkJRMEVzVFVGQlJTeHZRa0ZCUml4RlFVRjNRaXhIUVVGNFFpeERRVUUwUWl4VFFVRTFRaXhGUVVGMVF5eE5RVUYyUXpzN1FVRkZRU3hSUVVGSkxHRkJRVW9zUlVGQmJVSTdRVUZEYWtJc1VVRkJSU3hoUVVGR0xFVkJRV2xDTEVkQlFXcENMRU5CUVhGQ0xGTkJRWEpDTEVWQlFXZERMRTFCUVdoRE8wRkJRMFE3TzBGQlJVUXNaVUZCVnl4WlFVRk5PMEZCUTJZc1YwRkJTeXhIUVVGTUxFTkJRVk1zVTBGQlZDeEZRVUZ2UWl4TlFVRndRanRCUVVORUxFdEJSa1FzUlVGRlJ5eEhRVVpJTzBGQlIwUXNSMEZhUkR0QlFXRkVPenRCUVVWRUxGTkJRVk1zWTBGQlZDeEhRVUV3UWp0QlFVTjRRaXhKUVVGRkxITkNRVUZHTEVWQlFUQkNMRXRCUVRGQ0xFTkJRV2RETEZsQlFVMDdRVUZEY0VNc1VVRkJUU3haUVVGWkxFVkJRVVVzYjBKQlFVWXNRMEZCYkVJN1FVRkRRU3hSUVVGTkxHRkJRV0VzVDBGQlR5eFZRVUZRTEVkQlFXOUNMRWxCUVhCQ0xFZEJRVEpDTEVkQlFUTkNMRWRCUVdsRExFZEJRWEJFTzBGQlEwRXNVVUZCVFN4TlFVRk5MRlZCUVZVc1UwRkJWaXhGUVVGYU8wRkJRMEVzWTBGQlZTeFBRVUZXTEVOQlFXdENPMEZCUTJoQ0xHbENRVUZYTEUxQlFVOHNUVUZCVFN4VlFVRmlMRWRCUVRKQ08wRkJSSFJDTEV0QlFXeENMRVZCUlVjc1IwRkdTRHRCUVVkRUxFZEJVRVE3UVVGUlFTeEpRVUZGTEc5Q1FVRkdMRVZCUVhkQ0xFdEJRWGhDTEVOQlFUaENMRmxCUVUwN1FVRkRiRU1zVVVGQlRTeGhRVUZoTEU5QlFVOHNWVUZCVUN4SFFVRnZRaXhKUVVGd1FpeEhRVUV5UWl4SFFVRXpRaXhIUVVGcFF5eEhRVUZ3UkR0QlFVTkJMRkZCUVUwc1dVRkJXU3hGUVVGRkxHOUNRVUZHTEVOQlFXeENPMEZCUTBFc1VVRkJUU3hOUVVGTkxGVkJRVlVzVTBGQlZpeEZRVUZhTzBGQlEwRXNZMEZCVlN4UFFVRldMRU5CUVd0Q08wRkJRMmhDTEdsQ1FVRlhMRTlCUVU4c1RVRkJUU3hWUVVGT0xFbEJRVzlDTEZWQlFUTkNPMEZCUkVzc1MwRkJiRUlzUlVGRlJ5eEhRVVpJTzBGQlIwUXNSMEZRUkR0QlFWRkVPenRCUVVWRUxGTkJRVk1zWlVGQlZDeEhRVUV5UWp0QlFVTjZRaXhOUVVGTkxHRkJRV0VzVDBGQlR5eFZRVUZRTEVkQlFXOUNMRWxCUVhCQ0xFZEJRVEpDTEVkQlFUTkNMRWRCUVdsRExFZEJRWEJFTzBGQlEwRXNUVUZCVFN4bFFVRmxMRTlCUVU4c1YwRkJVQ3hIUVVGeFFpeEhRVUV4UXp0QlFVTkJMRWxCUVVVc2IwSkJRVVlzUlVGQmQwSXNUVUZCZUVJc1EwRkJLMElzWlVGQlowSXNaVUZCWlN4VlFVRTVSRHRCUVVORUlpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUlvWm5WdVkzUnBiMjRnWlNoMExHNHNjaWw3Wm5WdVkzUnBiMjRnY3lodkxIVXBlMmxtS0NGdVcyOWRLWHRwWmlnaGRGdHZYU2w3ZG1GeUlHRTlkSGx3Wlc5bUlISmxjWFZwY21VOVBWd2lablZ1WTNScGIyNWNJaVltY21WeGRXbHlaVHRwWmlnaGRTWW1ZU2x5WlhSMWNtNGdZU2h2TENFd0tUdHBaaWhwS1hKbGRIVnliaUJwS0c4c0lUQXBPM1poY2lCbVBXNWxkeUJGY25KdmNpaGNJa05oYm01dmRDQm1hVzVrSUcxdlpIVnNaU0FuWENJcmJ5dGNJaWRjSWlrN2RHaHliM2NnWmk1amIyUmxQVndpVFU5RVZVeEZYMDVQVkY5R1QxVk9SRndpTEdaOWRtRnlJR3c5Ymx0dlhUMTdaWGh3YjNKMGN6cDdmWDA3ZEZ0dlhWc3dYUzVqWVd4c0tHd3VaWGh3YjNKMGN5eG1kVzVqZEdsdmJpaGxLWHQyWVhJZ2JqMTBXMjlkV3pGZFcyVmRPM0psZEhWeWJpQnpLRzQvYmpwbEtYMHNiQ3hzTG1WNGNHOXlkSE1zWlN4MExHNHNjaWw5Y21WMGRYSnVJRzViYjEwdVpYaHdiM0owYzMxMllYSWdhVDEwZVhCbGIyWWdjbVZ4ZFdseVpUMDlYQ0ptZFc1amRHbHZibHdpSmlaeVpYRjFhWEpsTzJadmNpaDJZWElnYnowd08yODhjaTVzWlc1bmRHZzdieXNyS1hNb2NsdHZYU2s3Y21WMGRYSnVJSE45S1NJc0lpOHFLbHh1SUNvZ2JHOWtZWE5vSUNoRGRYTjBiMjBnUW5WcGJHUXBJRHhvZEhSd2N6b3ZMMnh2WkdGemFDNWpiMjB2UGx4dUlDb2dRblZwYkdRNklHQnNiMlJoYzJnZ2JXOWtkV3hoY21sNlpTQmxlSEJ2Y25SelBWd2libkJ0WENJZ0xXOGdMaTlnWEc0Z0tpQkRiM0I1Y21sbmFIUWdhbEYxWlhKNUlFWnZkVzVrWVhScGIyNGdZVzVrSUc5MGFHVnlJR052Ym5SeWFXSjFkRzl5Y3lBOGFIUjBjSE02THk5cWNYVmxjbmt1YjNKbkx6NWNiaUFxSUZKbGJHVmhjMlZrSUhWdVpHVnlJRTFKVkNCc2FXTmxibk5sSUR4b2RIUndjem92TDJ4dlpHRnphQzVqYjIwdmJHbGpaVzV6WlQ1Y2JpQXFJRUpoYzJWa0lHOXVJRlZ1WkdWeWMyTnZjbVV1YW5NZ01TNDRMak1nUEdoMGRIQTZMeTkxYm1SbGNuTmpiM0psYW5NdWIzSm5MMHhKUTBWT1UwVStYRzRnS2lCRGIzQjVjbWxuYUhRZ1NtVnlaVzE1SUVGemFHdGxibUZ6TENCRWIyTjFiV1Z1ZEVOc2IzVmtJR0Z1WkNCSmJuWmxjM1JwWjJGMGFYWmxJRkpsY0c5eWRHVnljeUFtSUVWa2FYUnZjbk5jYmlBcUwxeHVYRzR2S2lvZ1ZYTmxaQ0JoY3lCMGFHVWdZRlI1Y0dWRmNuSnZjbUFnYldWemMyRm5aU0JtYjNJZ1hDSkdkVzVqZEdsdmJuTmNJaUJ0WlhSb2IyUnpMaUFxTDF4dWRtRnlJRVpWVGtOZlJWSlNUMUpmVkVWWVZDQTlJQ2RGZUhCbFkzUmxaQ0JoSUdaMWJtTjBhVzl1Snp0Y2JseHVMeW9xSUZWelpXUWdZWE1nY21WbVpYSmxibU5sY3lCbWIzSWdkbUZ5YVc5MWN5QmdUblZ0WW1WeVlDQmpiMjV6ZEdGdWRITXVJQ292WEc1MllYSWdUa0ZPSUQwZ01DQXZJREE3WEc1Y2JpOHFLaUJnVDJKcVpXTjBJM1J2VTNSeWFXNW5ZQ0J5WlhOMWJIUWdjbVZtWlhKbGJtTmxjeTRnS2k5Y2JuWmhjaUJ6ZVcxaWIyeFVZV2NnUFNBblcyOWlhbVZqZENCVGVXMWliMnhkSnp0Y2JseHVMeW9xSUZWelpXUWdkRzhnYldGMFkyZ2diR1ZoWkdsdVp5QmhibVFnZEhKaGFXeHBibWNnZDJocGRHVnpjR0ZqWlM0Z0tpOWNiblpoY2lCeVpWUnlhVzBnUFNBdlhseGNjeXQ4WEZ4ekt5UXZaenRjYmx4dUx5b3FJRlZ6WldRZ2RHOGdaR1YwWldOMElHSmhaQ0J6YVdkdVpXUWdhR1Y0WVdSbFkybHRZV3dnYzNSeWFXNW5JSFpoYkhWbGN5NGdLaTljYm5aaGNpQnlaVWx6UW1Ga1NHVjRJRDBnTDE1YkxTdGRNSGhiTUMwNVlTMW1YU3NrTDJrN1hHNWNiaThxS2lCVmMyVmtJSFJ2SUdSbGRHVmpkQ0JpYVc1aGNua2djM1J5YVc1bklIWmhiSFZsY3k0Z0tpOWNiblpoY2lCeVpVbHpRbWx1WVhKNUlEMGdMMTR3WWxzd01WMHJKQzlwTzF4dVhHNHZLaW9nVlhObFpDQjBieUJrWlhSbFkzUWdiMk4wWVd3Z2MzUnlhVzVuSUhaaGJIVmxjeTRnS2k5Y2JuWmhjaUJ5WlVselQyTjBZV3dnUFNBdlhqQnZXekF0TjEwckpDOXBPMXh1WEc0dktpb2dRblZwYkhRdGFXNGdiV1YwYUc5a0lISmxabVZ5Wlc1alpYTWdkMmwwYUc5MWRDQmhJR1JsY0dWdVpHVnVZM2tnYjI0Z1lISnZiM1JnTGlBcUwxeHVkbUZ5SUdaeVpXVlFZWEp6WlVsdWRDQTlJSEJoY25ObFNXNTBPMXh1WEc0dktpb2dSR1YwWldOMElHWnlaV1VnZG1GeWFXRmliR1VnWUdkc2IySmhiR0FnWm5KdmJTQk9iMlJsTG1wekxpQXFMMXh1ZG1GeUlHWnlaV1ZIYkc5aVlXd2dQU0IwZVhCbGIyWWdaMnh2WW1Gc0lEMDlJQ2R2WW1wbFkzUW5JQ1ltSUdkc2IySmhiQ0FtSmlCbmJHOWlZV3d1VDJKcVpXTjBJRDA5UFNCUFltcGxZM1FnSmlZZ1oyeHZZbUZzTzF4dVhHNHZLaW9nUkdWMFpXTjBJR1p5WldVZ2RtRnlhV0ZpYkdVZ1lITmxiR1pnTGlBcUwxeHVkbUZ5SUdaeVpXVlRaV3htSUQwZ2RIbHdaVzltSUhObGJHWWdQVDBnSjI5aWFtVmpkQ2NnSmlZZ2MyVnNaaUFtSmlCelpXeG1MazlpYW1WamRDQTlQVDBnVDJKcVpXTjBJQ1ltSUhObGJHWTdYRzVjYmk4cUtpQlZjMlZrSUdGeklHRWdjbVZtWlhKbGJtTmxJSFJ2SUhSb1pTQm5iRzlpWVd3Z2IySnFaV04wTGlBcUwxeHVkbUZ5SUhKdmIzUWdQU0JtY21WbFIyeHZZbUZzSUh4OElHWnlaV1ZUWld4bUlIeDhJRVoxYm1OMGFXOXVLQ2R5WlhSMWNtNGdkR2hwY3ljcEtDazdYRzVjYmk4cUtpQlZjMlZrSUdadmNpQmlkV2xzZEMxcGJpQnRaWFJvYjJRZ2NtVm1aWEpsYm1ObGN5NGdLaTljYm5aaGNpQnZZbXBsWTNSUWNtOTBieUE5SUU5aWFtVmpkQzV3Y205MGIzUjVjR1U3WEc1Y2JpOHFLbHh1SUNvZ1ZYTmxaQ0IwYnlCeVpYTnZiSFpsSUhSb1pWeHVJQ29nVzJCMGIxTjBjbWx1WjFSaFoyQmRLR2gwZEhBNkx5OWxZMjFoTFdsdWRHVnlibUYwYVc5dVlXd3ViM0puTDJWamJXRXRNall5THpjdU1DOGpjMlZqTFc5aWFtVmpkQzV3Y205MGIzUjVjR1V1ZEc5emRISnBibWNwWEc0Z0tpQnZaaUIyWVd4MVpYTXVYRzRnS2k5Y2JuWmhjaUJ2WW1wbFkzUlViMU4wY21sdVp5QTlJRzlpYW1WamRGQnliM1J2TG5SdlUzUnlhVzVuTzF4dVhHNHZLaUJDZFdsc2RDMXBiaUJ0WlhSb2IyUWdjbVZtWlhKbGJtTmxjeUJtYjNJZ2RHaHZjMlVnZDJsMGFDQjBhR1VnYzJGdFpTQnVZVzFsSUdGeklHOTBhR1Z5SUdCc2IyUmhjMmhnSUcxbGRHaHZaSE11SUNvdlhHNTJZWElnYm1GMGFYWmxUV0Y0SUQwZ1RXRjBhQzV0WVhnc1hHNGdJQ0FnYm1GMGFYWmxUV2x1SUQwZ1RXRjBhQzV0YVc0N1hHNWNiaThxS2x4dUlDb2dSMlYwY3lCMGFHVWdkR2x0WlhOMFlXMXdJRzltSUhSb1pTQnVkVzFpWlhJZ2IyWWdiV2xzYkdselpXTnZibVJ6SUhSb1lYUWdhR0YyWlNCbGJHRndjMlZrSUhOcGJtTmxYRzRnS2lCMGFHVWdWVzVwZUNCbGNHOWphQ0FvTVNCS1lXNTFZWEo1SURFNU56QWdNREE2TURBNk1EQWdWVlJES1M1Y2JpQXFYRzRnS2lCQWMzUmhkR2xqWEc0Z0tpQkFiV1Z0WW1WeVQyWWdYMXh1SUNvZ1FITnBibU5sSURJdU5DNHdYRzRnS2lCQVkyRjBaV2R2Y25rZ1JHRjBaVnh1SUNvZ1FISmxkSFZ5Ym5NZ2UyNTFiV0psY24wZ1VtVjBkWEp1Y3lCMGFHVWdkR2x0WlhOMFlXMXdMbHh1SUNvZ1FHVjRZVzF3YkdWY2JpQXFYRzRnS2lCZkxtUmxabVZ5S0daMWJtTjBhVzl1S0hOMFlXMXdLU0I3WEc0Z0tpQWdJR052Ym5OdmJHVXViRzluS0Y4dWJtOTNLQ2tnTFNCemRHRnRjQ2s3WEc0Z0tpQjlMQ0JmTG01dmR5Z3BLVHRjYmlBcUlDOHZJRDArSUV4dlozTWdkR2hsSUc1MWJXSmxjaUJ2WmlCdGFXeHNhWE5sWTI5dVpITWdhWFFnZEc5dmF5Qm1iM0lnZEdobElHUmxabVZ5Y21Wa0lHbHVkbTlqWVhScGIyNHVYRzRnS2k5Y2JuWmhjaUJ1YjNjZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ2NtVjBkWEp1SUhKdmIzUXVSR0YwWlM1dWIzY29LVHRjYm4wN1hHNWNiaThxS2x4dUlDb2dRM0psWVhSbGN5QmhJR1JsWW05MWJtTmxaQ0JtZFc1amRHbHZiaUIwYUdGMElHUmxiR0Y1Y3lCcGJuWnZhMmx1WnlCZ1puVnVZMkFnZFc1MGFXd2dZV1owWlhJZ1lIZGhhWFJnWEc0Z0tpQnRhV3hzYVhObFkyOXVaSE1nYUdGMlpTQmxiR0Z3YzJWa0lITnBibU5sSUhSb1pTQnNZWE4wSUhScGJXVWdkR2hsSUdSbFltOTFibU5sWkNCbWRXNWpkR2x2YmlCM1lYTmNiaUFxSUdsdWRtOXJaV1F1SUZSb1pTQmtaV0p2ZFc1alpXUWdablZ1WTNScGIyNGdZMjl0WlhNZ2QybDBhQ0JoSUdCallXNWpaV3hnSUcxbGRHaHZaQ0IwYnlCallXNWpaV3hjYmlBcUlHUmxiR0Y1WldRZ1lHWjFibU5nSUdsdWRtOWpZWFJwYjI1eklHRnVaQ0JoSUdCbWJIVnphR0FnYldWMGFHOWtJSFJ2SUdsdGJXVmthV0YwWld4NUlHbHVkbTlyWlNCMGFHVnRMbHh1SUNvZ1VISnZkbWxrWlNCZ2IzQjBhVzl1YzJBZ2RHOGdhVzVrYVdOaGRHVWdkMmhsZEdobGNpQmdablZ1WTJBZ2MyaHZkV3hrSUdKbElHbHVkbTlyWldRZ2IyNGdkR2hsWEc0Z0tpQnNaV0ZrYVc1bklHRnVaQzl2Y2lCMGNtRnBiR2x1WnlCbFpHZGxJRzltSUhSb1pTQmdkMkZwZEdBZ2RHbHRaVzkxZEM0Z1ZHaGxJR0JtZFc1allDQnBjeUJwYm5admEyVmtYRzRnS2lCM2FYUm9JSFJvWlNCc1lYTjBJR0Z5WjNWdFpXNTBjeUJ3Y205MmFXUmxaQ0IwYnlCMGFHVWdaR1ZpYjNWdVkyVmtJR1oxYm1OMGFXOXVMaUJUZFdKelpYRjFaVzUwWEc0Z0tpQmpZV3hzY3lCMGJ5QjBhR1VnWkdWaWIzVnVZMlZrSUdaMWJtTjBhVzl1SUhKbGRIVnliaUIwYUdVZ2NtVnpkV3gwSUc5bUlIUm9aU0JzWVhOMElHQm1kVzVqWUZ4dUlDb2dhVzUyYjJOaGRHbHZiaTVjYmlBcVhHNGdLaUFxS2s1dmRHVTZLaW9nU1dZZ1lHeGxZV1JwYm1kZ0lHRnVaQ0JnZEhKaGFXeHBibWRnSUc5d2RHbHZibk1nWVhKbElHQjBjblZsWUN3Z1lHWjFibU5nSUdselhHNGdLaUJwYm5admEyVmtJRzl1SUhSb1pTQjBjbUZwYkdsdVp5QmxaR2RsSUc5bUlIUm9aU0IwYVcxbGIzVjBJRzl1YkhrZ2FXWWdkR2hsSUdSbFltOTFibU5sWkNCbWRXNWpkR2x2Ymx4dUlDb2dhWE1nYVc1MmIydGxaQ0J0YjNKbElIUm9ZVzRnYjI1alpTQmtkWEpwYm1jZ2RHaGxJR0IzWVdsMFlDQjBhVzFsYjNWMExseHVJQ3BjYmlBcUlFbG1JR0IzWVdsMFlDQnBjeUJnTUdBZ1lXNWtJR0JzWldGa2FXNW5ZQ0JwY3lCZ1ptRnNjMlZnTENCZ1puVnVZMkFnYVc1MmIyTmhkR2x2YmlCcGN5QmtaV1psY25KbFpGeHVJQ29nZFc1MGFXd2dkRzhnZEdobElHNWxlSFFnZEdsamF5d2djMmx0YVd4aGNpQjBieUJnYzJWMFZHbHRaVzkxZEdBZ2QybDBhQ0JoSUhScGJXVnZkWFFnYjJZZ1lEQmdMbHh1SUNwY2JpQXFJRk5sWlNCYlJHRjJhV1FnUTI5eVltRmphRzhuY3lCaGNuUnBZMnhsWFNob2RIUndjem92TDJOemN5MTBjbWxqYTNNdVkyOXRMMlJsWW05MWJtTnBibWN0ZEdoeWIzUjBiR2x1WnkxbGVIQnNZV2x1WldRdFpYaGhiWEJzWlhNdktWeHVJQ29nWm05eUlHUmxkR0ZwYkhNZ2IzWmxjaUIwYUdVZ1pHbG1abVZ5Wlc1alpYTWdZbVYwZDJWbGJpQmdYeTVrWldKdmRXNWpaV0FnWVc1a0lHQmZMblJvY205MGRHeGxZQzVjYmlBcVhHNGdLaUJBYzNSaGRHbGpYRzRnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ29nUUhOcGJtTmxJREF1TVM0d1hHNGdLaUJBWTJGMFpXZHZjbmtnUm5WdVkzUnBiMjVjYmlBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHWjFibU1nVkdobElHWjFibU4wYVc5dUlIUnZJR1JsWW05MWJtTmxMbHh1SUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEo5SUZ0M1lXbDBQVEJkSUZSb1pTQnVkVzFpWlhJZ2IyWWdiV2xzYkdselpXTnZibVJ6SUhSdklHUmxiR0Y1TGx4dUlDb2dRSEJoY21GdElIdFBZbXBsWTNSOUlGdHZjSFJwYjI1elBYdDlYU0JVYUdVZ2IzQjBhVzl1Y3lCdlltcGxZM1F1WEc0Z0tpQkFjR0Z5WVcwZ2UySnZiMnhsWVc1OUlGdHZjSFJwYjI1ekxteGxZV1JwYm1jOVptRnNjMlZkWEc0Z0tpQWdVM0JsWTJsbWVTQnBiblp2YTJsdVp5QnZiaUIwYUdVZ2JHVmhaR2x1WnlCbFpHZGxJRzltSUhSb1pTQjBhVzFsYjNWMExseHVJQ29nUUhCaGNtRnRJSHR1ZFcxaVpYSjlJRnR2Y0hScGIyNXpMbTFoZUZkaGFYUmRYRzRnS2lBZ1ZHaGxJRzFoZUdsdGRXMGdkR2x0WlNCZ1puVnVZMkFnYVhNZ1lXeHNiM2RsWkNCMGJ5QmlaU0JrWld4aGVXVmtJR0psWm05eVpTQnBkQ2R6SUdsdWRtOXJaV1F1WEc0Z0tpQkFjR0Z5WVcwZ2UySnZiMnhsWVc1OUlGdHZjSFJwYjI1ekxuUnlZV2xzYVc1blBYUnlkV1ZkWEc0Z0tpQWdVM0JsWTJsbWVTQnBiblp2YTJsdVp5QnZiaUIwYUdVZ2RISmhhV3hwYm1jZ1pXUm5aU0J2WmlCMGFHVWdkR2x0Wlc5MWRDNWNiaUFxSUVCeVpYUjFjbTV6SUh0R2RXNWpkR2x2Ym4wZ1VtVjBkWEp1Y3lCMGFHVWdibVYzSUdSbFltOTFibU5sWkNCbWRXNWpkR2x2Ymk1Y2JpQXFJRUJsZUdGdGNHeGxYRzRnS2x4dUlDb2dMeThnUVhadmFXUWdZMjl6ZEd4NUlHTmhiR04xYkdGMGFXOXVjeUIzYUdsc1pTQjBhR1VnZDJsdVpHOTNJSE5wZW1VZ2FYTWdhVzRnWm14MWVDNWNiaUFxSUdwUmRXVnllU2gzYVc1a2IzY3BMbTl1S0NkeVpYTnBlbVVuTENCZkxtUmxZbTkxYm1ObEtHTmhiR04xYkdGMFpVeGhlVzkxZEN3Z01UVXdLU2s3WEc0Z0tseHVJQ29nTHk4Z1NXNTJiMnRsSUdCelpXNWtUV0ZwYkdBZ2QyaGxiaUJqYkdsamEyVmtMQ0JrWldKdmRXNWphVzVuSUhOMVluTmxjWFZsYm5RZ1kyRnNiSE11WEc0Z0tpQnFVWFZsY25rb1pXeGxiV1Z1ZENrdWIyNG9KMk5zYVdOckp5d2dYeTVrWldKdmRXNWpaU2h6Wlc1a1RXRnBiQ3dnTXpBd0xDQjdYRzRnS2lBZ0lDZHNaV0ZrYVc1bkp6b2dkSEoxWlN4Y2JpQXFJQ0FnSjNSeVlXbHNhVzVuSnpvZ1ptRnNjMlZjYmlBcUlIMHBLVHRjYmlBcVhHNGdLaUF2THlCRmJuTjFjbVVnWUdKaGRHTm9URzluWUNCcGN5QnBiblp2YTJWa0lHOXVZMlVnWVdaMFpYSWdNU0J6WldOdmJtUWdiMllnWkdWaWIzVnVZMlZrSUdOaGJHeHpMbHh1SUNvZ2RtRnlJR1JsWW05MWJtTmxaQ0E5SUY4dVpHVmliM1Z1WTJVb1ltRjBZMmhNYjJjc0lESTFNQ3dnZXlBbmJXRjRWMkZwZENjNklERXdNREFnZlNrN1hHNGdLaUIyWVhJZ2MyOTFjbU5sSUQwZ2JtVjNJRVYyWlc1MFUyOTFjbU5sS0NjdmMzUnlaV0Z0SnlrN1hHNGdLaUJxVVhWbGNua29jMjkxY21ObEtTNXZiaWduYldWemMyRm5aU2NzSUdSbFltOTFibU5sWkNrN1hHNGdLbHh1SUNvZ0x5OGdRMkZ1WTJWc0lIUm9aU0IwY21GcGJHbHVaeUJrWldKdmRXNWpaV1FnYVc1MmIyTmhkR2x2Ymk1Y2JpQXFJR3BSZFdWeWVTaDNhVzVrYjNjcExtOXVLQ2R3YjNCemRHRjBaU2NzSUdSbFltOTFibU5sWkM1allXNWpaV3dwTzF4dUlDb3ZYRzVtZFc1amRHbHZiaUJrWldKdmRXNWpaU2htZFc1akxDQjNZV2wwTENCdmNIUnBiMjV6S1NCN1hHNGdJSFpoY2lCc1lYTjBRWEpuY3l4Y2JpQWdJQ0FnSUd4aGMzUlVhR2x6TEZ4dUlDQWdJQ0FnYldGNFYyRnBkQ3hjYmlBZ0lDQWdJSEpsYzNWc2RDeGNiaUFnSUNBZ0lIUnBiV1Z5U1dRc1hHNGdJQ0FnSUNCc1lYTjBRMkZzYkZScGJXVXNYRzRnSUNBZ0lDQnNZWE4wU1c1MmIydGxWR2x0WlNBOUlEQXNYRzRnSUNBZ0lDQnNaV0ZrYVc1bklEMGdabUZzYzJVc1hHNGdJQ0FnSUNCdFlYaHBibWNnUFNCbVlXeHpaU3hjYmlBZ0lDQWdJSFJ5WVdsc2FXNW5JRDBnZEhKMVpUdGNibHh1SUNCcFppQW9kSGx3Wlc5bUlHWjFibU1nSVQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lIUm9jbTkzSUc1bGR5QlVlWEJsUlhKeWIzSW9SbFZPUTE5RlVsSlBVbDlVUlZoVUtUdGNiaUFnZlZ4dUlDQjNZV2wwSUQwZ2RHOU9kVzFpWlhJb2QyRnBkQ2tnZkh3Z01EdGNiaUFnYVdZZ0tHbHpUMkpxWldOMEtHOXdkR2x2Ym5NcEtTQjdYRzRnSUNBZ2JHVmhaR2x1WnlBOUlDRWhiM0IwYVc5dWN5NXNaV0ZrYVc1bk8xeHVJQ0FnSUcxaGVHbHVaeUE5SUNkdFlYaFhZV2wwSnlCcGJpQnZjSFJwYjI1ek8xeHVJQ0FnSUcxaGVGZGhhWFFnUFNCdFlYaHBibWNnUHlCdVlYUnBkbVZOWVhnb2RHOU9kVzFpWlhJb2IzQjBhVzl1Y3k1dFlYaFhZV2wwS1NCOGZDQXdMQ0IzWVdsMEtTQTZJRzFoZUZkaGFYUTdYRzRnSUNBZ2RISmhhV3hwYm1jZ1BTQW5kSEpoYVd4cGJtY25JR2x1SUc5d2RHbHZibk1nUHlBaElXOXdkR2x2Ym5NdWRISmhhV3hwYm1jZ09pQjBjbUZwYkdsdVp6dGNiaUFnZlZ4dVhHNGdJR1oxYm1OMGFXOXVJR2x1ZG05clpVWjFibU1vZEdsdFpTa2dlMXh1SUNBZ0lIWmhjaUJoY21keklEMGdiR0Z6ZEVGeVozTXNYRzRnSUNBZ0lDQWdJSFJvYVhOQmNtY2dQU0JzWVhOMFZHaHBjenRjYmx4dUlDQWdJR3hoYzNSQmNtZHpJRDBnYkdGemRGUm9hWE1nUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnYkdGemRFbHVkbTlyWlZScGJXVWdQU0IwYVcxbE8xeHVJQ0FnSUhKbGMzVnNkQ0E5SUdaMWJtTXVZWEJ3Ykhrb2RHaHBjMEZ5Wnl3Z1lYSm5jeWs3WEc0Z0lDQWdjbVYwZFhKdUlISmxjM1ZzZER0Y2JpQWdmVnh1WEc0Z0lHWjFibU4wYVc5dUlHeGxZV1JwYm1kRlpHZGxLSFJwYldVcElIdGNiaUFnSUNBdkx5QlNaWE5sZENCaGJua2dZRzFoZUZkaGFYUmdJSFJwYldWeUxseHVJQ0FnSUd4aGMzUkpiblp2YTJWVWFXMWxJRDBnZEdsdFpUdGNiaUFnSUNBdkx5QlRkR0Z5ZENCMGFHVWdkR2x0WlhJZ1ptOXlJSFJvWlNCMGNtRnBiR2x1WnlCbFpHZGxMbHh1SUNBZ0lIUnBiV1Z5U1dRZ1BTQnpaWFJVYVcxbGIzVjBLSFJwYldWeVJYaHdhWEpsWkN3Z2QyRnBkQ2s3WEc0Z0lDQWdMeThnU1c1MmIydGxJSFJvWlNCc1pXRmthVzVuSUdWa1oyVXVYRzRnSUNBZ2NtVjBkWEp1SUd4bFlXUnBibWNnUHlCcGJuWnZhMlZHZFc1aktIUnBiV1VwSURvZ2NtVnpkV3gwTzF4dUlDQjlYRzVjYmlBZ1puVnVZM1JwYjI0Z2NtVnRZV2x1YVc1blYyRnBkQ2gwYVcxbEtTQjdYRzRnSUNBZ2RtRnlJSFJwYldWVGFXNWpaVXhoYzNSRFlXeHNJRDBnZEdsdFpTQXRJR3hoYzNSRFlXeHNWR2x0WlN4Y2JpQWdJQ0FnSUNBZ2RHbHRaVk5wYm1ObFRHRnpkRWx1ZG05clpTQTlJSFJwYldVZ0xTQnNZWE4wU1c1MmIydGxWR2x0WlN4Y2JpQWdJQ0FnSUNBZ2NtVnpkV3gwSUQwZ2QyRnBkQ0F0SUhScGJXVlRhVzVqWlV4aGMzUkRZV3hzTzF4dVhHNGdJQ0FnY21WMGRYSnVJRzFoZUdsdVp5QS9JRzVoZEdsMlpVMXBiaWh5WlhOMWJIUXNJRzFoZUZkaGFYUWdMU0IwYVcxbFUybHVZMlZNWVhOMFNXNTJiMnRsS1NBNklISmxjM1ZzZER0Y2JpQWdmVnh1WEc0Z0lHWjFibU4wYVc5dUlITm9iM1ZzWkVsdWRtOXJaU2gwYVcxbEtTQjdYRzRnSUNBZ2RtRnlJSFJwYldWVGFXNWpaVXhoYzNSRFlXeHNJRDBnZEdsdFpTQXRJR3hoYzNSRFlXeHNWR2x0WlN4Y2JpQWdJQ0FnSUNBZ2RHbHRaVk5wYm1ObFRHRnpkRWx1ZG05clpTQTlJSFJwYldVZ0xTQnNZWE4wU1c1MmIydGxWR2x0WlR0Y2JseHVJQ0FnSUM4dklFVnBkR2hsY2lCMGFHbHpJR2x6SUhSb1pTQm1hWEp6ZENCallXeHNMQ0JoWTNScGRtbDBlU0JvWVhNZ2MzUnZjSEJsWkNCaGJtUWdkMlVuY21VZ1lYUWdkR2hsWEc0Z0lDQWdMeThnZEhKaGFXeHBibWNnWldSblpTd2dkR2hsSUhONWMzUmxiU0IwYVcxbElHaGhjeUJuYjI1bElHSmhZMnQzWVhKa2N5QmhibVFnZDJVbmNtVWdkSEpsWVhScGJtZGNiaUFnSUNBdkx5QnBkQ0JoY3lCMGFHVWdkSEpoYVd4cGJtY2daV1JuWlN3Z2IzSWdkMlVuZG1VZ2FHbDBJSFJvWlNCZ2JXRjRWMkZwZEdBZ2JHbHRhWFF1WEc0Z0lDQWdjbVYwZFhKdUlDaHNZWE4wUTJGc2JGUnBiV1VnUFQwOUlIVnVaR1ZtYVc1bFpDQjhmQ0FvZEdsdFpWTnBibU5sVEdGemRFTmhiR3dnUGowZ2QyRnBkQ2tnZkh4Y2JpQWdJQ0FnSUNoMGFXMWxVMmx1WTJWTVlYTjBRMkZzYkNBOElEQXBJSHg4SUNodFlYaHBibWNnSmlZZ2RHbHRaVk5wYm1ObFRHRnpkRWx1ZG05clpTQStQU0J0WVhoWFlXbDBLU2s3WEc0Z0lIMWNibHh1SUNCbWRXNWpkR2x2YmlCMGFXMWxja1Y0Y0dseVpXUW9LU0I3WEc0Z0lDQWdkbUZ5SUhScGJXVWdQU0J1YjNjb0tUdGNiaUFnSUNCcFppQW9jMmh2ZFd4a1NXNTJiMnRsS0hScGJXVXBLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEpoYVd4cGJtZEZaR2RsS0hScGJXVXBPMXh1SUNBZ0lIMWNiaUFnSUNBdkx5QlNaWE4wWVhKMElIUm9aU0IwYVcxbGNpNWNiaUFnSUNCMGFXMWxja2xrSUQwZ2MyVjBWR2x0Wlc5MWRDaDBhVzFsY2tWNGNHbHlaV1FzSUhKbGJXRnBibWx1WjFkaGFYUW9kR2x0WlNrcE8xeHVJQ0I5WEc1Y2JpQWdablZ1WTNScGIyNGdkSEpoYVd4cGJtZEZaR2RsS0hScGJXVXBJSHRjYmlBZ0lDQjBhVzFsY2tsa0lEMGdkVzVrWldacGJtVmtPMXh1WEc0Z0lDQWdMeThnVDI1c2VTQnBiblp2YTJVZ2FXWWdkMlVnYUdGMlpTQmdiR0Z6ZEVGeVozTmdJSGRvYVdOb0lHMWxZVzV6SUdCbWRXNWpZQ0JvWVhNZ1ltVmxibHh1SUNBZ0lDOHZJR1JsWW05MWJtTmxaQ0JoZENCc1pXRnpkQ0J2Ym1ObExseHVJQ0FnSUdsbUlDaDBjbUZwYkdsdVp5QW1KaUJzWVhOMFFYSm5jeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR2x1ZG05clpVWjFibU1vZEdsdFpTazdYRzRnSUNBZ2ZWeHVJQ0FnSUd4aGMzUkJjbWR6SUQwZ2JHRnpkRlJvYVhNZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkRHRjYmlBZ2ZWeHVYRzRnSUdaMWJtTjBhVzl1SUdOaGJtTmxiQ2dwSUh0Y2JpQWdJQ0JwWmlBb2RHbHRaWEpKWkNBaFBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0JqYkdWaGNsUnBiV1Z2ZFhRb2RHbHRaWEpKWkNrN1hHNGdJQ0FnZlZ4dUlDQWdJR3hoYzNSSmJuWnZhMlZVYVcxbElEMGdNRHRjYmlBZ0lDQnNZWE4wUVhKbmN5QTlJR3hoYzNSRFlXeHNWR2x0WlNBOUlHeGhjM1JVYUdseklEMGdkR2x0WlhKSlpDQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ2ZWeHVYRzRnSUdaMWJtTjBhVzl1SUdac2RYTm9LQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhVzFsY2tsa0lEMDlQU0IxYm1SbFptbHVaV1FnUHlCeVpYTjFiSFFnT2lCMGNtRnBiR2x1WjBWa1oyVW9ibTkzS0NrcE8xeHVJQ0I5WEc1Y2JpQWdablZ1WTNScGIyNGdaR1ZpYjNWdVkyVmtLQ2tnZTF4dUlDQWdJSFpoY2lCMGFXMWxJRDBnYm05M0tDa3NYRzRnSUNBZ0lDQWdJR2x6U1c1MmIydHBibWNnUFNCemFHOTFiR1JKYm5admEyVW9kR2x0WlNrN1hHNWNiaUFnSUNCc1lYTjBRWEpuY3lBOUlHRnlaM1Z0Wlc1MGN6dGNiaUFnSUNCc1lYTjBWR2hwY3lBOUlIUm9hWE03WEc0Z0lDQWdiR0Z6ZEVOaGJHeFVhVzFsSUQwZ2RHbHRaVHRjYmx4dUlDQWdJR2xtSUNocGMwbHVkbTlyYVc1bktTQjdYRzRnSUNBZ0lDQnBaaUFvZEdsdFpYSkpaQ0E5UFQwZ2RXNWtaV1pwYm1Wa0tTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQnNaV0ZrYVc1blJXUm5aU2hzWVhOMFEyRnNiRlJwYldVcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2FXWWdLRzFoZUdsdVp5a2dlMXh1SUNBZ0lDQWdJQ0F2THlCSVlXNWtiR1VnYVc1MmIyTmhkR2x2Ym5NZ2FXNGdZU0IwYVdkb2RDQnNiMjl3TGx4dUlDQWdJQ0FnSUNCMGFXMWxja2xrSUQwZ2MyVjBWR2x0Wlc5MWRDaDBhVzFsY2tWNGNHbHlaV1FzSUhkaGFYUXBPMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhVzUyYjJ0bFJuVnVZeWhzWVhOMFEyRnNiRlJwYldVcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdJQ0JwWmlBb2RHbHRaWEpKWkNBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0IwYVcxbGNrbGtJRDBnYzJWMFZHbHRaVzkxZENoMGFXMWxja1Y0Y0dseVpXUXNJSGRoYVhRcE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdjbVZ6ZFd4ME8xeHVJQ0I5WEc0Z0lHUmxZbTkxYm1ObFpDNWpZVzVqWld3Z1BTQmpZVzVqWld3N1hHNGdJR1JsWW05MWJtTmxaQzVtYkhWemFDQTlJR1pzZFhOb08xeHVJQ0J5WlhSMWNtNGdaR1ZpYjNWdVkyVmtPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlFTm9aV05yY3lCcFppQmdkbUZzZFdWZ0lHbHpJSFJvWlZ4dUlDb2dXMnhoYm1kMVlXZGxJSFI1Y0dWZEtHaDBkSEE2THk5M2QzY3VaV050WVMxcGJuUmxjbTVoZEdsdmJtRnNMbTl5Wnk5bFkyMWhMVEkyTWk4M0xqQXZJM05sWXkxbFkyMWhjMk55YVhCMExXeGhibWQxWVdkbExYUjVjR1Z6S1Z4dUlDb2diMllnWUU5aWFtVmpkR0F1SUNobExtY3VJR0Z5Y21GNWN5d2dablZ1WTNScGIyNXpMQ0J2WW1wbFkzUnpMQ0J5WldkbGVHVnpMQ0JnYm1WM0lFNTFiV0psY2lnd0tXQXNJR0Z1WkNCZ2JtVjNJRk4wY21sdVp5Z25KeWxnS1Z4dUlDcGNiaUFxSUVCemRHRjBhV05jYmlBcUlFQnRaVzFpWlhKUFppQmZYRzRnS2lCQWMybHVZMlVnTUM0eExqQmNiaUFxSUVCallYUmxaMjl5ZVNCTVlXNW5YRzRnS2lCQWNHRnlZVzBnZXlwOUlIWmhiSFZsSUZSb1pTQjJZV3gxWlNCMGJ5QmphR1ZqYXk1Y2JpQXFJRUJ5WlhSMWNtNXpJSHRpYjI5c1pXRnVmU0JTWlhSMWNtNXpJR0IwY25WbFlDQnBaaUJnZG1Gc2RXVmdJR2x6SUdGdUlHOWlhbVZqZEN3Z1pXeHpaU0JnWm1Gc2MyVmdMbHh1SUNvZ1FHVjRZVzF3YkdWY2JpQXFYRzRnS2lCZkxtbHpUMkpxWldOMEtIdDlLVHRjYmlBcUlDOHZJRDArSUhSeWRXVmNiaUFxWEc0Z0tpQmZMbWx6VDJKcVpXTjBLRnN4TENBeUxDQXpYU2s3WEc0Z0tpQXZMeUE5UGlCMGNuVmxYRzRnS2x4dUlDb2dYeTVwYzA5aWFtVmpkQ2hmTG01dmIzQXBPMXh1SUNvZ0x5OGdQVDRnZEhKMVpWeHVJQ3BjYmlBcUlGOHVhWE5QWW1wbFkzUW9iblZzYkNrN1hHNGdLaUF2THlBOVBpQm1ZV3h6WlZ4dUlDb3ZYRzVtZFc1amRHbHZiaUJwYzA5aWFtVmpkQ2gyWVd4MVpTa2dlMXh1SUNCMllYSWdkSGx3WlNBOUlIUjVjR1Z2WmlCMllXeDFaVHRjYmlBZ2NtVjBkWEp1SUNFaGRtRnNkV1VnSmlZZ0tIUjVjR1VnUFQwZ0oyOWlhbVZqZENjZ2ZId2dkSGx3WlNBOVBTQW5ablZ1WTNScGIyNG5LVHRjYm4xY2JseHVMeW9xWEc0Z0tpQkRhR1ZqYTNNZ2FXWWdZSFpoYkhWbFlDQnBjeUJ2WW1wbFkzUXRiR2xyWlM0Z1FTQjJZV3gxWlNCcGN5QnZZbXBsWTNRdGJHbHJaU0JwWmlCcGRDZHpJRzV2ZENCZ2JuVnNiR0JjYmlBcUlHRnVaQ0JvWVhNZ1lTQmdkSGx3Wlc5bVlDQnlaWE4xYkhRZ2IyWWdYQ0p2WW1wbFkzUmNJaTVjYmlBcVhHNGdLaUJBYzNSaGRHbGpYRzRnS2lCQWJXVnRZbVZ5VDJZZ1gxeHVJQ29nUUhOcGJtTmxJRFF1TUM0d1hHNGdLaUJBWTJGMFpXZHZjbmtnVEdGdVoxeHVJQ29nUUhCaGNtRnRJSHNxZlNCMllXeDFaU0JVYUdVZ2RtRnNkV1VnZEc4Z1kyaGxZMnN1WEc0Z0tpQkFjbVYwZFhKdWN5QjdZbTl2YkdWaGJuMGdVbVYwZFhKdWN5QmdkSEoxWldBZ2FXWWdZSFpoYkhWbFlDQnBjeUJ2WW1wbFkzUXRiR2xyWlN3Z1pXeHpaU0JnWm1Gc2MyVmdMbHh1SUNvZ1FHVjRZVzF3YkdWY2JpQXFYRzRnS2lCZkxtbHpUMkpxWldOMFRHbHJaU2g3ZlNrN1hHNGdLaUF2THlBOVBpQjBjblZsWEc0Z0tseHVJQ29nWHk1cGMwOWlhbVZqZEV4cGEyVW9XekVzSURJc0lETmRLVHRjYmlBcUlDOHZJRDArSUhSeWRXVmNiaUFxWEc0Z0tpQmZMbWx6VDJKcVpXTjBUR2xyWlNoZkxtNXZiM0FwTzF4dUlDb2dMeThnUFQ0Z1ptRnNjMlZjYmlBcVhHNGdLaUJmTG1selQySnFaV04wVEdsclpTaHVkV3hzS1R0Y2JpQXFJQzh2SUQwK0lHWmhiSE5sWEc0Z0tpOWNibVoxYm1OMGFXOXVJR2x6VDJKcVpXTjBUR2xyWlNoMllXeDFaU2tnZTF4dUlDQnlaWFIxY200Z0lTRjJZV3gxWlNBbUppQjBlWEJsYjJZZ2RtRnNkV1VnUFQwZ0oyOWlhbVZqZENjN1hHNTlYRzVjYmk4cUtseHVJQ29nUTJobFkydHpJR2xtSUdCMllXeDFaV0FnYVhNZ1kyeGhjM05wWm1sbFpDQmhjeUJoSUdCVGVXMWliMnhnSUhCeWFXMXBkR2wyWlNCdmNpQnZZbXBsWTNRdVhHNGdLbHh1SUNvZ1FITjBZWFJwWTF4dUlDb2dRRzFsYldKbGNrOW1JRjljYmlBcUlFQnphVzVqWlNBMExqQXVNRnh1SUNvZ1FHTmhkR1ZuYjNKNUlFeGhibWRjYmlBcUlFQndZWEpoYlNCN0tuMGdkbUZzZFdVZ1ZHaGxJSFpoYkhWbElIUnZJR05vWldOckxseHVJQ29nUUhKbGRIVnlibk1nZTJKdmIyeGxZVzU5SUZKbGRIVnlibk1nWUhSeWRXVmdJR2xtSUdCMllXeDFaV0FnYVhNZ1lTQnplVzFpYjJ3c0lHVnNjMlVnWUdaaGJITmxZQzVjYmlBcUlFQmxlR0Z0Y0d4bFhHNGdLbHh1SUNvZ1h5NXBjMU41YldKdmJDaFRlVzFpYjJ3dWFYUmxjbUYwYjNJcE8xeHVJQ29nTHk4Z1BUNGdkSEoxWlZ4dUlDcGNiaUFxSUY4dWFYTlRlVzFpYjJ3b0oyRmlZeWNwTzF4dUlDb2dMeThnUFQ0Z1ptRnNjMlZjYmlBcUwxeHVablZ1WTNScGIyNGdhWE5UZVcxaWIyd29kbUZzZFdVcElIdGNiaUFnY21WMGRYSnVJSFI1Y0dWdlppQjJZV3gxWlNBOVBTQW5jM2x0WW05c0p5QjhmRnh1SUNBZ0lDaHBjMDlpYW1WamRFeHBhMlVvZG1Gc2RXVXBJQ1ltSUc5aWFtVmpkRlJ2VTNSeWFXNW5MbU5oYkd3b2RtRnNkV1VwSUQwOUlITjViV0p2YkZSaFp5azdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1EyOXVkbVZ5ZEhNZ1lIWmhiSFZsWUNCMGJ5QmhJRzUxYldKbGNpNWNiaUFxWEc0Z0tpQkFjM1JoZEdsalhHNGdLaUJBYldWdFltVnlUMllnWDF4dUlDb2dRSE5wYm1ObElEUXVNQzR3WEc0Z0tpQkFZMkYwWldkdmNua2dUR0Z1WjF4dUlDb2dRSEJoY21GdElIc3FmU0IyWVd4MVpTQlVhR1VnZG1Gc2RXVWdkRzhnY0hKdlkyVnpjeTVjYmlBcUlFQnlaWFIxY201eklIdHVkVzFpWlhKOUlGSmxkSFZ5Ym5NZ2RHaGxJRzUxYldKbGNpNWNiaUFxSUVCbGVHRnRjR3hsWEc0Z0tseHVJQ29nWHk1MGIwNTFiV0psY2lnekxqSXBPMXh1SUNvZ0x5OGdQVDRnTXk0eVhHNGdLbHh1SUNvZ1h5NTBiMDUxYldKbGNpaE9kVzFpWlhJdVRVbE9YMVpCVEZWRktUdGNiaUFxSUM4dklEMCtJRFZsTFRNeU5GeHVJQ3BjYmlBcUlGOHVkRzlPZFcxaVpYSW9TVzVtYVc1cGRIa3BPMXh1SUNvZ0x5OGdQVDRnU1c1bWFXNXBkSGxjYmlBcVhHNGdLaUJmTG5SdlRuVnRZbVZ5S0NjekxqSW5LVHRjYmlBcUlDOHZJRDArSURNdU1seHVJQ292WEc1bWRXNWpkR2x2YmlCMGIwNTFiV0psY2loMllXeDFaU2tnZTF4dUlDQnBaaUFvZEhsd1pXOW1JSFpoYkhWbElEMDlJQ2R1ZFcxaVpYSW5LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIWmhiSFZsTzF4dUlDQjlYRzRnSUdsbUlDaHBjMU41YldKdmJDaDJZV3gxWlNrcElIdGNiaUFnSUNCeVpYUjFjbTRnVGtGT08xeHVJQ0I5WEc0Z0lHbG1JQ2hwYzA5aWFtVmpkQ2gyWVd4MVpTa3BJSHRjYmlBZ0lDQjJZWElnYjNSb1pYSWdQU0IwZVhCbGIyWWdkbUZzZFdVdWRtRnNkV1ZQWmlBOVBTQW5ablZ1WTNScGIyNG5JRDhnZG1Gc2RXVXVkbUZzZFdWUFppZ3BJRG9nZG1Gc2RXVTdYRzRnSUNBZ2RtRnNkV1VnUFNCcGMwOWlhbVZqZENodmRHaGxjaWtnUHlBb2IzUm9aWElnS3lBbkp5a2dPaUJ2ZEdobGNqdGNiaUFnZlZ4dUlDQnBaaUFvZEhsd1pXOW1JSFpoYkhWbElDRTlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIWmhiSFZsSUQwOVBTQXdJRDhnZG1Gc2RXVWdPaUFyZG1Gc2RXVTdYRzRnSUgxY2JpQWdkbUZzZFdVZ1BTQjJZV3gxWlM1eVpYQnNZV05sS0hKbFZISnBiU3dnSnljcE8xeHVJQ0IyWVhJZ2FYTkNhVzVoY25rZ1BTQnlaVWx6UW1sdVlYSjVMblJsYzNRb2RtRnNkV1VwTzF4dUlDQnlaWFIxY200Z0tHbHpRbWx1WVhKNUlIeDhJSEpsU1hOUFkzUmhiQzUwWlhOMEtIWmhiSFZsS1NsY2JpQWdJQ0EvSUdaeVpXVlFZWEp6WlVsdWRDaDJZV3gxWlM1emJHbGpaU2d5S1N3Z2FYTkNhVzVoY25rZ1B5QXlJRG9nT0NsY2JpQWdJQ0E2SUNoeVpVbHpRbUZrU0dWNExuUmxjM1FvZG1Gc2RXVXBJRDhnVGtGT0lEb2dLM1poYkhWbEtUdGNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCa1pXSnZkVzVqWlR0Y2JpSXNJbWx0Y0c5eWRDQmtaV0p2ZFc1alpTQm1jbTl0SUNjdUxpOXViMlJsWDIxdlpIVnNaWE12Ykc5a1lYTm9MbVJsWW05MWJtTmxMMmx1WkdWNEp6dGNjbHh1WEhKY2JpUW9aRzlqZFcxbGJuUXBMbkpsWVdSNUtDZ3BJRDArSUh0Y2NseHVJQ0JCVDFNdWFXNXBkQ2g3WEhKY2JpQWdJQ0JrYVhOaFlteGxPaUFuYlc5aWFXeGxKeXhjY2x4dUlDQWdJR1ZoYzJsdVp6b2dKMlZoYzJVdGFXNHRiM1YwSnl4Y2NseHVJQ0FnSUdSbGJHRjVPaUF4TURBc1hISmNiaUFnSUNCa2RYSmhkR2x2YmpvZ01UQXdNQ3hjY2x4dUlDQWdJRzltWm5ObGREb2dNVEF3TEZ4eVhHNGdJQ0FnYjI1alpUb2dkSEoxWlZ4eVhHNGdJSDBwTzF4eVhHNGdJSE5qY205c2JFSjBia2x1YVhRb0tUdGNjbHh1SUNCa2NtOXdSRzkzYmtsdWFYUW9LVHRjY2x4dUlDQjBiMmRuYkdWRGIyeHNZWEJ6WlNncE8xeHlYRzRnSUdsdWFYUlFjbTlxWldOMFUyeHBaR1Z5S0NrN1hISmNiaUFnYVc1cGRFMWxiblZDZEc0b0tUdGNjbHh1SUNCcGJtbDBWRzl2YkhOQ2RHNXpLQ2s3WEhKY2JpQWdhVzVwZEZOamNtOXNiRUowYm5Nb0tUdGNjbHh1SUNCelpYUk5iMlJsYkhOSVpXbG5hSFFvS1R0Y2NseHVJQ0FrS0hkcGJtUnZkeWt1Y21WemFYcGxLR1JsWW05MWJtTmxLSE5sZEUxdlpHVnNjMGhsYVdkb2RDd2dNVFV3S1NrN1hISmNibjBwTzF4eVhHNWNjbHh1Wm5WdVkzUnBiMjRnYzJOeWIyeHNRblJ1U1c1cGRDZ3BJSHRjY2x4dUlDQWtLQ2N1Wm05dmRHVnlYMTkxY0MxaWRHNG5LUzVqYkdsamF5aG1kVzVqZEdsdmJpQW9aWFpsYm5RcElIdGNjbHh1SUNBZ0lIWmhjaUIwWVhKblpYUWdQU0FrS0hSb2FYTXVhR0Z6YUNrN1hISmNiaUFnSUNCcFppQW9kR0Z5WjJWMExteGxibWQwYUNrZ2UxeHlYRzRnSUNBZ0lDQmxkbVZ1ZEM1d2NtVjJaVzUwUkdWbVlYVnNkQ2dwTzF4eVhHNWNjbHh1SUNBZ0lDQWdKQ2duYUhSdGJDd2dZbTlrZVNjcExtRnVhVzFoZEdVb2UxeHlYRzRnSUNBZ0lDQWdJSE5qY205c2JGUnZjRG9nZEdGeVoyVjBMbTltWm5ObGRDZ3BMblJ2Y0Z4eVhHNGdJQ0FnSUNCOUxDQXhNREF3TENCbWRXNWpkR2x2YmlBb0tTQjdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIWmhjaUFrZEdGeVoyVjBJRDBnSkNoMFlYSm5aWFFwTzF4eVhHNGdJQ0FnSUNBZ0lDUjBZWEpuWlhRdVptOWpkWE1vS1R0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSkhSaGNtZGxkQzVwY3loY0lqcG1iMk4xYzF3aUtTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWtkR0Z5WjJWMExtRjBkSElvSjNSaFltbHVaR1Y0Snl3Z0p5MHhKeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQWtkR0Z5WjJWMExtWnZZM1Z6S0NrN1hISmNiaUFnSUNBZ0lDQWdmVHRjY2x4dUlDQWdJQ0FnZlNrN1hISmNiaUFnSUNCOVhISmNiaUFnZlNrN1hISmNibjFjY2x4dVhISmNibVoxYm1OMGFXOXVJR1J5YjNCRWIzZHVTVzVwZENncElIdGNjbHh1SUNBa0tDY3VZbkpsWVdSamNuVnRZbk5mWDJSa0xXSjBiaWNwTG1Oc2FXTnJLQ2hsZG1WdWRDa2dQVDRnZTF4eVhHNGdJQ0FnWTI5dWMzUWdhR0Z6UTJ4aGMzTWdQU0FrS0dWMlpXNTBMblJoY21kbGRDNXdZWEpsYm5SRmJHVnRaVzUwS1M1b1lYTkRiR0Z6Y3lnblluSmxZV1JqY25WdFluTmZYMlJrTFdKMGJpMXphRzkzSnlrN1hISmNiaUFnSUNCamIyNXpkQ0JsYkdWdFpXNTBjME52ZFc1MElEMGdKQ2duTG1KeVpXRmtZM0oxYldKelgxOWtaQzFpZEc0dGMyaHZkeWNwTG14bGJtZDBhRHRjY2x4dUlDQWdJR2xtSUNob1lYTkRiR0Z6Y3lBbUppQmxiR1Z0Wlc1MGMwTnZkVzUwS1NCN1hISmNiaUFnSUNBZ0lDUW9aWFpsYm5RdWRHRnlaMlYwTG5CaGNtVnVkRVZzWlcxbGJuUXBMbkpsYlc5MlpVTnNZWE56S0NkaWNtVmhaR055ZFcxaWMxOWZaR1F0WW5SdUxYTm9iM2NuS1R0Y2NseHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb0lXaGhjME5zWVhOeklDWW1JR1ZzWlcxbGJuUnpRMjkxYm5RcElIdGNjbHh1SUNBZ0lDQWdKQ2duTG1KeVpXRmtZM0oxYldKelgxOWtaQzFpZEc0dGMyaHZkeWNwTG5KbGJXOTJaVU5zWVhOektDZGljbVZoWkdOeWRXMWljMTlmWkdRdFluUnVMWE5vYjNjbktUdGNjbHh1SUNBZ0lDQWdKQ2hsZG1WdWRDNTBZWEpuWlhRdWNHRnlaVzUwUld4bGJXVnVkQ2t1WVdSa1EyeGhjM01vSjJKeVpXRmtZM0oxYldKelgxOWtaQzFpZEc0dGMyaHZkeWNwTzF4eVhHNGdJQ0FnZlNCbGJITmxJSHRjY2x4dUlDQWdJQ0FnSkNobGRtVnVkQzUwWVhKblpYUXVjR0Z5Wlc1MFJXeGxiV1Z1ZENrdVlXUmtRMnhoYzNNb0oySnlaV0ZrWTNKMWJXSnpYMTlrWkMxaWRHNHRjMmh2ZHljcE8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUgwcE8xeHlYRzVjY2x4dUlDQWtLSGRwYm1SdmR5a3VZMnhwWTJzb0tHVjJaVzUwS1NBOVBpQjdYSEpjYmlBZ0lDQnBaaUFvSVdWMlpXNTBMblJoY21kbGRDNXRZWFJqYUdWektDY3VZbkpsWVdSamNuVnRZbk5mWDJSa0xXSjBiaWNwS1NCN1hISmNiaUFnSUNBZ0lDUW9KeTVpY21WaFpHTnlkVzFpYzE5ZlpHUXRZblJ1TFhOb2IzY25LUzV5WlcxdmRtVkRiR0Z6Y3lnblluSmxZV1JqY25WdFluTmZYMlJrTFdKMGJpMXphRzkzSnlrN1hISmNiaUFnSUNCOVhISmNiaUFnZlNsY2NseHVmVnh5WEc1Y2NseHVablZ1WTNScGIyNGdkRzluWjJ4bFEyOXNiR0Z3YzJVb0tTQjdYSEpjYmlBZ2JHVjBJSFJwYldWdmRYUTdYSEpjYmlBZ0pDZ25MbVJsYzJOZlgzUnBkR3hsTFdOdmJHeGhjSE5sTFdKMGJpY3BMbU5zYVdOcktDaGxkbVZ1ZENrZ1BUNGdlMXh5WEc0Z0lDQWdKQ2duTG1SbGMyTmZYMjF2WW1sc1pTMTBhWFJzWlNjcExuUnZaMmRzWlVOc1lYTnpLQ2RoWTNScGRtVW5LVHRjY2x4dUlDQWdJR052Ym5OMElIQmhibVZzSUQwZ0pDZ25MbVJsYzJOZlgyTnZiR3hoY0hObExXTnZiblJoYVc1bGNpY3BXekJkTzF4eVhHNGdJQ0FnYVdZZ0tIQmhibVZzTG5OMGVXeGxMbTFoZUVobGFXZG9kQ2tnZTF4eVhHNGdJQ0FnSUNCd1lXNWxiQzV6ZEhsc1pTNXRZWGhJWldsbmFIUWdQU0J1ZFd4c08xeHlYRzRnSUNBZ0lDQjBhVzFsYjNWMElEMGdjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnY0dGdVpXd3VjM1I1YkdVdVpHbHpjR3hoZVNBOUlDZHViMjVsSnp0Y2NseHVJQ0FnSUNBZ2ZTd2dOakF3S1R0Y2NseHVJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUdOc1pXRnlWR2x0Wlc5MWRDaDBhVzFsYjNWMEtUdGNjbHh1SUNBZ0lDQWdjR0Z1Wld3dWMzUjViR1V1WkdsemNHeGhlU0E5SUNkaWJHOWpheWM3WEhKY2JpQWdJQ0FnSUhCaGJtVnNMbk4wZVd4bExtMWhlRWhsYVdkb2RDQTlJSEJoYm1Wc0xuTmpjbTlzYkVobGFXZG9kQ0FySUZ3aWNIaGNJanRjY2x4dUlDQWdJSDFjY2x4dUlDQjlLVnh5WEc1OVhISmNibHh5WEc1bWRXNWpkR2x2YmlCcGJtbDBVSEp2YW1WamRGTnNhV1JsY2lncElIdGNjbHh1SUNCamIyNXpkQ0J3Y205cVpXTjBjeUE5SUNRb0p5NXdjbTlxWldOMGMxOWZjMnhwWkdWeUp5azdYSEpjYmlBZ2NISnZhbVZqZEhNdWJHVnVaM1JvSUNZbUlIQnliMnBsWTNSekxuTnNhV05yS0h0Y2NseHVJQ0FnSUdsdVptbHVhWFJsT2lCbVlXeHpaU3hjY2x4dUlDQWdJSE5zYVdSbGMxUnZVMmh2ZHpvZ015eGNjbHh1SUNBZ0lITnNhV1JsYzFSdlUyTnliMnhzT2lBeExGeHlYRzRnSUNBZ2NISmxka0Z5Y205M09pQmdQR0oxZEhSdmJpQjBlWEJsUFZ3aVluVjBkRzl1WENJZ1kyeGhjM005WENKemJHbGpheTF3Y21WMlhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRtY2dkMmxrZEdnOVhDSXlOSEI0WENJZ2FHVnBaMmgwUFZ3aU1qUndlRndpSUhacFpYZENiM2c5WENJd0lEQWdNalFnTWpSY0lpQmhjbWxoTFd4aFltVnNQVndpVTJ4cFpHVnlJSEJ5WlhZZ1luVjBkRzl1SUdsamIyNWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjRzlzZVdkdmJpQm1hV3hzUFZ3aUl6YzFOelUzTlZ3aUlIQnZhVzUwY3oxY0lqRXdJRFlnT0M0MU9TQTNMalF4SURFekxqRTNJREV5SURndU5Ua2dNVFl1TlRrZ01UQWdNVGdnTVRZZ01USmNJajQ4TDNCdmJIbG5iMjQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjM1puUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWlkWFIwYjI0K1lDeGNjbHh1SUNBZ0lHNWxlSFJCY25KdmR6b2dZRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56UFZ3aWMyeHBZMnN0Ym1WNGRGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzWm5JSGRwWkhSb1BWd2lNalJ3ZUZ3aUlHaGxhV2RvZEQxY0lqSTBjSGhjSWlCMmFXVjNRbTk0UFZ3aU1DQXdJREkwSURJMFhDSWdZWEpwWVMxc1lXSmxiRDFjSWxOc2FXUmxjaUJ1WlhoMElHSjFkSFJ2YmlCcFkyOXVYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEJ2YkhsbmIyNGdabWxzYkQxY0lpTTNOVGMxTnpWY0lpQndiMmx1ZEhNOVhDSXhNQ0EySURndU5Ua2dOeTQwTVNBeE15NHhOeUF4TWlBNExqVTVJREUyTGpVNUlERXdJREU0SURFMklERXlYQ0krUEM5d2IyeDVaMjl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM04yWno1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBtQXNYSEpjYmlBZ0lDQnlaWE53YjI1emFYWmxPaUJiWEhKY2JpQWdJQ0FnSUh0Y2NseHVJQ0FnSUNBZ0lDQmljbVZoYTNCdmFXNTBPaUE1T1RJc1hISmNiaUFnSUNBZ0lDQWdjMlYwZEdsdVozTTZJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lITnNhV1JsYzFSdlUyaHZkem9nTWl4Y2NseHVJQ0FnSUNBZ0lDQjlMRnh5WEc0Z0lDQWdJQ0I5TEZ4eVhHNGdJQ0FnSUNCN1hISmNiaUFnSUNBZ0lDQWdZbkpsWVd0d2IybHVkRG9nTnpZNExGeHlYRzRnSUNBZ0lDQWdJSE5sZEhScGJtZHpPaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQnpiR2xrWlhOVWIxTm9iM2M2SURVc1hISmNiaUFnSUNBZ0lDQWdmU3hjY2x4dUlDQWdJQ0FnZlZ4eVhHNGdJQ0FnWFZ4eVhHNGdJSDBwTzF4eVhHNTlYSEpjYmx4eVhHNW1kVzVqZEdsdmJpQnBibWwwVFc5a1pXeHpVMnhwWkdWeUtDa2dlMXh5WEc0Z0lHTnZibk4wSUcxdlpHVnNjeUE5SUNRb0p5NXRiMlJsYkhNbktUdGNjbHh1SUNCcFppQW9JVzF2WkdWc2N5NXNaVzVuZEdncElISmxkSFZ5Ymp0Y2NseHVJQ0JqYjI1emRDQnpiR2xrWlhJZ1BTQnRiMlJsYkhNdWMyeHBZMnNvZTF4eVhHNGdJQ0FnYVc1bWFXNXBkR1U2SUdaaGJITmxMRnh5WEc0Z0lDQWdjMnhwWkdWelZHOVRhRzkzT2lCallXeGpUVzlrWld4elUyeHBaR1Z6S0Nrc1hISmNiaUFnSUNCemJHbGtaWE5VYjFOamNtOXNiRG9nTVN4Y2NseHVJQ0FnSUhabGNuUnBZMkZzT2lCMGNuVmxMRnh5WEc0Z0lDQWdjSEpsZGtGeWNtOTNPaUJnUEdKMWRIUnZiaUIwZVhCbFBWd2lZblYwZEc5dVhDSWdZMnhoYzNNOVhDSnpiR2xqYXkxd2NtVjJYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkbWNnZG1sbGQwSnZlRDFjSWpBZ01DQXlOQ0F5TkZ3aUlHRnlhV0V0YkdGaVpXdzlYQ0pUYkdsa1pYSWdjSEpsZGlCaWRYUjBiMjRnYVdOdmJsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHdiMng1WjI5dUlHWnBiR3c5WENJak56VTNOVGMxWENJZ2NHOXBiblJ6UFZ3aU1UQWdOaUE0TGpVNUlEY3VOREVnTVRNdU1UY2dNVElnT0M0MU9TQXhOaTQxT1NBeE1DQXhPQ0F4TmlBeE1sd2lQand2Y0c5c2VXZHZiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwySjFkSFJ2Ymo1Z0xGeHlYRzRnSUNBZ2JtVjRkRUZ5Y205M09pQmdQR0oxZEhSdmJpQjBlWEJsUFZ3aVluVjBkRzl1WENJZ1kyeGhjM005WENKemJHbGpheTF1WlhoMFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRtY2dkbWxsZDBKdmVEMWNJakFnTUNBeU5DQXlORndpSUdGeWFXRXRiR0ZpWld3OVhDSlRiR2xrWlhJZ2JtVjRkQ0JpZFhSMGIyNGdhV052Ymx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4d2IyeDVaMjl1SUdacGJHdzlYQ0lqTnpVM05UYzFYQ0lnY0c5cGJuUnpQVndpTVRBZ05pQTRMalU1SURjdU5ERWdNVE11TVRjZ01USWdPQzQxT1NBeE5pNDFPU0F4TUNBeE9DQXhOaUF4TWx3aVBqd3ZjRzlzZVdkdmJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emRtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJKMWRIUnZiajVnTEZ4eVhHNGdJSDBwTzF4eVhHNWNjbHh1SUNBa0tIZHBibVJ2ZHlrdWNtVnphWHBsS0dSbFltOTFibU5sS0NncElEMCtJSHRjY2x4dUlDQWdJSE5zYVdSbGNpNXpiR2xqYXlnbmMyeHBZMnRUWlhSUGNIUnBiMjRuTENBbmMyeHBaR1Z6Vkc5VGFHOTNKeXdnWTJGc1kwMXZaR1ZzYzFOc2FXUmxjeWdwTENCMGNuVmxLVHRjY2x4dUlDQjlMQ0F4TlRBcEtUdGNjbHh1ZlZ4eVhHNW1kVzVqZEdsdmJpQmpZV3hqVFc5a1pXeHpVMnhwWkdWektDa2dlMXh5WEc0Z0lHTnZibk4wSUdobFlXUmxja2hsYVdkb2RDQTlJRGd3TzF4eVhHNGdJR052Ym5OMElITnNhV1JsY2tKMGJuTWdQU0EyT0R0Y2NseHVJQ0JqYjI1emRDQjBiM0JRWVdSa2FXNW5JRDBnTVRBN1hISmNiaUFnWTI5dWMzUWdjMnhwWkdWSVpXbG5hSFFnUFNCM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBOElERTJNREFnUHlBeE1EQWdPaUF4TlRBN1hISmNibHh5WEc0Z0lHTnZibk4wSUhOc2FXUmxja2hsYVdkb2RDQTlJR2hsWVdSbGNraGxhV2RvZENBcklITnNhV1JsY2tKMGJuTWdLeUIwYjNCUVlXUmthVzVuTzF4eVhHNGdJSEpsZEhWeWJpQk5ZWFJvTG1ac2IyOXlLQ2gzYVc1a2IzY3VhVzV1WlhKSVpXbG5hSFFnTFNCb1pXRmtaWEpJWldsbmFIUWdMU0J6Ykdsa1pYSkNkRzV6SUMwZ2RHOXdVR0ZrWkdsdVp5a2dMeUJ6Ykdsa1pVaGxhV2RvZENrN1hISmNibjFjY2x4dVhISmNibVoxYm1OMGFXOXVJR2x1YVhSVWIyOXNjMEowYm5Nb0tTQjdYSEpjYmlBZ2JHVjBJSE5zYVdSbGNqdGNjbHh1SUNCamIyNXpkQ0JtZFd4c2MyTnlaV1Z1SUQwZ0pDZ25MbVoxYkd4elkzSmxaVzRuS1Z4eVhHNGdJQ1FvSnk1dGIyUmxiQzB6WkY5ZlpuVnNiSE5qY21WbGJpMWlkRzRuS1M1amJHbGpheWdvS1NBOVBpQjdYSEpjYmlBZ0lDQm1kV3hzYzJOeVpXVnVMbU56Y3lnblpHbHpjR3hoZVNjc0lDZG1iR1Y0SnlsY2NseHVJQ0FnSUhObGRGUnBiV1Z2ZFhRb0tDa2dQVDRnZXlCY2NseHVJQ0FnSUNBZ1puVnNiSE5qY21WbGJpNWpjM01vSjI5d1lXTnBkSGtuTENBeEtUdGNjbHh1SUNBZ0lIMHNJREFwTzF4eVhHNGdJQ0FnSkNnbkxtZGhiR3hsY25rdFkyOXVkR0ZwYm1WeUp5a3VZM056S0Nka2FYTndiR0Y1Snl3Z0oyNXZibVVuS1R0Y2NseHVYSEpjYmlBZ0lDQnpiR2xrWlhJZ1BTQWtLQ2N1Wm5Wc2JITmpjbVZsYmw5ZmMyeHBaR1Z5SnlrdWMyeHBZMnNvZTF4eVhHNGdJQ0FnSUNCcGJtWnBibWwwWlRvZ1ptRnNjMlVzWEhKY2JpQWdJQ0FnSUhOc2FXUmxjMVJ2VTJodmR6b2dNU3hjY2x4dUlDQWdJQ0FnYzJ4cFpHVnpWRzlUWTNKdmJHdzZJREVzWEhKY2JpQWdJQ0FnSUdObGJuUmxjazF2WkdVNklIUnlkV1VzWEhKY2JpQWdJQ0FnSUhCeVpYWkJjbkp2ZHpvZ1lEeGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpQVndpYzJ4cFkyc3RjSEpsZGx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRtY2dkbWxsZDBKdmVEMWNJakFnTUNBeU5DQXlORndpSUdGeWFXRXRiR0ZpWld3OVhDSlRiR2xrWlhJZ2NISmxkaUJpZFhSMGIyNGdhV052Ymx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIQnZiSGxuYjI0Z1ptbHNiRDFjSWlNM05UYzFOelZjSWlCd2IybHVkSE05WENJeE1DQTJJRGd1TlRrZ055NDBNU0F4TXk0eE55QXhNaUE0TGpVNUlERTJMalU1SURFd0lERTRJREUySURFeVhDSStQQzl3YjJ4NVoyOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjM1puUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMkoxZEhSdmJqNWdMRnh5WEc0Z0lDQWdJQ0J1WlhoMFFYSnliM2M2SUdBOFluVjBkRzl1SUhSNWNHVTlYQ0ppZFhSMGIyNWNJaUJqYkdGemN6MWNJbk5zYVdOckxXNWxlSFJjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNabklIWnBaWGRDYjNnOVhDSXdJREFnTWpRZ01qUmNJaUJoY21saExXeGhZbVZzUFZ3aVUyeHBaR1Z5SUc1bGVIUWdZblYwZEc5dUlHbGpiMjVjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4d2IyeDVaMjl1SUdacGJHdzlYQ0lqTnpVM05UYzFYQ0lnY0c5cGJuUnpQVndpTVRBZ05pQTRMalU1SURjdU5ERWdNVE11TVRjZ01USWdPQzQxT1NBeE5pNDFPU0F4TUNBeE9DQXhOaUF4TWx3aVBqd3ZjRzlzZVdkdmJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTjJaejVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWlkWFIwYjI0K1lGeHlYRzRnSUNBZ2ZTazdYSEpjYmlBZ2ZTazdYSEpjYmlBZ0pDZ25MbVoxYkd4elkzSmxaVzVmWDJOc2IzTmxMV0owYmljcExtTnNhV05yS0NncElEMCtJSHRjY2x4dUlDQWdJR1oxYkd4elkzSmxaVzR1WTNOektDZHZjR0ZqYVhSNUp5d2dNQ2xjY2x4dUlDQWdJQ1FvSnk1bllXeHNaWEo1TFdOdmJuUmhhVzVsY2ljcExtTnpjeWduWkdsemNHeGhlU2NzSUNkbWJHVjRKeWs3WEhKY2JpQWdJQ0JjY2x4dUlDQWdJSE5sZEZScGJXVnZkWFFvS0NrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0JtZFd4c2MyTnlaV1Z1TG1OemN5Z25aR2x6Y0d4aGVTY3NJQ2R1YjI1bEp5azdYSEpjYmlBZ0lDQWdJSE5zYVdSbGNpNXpiR2xqYXlnbmRXNXpiR2xqYXljcE8xeHlYRzRnSUNBZ2ZTd2dNekF3S1R0Y2NseHVJQ0I5S1R0Y2NseHVmVnh5WEc1bWRXNWpkR2x2YmlCcGJtbDBUV1Z1ZFVKMGJpZ3BJSHRjY2x4dUlDQmpiMjV6ZENCdFpXNTFJRDBnSkNnbkxtMXZZbWxzWlMxdFpXNTFKeWs3WEhKY2JpQWdiR1YwSUhkaGMwWjFiR3h6WTNKbFpXNGdQU0JtWVd4elpUdGNjbHh1SUNBa0tDY3VhR1ZoWkdWeVgxOXRaVzUxTFdKMGJpY3BMbU5zYVdOcktDZ3BJRDArSUh0Y2NseHVJQ0FnSUcxbGJuVXVZM056S0Nka2FYTndiR0Y1Snl3Z0oyWnNaWGduS1Z4eVhHNGdJQ0FnYzJWMFZHbHRaVzkxZENnb0tTQTlQaUI3SUZ4eVhHNGdJQ0FnSUNCdFpXNTFMbU56Y3lnbmIzQmhZMmwwZVNjc0lERXBPMXh5WEc0Z0lDQWdmU3dnTUNrN1hISmNiaUFnSUNBa0tDY3VaMkZzYkdWeWVTMWpiMjUwWVdsdVpYSW5LUzVqYzNNb0oyUnBjM0JzWVhrbkxDQW5ibTl1WlNjcE8xeHlYRzRnSUNBZ0pDZ25MbWhsWVdSbGNpY3BMbU56Y3lnblpHbHpjR3hoZVNjc0lDZHViMjVsSnlrN1hISmNibHh5WEc0Z0lDQWdhV1lnS0NRb0p5NW1kV3hzYzJOeVpXVnVKeWt1WTNOektDZGthWE53YkdGNUp5a2dQVDA5SUNkbWJHVjRKeWtnZTF4eVhHNGdJQ0FnSUNCM1lYTkdkV3hzYzJOeVpXVnVJRDBnZEhKMVpUdGNjbHh1SUNBZ0lDQWdKQ2duTG1aMWJHeHpZM0psWlc0bktTNWpjM01vSjJScGMzQnNZWGtuTENBbmJtOXVaU2NwTzF4eVhHNGdJQ0FnZlNCbGJITmxJSHRjY2x4dUlDQWdJQ0FnZDJGelJuVnNiSE5qY21WbGJpQTlJR1poYkhObE8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUgwcE8xeHlYRzVjY2x4dUlDQWtLQ2N1Ylc5aWFXeGxMVzFsYm5WZlgyTnNiM05sTFdKMGJpY3BMbU5zYVdOcktDZ3BJRDArSUh0Y2NseHVJQ0FnSUcxbGJuVXVZM056S0NkdmNHRmphWFI1Snl3Z01DazdYSEpjYmlBZ0lDQWtLQ2N1YUdWaFpHVnlKeWt1WTNOektDZGthWE53YkdGNUp5d2dKMkpzYjJOckp5azdYSEpjYmlBZ0lDQWtLQ2N1WjJGc2JHVnllUzFqYjI1MFlXbHVaWEluS1M1amMzTW9KMlJwYzNCc1lYa25MQ0FuWm14bGVDY3BPMXh5WEc1Y2NseHVJQ0FnSUdsbUlDaDNZWE5HZFd4c2MyTnlaV1Z1S1NCN1hISmNiaUFnSUNBZ0lDUW9KeTVtZFd4c2MyTnlaV1Z1SnlrdVkzTnpLQ2RrYVhOd2JHRjVKeXdnSjJac1pYZ25LVHRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJRnh5WEc0Z0lDQWdjMlYwVkdsdFpXOTFkQ2dvS1NBOVBpQjdYSEpjYmlBZ0lDQWdJRzFsYm5VdVkzTnpLQ2RrYVhOd2JHRjVKeXdnSjI1dmJtVW5LVHRjY2x4dUlDQWdJSDBzSURNd01DazdYSEpjYmlBZ2ZTazdYSEpjYm4xY2NseHVYSEpjYm1aMWJtTjBhVzl1SUdsdWFYUlRZM0p2Ykd4Q2RHNXpLQ2tnZTF4eVhHNGdJQ1FvSnk1dGIyUmxiSE5mWDNOamNtOXNiQzFrYjNkdUp5a3VZMnhwWTJzb0tDa2dQVDRnZTF4eVhHNGdJQ0FnWTI5dWMzUWdZMjl1ZEdGcGJtVnlJRDBnSkNnbkxtMXZaR1ZzYzE5ZlkyOXVkR0ZwYm1WeUp5azdYSEpjYmlBZ0lDQmpiMjV6ZENCcGRHVnRTR1ZwWjJoMElEMGdkMmx1Wkc5M0xtbHVibVZ5VjJsa2RHZ2dQQ0F4TmpBd0lEOGdNVEF3SURvZ01UVXdPMXh5WEc0Z0lDQWdZMjl1YzNRZ2RHOXdJRDBnWTI5dWRHRnBibVZ5TG5OamNtOXNiRlJ2Y0NncE8xeHlYRzRnSUNBZ1kyOXVkR0ZwYm1WeUxtRnVhVzFoZEdVb2UxeHlYRzRnSUNBZ0lDQnpZM0p2Ykd4VWIzQTZJSFJ2Y0NBdElDaDBiM0FnSlNCcGRHVnRTR1ZwWjJoMEtTQXJJR2wwWlcxSVpXbG5hSFJjY2x4dUlDQWdJSDBzSURNd01DazdYSEpjYmlBZ2ZTazdYSEpjYmlBZ0pDZ25MbTF2WkdWc2MxOWZjMk55YjJ4c0xYVndKeWt1WTJ4cFkyc29LQ2tnUFQ0Z2UxeHlYRzRnSUNBZ1kyOXVjM1FnYVhSbGJVaGxhV2RvZENBOUlIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lEd2dNVFl3TUNBL0lERXdNQ0E2SURFMU1EdGNjbHh1SUNBZ0lHTnZibk4wSUdOdmJuUmhhVzVsY2lBOUlDUW9KeTV0YjJSbGJITmZYMk52Ym5SaGFXNWxjaWNwTzF4eVhHNGdJQ0FnWTI5dWMzUWdkRzl3SUQwZ1kyOXVkR0ZwYm1WeUxuTmpjbTlzYkZSdmNDZ3BPMXh5WEc0Z0lDQWdZMjl1ZEdGcGJtVnlMbUZ1YVcxaGRHVW9lMXh5WEc0Z0lDQWdJQ0J6WTNKdmJHeFViM0E2SUhSdmNDQXRJQ2gwYjNBZ0pTQnBkR1Z0U0dWcFoyaDBJSHg4SUdsMFpXMUlaV2xuYUhRcFhISmNiaUFnSUNCOUxDQXpNREFwTzF4eVhHNGdJSDBwTzF4eVhHNTlYSEpjYmx4eVhHNW1kVzVqZEdsdmJpQnpaWFJOYjJSbGJITklaV2xuYUhRb0tTQjdYSEpjYmlBZ1kyOXVjM1FnYVhSbGJVaGxhV2RvZENBOUlIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lEd2dNVFl3TUNBL0lERXdNQ0E2SURFMU1EdGNjbHh1SUNCamIyNXpkQ0J0YjJSbGJITklaV2xuYUhRZ1BTQjNhVzVrYjNjdWFXNXVaWEpJWldsbmFIUWdMU0F4T0RZN1hISmNiaUFnSkNnbkxtMXZaR1ZzYzE5ZlkyOXVkR0ZwYm1WeUp5a3VhR1ZwWjJoMEtHMXZaR1ZzYzBobGFXZG9kQ0F0SUNodGIyUmxiSE5JWldsbmFIUWdKU0JwZEdWdFNHVnBaMmgwS1NrN1hISmNibjBpWFgwPSJ9
