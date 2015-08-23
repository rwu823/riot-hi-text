/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var escapeRegExp = __webpack_require__(1);

	var regexpEscapes = {
	    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
	    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
	    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
	    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
	    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
	};

	/** Used to escape characters for inclusion in compiled string literals. */
	var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	};

	var re = '';

	for (var k in stringEscapes) {
	    re += '\\\\' + stringEscapes[k] + '|';
	}
	for (var k in regexpEscapes) {
	    re += '\\\\' + regexpEscapes[k] + '|';
	}

	var tagSrc = '(<\/?[^>]+>)?';

	riot.tag('hi-text', '<yield />', function (opts) {
	    var tag = this;
	    var el = this.root;
	    var caseSensitive = /^(true|)$/.test(opts['case-sensitive']);

	    tag.resetHTML = function () {
	        this._html = this.root.innerHTML;

	        return this;
	    };

	    tag.setHighlight = function (word, caseSens) {
	        if (!tag._html) tag.resetHTML();

	        if (typeof caseSens === 'undefined') {
	            caseSens = caseSensitive;
	        }

	        word = word.trim();
	        tag.hasMatched = false;

	        var className = tag.opts['class-name'] || 'highlight';

	        if (word.length > 1) {
	            word = escapeRegExp(word);

	            word = word.match(new RegExp(re + '\\.|.', 'g'));

	            if (!word || !tag._html) return;

	            // skip `<tag></tag>`
	            word = tagSrc + word.join(tagSrc) + tagSrc;

	            var qREi = new RegExp('(' + word + ')', caseSens ? '' : 'i');
	            var qREig = new RegExp(qREi.source, caseSens ? 'g' : 'ig');

	            if (qREi.test(tag._html)) {
	                tag.hasMatched = true;
	                tag.root.innerHTML = tag.root.innerHTML.replace(qREig, '<span class="' + className + '">$1</span>');
	            }
	        } else {
	            (function () {
	                var highlight = function highlight(rootNode) {

	                    var wrap = function wrap(node) {
	                        if (node.nodeType === 3) {
	                            var pos = caseSens ? node.data.indexOf(word) : node.data.toLowerCase().indexOf(word.toLowerCase());

	                            if (pos < 0) return;

	                            var nt = undefined;

	                            if (pos === 0) {
	                                nt = node.splitText(word.length);
	                            } else if (pos > 0) {
	                                nt = node.splitText(pos).splitText(word.length);
	                            }

	                            var target = nt.previousSibling;

	                            var span = document.createElement('span');
	                            span.className = className;
	                            span.textContent = target.data;

	                            nt.parentNode.replaceChild(span, target);
	                            tag.hasMatched = true;
	                            wrap(nt);
	                        } else if (node.nodeType === 1 && node.childNodes && !(node.tagName === 'SPAN' && node.classList.contains(className)) && !/^(style|script)$/i.test(node.tagName)) {
	                            highlight(node);
	                        }
	                    };

	                    for (var i = 0; i < rootNode.childNodes.length; ++i) {
	                        wrap(rootNode.childNodes[i]);
	                    }

	                    return;
	                };

	                highlight(el);
	            })();
	        }

	        return this;
	    };

	    tag.clean = function () {
	        this.root.innerHTML = this._html;
	        return this;
	    };

	    tag.on('mount', function () {
	        tag.resetHTML();
	        tag.trigger('mounted');
	    });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(2),
	    escapeRegExpChar = __webpack_require__(3);

	/**
	 * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
	 * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
	 */
	var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
	    reHasRegExpChars = RegExp(reRegExpChars.source);

	/**
	 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	 */
	function escapeRegExp(string) {
	  string = baseToString(string);
	  return (string && reHasRegExpChars.test(string))
	    ? string.replace(reRegExpChars, escapeRegExpChar)
	    : (string || '(?:)');
	}

	module.exports = escapeRegExp;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  return value == null ? '' : (value + '');
	}

	module.exports = baseToString;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/** Used to escape characters for inclusion in compiled regexes. */
	var regexpEscapes = {
	  '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
	  '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
	  'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
	  'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
	  'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
	};

	/** Used to escape characters for inclusion in compiled string literals. */
	var stringEscapes = {
	  '\\': '\\',
	  "'": "'",
	  '\n': 'n',
	  '\r': 'r',
	  '\u2028': 'u2028',
	  '\u2029': 'u2029'
	};

	/**
	 * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
	 *
	 * @private
	 * @param {string} chr The matched character to escape.
	 * @param {string} leadingChar The capture group for a leading character.
	 * @param {string} whitespaceChar The capture group for a whitespace character.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
	  if (leadingChar) {
	    chr = regexpEscapes[chr];
	  } else if (whitespaceChar) {
	    chr = stringEscapes[chr];
	  }
	  return '\\' + chr;
	}

	module.exports = escapeRegExpChar;


/***/ }
/******/ ]);