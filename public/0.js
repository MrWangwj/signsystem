webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(82)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(34);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 34 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(202)
  __webpack_require__(204)
  __webpack_require__(206)
  __webpack_require__(208)
  __webpack_require__(210)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(212),
  /* template */
  __webpack_require__(279),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-43186183",
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/resources/assets/js/components/wechat/course/Count.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Count.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-43186183", Component.options)
  } else {
    hotAPI.reload("data-v-43186183", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g,
	EMPTY = '';

var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
	trim = String.prototype.trim;

var _trim = trim ?
	function(str) {
		return str == null ? EMPTY : trim.call(str);
	} : function(str) {
		return str == null ? EMPTY : (str + '').replace(RE_TRIM, EMPTY);
	};

function upperCase() {
	return arguments[1].toUpperCase();
}

function Empty() {}

function createObject(proto, constructor) {
	var newProto;
	if (Object.create) {
		newProto = Object.create(proto);
	} else {
		Empty.prototype = proto;
		newProto = new Empty();
	}
	newProto.constructor = constructor;
	return newProto;
}

function getNodes(node, rootNode) {
	if (!node) return;
	if (node.nodeType) return [node];
	var rootNode = rootNode && rootNode.nodeType ? rootNode : document;
	if (node && typeof node === "string") {
		return rootNode.querySelectorAll(node);
	}
	return;
}

// Useful for temporary DOM ids.
var idCounter = 0;

var getOffsetTop = function(el) {
	var offset = el.offsetTop;
	if (el.offsetParent != null) offset += getOffsetTop(el.offsetParent);
	return offset;
};
var getOffsetLeft = function(el) {
	var offset = el.offsetLeft;
	if (el.offsetParent != null) offset += getOffsetLeft(el.offsetParent);
	return offset;
};

var Util = {
	// Is a given variable an object?
	isObject: function(obj) {
		return obj === Object(obj);
	},
	isArray: Array.isArray || function(obj) {
		return toString.call(obj) == '[object Array]';
	},
	// Is a given array, string, or object empty?
	// An "empty" object has no enumerable own-properties.
	isEmpty: function(obj) {
		if (obj == null) return true;
		if (this.isArray(obj) || this.isString(obj)) return obj.length === 0;
		for (var key in obj)
			if (this.has(obj, key)) return false;
		return true;
	},
	mix: function(to, from, deep) {
		for (var i in from) {
			to[i] = from[i];
		}
		return to;
	},
	extend: function(r, s, px, sx) {
		if (!s || !r) {
			return r;
		}
		var sp = s.prototype,
			rp;
		// add prototype chain
		rp = createObject(sp, r);
		r.prototype = this.mix(rp, r.prototype);
		r.superclass = createObject(sp, s);
		// add prototype overrides
		if (px) {
			this.mix(rp, px);
		}
		// add object overrides
		if (sx) {
			this.mix(r, sx);
		}
		return r;
	},
	/**
	 * test whether a string start with a specified substring
	 * @param {String} str the whole string
	 * @param {String} prefix a specified substring
	 * @return {Boolean} whether str start with prefix
	 * @member util
	 */
	startsWith: function(str, prefix) {
		return str.lastIndexOf(prefix, 0) === 0;
	},

	/**
	 * test whether a string end with a specified substring
	 * @param {String} str the whole string
	 * @param {String} suffix a specified substring
	 * @return {Boolean} whether str end with suffix
	 * @member util
	 */
	endsWith: function(str, suffix) {
		var ind = str.length - suffix.length;
		return ind >= 0 && str.indexOf(suffix, ind) === ind;
	},
	/**
	 * Removes the whitespace from the beginning and end of a string.
	 * @method
	 * @member util
	 */
	trim: _trim,
	/**
	 * Substitutes keywords in a string using an object/array.
	 * Removes undef keywords and ignores escaped keywords.
	 * @param {String} str template string
	 * @param {Object} o json data
	 * @member util
	 * @param {RegExp} [regexp] to match a piece of template string
	 */
	substitute: function(str, o, regexp) {
		if (typeof str !== 'string' || !o) {
			return str;
		}

		return str.replace(regexp || SUBSTITUTE_REG, function(match, name) {
			if (match.charAt(0) === '\\') {
				return match.slice(1);
			}
			return (o[name] === undefined) ? EMPTY : o[name];
		});
	},
	/**
	 * vendors
	 * @return { String } webkit|moz|ms|o
	 * @memberOf Util
	 */
	vendor: (function() {
		var el = document.createElement('div').style;
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;
		for (; i < l; i++) {
			transform = vendors[i] + 'ransform';
			if (transform in el) return vendors[i].substr(0, vendors[i].length - 1);
		}
		return false;
	})(),
	/**
	 *  add vendor to attribute
	 *  @memberOf Util
	 *  @param {String} attrName name of attribute
	 *  @return { String }
	 **/
	prefixStyle: function(attrName) {
		if (this.vendor === false) return false;
		if (this.vendor === '') return attrName;
		return this.vendor + attrName.charAt(0).toUpperCase() + attrName.substr(1);
	},
	/**
	 * judge if has class
	 * @memberOf Util
	 * @param  {HTMLElement}  el
	 * @param  {String}  className
	 * @return {Boolean}
	 */
	hasClass: function(el, className) {
		return el && el.className && className && el.className.indexOf(className) != -1;
	},
	/**
	 * add className for the element
	 * @memberOf Util
	 * @param  {HTMLElement}  el
	 * @param  {String}  className
	 */
	addClass: function(el, className) {
		if (el && className && !this.hasClass(el, className)) {
			el.className += " " + className;
		}
	},
	/**
	 * remove className for the element
	 * @memberOf Util
	 * @param  {HTMLElement}  el
	 * @param  {String}  className
	 */
	removeClass: function(el, className) {
		if (el && el.className && className) {
			el.className = el.className.replace(className, "");
		}
	},
	/**
	 * remove an element
	 * @memberOf Util
	 * @param  {HTMLElement}  el
	 */
	remove: function(el) {
		if (!el || !el.parentNode) return;
		el.parentNode.removeChild(el);
	},
	/**
	 * get offset top
	 * @memberOf Util
	 * @param  {HTMLElement}   el
	 * @return {Number} offsetTop
	 */
	getOffsetTop: getOffsetTop,
	/**
	 * get offset left
	 * @memberOf Util
	 * @param  {HTMLElement}  el
	 * @return {Number} offsetLeft
	 */
	getOffsetLeft: getOffsetLeft,
	/**
	 * get offset left
	 * @memberOf Util
	 * @param  {HTMLElement} el
	 * @param  {String} selector
	 * @param  {HTMLElement} rootNode
	 * @return {HTMLElement} parent element
	 */
	findParentEl: function(el, selector, rootNode) {
		var rs = null,
			parent = null;
		var type = /^#/.test(selector) ? "id" : /^\./.test(selector) ? "class" : "tag";
		var sel = selector.replace(/\.|#/g, "");
		if (rootNode && typeof rootNode === "string") {
			rootNode = document.querySelector(rootNode);
		}
		rootNode = rootNode || document.body;
		if (!el || !selector) return;
		if (type == "class" && el.className && el.className.match(sel)) {
			return el;
		} else if (type == "id" && el.id && _trim(el.id) == sel) {
			return el;
		} else if (type == "tag" && el.tagName.toLowerCase() == sel) {
			return el;
		}
		while (!rs) {
			if (parent == rootNode) break;
			parent = el.parentNode;
			if (!parent) break;
			if ((type == "class" && parent.className && parent.className.match(sel)) || (type == "id" && parent.id && _trim(parent.id) == sel) || (type == "tag" && parent.tagName && parent.tagName.toLowerCase() == sel)) {
				rs = parent
				return rs;
				break;
			} else {
				el = parent;
			}
		}
		return null;
	},
	/**
	 * Generate a unique integer id (unique within the entire client session).
	 * @param  {String} prefix
	 * @return {String} guid
	 */
	guid: function(prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	},
	/**
	 * judge if is an android os
	 * @return {Boolean} [description]
	 */
	isAndroid: function() {
		return /Android /.test(window.navigator.appVersion);
	},
	/**
	 * judge if is an android device with low  performance
	 * @return {Boolean}
	 */
	isBadAndroid: function() {
		return /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion))
	},
	px2Num: function(px) {
		return Number(px.replace(/px/, ''));
	},
	getNodes: getNodes,
	getNode: function(node, rootNode) {
		var nodes = getNodes(node, rootNode);
		return nodes && nodes[0];
	},
	stringifyStyle: function(style) {
		var styleStr = "";
		for (var i in style) {
			styleStr += [i, ":", style[i], ";"].join("");
		}
		return styleStr;
	}
}

// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
var names = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
for (var i = 0; i < names.length; i++) {
	Util['is' + names[i]] = function(obj) {
		return toString.call(obj) == '[object ' + names[i] + ']';
	};
}

if (typeof module == 'object' && module.exports) {
	module.exports = Util;
}
/** ignored by jsdoc **/
else {
	return Util;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
var Events = __webpack_require__(242);
/** 
      @constructor 
      @mixes Events
      */
var Base = function() {}

Util.mix(Base.prototype, Events);

Util.mix(Base.prototype, {
	/**
	 * @memberof Base
	 * @param  {object} plugin plug a plugin
	 */
	plug: function(plugin) {
		var self = this;
		if (!plugin || !plugin.pluginId) return;
		if (!self.__plugins) {
			self.__plugins = [];
		}
		var __plugin = self.getPlugin(plugin.pluginId);
		__plugin && self.unplug(plugin.pluginId);
		plugin.pluginInitializer(self);
		self.__plugins.push(plugin);
		return self;
	},
	/**
	 * @memberof Base
	 * @param  {object|string} plugin unplug a plugin by pluginId or plugin instance
	 */
	unplug: function(plugin) {
		var self = this;
		if (!plugin || !self.__plugins) return;
		var _plugin = typeof plugin == "string" ? self.getPlugin(plugin) : plugin;
		_plugin.pluginDestructor(self);
		for (var i = 0, l = self.__plugins.length;i < l;i++) {
			if (self.__plugins[i] == _plugin) {
				return self.__plugins.splice(i, 1);
			}
		}
	},
	/**
	 * @memberof Base
	 * @param  {object|string} plugin get plugin by pluginId
	 */
	getPlugin: function(pluginId) {
		var self = this;
		var plugins = [];
		if(!self.__plugins) return;
		for (var i = 0, l = self.__plugins.length;i < l;i++) {
			if (self.__plugins[i] && self.__plugins[i].pluginId == pluginId) {
				plugins.push(self.__plugins[i])
			}
		}
		return plugins.length > 1 ? plugins : plugins[0] || null;
	}
});

if (typeof module == 'object' && module.exports) {
	module.exports = Base;
}
/** ignored by jsdoc **/
else {
	return Base;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
var Timer = __webpack_require__(170);
var Easing = __webpack_require__(171);
var Base = __webpack_require__(165);
//transform
var vendorTransform = Util.prefixStyle("transform");
//transition webkitTransition MozTransition OTransition msTtransition
var vendorTransition = Util.prefixStyle("transition");

var vendorTransitionDuration = Util.prefixStyle("transitionDuration");

var vendorTransformOrigin = Util.prefixStyle("transformOrigin");

var vendorTransitionEnd = Util.vendor ? Util.prefixStyle("transitionEnd") : "transitionend";

var vendorTransformStr = Util.vendor ? ["-", Util.vendor, "-transform"].join("") : "transform";

var translateTpl = 'translateX({translateX}px) translateY({translateY}px) translateZ(0)';
//limit attrs
var animAttrs = {
	'transform': true,
	'opacity': true,
	'scrollTop': true,
	'scrollLeft': true
};

function myParse(v) {
	return Math.round(parseFloat(v) * 1e5) / 1e5;
}

function defaultDecompose() {
	return {
		translateX: 0,
		translateY: 0,
		rotate: 0,
		skewX: 0,
		skewY: 0,
		scaleX: 1,
		scaleY: 1
	};
}

function toMatrixArray(matrix) {
	matrix = matrix.split(/,/);
	matrix = Array.prototype.map.call(matrix, function(v) {
		return myParse(v);
	});
	return matrix;
}

function decomposeMatrix(matrix) {
	matrix = toMatrixArray(matrix);
	var scaleX, scaleY, skew,
		A = matrix[0],
		B = matrix[1],
		C = matrix[2],
		D = matrix[3];

	// Make sure matrix is not singular
	if (A * D - B * C) {
		scaleX = Math.sqrt(A * A + B * B);
		skew = (A * C + B * D) / (A * D - C * B);
		scaleY = (A * D - B * C) / scaleX;
		// step (6)
		if (A * D < B * C) {
			skew = -skew;
			scaleX = -scaleX;
		}
		// matrix is singular and cannot be interpolated
	} else {
		// In this case the elem shouldn't be rendered, hence scale == 0
		scaleX = scaleY = skew = 0;
	}

	// The recomposition order is very important
	// see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
	return {
		translateX: myParse(matrix[4]),
		translateY: myParse(matrix[5]),
		rotate: myParse(Math.atan2(B, A) * 180 / Math.PI),
		skewX: myParse(Math.atan(skew) * 180 / Math.PI),
		skewY: 0,
		scaleX: myParse(scaleX),
		scaleY: myParse(scaleY)
	};
}

function getTransformInfo(transform) {
	transform = transform.split(')');
	var trim = Util.trim,
		i = -1,
		l = transform.length - 1,
		split, prop, val,
		ret = defaultDecompose();

	// Loop through the transform properties, parse and multiply them
	while (++i < l) {
		split = transform[i].split('(');
		prop = trim(split[0]);
		val = split[1];
		switch (prop) {
			case 'translateX':
			case 'translateY':
			case 'scaleX':
			case 'scaleY':
				ret[prop] = myParse(val);
				break;
			case 'translate':
			case 'translate3d':
				val = val.split(',');
				ret.translateX = myParse(val[0]);
				ret.translateY = myParse(val[1] || 0);
				break;
			case 'scale':
				val = val.split(',');
				ret.scaleX = myParse(val[0]);
				ret.scaleY = myParse(val[1] || val[0]);
				break;
			case 'matrix':
				return decomposeMatrix(val);
		}
	}

	return ret;
}

/**
 * animate function
 * @constructor
 * @param {HTMLElement} el element to animate
 * @param {Object} config config for animate
 * @param {Object} config.css
 * @param {Number} config.duration
 * @param {String} config.easing
 * @extends {Base}
 */
function Animate(el, cfg) {
	if (!el || !cfg || !cfg.css) return;
	var self = this;
	self.cfg = cfg;
	self.el = el;
	var duration = cfg.duration || 0,
		easing = cfg.easing || "ease",
		delay = cfg.delay || 0;
	//trigger run
	if (cfg.run) {
		//frame animate
		self.timer = self.timer || new Timer({
			duration: Math.round(duration),
			easing: easing,
		});
		self.timer.on("run", cfg.run);
	}
	self._bindEvt();
	return self;
}

function computeTransform(prevTransform, destTransform) {
	var transform = getTransformInfo(prevTransform);
	var dest = getTransformInfo(destTransform);
	var trans = {};
	for (var i in dest) {
		trans[i] = {
			prevVal: transform[i],
			newVal: dest[i]
		}
	}
	return trans;
}

//for scroll only
function setStyle(el, styleName, prevVal, newVal, percent) {
	prevVal = isNaN(Number(prevVal)) ? 0 : Number(prevVal);
	var curVal = ((newVal - prevVal) * percent + prevVal);
	css(el, styleName, curVal);
}

function css(el, styleName, val) {
	switch (styleName) {
		case "scrollTop":
		case "scrollLeft":
			el[styleName] = val;
			break;
		case "transform":
			el.style[vendorTransform] = val;
		case "opacity":
			el.style[styleName] = val;
			break;

	}
}

Util.extend(Animate, Base, {
	/**
	 * to start the animation
	 * @memberof Animate
	 * @return {Animate}
	 */
	run: function() {
		var self = this;
		var cfg = self.cfg,
			el = self.el,
			duration = cfg.duration || 0,
			easing = cfg.easing || "ease",
			delay = cfg.delay || 0;
		self.__isTransitionEnd = false;
		clearTimeout(self.__itv)
		self.timer && self.timer.run();
		if (duration <= Timer.MIN_DURATION) {
			for (var i in cfg.css) {
				css(el, i, cfg.css[i]);
			}
			self.stop()
			self.__handlers.stop.call(self);
			return;
		}

		if(Util.isBadAndroid()){
			//use frame animate on bad android device
			cfg.useTransition = false;
		}

		if (cfg.useTransition) {
			//transition
			el.style[vendorTransition] = Util.substitute('all {duration}ms {easing} {delay}ms', {
				duration: Math.round(duration),
				easing: Easing.format(easing),
				delay: delay
			});
			for (var i in cfg.css) {
				//set css
				css(el, i, cfg.css[i]);
			}
			self.__itv = setTimeout(function() {
				if (!self.__isTransitionEnd) {
					self.__isTransitionEnd = true;
					self.trigger("transitionend");
				}
			}, Number(duration) + 60);
		} else {
			self.computeStyle = self.computeStyle || window.getComputedStyle(el);
			//transform
			if (cfg.css.transform && self.timer) {
				var transmap = self.transmap = computeTransform(self.computeStyle[vendorTransform], cfg.css.transform);
				self.timer.off("run", self.__handlers.transRun);
				self.timer.on("run", self.__handlers.transRun, self);
				self.timer.off("end",self.__handlers.transRun);
				self.timer.on("end", self.__handlers.transRun, self);
			}
		}
		return self;
	},
	_transitionEndHandler: function(e) {
		var self = this;
		self.stop();
		self.__handlers.stop.call(self);
	},
	__handlers: {
		transRun: function(e) {
			var self = this;
			var transmap = self.transmap;
			var el = self.el;
			var newTrans = {};
			for (var i in transmap) {
				newTrans[i] = (transmap[i].newVal - transmap[i].prevVal) * e.percent + transmap[i].prevVal
			}
			var ret = Util.substitute(translateTpl + ' ' +
				'scale({scaleX},{scaleY})', newTrans);
			el.style[vendorTransform] = ret;
		},
		stop: function(e) {
			var self = this;
			var cfg = self.cfg;
			cfg.end && cfg.end({
				percent: 1
			});
		}
	},
	_bindEvt: function() {
		var self = this;
		var cfg = self.cfg;
		var el = self.el;
		self.el.addEventListener(vendorTransitionEnd, function(e) {
			self.__isTransitionEnd = true;
			if (e.target !== e.currentTarget) return;
			self.trigger("transitionend", e);
		})
		self.on("transitionend", self._transitionEndHandler, self);
		var cssRun = function(e) {
			self.computeStyle = self.computeStyle || window.getComputedStyle(el);
			for (var i in cfg.css) {
				if (!/transform/.test(i)) {
					setStyle(self.el, i, self.computeStyle[i], cfg.css[i], e.percent);
				}
			}
		};
		self.timer && self.timer.on("run", cssRun);
		self.timer && self.timer.on("stop", self.__handlers.stop, self);
	},
	/**
	 * to stop the animation
	 * @memberof Animate
	 * @return {Animate}
	 */
	stop: function() {
		var self = this;
		if (self.cfg.useTransition && self.cfg.duration > Timer.MIN_DURATION) {
			var computeStyle = window.getComputedStyle(this.el);
			for (var i in self.cfg.css) {
				if (animAttrs[i]) {
					var value = /transform/.test(i) ? computeStyle[vendorTransform] : computeStyle[i];
					css(self.el, i, Util.substitute(translateTpl + ' ' + 'scale({scaleX},{scaleY})', getTransformInfo(value)));
				}
			}
			self.el.style[vendorTransition] = "none";
		}
		self.timer && self.timer.stop() && self.timer.reset();
		self.computeStyle = null;
		return self;
	},
	/**
	 * to reset the animation to a new state
	 * @memberof Animate
	 * @param {object} cfg cfg for new animation
	 * @return {Animate}
	 */
	reset: function(cfg) {
		var self = this;
		self.computeStyle = null;
		Util.mix(self.cfg, cfg);
		this.timer && self.timer.reset({
			duration: Math.round(self.cfg.duration),
			easing: self.cfg.easing
		});
		return self;
	}
});


if (typeof module == 'object' && module.exports) {
	module.exports = Animate;
}
/** ignored by jsdoc **/
else {
	return Animate;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge]
 * @returns {Object} dest
 */
function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
function merge(dest, src) {
    return extend(dest, src, true);
}

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        extend(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument;
    return (doc.defaultView || doc.parentWindow);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;
    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = last.deltaX - input.deltaX;
        var deltaY = last.deltaY - input.deltaY;
        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }
    
    if (abs(x) >= abs(y)) {
        return x > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y > 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.allow = true; // used by Input.TouchMouse to disable mouse events
    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */
function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        // when we're in a touch event, so  block all upcoming mouse events
        // most mobile browser also emit mouseevents, right after touchstart
        if (isTouch) {
            this.mouse.allow = false;
        } else if (isMouse && !this.mouse.allow) {
            return;
        }

        // reset the allowMouse when we're done
        if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
            this.mouse.allow = true;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        // not needed with native support for the touchAction property
        if (NATIVE_TOUCH_ACTION) {
            return;
        }

        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // pan-x and pan-y can be combined
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_PAN_X + ' ' + TOUCH_ACTION_PAN_Y;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.id = uniqueId();

    this.manager = null;
    this.options = merge(options || {}, this.defaults);

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        extend(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(withState) {
            self.manager.emit(self.options.event + (withState ? stateStr(state) : ''), input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(true);
        }

        emit(); // simple 'eventName' events

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(true);
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = extend({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {
        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this._super.emit.call(this, input);
    },
    reset:function(){
        
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        this._super.emit.call(this, input);
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            this.manager.emit(this.options.event + inOut, input);
        }
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 500, // minimal time of the pointer to be pressed
        threshold: 5 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.65,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.velocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.velocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.velocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.direction &&
            input.distance > this.options.threshold &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.direction);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 10, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;
        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }
        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;
            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED ) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create an manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.4';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, { enable: false }],
        [PinchRecognizer, { enable: false }, ['rotate']],
        [SwipeRecognizer,{ direction: DIRECTION_HORIZONTAL }],
        [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    options = options || {};

    this.options = merge(options, Hammer.defaults);
    this.options.inputTarget = this.options.inputTarget || element;
    this.handlers = {};
    this.session = {};
    this.recognizers = [];

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        extend(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        var recognizers = this.recognizers;
        recognizer = this.get(recognizer);
        recognizers.splice(inArray(recognizers, recognizer), 1);

        this.touchAction.update();
        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    each(manager.options.cssProps, function(value, name) {
        element.style[prefixed(element.style, name)] = add ? value : '';
    });
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

extend(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

if (typeof module == 'object' && module.exports) {
    module.exports = Hammer;
}
/** ignored by jsdoc **/
else {
    return Hammer;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  hasClass: function hasClass(el, token) {
    return new RegExp('(\\s|^)' + token + '(\\s|$)').test(el.className);
  },
  addClass: function addClass(el, token) {
    if (!el) {
      return;
    }
    if (el.classList) {
      el.classList.add(token);
    } else if (!this.hasClass(el, token)) {
      el.className += '' + token;
    }
  },
  removeClass: function removeClass(el, token) {
    if (!el) {
      return;
    }
    if (el.classList) {
      el.classList.remove(token);
    } else if (this.hasClass(el, token)) {
      el.className = el.className.replace(new RegExp('(\\s|^)' + token + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
    }
  }
};

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
var Base = __webpack_require__(165);
var Easing = __webpack_require__(171);

var RAF = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

var vendors = ['webkit', 'moz', 'ms', 'o'];
var cancelRAF = window.cancelAnimationFrame;
if (!cancelRAF) {
	for (var i = 0; i < vendors.length; i++) {
		if (window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame']) {
			cancelRAF = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
		}
	}
}

cancelRAF = cancelRAF || window.clearTimeout;

function Bezier(x1, y1, x2, y2, epsilon) {
	var curveX = function(t) {
		var v = 1 - t;
		return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
	};

	var curveY = function(t) {
		var v = 1 - t;
		return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
	};

	var derivativeCurveX = function(t) {
		var v = 1 - t;
		return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
	};

	return function(t) {

		var x = t,
			t0, t1, t2, x2, d2, i;

		// First try a few iterations of Newton's method -- normally very fast.
		for (t2 = x, i = 0; i < 8; i++) {
			x2 = curveX(t2) - x;
			if (Math.abs(x2) < epsilon) return curveY(t2);
			d2 = derivativeCurveX(t2);
			if (Math.abs(d2) < 1e-6) break;
			t2 = t2 - x2 / d2;
		}

		t0 = 0, t1 = 1, t2 = x;

		if (t2 < t0) return curveY(t0);
		if (t2 > t1) return curveY(t1);

		// Fallback to the bisection method for reliability.
		while (t0 < t1) {
			x2 = curveX(t2);
			if (Math.abs(x2 - x) < epsilon) return curveY(t2);
			if (x > x2) t0 = t2;
			else t1 = t2;
			t2 = (t1 - t0) * .5 + t0;
		}

		// Failure
		return curveY(t2);

	};

};



function Timer(cfg) {
	var self = this;
	self.cfg = Util.mix({
		easing: "linear"
	}, cfg)
}

Timer.MIN_DURATION = 1;

Util.extend(Timer, Base, {
	reset: function(cfg) {
		var self = this;
		Util.mix(self.cfg, cfg);
		self.isfinished = false;
		self.percent = 0;
		self._stop = null;
	},
	run: function() {
		var self = this;
		var duration = self.cfg.duration;
		if (duration <= Timer.MIN_DURATION) {
			self.isfinished = true;
			self.trigger("run", {
				percent: 1
			});
			self.trigger("end", {
				percent: 1
			});
		}
		if (self.isfinished) return;
		self._hasFinishedPercent = self._stop && self._stop.percent || 0;
		self._stop = null;
		self.start = Date.now();
		self.percent = 0;
		// epsilon determines the precision of the solved values
		var epsilon = (1000 / 60 / duration) / 4;
		var b = Easing[self.cfg.easing];
		self.easingFn = Bezier(b[0], b[1], b[2], b[3], epsilon);
		self._run();
	},
	_run: function() {
		var self = this;
		cancelRAF(self._raf);
		self._raf = RAF(function() {
			self.now = Date.now();
			self.duration = self.now - self.start >= self.cfg.duration ? self.cfg.duration : self.now - self.start;
			self.progress = self.easingFn(self.duration / self.cfg.duration);
			self.percent = self.duration / self.cfg.duration + self._hasFinishedPercent;
			if (self.percent >= 1 || self._stop) {
				self.percent = self._stop && self._stop.percent ? self._stop.percent : 1;
				self.duration = self._stop && self._stop.duration ? self._stop.duration : self.duration;
				var param = {
					percent: self.percent
				};
				self.trigger("stop", param);
				if (self.percent >= 1) {
					self.isfinished = true;
					self.trigger("end", {
						percent: 1
					});
				}
				return;
			}
			self.trigger("run", {
				percent: self.progress,
				originPercent:self.percent
			});
			self._run();
		})
	},
	stop: function() {
		var self = this;
		self._stop = {
			percent: self.percent,
			now: self.now
		};
		cancelRAF(self._raf)
	}
});


if (typeof module == 'object' && module.exports) {
	module.exports = Timer;
}
/** ignored by jsdoc **/
else {
	return Timer;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
//easing
var Easing = {
	"linear": [0, 0, 1, 1],
	"ease": [.25, .1, .25, 1],
	"ease-in":[.42,0,1,1],
	"ease-out": [0, 0, .58, 1],
	"ease-in-out": [.42, 0, .58, 1],
	"quadratic": [0.33, 0.66, 0.66, 1],
	"circular": [0.1, 0.57, 0.1, 1],
	"bounce": [.71, 1.35, .47, 1.41],
	format: function(easing) {
		if (!easing) return;
		if (typeof easing === "string" && this[easing]) {
			return this[easing] instanceof Array ? [" cubic-bezier(", this[easing], ") "].join("") : this[easing];
		}
		if (easing instanceof Array) {
			return [" cubic-bezier(", easing, ") "].join("");
		}
		return easing;
	}
}
if (typeof module == 'object' && module.exports) {
	module.exports = Easing;
}
/** ignored by jsdoc **/
 else {
	return Easing;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164),
    Base = __webpack_require__(165),
    Animate = __webpack_require__(166),
    Boundry = __webpack_require__(244),
    Hammer = __webpack_require__(168),
    Sticky = __webpack_require__(245),
    Fixed = __webpack_require__(246);
// boundry checked bounce effect
var BOUNDRY_CHECK_DURATION = 500;
var BOUNDRY_CHECK_EASING = "ease";
var BOUNDRY_CHECK_ACCELERATION = 0.1;
/** 
 * @constructor
 * @param {object} cfg config for scroll
 * @param {number} cfg.SCROLL_ACCELERATION  acceleration for scroll, min value make the scrolling smoothly
 * @param {number} cfg.BOUNDRY_CHECK_DURATION duration for boundry bounce
 * @param {number} cfg.BOUNDRY_CHECK_EASING easing for boundry bounce
 * @param {number} cfg.BOUNDRY_CHECK_ACCELERATION acceleration for boundry bounce
 * @param {boolean} cfg.lockX just like overflow-x:hidden
 * @param {boolean} cfg.lockY just like overflow-y:hidden
 * @param {boolean} cfg.scrollbarX config if the scrollbar-x is visible
 * @param {boolean} cfg.scrollbarY config if the scrollbar-y is visible
 * @param {boolean} cfg.useTransition config if use css3 transition or raf for scroll animation
 * @param {boolean} cfg.useOriginScroll config if use simulate or origin scroll
 * @param {boolean} cfg.bounce config if use has the bounce effect when scrolling outside of the boundry
 * @param {boolean} cfg.boundryCheck config if scrolling inside of the boundry
 * @param {boolean} cfg.preventDefault prevent touchstart
 * @param {boolean} cfg.preventTouchMove prevent touchmove
 * @param {string|HTMLElement}  cfg.container config for scroller's container which default value is ".xs-container"
 * @param {string|HTMLElement}  cfg.content config for scroller's content which default value is ".xs-content"
 * @param {object}  cfg.indicatorInsets  config scrollbars position {top: number, left: number, bottom: number, right: number}
 * @param {string}  cfg.stickyElements config for sticky-positioned elements
 * @param {string}  cfg.fixedElements config for fixed-positioned elements
 * @param {string}  cfg.touchAction config for touchAction of the scroller
 * @extends XScroll
 * @example
 * var xscroll = new XScroll({
 *    renderTo:"#scroll",
 *    lockX:false,
 *    scrollbarX:true
 * });
 * xscroll.render();
 */
function XScroll(cfg) {
    XScroll.superclass.constructor.call(this);
    this.userConfig = cfg;
    this.init();
}

Util.extend(XScroll, Base, {
    /**
     * version
     * @memberof XScroll
     * @type {string}
     */
    version: "3.0.13",
    /**
     * init scroll
     * @memberof XScroll
     * @return {XScroll}
     */
    init: function() {
        var self = this;
        var defaultCfg = {
            preventDefault: true,
            bounce: true,
            boundryCheck: true,
            useTransition: true,
            gpuAcceleration: true,
            BOUNDRY_CHECK_EASING: BOUNDRY_CHECK_EASING,
            BOUNDRY_CHECK_DURATION: BOUNDRY_CHECK_DURATION,
            BOUNDRY_CHECK_ACCELERATION: BOUNDRY_CHECK_ACCELERATION,
            useOriginScroll: false,
            zoomType: "y",
            indicatorInsets: {
                top: 3,
                bottom: 3,
                left: 3,
                right: 3,
                width: 3,
                spacing: 5
            },
            container: ".xs-container",
            content: ".xs-content",
            stickyElements: ".xs-sticky",
            fixedElements: ".xs-fixed",
            touchAction: "auto"
        };
        //generate guid
        self.guid = Util.guid();
        self.renderTo = Util.getNode(self.userConfig.renderTo);
        //timer for animtion
        self.__timers = {};
        //config attributes on element
        var elCfg = JSON.parse(self.renderTo.getAttribute('xs-cfg'));
        var userConfig = self.userConfig = Util.mix(Util.mix(defaultCfg, elCfg), self.userConfig);
        self.container = Util.getNode(userConfig.container,self.renderTo);
        self.content = Util.getNode(userConfig.content,self.renderTo);
        self.boundry = new Boundry();
        self.boundry.refresh();
        return self;
    },
    /**
     * destroy scroll
     * @memberof XScroll
     * @return {XScroll}
     */
    destroy: function() {
        var self = this;
        self.mc && self.mc.destroy();
        self.sticky && self.sticky.destroy();
        self.fixed && self.fixed.destroy();
    },
    _initContainer: function() {},
    /**
     * @memberof XScroll
     * @return {XScroll}
     */
    enableGPUAcceleration: function() {
        this.userConfig.gpuAcceleration = true;
        return this;
    },
    /**
     * @memberof XScroll
     * @return {XScroll}
     */
    disableGPUAcceleration: function() {
        this.userConfig.gpuAcceleration = false;
        return this;
    },
    /**
     * get scroll offset
     * @memberof XScroll
     * @return {Object} {scrollTop:scrollTop,scrollLeft:scrollLeft}
     */
    getScrollPos: function() {
        var self = this;
        return {
            scrollLeft: self.getScrollLeft(),
            scrollTop: self.getScrollTop()
        }
    },
    /**
     * get scroll top value
     * @memberof XScroll
     * @return {number} scrollTop
     */
    getScrollTop: function() {},
    /**
     * get scroll left value
     * @memberof XScroll
     * @return {number} scrollLeft
     */
    getScrollLeft: function() {},
    /**
     * scroll absolute to the destination
     * @memberof XScroll
     * @param scrollLeft {number} scrollLeft
     * @param scrollTop {number} scrollTop
     * @param duration {number} duration for animte
     * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
     **/
    scrollTo: function(scrollLeft, scrollTop, duration, easing, callback) {
        var self = this;
        var scrollLeft = (undefined === scrollLeft || isNaN(scrollLeft)) ? -self.getScrollLeft() : scrollLeft;
        var scrollTop = (undefined === scrollTop || isNaN(scrollTop)) ? -self.getScrollTop() : scrollTop;
        self.scrollLeft(scrollLeft, duration, easing, callback);
        self.scrollTop(scrollTop, duration, easing, callback);
    },
    /**
     * scroll relative to the destination
     * @memberof XScroll
     * @param scrollLeft {number} scrollLeft
     * @param scrollTop {number} scrollTop
     * @param duration {number} duration for animte
     * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
     **/
    scrollBy: function(scrollLeft, scrollTop, duration, easing, callback) {
        this.scrollByX(scrollLeft, duration, easing, callback);
        this.scrollByY(scrollTop, duration, easing, callback);
    },
    /**
     * horizontal scroll relative to the destination
     * @memberof XScroll
     * @param scrollLeft {number} scrollLeft
     * @param duration {number} duration for animte
     * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
     **/
    scrollLeftBy: function(scrollLeft, duration, easing, callback) {
        this.scrollLeft(Number(scrollLeft) + Number(this.getScrollLeft()), duration, easing, callback);
    },
    /**
     * vertical scroll relative to the destination
     * @memberof XScroll
     * @param scrollTop {number} scrollTop
     * @param duration {number} duration for animte
     * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
     **/
    scrollTopBy: function(scrollTop, duration, easing, callback) {
        this.scrollTop(Number(scrollTop) + Number(this.getScrollTop()), duration, easing, callback);
    },
    /**
     * horizontal scroll absolute to the destination
     * @memberof XScroll
     * @param scrollLeft {number} scrollLeft
     * @param duration {number} duration for animte
     * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
     **/
    scrollLeft: function(scrollLeft, duration, easing, callback) {},
    /**
     * vertical scroll absolute to the destination
     * @memberof XScroll
     * @param scrollTop {number} scrollTop
     * @param duration {number} duration for animte
     * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
     **/
    scrollTop: function(scrollTop, duration, easing, callback) {},
    /**
     * reset the boundry size
     * @memberof XScroll
     * @return {XScroll}
     **/
    resetSize: function() {
        var self = this;
        if(!self.container || !self.content) return;
        var userConfig = self.userConfig;
        var renderToStyle = getComputedStyle(self.renderTo);
        var width = self.width = (userConfig.width || self.renderTo.offsetWidth) - Util.px2Num(renderToStyle['padding-left']) - Util.px2Num(renderToStyle['padding-right']);
        var height = self.height = (userConfig.height || self.renderTo.offsetHeight) - Util.px2Num(renderToStyle['padding-top']) - Util.px2Num(renderToStyle['padding-bottom']);;
        var containerWidth = userConfig.containerWidth || self.content.offsetWidth;
        var containerHeight = userConfig.containerHeight || self.content.offsetHeight;
        self.containerWidth = containerWidth < self.width ? self.width : containerWidth;
        self.containerHeight = containerHeight < self.height ? self.height : containerHeight;
        self.boundry.refresh({
            width: self.width,
            height: self.height
        });
        return self;
    },
    /**
     * render scroll
     * @memberof XScroll
     * @return {XScroll}
     **/
    render: function() {
        var self = this;
        self.resetSize();
        //init stickies
        self.initSticky();
        //init fixed elements
        self.initFixed();

        self.trigger("afterrender", {
            type: "afterrender"
        });
        self._bindEvt();
        //update touch-action 
        self.initTouchAction();
        return self;
    },
    /**
     * init touch action
     * @memberof XScroll
     * @return {XScroll}
     */
    initTouchAction: function() {
        var self = this;
        self.mc.set({
            touchAction: self.userConfig.touchAction
        });
        return self;
    },
    initFixed: function() {
        var self = this,
            userConfig = self.userConfig;
        self.fixed = self.fixed || new Fixed({
            fixedElements:userConfig.fixedElements,
            xscroll:self,
            fixedRenderTo:userConfig.fixedRenderTo
        });
        self.fixed.render();
        self.resetSize();
        return self;
    },
    initSticky:function(){
        var self = this,userConfig = self.userConfig;
        var sticky = self.sticky = self.sticky || new Sticky({
            xscroll:self,
            zoomType:userConfig.zoomType,
            stickyRenderTo:userConfig.stickyRenderTo
        });
        sticky.render();
    },
    /**
     * bounce to the boundry vertical and horizontal
     * @memberof XScroll
     * @return {XScroll}
     **/
    boundryCheck: function() {
        return this;
    },
    /**
     * bounce to the boundry horizontal
     * @memberof XScroll
     * @return {XScroll}
     **/
    boundryCheckX: function() {
        return this;
    },
    /**
     * bounce to the boundry vertical
     * @memberof XScroll
     * @return {XScroll}
     **/
    boundryCheckY: function() {
        return this;
    },
    _bindEvt: function() {
        var self = this;
        if (self.___isEvtBind) return;
        self.___isEvtBind = true;
        var mc = self.mc = new Hammer.Manager(self.renderTo);
        var tap = new Hammer.Tap();
        var pan = new Hammer.Pan();
        var pinch = new Hammer.Pinch();
        mc.add([tap, pan]);
        //trigger all events 
        self.mc.on("panstart pan panend pancancel pinchstart pinchmove pinchend pinchcancel pinchin pinchout", function(e) {
            self.trigger(e.type, e);
        });
        //trigger touch events
        var touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel','mousedown'];
        for (var i = 0, l = touchEvents.length; i < l; i++) {
            self.renderTo.addEventListener(touchEvents[i], function(e) {
                self.trigger(e.type, e);
            });
        }
        self.mc.on("tap", function(e) {
            if (e.tapCount == 1) {
                e.type = "tap";
                self.trigger(e.type, e);
            } else if (e.tapCount == 2) {
                e.type = "doubletap";
                self.trigger("doubletap", e);
            }
        });
        return self;
    },
    _resetLockConfig: function() {},
    stop: function() {}
});

if (typeof module == 'object' && module.exports) {
    module.exports = XScroll;
}
/** ignored by jsdoc **/
else {
    return XScroll;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeOptions = undefined;

var _objectAssign = __webpack_require__(167);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergeOptions = function mergeOptions($vm, options) {
  var defaults = {};
  for (var i in $vm.$options.props) {
    if (i !== 'value') {
      defaults[i] = $vm.$options.props[i].default;
    }
  }
  var _options = (0, _objectAssign2.default)({}, defaults, options);
  for (var _i in _options) {
    $vm[_i] = _options[_i];
  }
};

exports.mergeOptions = mergeOptions;

/***/ }),
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(203);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("63f9fa08", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Count.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Count.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.title {\n    width: 100%;\n    height: 45px;\n    font-size: small;\n}\n.title > div {\n    width: 335px;\n    margin: 5px auto;\n    height: 35px;\n}\n.title > div > div {\n    float: left;\n    height: 100%;\n}\n.title > div:after {\n    display: block;\n    content: '';\n    clear: both;\n}\n.see-type {\n    width: 50px;\n    margin-right: 5px;\n}\n.now-week-but {\n    width: 35px;\n    height: 100%;\n    margin-right: 5px;\n}\n.weeks {\n    width: 200px;\n}\n.count {\n    width: 35px;\n    margin-left: 5px;\n}\n.see-type, .now-week-but, .count {\n    background-color: #227B86;\n    border-radius: 5px;\n    line-height: 35px;\n    text-align: center;\n    color: white;\n}\n", ""]);

// exports


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(205);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("45d7c3a7", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./Count.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./Count.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n* {\n    margin: 0;\n    padding: 0;\n}\n", ""]);

// exports


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(207);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("e8c6f766", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=2!./Count.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=2!./Count.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.week-day[data-v-43186183] {\n    border-radius: 25px;\n}\n.week-title[data-v-43186183] {\n    height: 40px;\n    text-align: center;\n    line-height: 40px;\n}\n.courseContent[data-v-43186183] {\n    overflow-y: scroll;\n    width: 210px;\n    height: 420px;\n    margin: 10px auto;\n}\n.courseContent label[data-v-43186183] {\n    text-align: center;\n}\n.section > div[data-v-43186183]:first-child {\n    height: 50px;\n}\n.section > div:first-child label[data-v-43186183] {\n    padding: 8px;\n    border-radius: 10px;\n    margin: 10px auto;\n    display: block;\n    width: 50px;\n    text-align: center;\n}\n.section > div[data-v-43186183]:last-child {\n    width: 100%;\n    padding: 10px;\n    box-sizing: border-box;\n    border-radius: 10px;\n    /*border: 1px solid black;*/\n}\n.section > div:last-child label[data-v-43186183] {\n    display: block;\n    width: 33.3%;\n    float: left;\n}\n.section > div[data-v-43186183]:last-child:after {\n    display: block;\n    content: '';\n    clear: both;\n}\n.group-item[data-v-43186183] {\n    width: 90px;\n    height: 26px;\n    line-height: 26px;\n    text-align: center;\n    border-radius: 3px;\n    border: 1px solid #ccc;\n    background-color: #fff;\n    margin: 5px;\n    box-sizing: border-box;\n}\n.group-item-selected[data-v-43186183] {\n    background: #ffffff url(/images/wechat/sel.png) no-repeat right bottom;\n    border-color: #ff4a00;\n}\n.box1-item[data-v-43186183] {\n    width: 35px;\n    height: 100%;\n    background-color: #FDCA62;\n    display: inline-block;\n    margin-left: 5px;\n    float: left;\n    text-align: center;\n    line-height: 35px;\n    border-radius: 5px;\n}\n.box1[data-v-43186183] {\n    position: relative;\n}\n.now-week[data-v-43186183] {\n    background-color: #227B86;\n    color: white;\n}\n.sel-week[data-v-43186183] {\n    color: #DB5061;\n    background-color: #F6C1C3;\n}\n.week-day .week-title[data-v-43186183] {\n    color: white;\n}\n.week-day > .courseContent > div > div:first-child > label[data-v-43186183] {\n    color: white;\n}\n.week-day > .courseContent > div > div[data-v-43186183]:last-child {\n    box-shadow: #666 0px 0px 10px;\n    background-color: #F9EAC7;\n}\n.main[data-v-43186183] {\n    background: url(/images/wechat/cloud.png) no-repeat;\n    background-size: 100% 60px;\n    background-position: 0 35px;\n}\n\n", ""]);

// exports


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(209);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("726adb54", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/after-less-loader.js!../../../../../../node_modules/less-loader/dist/cjs.js!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=3!./Count.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/after-less-loader.js!../../../../../../node_modules/less-loader/dist/cjs.js!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=3!./Count.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.vux-close[data-v-43186183] {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle;\n  color: #999;\n  width: 24px;\n  height: 24px;\n}\n.vux-close[data-v-43186183]:before,\n.vux-close[data-v-43186183]:after {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 11px;\n  width: 24px;\n  height: 1px;\n  background-color: currentColor;\n  transform: rotate(-45deg);\n}\n.vux-close[data-v-43186183]:after {\n  transform: rotate(45deg);\n}\n.dialog-demo .weui-dialog[data-v-43186183] {\n  border-radius: 8px;\n  padding-bottom: 8px;\n}\n.dialog-demo .dialog-title[data-v-43186183] {\n  line-height: 30px;\n  color: #666;\n}\n.dialog-demo .img-box[data-v-43186183] {\n  height: 350px;\n  overflow: hidden;\n}\n.dialog-demo .vux-close[data-v-43186183] {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n", ""]);

// exports


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(211);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("4f58178b", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=4!./Count.vue", function() {
     var newContent = require("!!../../../../../../node_modules/css-loader/index.js!../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43186183\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/vux-loader/src/style-loader.js!../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=4!./Count.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.label-stu[data-v-43186183] {\n    width: 100%;\n    padding-top: 40px;\n    overflow: scroll;\n    height: 300px;\n}\n.label-stu[data-v-43186183]:after {\n    display: block;\n    content: '';\n    clear: both;\n}\n.label-stu > label[data-v-43186183] {\n    float: left;\n    display: block;\n    width: 25%;\n    overflow: hidden;\n    height: 30px;\n    line-height: 30px;\n}\n.sel-user[data-v-43186183] {\n    color: #289886;\n}\n", ""]);

// exports


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueCarousel3d = __webpack_require__(213);

var _index2 = __webpack_require__(214);

var _index3 = _interopRequireDefault(_index2);

var _index4 = __webpack_require__(221);

var _index5 = _interopRequireDefault(_index4);

var _checker = __webpack_require__(222);

var _checker2 = _interopRequireDefault(_checker);

var _checkerItem = __webpack_require__(227);

var _checkerItem2 = _interopRequireDefault(_checkerItem);

var _index6 = __webpack_require__(232);

var _index7 = _interopRequireDefault(_index6);

var _index8 = __webpack_require__(237);

var _index9 = _interopRequireDefault(_index8);

var _index10 = __webpack_require__(253);

var _index11 = _interopRequireDefault(_index10);

var _index12 = __webpack_require__(260);

var _index13 = _interopRequireDefault(_index12);

var _index14 = __webpack_require__(266);

var _index15 = _interopRequireDefault(_index14);

var _index16 = __webpack_require__(271);

var _index17 = _interopRequireDefault(_index16);

var _index18 = __webpack_require__(286);

var _index19 = _interopRequireDefault(_index18);

var _index20 = __webpack_require__(292);

var _index21 = _interopRequireDefault(_index20);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Vue.use(_index11.default);
Vue.use(_index13.default);
exports.default = {
  directives: {
    TransferDom: _index5.default
  },
  components: {
    Carousel3d: _vueCarousel3d.Carousel3d,
    Slide: _vueCarousel3d.Slide,
    Popup: _index3.default,
    TransferDom: _index5.default,
    Checker: _checker2.default,
    CheckerItem: _checkerItem2.default,
    Divider: _index7.default,
    Scroller: _index9.default,
    ToastPlugin: _index11.default,
    XTable: _index15.default,
    XDialog: _index17.default,
    XButton: _index19.default,
    CheckIcon: _index21.default
  },
  data: function data() {
    return {
      get: {
        nowWeek: 0, //当前周
        groups: [], //所有分组
        positions: [], //所有职务
        grades: [], //年级
        students: [], //所有学生,
        locations: [] //所有地点
      },
      set: {
        weeks: [], //一共有多少周
        selPositions: [], //选择额职务
        selSexs: [], //选择的性别
        selGrades: [], //选中你的年级
        selGroups: [], //选中的分组
        selStudent: [], //选中的学生
        selWeek: 0, //选中的周
        selLocations: [] //选中的地点
      },
      count: false, //是否打开统计页面
      haveNoCourse: true, //是否有课
      courses: [[], [], [], [], [], [], []], //统计的课表人员信息
      test: true,
      colorIndex: [0, 1, 2, 3, 4, 5, 6],

      type2Data: {
        showHideOnBlur: false,
        title: '',
        x: 0,
        y: 0
      },
      type: true,

      colors: [{
        title: '#1A9053',
        content: '#26CDB2'
      }, {
        title: '#EF3C67',
        content: '#FD9693'
      }, {
        title: '#794017',
        content: '#FEC961'
      }, {
        title: '#1BAE9A',
        content: '#91FBC1'
      }, {
        title: '#D13420',
        content: '#FD8E6B'
      }, {
        title: '#82BD4B',
        content: '#CAF3A3'
      }, {
        title: '#E23B5B',
        content: '#FCC5CC'
      }],
      selUserId: 0,
      selStu: {
        showHideOnBlur: false,
        allType: false,
        students: []
      }
    };
  },

  methods: {
    info: function info() {
      var _this = this;

      document.getElementsByTagName('html')[0].style.background = '#89E4DF';

      var maxWeek = 20; // 最大周
      this.$vux.loading.show({
        text: '正在加载数据'
      });
      axios.get('/wechat/course/count').then(function (response) {
        console.log(response.data);

        var data = response.data;
        _this.get.nowWeek = data.nowWeek; //当前周
        _this.get.groups = data.groups; //分组情况
        _this.get.positions = data.positions; //职位情况
        _this.get.grades = data.grades; //年级情况
        _this.get.students = data.students; //学生
        _this.get.locations = data.locations; //地点

        if (_this.get.nowWeek > 20) maxWeek = _this.get.nowWeek; //判断若用户大于20周，则以当前为最大

        for (var i = 1; i <= maxWeek; i++) {
          _this.set.weeks[i - 1] = {
            id: i
          };

          if (_this.get.nowWeek === i) {
            _this.set.weeks[i - 1].sel = true;
          } else {
            _this.set.weeks[i - 1].sel = false;
          }
        }

        _this.set.selWeek = _this.get.nowWeek;

        _this.getSelStudents();

        var nowWeekDay = (new Date().getDay() + 6) % 7;
        _this.$children[2].goSlide(nowWeekDay);

        _this.setNowWeek();

        _this.$vux.loading.hide();
      });

      this.colorIndex.sort(this.randomsort);
    },
    setHasNoCourse: function setHasNoCourse(bool) {
      this.haveNoCourse = bool;
      this.getCourses();
    },
    addSelWeek: function addSelWeek(id) {
      if (this.set.selWeel !== id) {
        this.test = true;
        this.set.weeks[this.set.selWeek - 1].sel = false;
        this.set.selWeek = id;
        this.set.weeks[id - 1].sel = true;
        this.test = false;
        this.getCourses();
      }
    },
    setNowWeek: function setNowWeek() {

      this.set.weeks[this.set.selWeek - 1].sel = false;
      this.set.selWeek = this.get.nowWeek;
      this.set.weeks[this.get.nowWeek - 1].sel = true;

      this.test = !this.test;
      document.getElementById('weeks').style.transform = 'translate(' + (this.get.nowWeek - 3) * -40 + 'px, 0)';
      this.getCourses();
    },
    getSelStudents: function getSelStudents() {

      this.set.selStudent = [];
      this.selStu.students = [];

      var all = this.get.students,
          groups = this.set.selGroups,
          sexs = this.set.selSexs,
          positions = this.set.selPositions,
          grades = this.set.selGrades,
          locations = this.set.selLocations;

      if (groups.length === 0 && positions.length === 0 && sexs.length === 0 && grades.length === 0 && locations.length === 0) {
        for (var index in all) {
          this.set.selStudent.push({
            id: index,
            name: all[index].name
          });
        }
      } else {

        for (var _index in all) {
          if ((!groups.length || groups.indexOf(all[_index].grouping_id) !== -1) && (!sexs.length || sexs.indexOf(all[_index].sex) !== -1) && (!grades.length || grades.indexOf(parseInt(_index.substring(2, 4))) !== -1) && (!locations.length || locations.indexOf(all[_index].location_id) !== -1)) {
            //判断用户是否符合选择的条件

            var userPositions = all[_index].positions;
            for (var position in userPositions) {
              if (!positions.length || positions.indexOf(userPositions[position].id) !== -1) {

                this.selStu.students.push(_index);

                this.set.selStudent.push({
                  id: _index,
                  name: all[_index].name
                });
                break;
              }
            }
          }
        }
      }

      this.getCourses();
    },
    getCourses: function getCourses() {
      var tmpCourses = [];

      for (var i = 0; i < 7; i++) {

        tmpCourses[i] = [{ id: '1-2', stus: [] }, { id: '3-4', stus: [] }, { id: '5', stus: [] }, { id: '6-7', stus: [] }, { id: '8-9', stus: [] }, { id: '10-11', stus: [] }, { id: '12', stus: [] }];
      }

      var all = this.get.students,
          //所有用户信息
      selStu = this.set.selStudent,
          //选中的用户信息
      selWeek = this.set.selWeek,
          //选中的周
      hasCourse = this.haveNoCourse; //是否有课

      for (var _i in selStu) {
        //循环选中用户
        for (var course in all[selStu[_i].id].courses) {
          // 循环用户的课表
          var tempCourse = all[selStu[_i].id].courses[course];
          if (tempCourse.start_week <= selWeek && selWeek <= tempCourse.end_week && (tempCourse.status === 0 || selWeek % 2 === tempCourse.status % 2)) {

            for (var n = tempCourse.start_section; n <= tempCourse.end_section; n++) {
              switch (n) {
                case 1:
                  {
                    tmpCourses[tempCourse.week_day - 1][0].stus.push({
                      id: selStu[_i].id,
                      name: selStu[_i].name,
                      course_id: course
                    });
                    continue;
                  }
                case 3:
                  {
                    tmpCourses[tempCourse.week_day - 1][1].stus.push({
                      id: selStu[_i].id,
                      name: selStu[_i].name,
                      course_id: course
                    });
                    continue;
                    break;
                  }
                case 5:
                  {
                    tmpCourses[tempCourse.week_day - 1][2].stus.push({
                      id: selStu[_i].id,
                      name: selStu[_i].name,
                      course_id: course
                    });
                    break;
                  }
                case 6:
                  {
                    tmpCourses[tempCourse.week_day - 1][3].stus.push({
                      id: selStu[_i].id,
                      name: selStu[_i].name,
                      course_id: course
                    });
                    continue;
                    break;
                  }
                case 8:
                  {
                    tmpCourses[tempCourse.week_day - 1][4].stus.push({
                      id: selStu[_i].id,
                      name: selStu[_i].name,
                      course_id: course
                    });
                    continue;
                    break;
                  }
                case 10:
                  {
                    tmpCourses[tempCourse.week_day - 1][5].stus.push({
                      id: selStu[_i].id,
                      name: selStu[_i].name,
                      course_id: course
                    });
                    continue;
                    break;
                  }
                case 12:
                  {
                    tmpCourses[tempCourse.week_day - 1][6].stus.push({
                      id: selStu[_i].id,
                      name: selStu[_i].name,
                      course_id: course
                    });
                    break;
                  }
              }
            }
          }
        }
      }

      if (!hasCourse) {
        for (var _i2 = 0; _i2 < 7; _i2++) {
          for (var j = 0; j < 7; j++) {

            var tmpStus = tmpCourses[_i2][j].stus.slice();
            tmpCourses[_i2][j].stus = [];
            for (var stu in selStu) {
              var id = selStu[stu].id;
              var status = false;
              for (var tmpStu in tmpStus) {
                if (id === tmpStus[tmpStu].id) {
                  status = true;
                  break;
                }
              }

              if (!status) {
                tmpCourses[_i2][j].stus.push({
                  id: selStu[stu].id,
                  name: selStu[stu].name,
                  course_id: 0
                });
              }
            }
          }
        }
      }

      this.courses = tmpCourses;
    },
    courseInfo: function courseInfo(user_id, course_id) {
      this.selUserId = user_id;

      if (this.haveNoCourse) {
        var course = this.get.students[user_id].courses[course_id];

        this.$vux.toast.text(course.name + '/' + course.location, 'top');
      }
    },
    randomsort: function randomsort(a, b) {
      return Math.random() > .5 ? -1 : 1; //通过随机产生0到1的数，然后判断是否大于0.5从而影响排序，产生随机性的效果。
    },
    selTd: function selTd(i, j) {

      var weeks = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

      this.type2Data.title = weeks[i] + this.courses[i][j].id;
      this.type2Data.x = i;
      this.type2Data.y = j;
      this.type2Data.showHideOnBlur = true;
    },
    selStuBut: function selStuBut() {

      this.count = false;
      this.selStu.showHideOnBlur = true;
    },
    selStuFun: function selStuFun() {

      this.set.selStudent = [];

      for (var i in this.selStu.students) {
        this.set.selStudent.push({
          id: this.selStu.students[i],
          name: this.get.students[this.selStu.students[i]].name
        });
      }

      this.getCourses();
    },
    selAllStu: function selAllStu() {
      console.log(this.selStu.allType);

      this.set.selStudent = [];
      this.selStu.students = [];

      for (var i in this.get.students) {
        this.set.selStudent.push({
          id: i,
          name: this.get.students[i].name
        });

        if (this.selStu.allType) this.selStu.students.push(i);
      }

      this.getCourses();
    }
  },
  mounted: function mounted() {

    this.info();
  }
};

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * vue-carousel-3d v0.1.18
 * (c) 2017 Vladimir Bujanovic
 * https://github.com/wlada/vue-carousel-3d#readme
 */
!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Carousel3d=e():t.Carousel3d=e()}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.Slide=e.Carousel3d=void 0;var r=n(1),o=i(r),s=n(15),a=i(s),u=function(t){t.component("carousel3d",o.default),t.component("slide",a.default)};e.default={install:u},e.Carousel3d=o.default,e.Slide=a.default},function(t,e,n){n(2);var i=n(7)(n(8),n(57),"data-v-c06c963c",null);t.exports=i.exports},function(t,e,n){var i=n(3);"string"==typeof i&&(i=[[t.id,i,""]]),i.locals&&(t.exports=i.locals);n(5)("e749a8c4",i,!0)},function(t,e,n){e=t.exports=n(4)(),e.push([t.id,".carousel-3d-container[data-v-c06c963c]{min-height:1px;width:100%;position:relative;z-index:0;overflow:hidden;margin:20px auto;box-sizing:border-box}.carousel-3d-slider[data-v-c06c963c]{position:relative;margin:0 auto;transform-style:preserve-3d;-webkit-perspective:1000px;-moz-perspective:1000px;perspective:1000px}",""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var n=this[e];n[2]?t.push("@media "+n[2]+"{"+n[1]+"}"):t.push(n[1])}return t.join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var i={},r=0;r<this.length;r++){var o=this[r][0];"number"==typeof o&&(i[o]=!0)}for(r=0;r<e.length;r++){var s=e[r];"number"==typeof s[0]&&i[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),t.push(s))}},t}},function(t,e,n){function i(t){for(var e=0;e<t.length;e++){var n=t[e],i=c[n.id];if(i){i.refs++;for(var r=0;r<i.parts.length;r++)i.parts[r](n.parts[r]);for(;r<n.parts.length;r++)i.parts.push(o(n.parts[r]));i.parts.length>n.parts.length&&(i.parts.length=n.parts.length)}else{for(var s=[],r=0;r<n.parts.length;r++)s.push(o(n.parts[r]));c[n.id]={id:n.id,refs:1,parts:s}}}}function r(){var t=document.createElement("style");return t.type="text/css",d.appendChild(t),t}function o(t){var e,n,i=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(i){if(f)return v;i.parentNode.removeChild(i)}if(x){var o=p++;i=h||(h=r()),e=s.bind(null,i,o,!1),n=s.bind(null,i,o,!0)}else i=r(),e=a.bind(null,i),n=function(){i.parentNode.removeChild(i)};return e(t),function(i){if(i){if(i.css===t.css&&i.media===t.media&&i.sourceMap===t.sourceMap)return;e(t=i)}else n()}}function s(t,e,n,i){var r=n?"":i.css;if(t.styleSheet)t.styleSheet.cssText=m(e,r);else{var o=document.createTextNode(r),s=t.childNodes;s[e]&&t.removeChild(s[e]),s.length?t.insertBefore(o,s[e]):t.appendChild(o)}}function a(t,e){var n=e.css,i=e.media,r=e.sourceMap;if(i&&t.setAttribute("media",i),r&&(n+="\n/*# sourceURL="+r.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}var u="undefined"!=typeof document,l=n(6),c={},d=u&&(document.head||document.getElementsByTagName("head")[0]),h=null,p=0,f=!1,v=function(){},x="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());t.exports=function(t,e,n){f=n;var r=l(t,e);return i(r),function(e){for(var n=[],o=0;o<r.length;o++){var s=r[o],a=c[s.id];a.refs--,n.push(a)}e?(r=l(t,e),i(r)):r=[];for(var o=0;o<n.length;o++){var a=n[o];if(0===a.refs){for(var u=0;u<a.parts.length;u++)a.parts[u]();delete c[a.id]}}}};var m=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t,e){for(var n=[],i={},r=0;r<e.length;r++){var o=e[r],s=o[0],a=o[1],u=o[2],l=o[3],c={id:t+":"+r,css:a,media:u,sourceMap:l};i[s]?i[s].parts.push(c):n.push(i[s]={id:s,parts:[c]})}return n}},function(t,e){t.exports=function(t,e,n,i){var r,o=t=t||{},s=typeof t.default;"object"!==s&&"function"!==s||(r=t,o=t.default);var a="function"==typeof o?o.options:o;if(e&&(a.render=e.render,a.staticRenderFns=e.staticRenderFns),n&&(a._scopeId=n),i){var u=a.computed||(a.computed={});Object.keys(i).forEach(function(t){var e=i[t];u[t]=function(){return e}})}return{esModule:r,exports:o,options:a}}},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(9),o=i(r),s=n(10),a=i(s),u=n(15),l=i(u),c=function(){};e.default={name:"carousel3d",components:{Controls:a.default,Slide:l.default},props:{count:{type:[Number,String],default:0},perspective:{type:[Number,String],default:35},display:{type:[Number,String],default:5},loop:{type:Boolean,default:!0},animationSpeed:{type:[Number,String],default:500},dir:{type:String,default:"rtl"},width:{type:[Number,String],default:360},height:{type:[Number,String],default:270},border:{type:[Number,String],default:1},space:{type:[Number,String],default:"auto"},startIndex:{type:[Number,String],default:0},clickable:{type:Boolean,default:!0},disable3d:{type:Boolean,default:!1},minSwipeDistance:{type:Number,default:10},inverseScaling:{type:[Number,String],default:300},controlsVisible:{type:Boolean,default:!1},controlsPrevHtml:{type:String,default:"&lsaquo;"},controlsNextHtml:{type:String,default:"&rsaquo;"},controlsWidth:{type:[String,Number],default:50},controlsHeight:{type:[String,Number],default:50},onLastSlide:{type:Function,default:c},onSlideChange:{type:Function,default:c}},data:function(){return{viewport:0,currentIndex:0,total:0,lock:!1,dragOffset:0,dragStartX:0,mousedown:!1,zIndex:998}},mixins:[o.default],watch:{count:function(){this.computeData()}},computed:{isLastSlide:function(){return this.currentIndex===this.total-1},isFirstSlide:function(){return 0===this.currentIndex},isNextPossible:function(){return!(!this.loop&&this.isLastSlide)},isPrevPossible:function(){return!(!this.loop&&this.isFirstSlide)},slideWidth:function(){var t=this.viewport,e=parseInt(this.width)+2*parseInt(this.border,10);return t<e?t:e},slideHeight:function(){var t=parseInt(this.width,10)+2*parseInt(this.border,10),e=parseInt(parseInt(this.height)+2*this.border,10),n=this.calculateAspectRatio(t,e);return this.slideWidth/n},visible:function(){var t=this.display>this.total?this.total:this.display;return 2!==t?t%2?t:t-1:t},hasHiddenSlides:function(){return this.total>this.visible},leftIndices:function(){for(var t=Math.floor(this.visible/2)+1,e=[],n=1;n<t;n++)e.push("ltr"===this.dir?(this.currentIndex+n)%this.total:(this.currentIndex-n)%this.total);return e},rightIndices:function(){for(var t=Math.floor(this.visible/2)+1,e=[],n=1;n<t;n++)e.push("ltr"===this.dir?(this.currentIndex-n)%this.total:(this.currentIndex+n)%this.total);return e},leftOutIndex:function(){var t=Math.floor(this.visible/2)+1;return"ltr"===this.dir?this.total-this.currentIndex-t<=0?-parseInt(this.total-this.currentIndex-t):this.currentIndex+t:this.currentIndex-t},rightOutIndex:function(){var t=Math.floor(this.visible/2)+1;return"ltr"===this.dir?this.currentIndex-t:this.total-this.currentIndex-t<=0?-parseInt(this.total-this.currentIndex-t,10):this.currentIndex+t}},methods:{goNext:function(){this.isNextPossible&&(this.isLastSlide?this.goSlide(0):this.goSlide(this.currentIndex+1))},goPrev:function(){this.isPrevPossible&&(this.isFirstSlide?this.goSlide(this.total-1):this.goSlide(this.currentIndex-1))},goSlide:function(t){var e=this;this.currentIndex=t<0||t>this.total-1?0:t,this.lock=!0,this.isLastSlide&&(this.onLastSlide!==c&&console.warn("onLastSlide deprecated, please use @last-slide"),this.onLastSlide(this.currentIndex),this.$emit("last-slide",this.currentIndex)),this.$emit("before-slide-change",this.currentIndex),setTimeout(function(){return e.animationEnd()},this.animationSpeed)},goFar:function(t){var e=this,n=t===this.total-1&&this.isFirstSlide?-1:t-this.currentIndex;this.isLastSlide&&0===t&&(n=1);for(var i=n<0?-n:n,r=0,o=0;o<i;){o+=1;var s=1===i?0:r;setTimeout(function(){return n<0?e.goPrev(i):e.goNext(i)},s),r+=this.animationSpeed/i}},animationEnd:function(){this.lock=!1,this.onSlideChange!==c&&console.warn("onSlideChange deprecated, please use @after-slide-change"),this.onSlideChange(this.currentIndex),this.$emit("after-slide-change",this.currentIndex)},handleMouseup:function(){this.mousedown=!1,this.dragOffset=0},handleMousedown:function(t){t.touches||t.preventDefault(),this.mousedown=!0,this.dragStartX="ontouchstart"in window?t.touches[0].clientX:t.clientX},handleMousemove:function(t){if(this.mousedown){var e="ontouchstart"in window?t.touches[0].clientX:t.clientX,n=this.dragStartX-e;this.dragOffset=n,this.dragOffset>this.minSwipeDistance?(this.handleMouseup(),this.goNext()):this.dragOffset<-this.minSwipeDistance&&(this.handleMouseup(),this.goPrev())}},attachMutationObserver:function(){var t=this,e=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;if(e){var n={attributes:!0,childList:!0,characterData:!0};this.mutationObserver=new e(function(){t.$nextTick(function(){t.computeData()})}),this.$el&&this.mutationObserver.observe(this.$el,n)}},detachMutationObserver:function(){this.mutationObserver&&this.mutationObserver.disconnect()},getSlideCount:function(){return void 0!==this.$slots.default?this.$slots.default.filter(function(t){return void 0!==t.tag}).length:0},calculateAspectRatio:function(t,e){return Math.min(t/e)},computeData:function(){this.total=this.getSlideCount(),this.currentIndex=parseInt(this.startIndex)>this.total-1?this.total-1:parseInt(this.startIndex),this.viewport=this.$el.clientWidth},setSize:function(){this.$el.style.cssText+="height:"+this.slideHeight+"px;",this.$el.childNodes[0].style.cssText+="width:"+this.slideWidth+"px; height:"+this.slideHeight+"px;"}},mounted:function(){this.computeData(),this.attachMutationObserver(),this.$isServer||(window.addEventListener("resize",this.setSize),"ontouchstart"in window?(this.$el.addEventListener("touchstart",this.handleMousedown),this.$el.addEventListener("touchend",this.handleMouseup),this.$el.addEventListener("touchmove",this.handleMousemove)):(this.$el.addEventListener("mousedown",this.handleMousedown),this.$el.addEventListener("mouseup",this.handleMouseup),this.$el.addEventListener("mousemove",this.handleMousemove)))},beforeDestroy:function(){this.$isServer||(this.detachMutationObserver(),"ontouchstart"in window?this.$el.removeEventListener("touchmove",this.handleMousemove):this.$el.removeEventListener("mousemove",this.handleMousemove),window.removeEventListener("resize",this.setSize))}}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={props:{autoplay:{type:Boolean,default:!1},autoplayTimeout:{type:Number,default:2e3},autoplayHoverPause:{type:Boolean,default:!0}},data:function(){return{autoplayInterval:null}},destroyed:function(){this.pauseAutoplay(),this.$isServer||(this.$el.removeEventListener("mouseenter",this.pauseAutoplay),this.$el.removeEventListener("mouseleave",this.startAutoplay))},methods:{pauseAutoplay:function(){this.autoplayInterval&&(this.autoplayInterval=clearInterval(this.autoplayInterval))},startAutoplay:function(){var t=this;this.autoplay&&(this.autoplayInterval=setInterval(function(){"ltr"===t.dir?t.goPrev():t.goNext()},this.autoplayTimeout))}},mounted:function(){!this.$isServer&&this.autoplayHoverPause&&(this.$el.addEventListener("mouseenter",this.pauseAutoplay),this.$el.addEventListener("mouseleave",this.startAutoplay)),this.startAutoplay()}};e.default=n},function(t,e,n){n(11);var i=n(7)(n(13),n(14),"data-v-43e93932",null);t.exports=i.exports},function(t,e,n){var i=n(12);"string"==typeof i&&(i=[[t.id,i,""]]),i.locals&&(t.exports=i.locals);n(5)("06c66230",i,!0)},function(t,e,n){e=t.exports=n(4)(),e.push([t.id,".carousel-3d-controls[data-v-43e93932]{position:absolute;top:50%;height:0;margin-top:-30px;left:0;width:100%;z-index:9099}.next[data-v-43e93932],.prev[data-v-43e93932]{width:60px;position:absolute;z-index:9999;font-size:60px;height:60px;line-height:60px;color:#333;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;text-decoration:none;top:0}.next[data-v-43e93932]:hover,.prev[data-v-43e93932]:hover{cursor:pointer;opacity:.7}.prev[data-v-43e93932]{left:10px;text-align:left}.next[data-v-43e93932]{right:10px;text-align:right}.disabled[data-v-43e93932],.disabled[data-v-43e93932]:hover{opacity:.2;cursor:default}",""])},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"controls",props:{width:{type:[String,Number],default:50},height:{type:[String,Number],default:60},prevHtml:{type:String,default:"&lsaquo;"},nextHtml:{type:String,default:"&rsaquo;"}},data:function(){return{parent:this.$parent}}}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"carousel-3d-controls"},[n("a",{staticClass:"prev",class:{disabled:!t.parent.isPrevPossible},style:"width: "+t.width+"px; height: "+t.height+"px; line-height: "+t.height+"px;",attrs:{href:"#"},on:{click:function(e){e.preventDefault(),t.parent.goPrev()}}},[n("span",{domProps:{innerHTML:t._s(t.prevHtml)}})]),t._v(" "),n("a",{staticClass:"next",class:{disabled:!t.parent.isNextPossible},style:"width: "+t.width+"px; height: "+t.height+"px; line-height: "+t.height+"px;",attrs:{href:"#"},on:{click:function(e){e.preventDefault(),t.parent.goNext()}}},[n("span",{domProps:{innerHTML:t._s(t.nextHtml)}})])])},staticRenderFns:[]}},function(t,e,n){n(16);var i=n(7)(n(18),n(56),null,null);t.exports=i.exports},function(t,e,n){var i=n(17);"string"==typeof i&&(i=[[t.id,i,""]]),i.locals&&(t.exports=i.locals);n(5)("1dbacf8a",i,!0)},function(t,e,n){e=t.exports=n(4)(),e.push([t.id,".carousel-3d-slide{position:absolute;opacity:0;visibility:hidden;overflow:hidden;top:0;border-radius:1px;border-color:#000;border-color:rgba(0,0,0,.4);border-style:solid;background-size:cover;background-color:#ccc;display:block;margin:0;box-sizing:border-box;text-align:left}.carousel-3d-slide img{width:100%}.carousel-3d-slide.current{opacity:1!important;visibility:visible!important;transform:none!important;z-index:999}",""])},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(19),o=i(r);e.default={name:"slide",props:{index:{type:Number}},data:function(){return{parent:this.$parent,styles:{},zIndex:999}},computed:{isCurrent:function(){return this.index===this.parent.currentIndex},slideStyle:function(){var t={};if(!this.isCurrent){var e=this.getSideIndex(this.parent.rightIndices),n=this.getSideIndex(this.parent.leftIndices);(e>=0||n>=0)&&(t=e>=0?this.calculatePosition(e,!0,this.zIndex):this.calculatePosition(n,!1,this.zIndex),t.opacity=1,t.visibility="visible"),this.parent.hasHiddenSlides&&(this.matchIndex(this.parent.leftOutIndex)?t=this.calculatePosition(this.parent.leftIndices.length-1,!1,this.zIndex):this.matchIndex(this.parent.rightOutIndex)&&(t=this.calculatePosition(this.parent.rightIndices.length-1,!0,this.zIndex)))}return(0,o.default)(t,{"border-width":this.parent.border+"px",width:this.parent.slideWidth+"px",height:this.parent.slideHeight+"px",transition:" transform "+this.parent.animationSpeed+"ms,                opacity "+this.parent.animationSpeed+"ms,                visibility "+this.parent.animationSpeed+"ms"})}},methods:{getSideIndex:function(t){var e=this,n=-1;return t.forEach(function(t,i){e.matchIndex(t)&&(n=i)}),n},matchIndex:function(t){return t>=0?this.index===t:this.parent.total+t===this.index},calculatePosition:function(t,e,n){var i=this.parent.disable3d?0:parseInt(this.parent.inverseScaling)+100*(t+1),r=this.parent.disable3d?0:parseInt(this.parent.perspective),o="auto"===this.parent.space?parseInt((t+1)*(this.parent.width/1.5),10):parseInt((t+1)*this.parent.space,10),s=e?"translateX("+o+"px) translateZ(-"+i+"px) rotateY(-"+r+"deg)":"translateX(-"+o+"px) translateZ(-"+i+"px) rotateY("+r+"deg)",a="auto"===this.parent.space?0:parseInt((t+1)*this.parent.space);return{transform:s,top:a,zIndex:n-(Math.abs(t)+1)}},goTo:function(){this.parent.clickable===!0&&this.parent.goFar(this.index)}}}},function(t,e,n){t.exports={default:n(20),__esModule:!0}},function(t,e,n){n(21),t.exports=n(24).Object.assign},function(t,e,n){var i=n(22);i(i.S+i.F,"Object",{assign:n(37)})},function(t,e,n){var i=n(23),r=n(24),o=n(25),s=n(27),a="prototype",u=function(t,e,n){var l,c,d,h=t&u.F,p=t&u.G,f=t&u.S,v=t&u.P,x=t&u.B,m=t&u.W,g=p?r:r[e]||(r[e]={}),y=g[a],b=p?i:f?i[e]:(i[e]||{})[a];p&&(n=e);for(l in n)c=!h&&b&&void 0!==b[l],c&&l in g||(d=c?b[l]:n[l],g[l]=p&&"function"!=typeof b[l]?n[l]:x&&c?o(d,i):m&&b[l]==d?function(t){var e=function(e,n,i){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,i)}return t.apply(this,arguments)};return e[a]=t[a],e}(d):v&&"function"==typeof d?o(Function.call,d):d,v&&((g.virtual||(g.virtual={}))[l]=d,t&u.R&&y&&!y[l]&&s(y,l,d)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,t.exports=u},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},function(t,e,n){var i=n(26);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){var i=n(28),r=n(36);t.exports=n(32)?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var i=n(29),r=n(31),o=n(35),s=Object.defineProperty;e.f=n(32)?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var i=n(30);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){t.exports=!n(32)&&!n(33)(function(){return 7!=Object.defineProperty(n(34)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){t.exports=!n(33)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var i=n(30),r=n(23).document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}}},function(t,e,n){var i=n(30);t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){"use strict";var i=n(38),r=n(53),o=n(54),s=n(55),a=n(42),u=Object.assign;t.exports=!u||n(33)(function(){var t={},e={},n=Symbol(),i="abcdefghijklmnopqrst";return t[n]=7,i.split("").forEach(function(t){e[t]=t}),7!=u({},t)[n]||Object.keys(u({},e)).join("")!=i})?function(t,e){for(var n=s(t),u=arguments.length,l=1,c=r.f,d=o.f;u>l;)for(var h,p=a(arguments[l++]),f=c?i(p).concat(c(p)):i(p),v=f.length,x=0;v>x;)d.call(p,h=f[x++])&&(n[h]=p[h]);return n}:u},function(t,e,n){var i=n(39),r=n(52);t.exports=Object.keys||function(t){return i(t,r)}},function(t,e,n){var i=n(40),r=n(41),o=n(45)(!1),s=n(49)("IE_PROTO");t.exports=function(t,e){var n,a=r(t),u=0,l=[];for(n in a)n!=s&&i(a,n)&&l.push(n);for(;e.length>u;)i(a,n=e[u++])&&(~o(l,n)||l.push(n));return l}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var i=n(42),r=n(44);t.exports=function(t){return i(r(t))}},function(t,e,n){var i=n(43);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var i=n(41),r=n(46),o=n(48);t.exports=function(t){return function(e,n,s){var a,u=i(e),l=r(u.length),c=o(s,l);if(t&&n!=n){for(;l>c;)if(a=u[c++],a!=a)return!0}else for(;l>c;c++)if((t||c in u)&&u[c]===n)return t||c||0;return!t&&-1}}},function(t,e,n){var i=n(47),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0}},function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}},function(t,e,n){var i=n(47),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)}},function(t,e,n){var i=n(50)("keys"),r=n(51);t.exports=function(t){return i[t]||(i[t]=r(t))}},function(t,e,n){var i=n(23),r="__core-js_shared__",o=i[r]||(i[r]={});t.exports=function(t){return o[t]||(o[t]={})}},function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){var i=n(44);t.exports=function(t){return Object(i(t))}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"carousel-3d-slide",class:{current:t.isCurrent},style:t.slideStyle,on:{click:function(e){t.goTo()}}},[t._t("default")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"carousel-3d-container",style:{height:this.slideHeight+"px"}},[n("div",{staticClass:"carousel-3d-slider",style:{width:this.slideWidth+"px",height:this.slideHeight+"px"}},[t._t("default")],2),t._v(" "),t.controlsVisible?n("controls",{attrs:{"next-html":t.controlsNextHtml,"prev-html":t.controlsPrevHtml,width:t.controlsWidth,height:t.controlsHeight}}):t._e()],1)},staticRenderFns:[]}}])});

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(215)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(217),
  /* template */
  __webpack_require__(220),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/popup/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-759b6578", Component.options)
  } else {
    hotAPI.reload("data-v-759b6578", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(216);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("4a3c32a0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-759b6578\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-759b6578\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "/**\n* actionsheet\n*/\n/**\n* datetime\n*/\n/**\n* tabbar\n*/\n/**\n* tab\n*/\n/**\n* dialog\n*/\n/**\n* x-number\n*/\n/**\n* checkbox\n*/\n/**\n* check-icon\n*/\n/**\n* Cell\n*/\n/**\n* Mask\n*/\n/**\n* Range\n*/\n/**\n* Tabbar\n*/\n/**\n* Header\n*/\n/**\n* Timeline\n*/\n/**\n* Switch\n*/\n/**\n* Button\n*/\n/**\n* swipeout\n*/\n/**\n* Cell\n*/\n/**\n* Badge\n*/\n/**\n* Popover\n*/\n/**\n* Button tab\n*/\n/* alias */\n/**\n* Swiper\n*/\n/**\n* checklist\n*/\n/**\n* popup-picker\n*/\n/**\n* popup\n*/\n/**\n* popup-header\n*/\n/**\n* form-preview\n*/\n/**\n* load-more\n*/\n/**\n* sticky\n*/\n/**\n* group\n*/\n/**\n* toast\n*/\n/**\n* icon\n*/\n/**\n* calendar\n*/\n/**\n* week-calendar\n*/\n/**\n* search\n*/\n/**\n* radio\n*/\n/**\n* loadmore\n*/\n.vux-popup-dialog {\n  position: fixed;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  background: #eee;\n  z-index: 501;\n  transition-property: transform;\n  transition-duration: 300ms;\n  max-height: 100%;\n  overflow-y: scroll;\n  -webkit-overflow-scrolling: touch;\n}\n.vux-popup-dialog.vux-popup-left {\n  width: auto;\n  height: 100%;\n  top: 0;\n  right: auto;\n  bottom: auto;\n  left: 0;\n}\n.vux-popup-dialog.vux-popup-right {\n  width: auto;\n  height: 100%;\n  top: 0;\n  right: 0;\n  bottom: auto;\n  left: auto;\n}\n.vux-popup-dialog.vux-popup-top {\n  width: 100%;\n  top: 0;\n  right: auto;\n  bottom: auto;\n  left: 0;\n}\n.vux-popup-mask {\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.5);\n  opacity: 0;\n  tap-highlight-color: rgba(0, 0, 0, 0);\n  z-index: -1;\n  transition: opacity 400ms;\n}\n.vux-popup-mask.vux-popup-show {\n  opacity: 1;\n}\n.vux-popup-animate-bottom-enter,\n.vux-popup-animate-bottom-leave-active {\n  transform: translate3d(0, 100%, 0);\n}\n.vux-popup-animate-left-enter,\n.vux-popup-animate-left-leave-active {\n  transform: translate3d(-100%, 0, 0);\n}\n.vux-popup-animate-right-enter,\n.vux-popup-animate-right-leave-active {\n  transform: translate3d(100%, 0, 0);\n}\n.vux-popup-animate-top-enter,\n.vux-popup-animate-top-leave-active {\n  transform: translate3d(0, -100%, 0);\n}\n.vux-modal-open {\n  overflow: hidden;\n  position: fixed;\n  width: 100%;\n}\n", ""]);

// exports


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _popup = __webpack_require__(218);

var _popup2 = _interopRequireDefault(_popup);

var _dom = __webpack_require__(169);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//

exports.default = {
  name: 'popup',
  props: {
    value: Boolean,
    height: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: 'auto'
    },
    showMask: {
      type: Boolean,
      default: true
    },
    isTransparent: Boolean,
    hideOnBlur: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'bottom'
    },
    maxHeight: String,
    popupStyle: Object,
    hideOnDeactivated: {
      type: Boolean,
      default: true
    }
  },
  created: function created() {
    // get global layout config
    if (this.$vux && this.$vux.config && this.$vux.config.$layout === 'VIEW_BOX') {
      this.layout = 'VIEW_BOX';
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$overflowScrollingList = document.querySelectorAll('.vux-fix-safari-overflow-scrolling');
    this.$nextTick(function () {
      var _this = _this2;
      _this2.popup = new _popup2.default({
        showMask: _this.showMask,
        container: _this.$el,
        hideOnBlur: _this.hideOnBlur,
        onOpen: function onOpen() {
          _this.fixSafariOverflowScrolling('auto');
          _this.show = true;
        },
        onClose: function onClose() {
          _this.show = false;
          if (window.__$vuxPopups && Object.keys(window.__$vuxPopups).length > 1) return;
          if (document.querySelector('.vux-popup-dialog.vux-popup-mask-disabled')) return;
          setTimeout(function () {
            _this.fixSafariOverflowScrolling('touch');
          }, 300);
        }
      });
      if (_this2.value) {
        _this2.popup.show();
      }
      _this2.initialShow = false;
    });
  },
  deactivated: function deactivated() {
    if (this.hideOnDeactivated) {
      this.show = false;
    }
    this.removeModalClassName();
  },

  methods: {
    /**
    * https://github.com/airyland/vux/issues/311
    * https://benfrain.com/z-index-stacking-contexts-experimental-css-and-ios-safari/
    */
    fixSafariOverflowScrolling: function fixSafariOverflowScrolling(type) {
      if (!this.$overflowScrollingList.length) return;
      // if (!/iphone/i.test(navigator.userAgent)) return
      for (var i = 0; i < this.$overflowScrollingList.length; i++) {
        this.$overflowScrollingList[i].style.webkitOverflowScrolling = type;
      }
    },
    removeModalClassName: function removeModalClassName() {
      this.layout === 'VIEW_BOX' && _dom2.default.removeClass(document.body, 'vux-modal-open');
    }
  },
  data: function data() {
    return {
      layout: '',
      initialShow: true,
      hasFirstShow: false,
      show: this.value
    };
  },

  computed: {
    styles: function styles() {
      var styles = {};
      if (!this.position || this.position === 'bottom' || this.position === 'top') {
        styles.height = this.height;
      } else {
        styles.width = this.width;
      }

      if (this.maxHeight) {
        styles['max-height'] = this.maxHeight;
      }

      this.isTransparent && (styles['background'] = 'transparent');
      if (this.popupStyle) {
        for (var i in this.popupStyle) {
          styles[i] = this.popupStyle[i];
        }
      }
      return styles;
    }
  },
  watch: {
    value: function value(val) {
      this.show = val;
    },
    show: function show(val) {
      var _this3 = this;

      this.$emit('input', val);
      if (val) {
        this.popup && this.popup.show();
        this.$emit('on-show');
        this.fixSafariOverflowScrolling('auto');
        this.layout === 'VIEW_BOX' && _dom2.default.addClass(document.body, 'vux-modal-open');
        if (!this.hasFirstShow) {
          this.$emit('on-first-show');
          this.hasFirstShow = true;
        }
      } else {
        this.$emit('on-hide');
        this.show = false;
        this.popup.hide(false);
        setTimeout(function () {
          if (!document.querySelector('.vux-popup-dialog.vux-popup-show')) {
            _this3.fixSafariOverflowScrolling('touch');
          }
          _this3.removeModalClassName();
        }, 200);
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.popup.destroy();
    this.fixSafariOverflowScrolling('touch');
    this.removeModalClassName();
  }
};

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var passiveSupported = __webpack_require__(219);
// not a good way but works well
window.__$vuxPopups = window.__$vuxPopups || {};
var popupDialog = function popupDialog(option) {
  var _this = this;

  this.uuid = Math.random().toString(36).substring(3, 8);
  this.params = {};
  if (Object.prototype.toString.call(option) === '[object Object]') {
    this.params = {
      hideOnBlur: option.hideOnBlur,
      onOpen: option.onOpen || function () {},
      onClose: option.onClose || function () {},
      showMask: option.showMask
    };
  }
  if (!!document.querySelectorAll('.vux-popup-mask').length <= 0) {
    this.divMask = document.createElement('a');
    this.divMask.className = 'vux-popup-mask';
    this.divMask.dataset.uuid = '';
    this.divMask.href = 'javascript:void(0)';
    document.body.appendChild(this.divMask);
  }
  var div = void 0;
  if (!option.container) {
    div = document.createElement('div');
  } else {
    div = option.container;
  }

  div.className += ' vux-popup-dialog vux-popup-dialog-' + this.uuid;
  if (!this.params.hideOnBlur) {
    div.className += ' vux-popup-mask-disabled';
  }

  this.div = div;

  if (!option.container) {
    document.body.appendChild(div);
  }
  this.container = document.querySelector('.vux-popup-dialog-' + this.uuid);
  this.mask = document.querySelector('.vux-popup-mask');
  this.mask.dataset.uuid += ',' + this.uuid;
  this._bindEvents();
  option = null;
  this.containerHandler = function () {
    _this.mask && !/show/.test(_this.mask.className) && setTimeout(function () {
      !/show/.test(_this.mask.className) && (_this.mask.style['zIndex'] = -1);
    }, 200);
  };

  this.container.addEventListener('webkitTransitionEnd', this.containerHandler);
  this.container.addEventListener('transitionend', this.containerHandler);
};

popupDialog.prototype.onClickMask = function () {
  this.params.hideOnBlur && this.params.onClose();
};

popupDialog.prototype._bindEvents = function () {
  if (this.params.hideOnBlur) {
    this.mask.addEventListener('click', this.onClickMask.bind(this), false);
    this.mask.addEventListener('touchmove', function (e) {
      return e.preventDefault();
    }, passiveSupported ? { passive: false } : false);
  }
};

popupDialog.prototype.show = function () {
  if (this.params.showMask) {
    this.mask.classList.add('vux-popup-show');
    this.mask.style['zIndex'] = 500;
  }
  this.container.classList.add('vux-popup-show');
  this.params.onOpen && this.params.onOpen(this);
  window.__$vuxPopups[this.uuid] = 1;
};

popupDialog.prototype.hide = function () {
  var _this2 = this;

  var shouldCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  this.container.classList.remove('vux-popup-show');
  if (!document.querySelector('.vux-popup-dialog.vux-popup-show')) {
    this.mask.classList.remove('vux-popup-show');
    setTimeout(function () {
      _this2.mask && !/show/.test(_this2.mask.className) && (_this2.mask.style['zIndex'] = -1);
    }, 400);
  }
  shouldCallback === false && this.params.onClose && this.params.hideOnBlur && this.params.onClose(this);
  this.isShow = false;
  delete window.__$vuxPopups[this.uuid];
};

popupDialog.prototype.destroy = function () {
  this.mask.dataset.uuid = this.mask.dataset.uuid.replace(new RegExp(',' + this.uuid, 'g'), '');
  if (!this.mask.dataset.uuid) {
    this.mask.removeEventListener('click', this.onClickMask.bind(this), false);
    this.mask && this.mask.parentNode && this.mask.parentNode.removeChild(this.mask);
  } else {
    this.hide();
  }
  this.container.removeEventListener('webkitTransitionEnd', this.containerHandler);
  this.container.removeEventListener('transitionend', this.containerHandler);
  delete window.__$vuxPopups[this.uuid];
};

exports.default = popupDialog;

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var passiveSupported = false;

try {
  var options = Object.defineProperty({}, 'passive', {
    get: function get() {
      passiveSupported = true;
    }
  });
  window.addEventListener('test', null, options);
} catch (err) {}

module.exports = passiveSupported;

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "name": ("vux-popup-animate-" + _vm.position)
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show && !_vm.initialShow),
      expression: "show && !initialShow"
    }],
    staticClass: "vux-popup-dialog",
    class: [("vux-popup-" + _vm.position), _vm.show ? 'vux-popup-show' : ''],
    style: (_vm.styles)
  }, [_vm._t("default")], 2)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-759b6578", module.exports)
  }
}

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectAssign = __webpack_require__(167);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get target DOM Node
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to
 */
function getTarget(node) {
  if (node === void 0) {
    return document.body;
  }

  if (typeof node === 'string' && node.indexOf('?') === 0) {
    return document.body;
  } else if (typeof node === 'string' && node.indexOf('?') > 0) {
    node = node.split('?')[0];
  }

  if (node === 'body' || node === true) {
    return document.body;
  }

  return node instanceof window.Node ? node : document.querySelector(node);
} // Thanks to: https://github.com/calebroseland/vue-dom-portal

function getShouldUpdate(node) {
  // do not updated by default
  if (!node) {
    return false;
  }
  if (typeof node === 'string' && node.indexOf('?') > 0) {
    try {
      var config = JSON.parse(node.split('?')[1]);
      return config.autoUpdate || false;
    } catch (e) {
      return false;
    }
  }
  return false;
}

var directive = {
  inserted: function inserted(el, _ref, vnode) {
    var value = _ref.value;

    el.className = el.className ? el.className + ' v-transfer-dom' : 'v-transfer-dom';
    var parentNode = el.parentNode;
    var home = document.createComment('');
    var hasMovedOut = false;

    if (value !== false) {
      parentNode.replaceChild(home, el); // moving out, el is no longer in the document
      getTarget(value).appendChild(el); // moving into new place
      hasMovedOut = true;
    }
    if (!el.__transferDomData) {
      el.__transferDomData = {
        parentNode: parentNode,
        home: home,
        target: getTarget(value),
        hasMovedOut: hasMovedOut
      };
    }
  },
  componentUpdated: function componentUpdated(el, _ref2) {
    var value = _ref2.value;

    var shouldUpdate = getShouldUpdate(value);
    if (!shouldUpdate) {
      return;
    }
    // need to make sure children are done updating (vs. `update`)
    var ref$1 = el.__transferDomData;
    // homes.get(el)
    var parentNode = ref$1.parentNode;
    var home = ref$1.home;
    var hasMovedOut = ref$1.hasMovedOut; // recall where home is

    if (!hasMovedOut && value) {
      // remove from document and leave placeholder
      parentNode.replaceChild(home, el);
      // append to target
      getTarget(value).appendChild(el);
      el.__transferDomData = (0, _objectAssign2.default)({}, el.__transferDomData, { hasMovedOut: true, target: getTarget(value) });
    } else if (hasMovedOut && value === false) {
      // previously moved, coming back home
      parentNode.replaceChild(el, home);
      el.__transferDomData = (0, _objectAssign2.default)({}, el.__transferDomData, { hasMovedOut: false, target: getTarget(value) });
    } else if (value) {
      // already moved, going somewhere else
      getTarget(value).appendChild(el);
    }
  },

  unbind: function unbind(el, binding) {
    el.className = el.className.replace('v-transfer-dom', '');
    if (el.__transferDomData.hasMovedOut === true) {
      el.__transferDomData.parentNode && el.__transferDomData.parentNode.appendChild(el);
    }
    el.__transferDomData = null;
  }
};

exports.default = directive;

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(223)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(225),
  /* template */
  __webpack_require__(226),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/checker/checker.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] checker.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6a4a18a4", Component.options)
  } else {
    hotAPI.reload("data-v-6a4a18a4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(224);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("f5d1cdd4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6a4a18a4\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./checker.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6a4a18a4\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./checker.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.vux-checker-item {\n  display: inline-block;\n}\n", ""]);

// exports


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//

exports.default = {
  name: 'checker',
  props: {
    defaultItemClass: String,
    selectedItemClass: String,
    disabledItemClass: String,
    type: {
      type: String,
      default: 'radio'
    },
    value: [String, Number, Array, Object],
    max: Number,
    radioRequired: Boolean
  },
  watch: {
    value: function value(newValue) {
      this.currentValue = newValue;
    },
    currentValue: function currentValue(val) {
      this.$emit('input', val);
      this.$emit('on-change', val);
    }
  },
  data: function data() {
    return {
      currentValue: this.value
    };
  }
};

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vux-checker-box"
  }, [_vm._t("default")], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6a4a18a4", module.exports)
  }
}

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(228)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(230),
  /* template */
  __webpack_require__(231),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/checker/checker-item.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] checker-item.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-769c70cc", Component.options)
  } else {
    hotAPI.reload("data-v-769c70cc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(229);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("4ba43bcc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-769c70cc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./checker-item.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-769c70cc\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./checker-item.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.vux-tap-active {\n  tap-highlight-color: rgba(0, 0, 0, 0);\n  user-select: none;\n}\n.vux-tap-active:active {\n  background-color: #ECECEC;\n}\n", ""]);

// exports


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
//
//
//
//
//

exports.default = {
  name: 'checker-item',
  props: {
    value: {
      type: [String, Number, Object],
      required: true
    },
    disabled: Boolean
  },
  watch: {
    disabled: function disabled(val) {
      if (val && this.$parent.type === 'radio' && this.value === this.$parent.currentValue) {
        this.$parent.currentValue = '';
      }
    }
  },
  computed: {
    classNames: function classNames() {
      var _this = this;

      var isSimpleValue = typeof this.value === 'string' || typeof this.value === 'number';
      var names = {
        'vux-tap-active': !this.disabled
      };

      if (this.$parent.defaultItemClass) {
        names[this.$parent.defaultItemClass] = true;
      }

      if (this.$parent.selectedItemClass) {
        var selected = false;
        if (this.$parent.type === 'radio') {
          if (isSimpleValue && this.$parent.currentValue === this.value) {
            selected = true;
          } else if (_typeof(this.value) === 'object' && isEqual(this.$parent.currentValue, this.value)) {
            selected = true;
          }
        } else {
          if (typeof this.value === 'string') {
            if (this.$parent.currentValue.indexOf(this.value) > -1) {
              selected = true;
            }
          } else if (this.$parent.currentValue && this.$parent.currentValue.length) {
            var match = this.$parent.currentValue.filter(function (one) {
              return isEqual(one, _this.value);
            });
            selected = match.length > 0;
          }
        }
        names[this.$parent.selectedItemClass] = selected;
      }

      if (this.$parent.disabledItemClass) {
        names[this.$parent.disabledItemClass] = this.disabled;
      }

      return names;
    }
  },
  methods: {
    select: function select() {
      if (this.$parent.type === 'radio') {
        this.selectRadio();
      } else {
        this.selectCheckbox();
      }
    },
    selectRadio: function selectRadio() {
      if (!this.disabled) {
        if (this.$parent.currentValue === this.value) {
          if (!this.$parent.radioRequired) {
            this.$parent.currentValue = '';
          }
        } else {
          this.$parent.currentValue = this.value;
        }
      }
      this.$emit('on-item-click', this.value, this.disabled);
    },
    selectCheckbox: function selectCheckbox() {
      if (!this.$parent.currentValue || this.$parent.currentValue === null) {
        this.$parent.currentValue = [];
      }
      var isSimpleValue = typeof this.value === 'string' || typeof this.value === 'number';
      if (!this.disabled) {
        var index = -1;
        if (isSimpleValue) {
          index = this.$parent.currentValue.indexOf(this.value);
        } else {
          index = this.$parent.currentValue.map(function (one) {
            return JSON.stringify(one);
          }).indexOf(JSON.stringify(this.value));
        }
        if (index > -1) {
          this.$parent.currentValue.splice(index, 1);
        } else {
          if (!this.$parent.max || this.$parent.max && this.$parent.currentValue !== null && this.$parent.currentValue.length < this.$parent.max) {
            if (!this.$parent.currentValue || !this.$parent.currentValue.length) {
              this.$parent.currentValue = [];
            }
            this.$parent.currentValue.push(this.value);
          }
        }
      }
      this.$emit('on-item-click', this.value, this.disabled);
    }
  }
};


function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vux-checker-item",
    class: _vm.classNames,
    on: {
      "click": _vm.select
    }
  }, [_vm._t("default")], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-769c70cc", module.exports)
  }
}

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(233)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(235),
  /* template */
  __webpack_require__(236),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/divider/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-471c3b65", Component.options)
  } else {
    hotAPI.reload("data-v-471c3b65", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(234);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("6a713e4a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-471c3b65\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-471c3b65\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.vux-divider {\n  display: table;\n  white-space: nowrap;\n  height: auto;\n  overflow: hidden;\n  line-height: 1;\n  text-align: center;\n  padding: 10px 0;\n  color: #666;\n}\n.vux-divider:after,.vux-divider:before {\n  content: '';\n  display: table-cell;\n  position: relative;\n  top: 50%;\n  width: 50%;\n  background-repeat: no-repeat;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABaAAAAACCAYAAACuTHuKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OThBRDY4OUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OThBRDY4QUNDMTYxMUU0OUE3NUVGOEJDMzMzMjE2NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5OEFENjg3Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU5OEFENjg4Q0MxNjExRTQ5QTc1RUY4QkMzMzMyMTY3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VU513gAAADVJREFUeNrs0DENACAQBDBIWLGBJQby/mUcJn5sJXQmOQMAAAAAAJqt+2prAAAAAACg2xdgANk6BEVuJgyMAAAAAElFTkSuQmCC)\n}\n.vux-divider:before {\n  background-position: right 1em top 50%\n}\n.vux-divider:after {\n  background-position: left 1em top 50%\n}\n", ""]);

// exports


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//

exports.default = {
  name: 'divider'
};

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "vux-divider"
  }, [_vm._t("default")], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-471c3b65", module.exports)
  }
}

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(238)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(240),
  /* template */
  __webpack_require__(252),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/scroller/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-79a3dc84", Component.options)
  } else {
    hotAPI.reload("data-v-79a3dc84", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(239);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("bf1b6994", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-79a3dc84\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-79a3dc84\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.xs-plugin-pullup-container {\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectAssign = __webpack_require__(167);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _xscroll = __webpack_require__(241);

var _xscroll2 = _interopRequireDefault(_xscroll);

var _pulldown = __webpack_require__(250);

var _pulldown2 = _interopRequireDefault(_pulldown);

var _pullup = __webpack_require__(251);

var _pullup2 = _interopRequireDefault(_pullup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//

var pulldownDefaultConfig = function pulldownDefaultConfig() {
  return {
    content: 'Pull Down To Refresh',
    height: 60,
    autoRefresh: false,
    downContent: 'Pull Down To Refresh',
    upContent: 'Release To Refresh',
    loadingContent: 'Loading...',
    clsPrefix: 'xs-plugin-pulldown-'
  };
};

var pullupDefaultConfig = function pullupDefaultConfig() {
  return {
    content: 'Pull Up To Refresh',
    pullUpHeight: 60,
    height: 40,
    autoRefresh: false,
    downContent: 'Release To Refresh',
    upContent: 'Pull Up To Refresh',
    loadingContent: 'Loading...',
    clsPrefix: 'xs-plugin-pullup-'
  };
};

exports.default = {
  name: 'scroller',
  props: {
    value: {
      type: Object,
      default: function _default() {
        return {
          pulldownStatus: '',
          pullupStatus: ''
        };
      }
    },
    height: String,
    lockX: Boolean,
    lockY: Boolean,
    scrollbarX: Boolean,
    scrollbarY: Boolean,
    bounce: {
      type: Boolean,
      default: true
    },
    useOriginScroll: {
      type: Boolean,
      default: false
    },
    useTransition: {
      type: Boolean,
      default: true
    },
    preventDefault: {
      type: Boolean,
      default: false
    },
    stopPropagation: Boolean,
    boundryCheck: {
      type: Boolean,
      default: true
    },
    gpuAcceleration: {
      type: Boolean,
      default: true
    },
    usePulldown: {
      type: Boolean,
      default: false
    },
    usePullup: {
      type: Boolean,
      default: false
    },
    /**
    * refer to: http://xscroll.github.io/node_modules/xscroll/doc/PullDown.html
    */
    pulldownConfig: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    pullupConfig: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    enableHorizontalSwiping: {
      type: Boolean,
      default: false
    },
    scrollBottomOffset: {
      type: Number,
      default: 0
    }
  },
  methods: {
    reset: function reset(scrollPosition, duration, easing) {
      if (scrollPosition) {
        if (typeof scrollPosition.left !== 'undefined') {
          this._xscroll.scrollLeft(scrollPosition.left, duration, easing);
        }
        if (typeof scrollPosition.top !== 'undefined') {
          this._xscroll.scrollTop(scrollPosition.top, duration, easing);
        }
      }
      this._xscroll && this._xscroll.resetSize();
    },
    donePulldown: function donePulldown() {
      var _this = this;

      this.pulldown.reset(function () {
        // repaint
        _this.reset();
      });
      this.currentValue.pulldownStatus = 'default';
    },
    disablePullup: function disablePullup() {
      // this._xscroll.unplug(this.pullup)
      this.pullup.stop();
      this.currentValue.pullupStatus = 'disabled';
    },
    enablePullup: function enablePullup() {
      this.currentValue.pullupStatus = 'default';
      this.pullup.restart();
    },
    donePullup: function donePullup() {
      this.pullup.complete();
      this.reset();
      this.currentValue.pullupStatus = 'default';
    },
    getStyles: function getStyles() {
      var height = this.height;
      if (!this.height && this.$el && !this.$el.style.height && this.lockX) {
        height = document.documentElement.clientHeight + 'px';
        this.reset();
      }

      if (this.height && this.height.indexOf('-') === 0) {
        height = document.documentElement.clientHeight + parseInt(this.height) + 'px';
      }
      this.styles = {
        height: '' + height
      };
    }
  },
  created: function created() {
    var _this2 = this;

    if (!this.value) {
      this.currentValue = {
        pulldownStatus: '',
        pullupStatus: ''
      };
    } else {
      this.currentValue = this.value;
    }
    this.handleOrientationchange = function () {
      setTimeout(function () {
        _this2.reset();
      }, 100);
    };
  },
  data: function data() {
    return {
      currentValue: {},
      styles: {}
    };
  },

  watch: {
    currentValue: {
      handler: function handler(val) {
        this.$emit('input', pure(val));
      },
      deep: true
    },
    height: function height() {
      this.getStyles();
    },

    value: {
      handler: function handler(val) {
        if (val.pullupStatus === 'default' && this.currentValue.pullupStatus !== 'default') {
          this.donePullup();
        }
        if (val.pulldownStatus === 'default' && this.currentValue.pulldownStatus !== 'default') {
          this.donePulldown();
        }
        if (val.pullupStatus === 'disabled' && this.currentValue.pullupStatus !== 'disabled') {
          this.disablePullup();
        }
        if (val.pullupStatus === 'enabled' && this.currentValue.pullupStatus === 'disabled') {
          this.enablePullup();
        }
      },
      deep: true
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    this.uuid = Math.random().toString(36).substring(3, 8);
    this.$nextTick(function () {
      _this3.$el.setAttribute('id', 'vux-scroller-' + _this3.uuid);
      var content = null;
      if (_this3.$slots.default) {
        content = _this3.$slots.default[0].elm;
      }
      if (!content) {
        throw new Error('no content is found');
      }

      _this3._xscroll = new _xscroll2.default({
        renderTo: '#vux-scroller-' + _this3.uuid,
        lockX: _this3.lockX,
        lockY: _this3.lockY,
        scrollbarX: _this3.scrollbarX,
        scrollbarY: _this3.scrollbarY,
        content: content,
        bounce: _this3.bounce,
        useOriginScroll: _this3.useOriginScroll,
        useTransition: _this3.useTransition,
        preventDefault: _this3.preventDefault,
        boundryCheck: _this3.boundryCheck,
        gpuAcceleration: _this3.gpuAcceleration,
        stopPropagation: _this3.stopPropagation
      });

      _this3._xscroll.on('scroll', function () {
        if (_this3._xscroll) {
          var top = _this3._xscroll.getScrollTop();
          _this3.$emit('on-scroll', {
            top: top,
            left: _this3._xscroll.getScrollLeft()
          });
          var containerHeight = _this3._xscroll.containerHeight;
          var scrollHeight = _this3._xscroll.height;
          if (top >= containerHeight - scrollHeight - _this3.scrollBottomOffset) {
            _this3.$emit('on-scroll-bottom');
          }
        }
      });

      if (_this3.usePulldown) {
        // if use slot=pulldown
        var container = _this3.$slots.pulldown;
        var config = (0, _objectAssign2.default)(pulldownDefaultConfig(), _this3.pulldownConfig);
        if (container) {
          config.container = container[0].elm;
        }
        _this3.pulldown = new _pulldown2.default(config);
        _this3._xscroll.plug(_this3.pulldown);
        _this3.pulldown.on('loading', function (e) {
          _this3.$emit('on-pulldown-loading', _this3.uuid);
        });
        _this3.pulldown.on('statuschange', function (val) {
          _this3.currentValue.pulldownStatus = val.newVal;
        });
      }

      if (_this3.usePullup) {
        // if use slot=pullup
        var _container = _this3.$slots.pullup;
        var _config = (0, _objectAssign2.default)(pullupDefaultConfig(), _this3.pullupConfig);

        if (_container) {
          _config.container = _container[0].elm;
        }
        _this3.pullup = new _pullup2.default(_config);
        _this3._xscroll.plug(_this3.pullup);
        _this3.pullup.on('loading', function (e) {
          _this3.$emit('on-pullup-loading', _this3.uuid);
        });
        _this3.pullup.on('statuschange', function (val) {
          _this3.currentValue.pullupStatus = val.newVal;
        });
      }

      if (_this3.enableHorizontalSwiping) {
        _this3._xscroll.on('panstart', function (e) {
          if (e.direction === 2 || e.direction === 4) {
            e.preventDefault();
            if (_this3.scrollbarY) {
              _this3._xscroll.userConfig.scrollbarY = false;
            }
            _this3._xscroll.userConfig.lockY = true;
          }
        });
        _this3._xscroll.on('panend', function () {
          if (_this3.scrollbarY) {
            _this3._xscroll.userConfig.scrollbarY = true;
          }
          _this3._xscroll.userConfig.lockY = false;
        });
      }

      _this3._xscroll.render();
      window.addEventListener('orientationchange', _this3.handleOrientationchange, false);
    });
    this.getStyles();
  },
  updated: function updated() {
    this.reset();
  },
  beforeDestroy: function beforeDestroy() {
    if (this.pullup) {
      this._xscroll.unplug(this.pullup);
      this.pullup.pluginDestructor();
    }
    if (this.pulldown) {
      this._xscroll.unplug(this.pulldown);
      this.pulldown.pluginDestructor();
    }
    window.removeEventListener('orientationchange', this.handleOrientationchange, false);
    this._xscroll.destroy();
    this._xscroll = null;
  }
};


function pure(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164),
	Base = __webpack_require__(165),
	Timer = __webpack_require__(170),
	Animate = __webpack_require__(166),
	Hammer = __webpack_require__(168),
	SimuScroll = __webpack_require__(243),
	OriginScroll = __webpack_require__(249);
var XScroll = function(cfg) {
		var _ = cfg && cfg.useOriginScroll ? OriginScroll : SimuScroll;
		return new _(cfg);
	}
/**
 * Util
 * @namespace Util
 * @type {Object}
 */
XScroll.Util = Util;
/**
 * Base
 * @namespace Base
 * @type {Base}
 */
XScroll.Base = Base;
/**
 * Timer
 * @namespace Timer
 * @type {Timer}
 */
XScroll.Timer = Timer;
/**
 * Animate
 * @namespace Animate
 * @type {Animate}
 */
XScroll.Animate = Animate;
/**
 * Hammer
 * @namespace Hammer
 * @type {Hammer}
 */
XScroll.Hammer = Hammer;
/**
 * plugins
 * @namespace Plugins
 * @type {Object}
 */
XScroll.Plugins = {};

if (typeof module == 'object' && module.exports) {
	module.exports = XScroll;
}
/** ignored by jsdoc **/
else {
	return window.XScroll = XScroll;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
var _once = function(func) {
  var ran = false,
    memo;
  return function() {
    if (ran) return memo;
    ran = true;
    memo = func.apply(this, arguments);
    func = null;
    return memo;
  };
};


/**
 * @discription events
 * @mixin
 */
var Events = {
  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  on: function(name, callback, context) {
    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({
      callback: callback,
      context: context,
      ctx: context || this
    });
    return this;
  },


  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, it will be removed.
  once: function(name, callback, context) {
    if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
    var self = this;
    var once = _once(function() {
      self.off(name, once);
      callback.apply(this, arguments);
    });
    once._callback = callback;
    return this.on(name, once, context);
  },

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  off: function(name, callback, context) {
    if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;

    // Remove all callbacks for all events.
    if (!name && !callback && !context) {
      this._events = void 0;
      return this;
    }

    var names = name ? [name] : Object.keys(this._events);
    for (var i = 0, length = names.length; i < length; i++) {
      name = names[i];

      // Bail out if there are no events stored.
      var events = this._events[name];
      if (!events) continue;

      // Remove all callbacks for this event.
      if (!callback && !context) {
        delete this._events[name];
        continue;
      }

      // Find any remaining events.
      var remaining = [];
      for (var j = 0, k = events.length; j < k; j++) {
        var event = events[j];
        if (
          callback && callback !== event.callback &&
          callback !== event.callback._callback ||
          context && context !== event.context
        ) {
          remaining.push(event);
        }
      }

      // Replace events if there are any remaining.  Otherwise, clean up.
      if (remaining.length) {
        this._events[name] = remaining;
      } else {
        delete this._events[name];
      }
    }

    return this;
  },

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  trigger: function(name) {
    if (!this._events) return this;
    var args = Array.prototype.slice.call(arguments, 1);
    if (!eventsApi(this, 'trigger', name, args)) return this;
    var events = this._events[name];
    var allEvents = this._events.all;
    if (events) triggerEvents(events, args);
    if (allEvents) triggerEvents(allEvents, arguments);
    return this;
  },

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  listenTo: function(obj, name, callback) {
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var id = obj._listenId || (obj._listenId = Util.guid('l'));
    listeningTo[id] = obj;
    if (!callback && typeof name === 'object') callback = this;
    obj.on(name, callback, this);
    return this;
  },

  listenToOnce: function(obj, name, callback) {
    if (typeof name === 'object') {
      for (var event in name) this.listenToOnce(obj, event, name[event]);
      return this;
    }
    var cb = _once(function() {
      this.stopListening(obj, name, cb);
      callback.apply(this, arguments);
    });
    cb._callback = callback;
    return this.listenTo(obj, name, cb);
  },

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  stopListening: function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;
    var remove = !name && !callback;
    if (!callback && typeof name === 'object') callback = this;
    if (obj)(listeningTo = {})[obj._listenId] = obj;
    for (var id in listeningTo) {
      obj = listeningTo[id];
      obj.off(name, callback, this);
      if (remove || Util.isEmpty(obj._events)) delete this._listeningTo[id];
    }
    return this;
  }

};

// Regular expression used to split event strings.
var eventSplitter = /\s+/;

// Implement fancy features of the Events API such as multiple event
// names `"change blur"` and jQuery-style event maps `{change: action}`
// in terms of the existing API.
var eventsApi = function(obj, action, name, rest) {
  if (!name) return true;

  // Handle event maps.
  if (typeof name === 'object') {
    for (var key in name) {
      obj[action].apply(obj, [key, name[key]].concat(rest));
    }
    return false;
  }

  // Handle space separated event names.
  if (eventSplitter.test(name)) {
    var names = name.split(eventSplitter);
    for (var i = 0, length = names.length; i < length; i++) {
      obj[action].apply(obj, [names[i]].concat(rest));
    }
    return false;
  }

  return true;
};

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
var triggerEvents = function(events, args) {
  var ev, i = -1,
    l = events.length,
    a1 = args[0],
    a2 = args[1],
    a3 = args[2];
  switch (args.length) {
    case 0:
      while (++i < l)(ev = events[i]).callback.call(ev.ctx);
      return;
    case 1:
      while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1);
      return;
    case 2:
      while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2);
      return;
    case 3:
      while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
      return;
    default:
      while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args);
      return;
  }
};

// Aliases for backwards compatibility.
Events.bind = Events.on;
Events.unbind = Events.off;

if (typeof module == 'object' && module.exports) {
  module.exports = Events;
}
/** ignored by jsdoc **/
else {
  return Events;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164),
  Base = __webpack_require__(165),
  Core = __webpack_require__(172),
  Animate = __webpack_require__(166),
  Hammer = __webpack_require__(168),
  ScrollBar = __webpack_require__(247),
  Controller = __webpack_require__(248);
//reduced boundry pan distance
var PAN_RATE = 1 - 0.618;
//constant for scrolling acceleration
var SCROLL_ACCELERATION = 0.0005;
//constant for outside of boundry acceleration
var BOUNDRY_ACCELERATION = 0.03;
//transform-origin
var transformOrigin = Util.prefixStyle("transformOrigin");
//transform
var transform = Util.prefixStyle("transform");
/** 
 * @constructor
 * @param {object} cfg config for scroll
 * @param {number} cfg.SCROLL_ACCELERATION  acceleration for scroll, min value make the scrolling smoothly
 * @param {number} cfg.BOUNDRY_CHECK_DURATION duration for boundry bounce
 * @param {number} cfg.BOUNDRY_CHECK_EASING easing for boundry bounce
 * @param {number} cfg.BOUNDRY_CHECK_ACCELERATION acceleration for boundry bounce
 * @param {boolean} cfg.lockX just like overflow-x:hidden
 * @param {boolean} cfg.lockY just like overflow-y:hidden
 * @param {boolean} cfg.scrollbarX config if the scrollbar-x is visible
 * @param {boolean} cfg.scrollbarY config if the scrollbar-y is visible
 * @param {boolean} cfg.useTransition config if use css3 transition or raf for scroll animation
 * @param {boolean} cfg.bounce config if use has the bounce effect when scrolling outside of the boundry
 * @param {boolean} cfg.boundryCheck config if scrolling inside of the boundry
 * @param {boolean} cfg.preventDefault prevent touchstart
 * @param {boolean} cfg.preventTouchMove prevent touchmove
 * @param {string|HTMLElement}  cfg.container config for scroller's container which default value is ".xs-container"
 * @param {string|HTMLElement}  cfg.content config for scroller's content which default value is ".xs-content"
 * @param {object}  cfg.indicatorInsets  config scrollbars position {top: number, left: number, bottom: number, right: number}
 * @param {string}  cfg.stickyElements config for sticky-positioned elements
 * @param {string}  cfg.fixedElements config for fixed-positioned elements
 * @param {string}  cfg.touchAction config for touchAction of the scroller
 * @extends XScroll
 * @example
 * var xscroll = new SimuScroll({
 *    renderTo:"#scroll",
 *    lockX:false,
 *    scrollbarX:true
 * });
 * xscroll.render();
 */
function SimuScroll(cfg) {
  SimuScroll.superclass.constructor.call(this, cfg);
}

Util.extend(SimuScroll, Core, {
  /** 
   * @memberof SimuScroll
   * @override
   */
  init: function() {
    var self = this;
    var defaultCfg = {
      preventDefault: true,
      preventTouchMove: true
    };
    SimuScroll.superclass.init.call(this);
    self.userConfig = Util.mix(defaultCfg, self.userConfig);
    self.SCROLL_ACCELERATION = self.userConfig.SCROLL_ACCELERATION || SCROLL_ACCELERATION;
    self.BOUNDRY_ACCELERATION = self.userConfig.BOUNDRY_ACCELERATION || BOUNDRY_ACCELERATION;
    self._initContainer();
    self.resetSize();
    //set overflow behaviors
    self._setOverflowBehavior();
    self.defaltConfig = {
      lockY: self.userConfig.lockY,
      lockX: self.userConfig.lockX
    }
    return self;
  },
  destroy: function() {
    var self = this;
    SimuScroll.superclass.destroy.call(this);
    self.renderTo.style.overflow = "";
    self.renderTo.style.touchAction = "";
    self.container.style.transform = "";
    self.container.style.transformOrigin = "";
    self.content.style.transform = "";
    self.content.style.transformOrigin = "";
    self.off("touchstart mousedown", self._ontouchstart);
    self.off("touchmove", self._ontouchmove);
    window.removeEventListener("resize", self.resizeHandler, self);
    self.destroyScrollBars();
  },
  /**
   * set overflow behavior
   * @return {boolean} [description]
   */
  _setOverflowBehavior: function() {
    var self = this;
    var renderTo = self.renderTo;
    var computeStyle = getComputedStyle(renderTo);
    self.userConfig.lockX = undefined === self.userConfig.lockX ? ((computeStyle['overflow-x'] == "hidden" || self.width == self.containerWidth) ? true : false) : self.userConfig.lockX;
    self.userConfig.lockY = undefined === self.userConfig.lockY ? ((computeStyle['overflow-y'] == "hidden" || self.height == self.containerHeight) ? true : false) : self.userConfig.lockY;
    self.userConfig.scrollbarX = undefined === self.userConfig.scrollbarX ? (self.userConfig.lockX ? false : true) : self.userConfig.scrollbarX;
    self.userConfig.scrollbarY = undefined === self.userConfig.scrollbarY ? (self.userConfig.lockY ? false : true) : self.userConfig.scrollbarY;
    return self;
  },
  /**
   * reset lockX or lockY config to the default value
   */
  _resetLockConfig: function() {
    var self = this;
    self.userConfig.lockX = self.defaltConfig.lockX;
    self.userConfig.lockY = self.defaltConfig.lockY;
    return self;
  },
  /**
   * init container
   * @override
   * @return {SimuScroll}
   */
  _initContainer: function() {
    var self = this;
    SimuScroll.superclass._initContainer.call(self);
    if (self.__isContainerInited || !self.container || !self.content) return;
    self.container.style[transformOrigin] = "0 0";
    self.content.style[transformOrigin] = "0 0";
    self.translate(0, 0);
    self.__isContainerInited = true;
    return self;
  },
  /**
   * get scroll top value
   * @memberof SimuScroll
   * @return {number} scrollTop
   */
  getScrollTop: function() {
    var transY = window.getComputedStyle(this.container)[transform].match(/[-\d\.*\d*]+/g);
    return transY ? Math.round(transY[5]) === 0 ? 0 : -Math.round(transY[5]) : 0;
  },
  /**
   * get scroll left value
   * @memberof SimuScroll
   * @return {number} scrollLeft
   */
  getScrollLeft: function() {
    var transX = window.getComputedStyle(this.content)[transform].match(/[-\d\.*\d*]+/g);
    return transX ? Math.round(transX[4]) === 0 ? 0 : -Math.round(transX[4]) : 0;
  },
  /**
   * horizontal scroll absolute to the destination
   * @memberof SimuScroll
   * @param scrollLeft {number} scrollLeft
   * @param duration {number} duration for animte
   * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
   **/
  scrollLeft: function(x, duration, easing, callback) {
    if (this.userConfig.lockX) return;
    var translateZ = this.userConfig.gpuAcceleration ? " translateZ(0) " : "";
    this.x = (undefined === x || isNaN(x) || 0 === x) ? 0 : -Math.round(x);
    this._animate("x", "translateX(" + this.x + "px) scale(" + this.scale + ")" + translateZ, duration, easing, callback);
    return this;
  },
  /**
   * vertical scroll absolute to the destination
   * @memberof SimuScroll
   * @param scrollTop {number} scrollTop
   * @param duration {number} duration for animte
   * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
   **/
  scrollTop: function(y, duration, easing, callback) {
    if (this.userConfig.lockY) return;
    var translateZ = this.userConfig.gpuAcceleration ? " translateZ(0) " : "";
    this.y = (undefined === y || isNaN(y) || 0 === y) ? 0 : -Math.round(y);
    this._animate("y", "translateY(" + this.y + "px) " + translateZ, duration, easing, callback);
    return this;
  },
  /**
   * translate the scroller to a new destination includes x , y , scale
   * @memberof SimuScroll
   * @param x {number} x
   * @param y {number} y
   * @param scale {number} scale
   **/
  translate: function(x, y, scale) {
    var translateZ = this.userConfig.gpuAcceleration ? " translateZ(0) " : "";
    this.x = x || this.x || 0;
    this.y = y || this.y || 0;
    this.scale = scale || this.scale || 1;
    this.content.style[transform] = "translate(" + this.x + "px,0px) scale(" + this.scale + ") " + translateZ;
    this.container.style[transform] = "translate(0px," + this.y + "px) " + translateZ;
    return this;
  },
  _animate: function(type, transform, duration, easing, callback) {
    var self = this;
    var duration = duration || 0;
    var easing = easing || "quadratic";
    var el = type == "y" ? self.container : self.content;
    var config = {
      css: {
        transform: transform
      },
      duration: duration,
      easing: easing,
      run: function(e) {
        /**
         * @event {@link SimuScroll#"scroll"}
         */
        self.trigger("scroll", {
          scrollTop: self.getScrollTop(),
          scrollLeft: self.getScrollLeft(),
          type: "scroll"
        });
      },
      useTransition: self.userConfig.useTransition,
      end: function(e) {
        callback && callback();
        if ((self["_bounce" + type] === 0 || self["_bounce" + type] === undefined) && easing != "linear") {
          self['isScrolling' + type.toUpperCase()] = false;
          self['isRealScrolling' + type.toUpperCase()] = false;
          self.trigger("scrollend", {
            type: "scrollend",
            scrollTop: self.getScrollTop(),
            scrollLeft: self.getScrollLeft(),
            zoomType: type,
            duration: duration,
            easing: easing
          });
        }
      }
    };
    var timer = self.__timers[type] = self.__timers[type] || new Animate(el, config);
    timer.stop();
    timer.reset(config);
    timer.run();
    self.trigger("scrollanimate", {
      type: "scrollanimate",
      scrollTop: -self.y,
      scrollLeft: -self.x,
      duration: duration,
      easing: easing,
      zoomType: type
    })
    return this;
  },
  _ontap: function(e) {
    var self = this;
    self.boundryCheck();
    // self._unPreventHref(e);
    if (!self.isRealScrollingX && !self.isRealScrollingY) {
      // self._triggerClick(e);
    }
    // self._preventHref(e);
    self.isRealScrollingY = false;
    self.isRealScrollingY = false;
  },
  _bindEvt: function() {
    SimuScroll.superclass._bindEvt.call(this);
    var self = this;
    if (self.__isEvtBind) return;
    self.__isEvtBind = true;
    var pinch = new Hammer.Pinch();
    self.mc.add(pinch);
    self.on("touchstart mousedown", self._ontouchstart, self);
    self.on("touchmove", self._ontouchmove, self);
    self.on("tap", self._ontap, self);
    self.on("panstart", self._onpanstart, self);
    self.on("pan", self._onpan, self);
    self.on("panend", self._onpanend, self);
    self.resizeHandler = function(e) {
      setTimeout(function() {
        self.resetSize();
        self.boundryCheck(0);
        self.render();
      }, 100);
    }
    //window resize
    window.addEventListener("resize", self.resizeHandler, self);

    return this;
  },
  _ontouchstart: function(e) {
    var self = this;
    if (!(/(SELECT|INPUT|TEXTAREA)/i).test(e.target.tagName) && self.userConfig.preventDefault) {
      e.preventDefault();
    }
    self.stop();
  },
  _ontouchmove: function(e) {
    this.userConfig.preventTouchMove && e.preventDefault();
  },
  _onpanstart: function(e) {
    this.userConfig.preventTouchMove && e.preventDefault();
    var self = this;
    var scrollLeft = self.getScrollLeft();
    var scrollTop = self.getScrollTop();
    self.stop();
    self.translate(-scrollLeft, -scrollTop);
    var threshold = self.mc.get("pan").options.threshold;
    self.thresholdY = e.direction == "8" ? threshold : e.direction == "16" ? -threshold : 0;
    self.thresholdX = e.direction == "2" ? threshold : e.direction == "4" ? -threshold : 0;
    return self;
  },
  _onpan: function(e) {
    this.userConfig.preventTouchMove && e.preventDefault();
    var self = this;
    var boundry = self.boundry;
    var userConfig = self.userConfig;
    var boundryCheck = userConfig.boundryCheck;
    var bounce = userConfig.bounce;
    var scrollTop = self.__topstart || (self.__topstart = -self.getScrollTop());
    var scrollLeft = self.__leftstart || (self.__leftstart = -self.getScrollLeft());
    var y = userConfig.lockY ? Number(scrollTop) : Number(scrollTop) + (e.deltaY + self.thresholdY);
    var x = userConfig.lockX ? Number(scrollLeft) : Number(scrollLeft) + (e.deltaX + self.thresholdX);
    var containerWidth = self.containerWidth;
    var containerHeight = self.containerHeight;
    if (boundryCheck) {
      //over top
      y = y > boundry.top ? bounce ? (y - boundry.top) * PAN_RATE + boundry.top : boundry.top : y;
      //over bottom
      y = y < boundry.bottom - containerHeight ? bounce ? y + (boundry.bottom - containerHeight - y) * PAN_RATE : boundry.bottom - containerHeight : y;
      //over left
      x = x > boundry.left ? bounce ? (x - boundry.left) * PAN_RATE + boundry.left : boundry.left : x;
      //over right
      x = x < boundry.right - containerWidth ? bounce ? x + (boundry.right - containerWidth - x) * PAN_RATE : boundry.right - containerWidth : x;
    }
    //move to x,y
    self.translate(x, y);
    //pan trigger the opposite direction
    self.directionX = e.type == 'panleft' ? 'right' : e.type == 'panright' ? 'left' : '';
    self.directionY = e.type == 'panup' ? 'down' : e.type == 'pandown' ? 'up' : '';
    self.trigger("scroll", {
      scrollTop: -y,
      scrollLeft: -x,
      triggerType: "pan",
      type: "scroll"
    });
    return self;
  },
  _onpanend: function(e) {
    var self = this;
    var userConfig = self.userConfig;
    var transX = self.computeScroll("x", e.velocityX);
    var transY = self.computeScroll("y", e.velocityY);
    var scrollLeft = transX ? transX.pos : 0;
    var scrollTop = transY ? transY.pos : 0;
    var duration;
    if (transX && transY && transX.status == "inside" && transY.status == "inside" && transX.duration && transY.duration) {
      //ensure the same duration
      duration = Math.max(transX.duration, transY.duration);
    }
    transX && self.scrollLeft(scrollLeft, duration || transX.duration, transX.easing, function(e) {
      self.boundryCheckX();
    });
    transY && self.scrollTop(scrollTop, duration || transY.duration, transY.easing, function(e) {
      self.boundryCheckY();
    });
    //judge the direction
    self.directionX = e.velocityX < 0 ? "left" : "right";
    self.directionY = e.velocityY < 0 ? "up" : "down";
    //clear start
    self.__topstart = null;
    self.__leftstart = null;
    return self;
  },
  /**
   * judge the scroller is out of boundry horizontally and vertically
   * @memberof SimuScroll
   * @return {boolean} isBoundryOut
   **/
  isBoundryOut: function() {
    return this.isBoundryOutLeft() || this.isBoundryOutRight() || this.isBoundryOutTop() || this.isBoundryOutBottom();
  },
  /**
   * judge if the scroller is outsideof left
   * @memberof SimuScroll
   * @return {boolean} isBoundryOut
   **/
  isBoundryOutLeft: function() {
    return this.getBoundryOutLeft() > 0 ? true : false;
  },
  /**
   * judge if the scroller is outsideof right
   * @memberof SimuScroll
   * @return {boolean} isBoundryOut
   **/
  isBoundryOutRight: function() {
    return this.getBoundryOutRight() > 0 ? true : false;
  },
  /**
   * judge if the scroller is outsideof top
   * @memberof SimuScroll
   * @return {boolean} isBoundryOut
   **/
  isBoundryOutTop: function() {
    return this.getBoundryOutTop() > 0 ? true : false;
  },
  /**
   * judge if the scroller is outsideof bottom
   * @memberof SimuScroll
   * @return {boolean} isBoundryOut
   **/
  isBoundryOutBottom: function() {
    return this.getBoundryOutBottom() > 0 ? true : false;
  },
  /**
   * get the offset value outsideof top
   * @memberof SimuScroll
   * @return {number} offset
   **/
  getBoundryOutTop: function() {
    return -this.boundry.top - this.getScrollTop();
  },
  /**
   * get the offset value outsideof left
   * @memberof SimuScroll
   * @return {number} offset
   **/
  getBoundryOutLeft: function() {
    return -this.boundry.left - this.getScrollLeft();
  },
  /**
   * get the offset value outsideof bottom
   * @memberof SimuScroll
   * @return {number} offset
   **/
  getBoundryOutBottom: function() {
    return this.boundry.bottom - this.containerHeight + this.getScrollTop();
  },
  /**
   * get the offset value outsideof right
   * @memberof SimuScroll
   * @return {number} offset
   **/
  getBoundryOutRight: function() {
    return this.boundry.right - this.containerWidth + this.getScrollLeft();
  },
  /**
   * compute scroll transition by zoomType and velocity
   * @memberof SimuScroll
   * @param {string} zoomType zoomType of scrolling
   * @param {number} velocity velocity after panend
   * @example
   * var info = xscroll.computeScroll("x",2);
   * // return {pos:90,easing:"easing",status:"inside",duration:500}
   * @return {Object}
   **/
  computeScroll: function(type, v) {
    var self = this;
    var userConfig = self.userConfig;
    var boundry = self.boundry;
    var pos = type == "x" ? self.getScrollLeft() : self.getScrollTop();
    var boundryStart = type == "x" ? boundry.left : boundry.top;
    var boundryEnd = type == "x" ? boundry.right : boundry.bottom;
    var innerSize = type == "x" ? self.containerWidth : self.containerHeight;
    var maxSpeed = userConfig.maxSpeed || 2;
    var boundryCheck = userConfig.boundryCheck;
    var bounce = userConfig.bounce;
    var transition = {};
    var status = "inside";
    if (boundryCheck) {
      if (type == "x" && (self.isBoundryOutLeft() || self.isBoundryOutRight())) {
        self.boundryCheckX();
        return;
      } else if (type == "y" && (self.isBoundryOutTop() || self.isBoundryOutBottom())) {
        self.boundryCheckY();
        return;
      }
    }
    if (type == "x" && self.userConfig.lockX) return;
    if (type == "y" && self.userConfig.lockY) return;
    v = v > maxSpeed ? maxSpeed : v < -maxSpeed ? -maxSpeed : v;
    var a = self.SCROLL_ACCELERATION * (v / (Math.abs(v) || 1));
    var a2 = self.BOUNDRY_ACCELERATION;
    var t = isNaN(v / a) ? 0 : v / a;
    var s = Number(pos) + t * v / 2;
    //over top boundry check bounce
    if (s < -boundryStart && boundryCheck) {
      var _s = -boundryStart - pos;
      var _t = (Math.sqrt(-2 * a * _s + v * v) + v) / a;
      var v0 = v - a * _t;
      var _t2 = Math.abs(v0 / a2);
      var s2 = v0 / 2 * _t2;
      t = _t + _t2;
      s = bounce ? -boundryStart + s2 : -boundryStart;
      status = "outside";
    } else if (s > innerSize - boundryEnd && boundryCheck) {
      var _s = (boundryEnd - innerSize) + pos;
      var _t = (Math.sqrt(-2 * a * _s + v * v) - v) / a;
      var v0 = v - a * _t;
      var _t2 = Math.abs(v0 / a2);
      var s2 = v0 / 2 * _t2;
      t = _t + _t2;
      s = bounce ? innerSize - boundryEnd + s2 : innerSize - boundryEnd;
      status = "outside";
    }
    if (isNaN(s) || isNaN(t)) return;
    transition.pos = s;
    transition.duration = t;
    transition.easing = Math.abs(v) > 2 ? "circular" : "quadratic";
    transition.status = status;
    var Type = type.toUpperCase();
    self['isScrolling' + Type] = true;
    self['isRealScrolling' + Type] = true;
    return transition;
  },
  /**
   * bounce to the boundry horizontal
   * @memberof SimuScroll
   * @return {SimuScroll}
   **/
  boundryCheckX: function(duration, easing, callback) {
    var self = this;
    if (!self.userConfig.boundryCheck) return;
    if (typeof arguments[0] == "function") {
      callback = arguments[0];
      duration = self.userConfig.BOUNDRY_CHECK_DURATION;
      easing = self.userConfig.BOUNDRY_CHECK_EASING;
    } else {
      duration = duration === 0 ? 0 : self.userConfig.BOUNDRY_CHECK_DURATION,
        easing = easing || self.userConfig.BOUNDRY_CHECK_EASING;
    }
    if (!self.userConfig.bounce || self.userConfig.lockX) return;
    var boundry = self.boundry;
    if (self.isBoundryOutLeft()) {
      self.scrollLeft(-boundry.left, duration, easing, callback);
    } else if (self.isBoundryOutRight()) {
      self.scrollLeft(self.containerWidth - boundry.right, duration, easing, callback);
    }
    return self;
  },
  /**
   * bounce to the boundry vertical
   * @memberof SimuScroll
   * @return {SimuScroll}
   **/
  boundryCheckY: function(duration, easing, callback) {
    var self = this;
    if (!self.userConfig.boundryCheck) return;
    if (typeof arguments[0] == "function") {
      callback = arguments[0];
      duration = self.userConfig.BOUNDRY_CHECK_DURATION;
      easing = self.userConfig.BOUNDRY_CHECK_EASING;
    } else {
      duration = duration === 0 ? 0 : self.userConfig.BOUNDRY_CHECK_DURATION,
        easing = easing || self.userConfig.BOUNDRY_CHECK_EASING;
    }
    if (!self.userConfig.boundryCheck || self.userConfig.lockY) return;
    var boundry = self.boundry;
    if (self.isBoundryOutTop()) {
      self.scrollTop(-boundry.top, duration, easing, callback);
    } else if (self.isBoundryOutBottom()) {
      self.scrollTop(self.containerHeight - boundry.bottom, duration, easing, callback);
    }
    return self;
  },
  /**
   * bounce to the boundry vertical and horizontal
   * @memberof SimuScroll
   * @return {SimuScroll}
   **/
  boundryCheck: function(duration, easing, callback) {
    this.boundryCheckX(duration, easing, callback);
    this.boundryCheckY(duration, easing, callback);
    return this;
  },
  /**
   * stop scrolling immediatelly
   * @memberof SimuScroll
   * @return {SimuScroll}
   **/
  stop: function() {
    var self = this;
    self.__timers.x && self.__timers.x.stop();
    self.__timers.y && self.__timers.y.stop();
    if (self.isScrollingX || self.isScrollingY) {
      var scrollTop = self.getScrollTop(),
        scrollLeft = self.getScrollLeft();
      self.trigger("scrollend", {
        scrollTop: scrollTop,
        scrollLeft: scrollLeft
      });
      self.trigger("stop", {
        scrollTop: scrollTop,
        scrollLeft: scrollLeft
      })
      self.isScrollingX = false;
      self.isScrollingY = false;
    }
    return self;
  },
  /**
   * render scroll
   * @memberof SimuScroll
   * @return {SimuScroll}
   **/
  render: function() {
    var self = this;
    SimuScroll.superclass.render.call(this);
    //fixed for scrollbars
    if (getComputedStyle(self.renderTo).position == "static") {
      self.renderTo.style.position = "relative";
    }
    self.renderTo.style.overflow = "hidden";
    self.initScrollBars();
    self.initController();
    return self;
  },
  /**
   * init scrollbars
   * @memberof SimuScroll
   * @return {SimuScroll}
   */
  initScrollBars: function() {
    var self = this;
    if (!self.userConfig.boundryCheck) return;
    var indicatorInsets = self.userConfig.indicatorInsets;
    if (self.userConfig.scrollbarX) {
      self.scrollbarX = self.scrollbarX || new ScrollBar({
        xscroll: self,
        type: "x",
        spacing: indicatorInsets.spacing
      });
      self.scrollbarX.render();
      self.scrollbarX._update();
      self.scrollbarX.hide();
    }
    if (self.userConfig.scrollbarY) {
      self.scrollbarY = self.scrollbarY || new ScrollBar({
        xscroll: self,
        type: "y",
        spacing: indicatorInsets.spacing
      });
      self.scrollbarY.render();
      self.scrollbarY._update();
      self.scrollbarY.hide();
    }
    return self;
  },
  /**
   * destroy scrollbars
   * @memberof SimuScroll
   * @return {SimuScroll}
   */
  destroyScrollBars: function() {
    this.scrollbarX && this.scrollbarX.destroy();
    this.scrollbarY && this.scrollbarY.destroy();
    return this;
  },
  /**
   * init controller for multi-scrollers
   * @memberof SimuScroll
   * @return {SimuScroll}
   */
  initController: function() {
    var self = this;
    self.controller = self.controller || new Controller({
      xscroll: self
    });
    return self;
  },
  _unPreventHref: function(e) {
    var target = Util.findParentEl(e.target,'a',this.renderTo);
    if(!target) return;
    if (target.tagName.toLowerCase() == "a") {
      var href = target.getAttribute("data-xs-href");
      if (href) {
        target.setAttribute("href", href);
      }
    }
  },
  _preventHref: function(e) {
    var target = Util.findParentEl(e.target,'a',this.renderTo);
    if(!target) return;
    if (target.tagName.toLowerCase() == "a") {
      var href = target.getAttribute("href");
      href && target.setAttribute("href", "javascript:void(0)");
      href && target.setAttribute("data-xs-href", href);
    }
  },
  _triggerClick: function(e) {
    var target = e.target;
    if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
      var ev = document.createEvent('MouseEvents');
      ev.initMouseEvent('click', true, true, e.view, 1,
        target.screenX, target.screenY, target.clientX, target.clientY,
        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
        0, null);
      target.dispatchEvent(ev);
    }
  }
});

if (typeof module == 'object' && module.exports) {
  module.exports = SimuScroll;
}
/** ignored by jsdoc **/
else {
  return SimuScroll;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
 var Util = __webpack_require__(164);

 function Boundry(cfg) {
     this.cfg = Util.mix({
         width: 0,
         height: 0
     }, cfg)
     this.init();
 }
 Util.mix(Boundry.prototype, {
     init: function() {
         var self = this;
         self._xtop = 0;
         self._xright = 0;
         self._xleft = 0;
         self._xbottom = 0;
         self.refresh({
             width: self.cfg.width,
             height: self.cfg.height
         });
     },
     reset: function() {
         this.resetTop();
         this.resetLeft();
         this.resetBottom();
         this.resetRight();
         return this;
     },
     resetTop: function() {
         this._xtop = 0;
         this.refresh();
         return this;
     },
     resetLeft: function() {
         this._xleft = 0;
         this.refresh();
         return this;
     },
     resetBottom: function() {
         this._xbottom = 0;
         this.refresh();
         return this;
     },
     resetRight: function() {
         this._xright = 0;
         this.refresh();
         return this;
     },
     expandTop: function(top) {
         this._xtop = top;
         this.refresh();
         return this;
     },
     expandLeft: function(left) {
         this._xleft = left;
         this.refresh();
         return this;
     },
     expandRight: function(right) {
         this._xright = right;
         this.refresh();
         return this;
     },
     expandBottom: function(bottom) {
         this._xbottom = bottom;
         this.refresh();
         return this;
     },
     refresh: function(cfg) {
         Util.mix(this.cfg, cfg);
         this.top = this._xtop;
         this.left = this._xleft;
         this.bottom = (cfg && cfg.height || this.cfg.height || 0) - this._xbottom;
         this.right = (cfg && cfg.width || this.cfg.width || 0) - this._xright;
         this.width = this.right - this.left > 0 ? this.right - this.left : 0;
         this.height = this.bottom - this.top > 0 ? this.bottom - this.top : 0;
         return this;
     }
 });


 if (typeof module == 'object' && module.exports) {
     module.exports = Boundry;
 }
 /** ignored by jsdoc **/
 else{
    return Boundry;
 }
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
var Base = __webpack_require__(165);
//transform
var transform = Util.prefixStyle("transform");
// default render function for position:sticky elements
var defaultStickyRenderFunc = function(e) {
  var stickyElement = e.stickyElement;
  var curStickyElement = e.curStickyElement;
  var xscroll = e.xscroll;
  var _ = e._;
  var infinite = xscroll.getPlugin("infinite");
  if (infinite) {
    infinite.userConfig.renderHook.call(self, stickyElement, curStickyElement);
    stickyElement.setAttribute("xs-guid", curStickyElement.guid);
    Util.addClass(stickyElement, curStickyElement.className);
    for (var attrName in curStickyElement.style) {
      if (attrName != "display" && attrName != "position") {
        //copy styles
        stickyElement.style[attrName] = attrName == _.height ? curStickyElement.style[attrName] + 'px' : curStickyElement.style[attrName];
      }
    }
  } else {
    var style = curStickyElement.getAttribute("style");
    stickyElement.innerHTML = curStickyElement.innerHTML;
    stickyElement.className = curStickyElement.className;
    style && stickyElement.setAttribute("style", style);
  }
}

var Sticky = function(cfg) {
  Sticky.superclass.constructor.call(this, cfg);
  this.userConfig = Util.mix({
    stickyRenderTo: undefined,
    forceSticky: true,
    prefix: "xs-sticky-container",
    stickyRenderFunc: defaultStickyRenderFunc,
    zoomType: "y"
  }, cfg);
  this.init();
}

Util.extend(Sticky, Base, {
  init: function() {
    var self = this,
      userConfig = self.userConfig,
      xscroll = self.xscroll = userConfig.xscroll;
    var isY = self.isY = !!(userConfig.zoomType == "y");
    self._ = {
      top: self.isY ? "top" : "left",
      left: self.isY ? "left" : "bottom",
      right: self.isY ? "right" : "top",
      height: self.isY ? "height" : "width",
      width: self.isY ? "width" : "height"
    };
    self.stickyRenderTo = Util.getNode(userConfig.stickyRenderTo);
    self._handlers = [];
    return self;
  },
  getStickiesPos: function() {
    var self = this;
    var xscroll = self.xscroll;
    var isInfinite = self.isInfinite;
    var isY = self.isY;
    var _ = self._;
    var stickiesPos = [];
    var getPos = function(sticky) {
      var pos = {};
      if (isInfinite) {
        pos[_.top] = isY ? sticky._top : sticky._left;
        pos[_.height] = isY ? sticky._height : sticky._width;
      } else {
        pos[_.top] = self.isY ? Util.getOffsetTop(sticky) : Util.getOffsetLeft(sticky);
        pos[_.height] = self.isY ? sticky.offsetHeight : sticky.offsetWidth;
      }
      return pos;
    }
    for (var i = 0; i < self.stickiesNum; i++) {
      var pos = getPos(self.stickyElements[i]);
      self._handlers[i] = self._handlers[i] || self.createStickyEl();
      pos.el = self._handlers[i];
      pos.isRender = false;
      stickiesPos.push(pos);
    }
    return stickiesPos
  },
  getStickyElements: function() {
    var self = this;
    var xscroll = self.xscroll;
    var userConfig = self.userConfig;
    var isInfinite = self.isInfinite;
    var infinite = xscroll.getPlugin("infinite");
    if (infinite) {
      var stickyElements = [],
        serializedData = infinite.__serializedData;
      for (var i in serializedData) {
        var rowData = serializedData[i];
        if (rowData && rowData.style && "sticky" == rowData.style.position) {
          stickyElements.push(rowData);
        }
      }
      return stickyElements;
    } else {
      return Util.getNodes(xscroll.userConfig.stickyElements, xscroll.content);
    }
  },
  render: function(force) {
    var self = this;
    var userConfig = self.userConfig;
    var xscroll = self.xscroll;
    self.isInfinite = !!xscroll.getPlugin("infinite");
    var _ = self._;
    self.stickyElements = self.getStickyElements();
    self.stickiesNum = self.stickyElements && self.stickyElements.length;
    if (!self.stickiesNum) return;
    if (!self.stickyRenderTo) {
      self.stickyRenderTo = document.createElement('div');
      xscroll.renderTo.appendChild(self.stickyRenderTo);
    }
    self.stickiesPos = self.getStickiesPos();
    var stickyRenderTo = self.stickyRenderTo;
    stickyRenderTo.style[_.top] = 0;
    stickyRenderTo.style[_.left] = 0;
    stickyRenderTo.style[_.right] = 0;
    stickyRenderTo.style.position = xscroll.userConfig.useOriginScroll ? "fixed" : "absolute";
    Util.addClass(self.stickyRenderTo, userConfig.prefix);
    self.stickyHandler(force);
    self._bindEvt();
  },
  createStickyEl: function() {
    var self = this;
    var el = document.createElement('div');
    el.style.display = "none";
    Util.addClass(el, "xs-sticky-handler");
    self.stickyRenderTo.appendChild(el);
    return el;
  },
  _bindEvt: function() {
    var self = this,
      xscroll = self.xscroll;
    xscroll.on("scroll", self.stickyHandler, self);
  },
  stickyHandler: function(force) {
    var self = this;
    var xscroll = self.xscroll;
    var userConfig = self.userConfig;
    var scrollTop = self.isY ? xscroll.getScrollTop() : xscroll.getScrollLeft();
    var stickiesPos = self.stickiesPos;
    var _ = self._;
    var indexes = [];
    for (var i = 0, l = stickiesPos.length; i < l; i++) {
      var top = stickiesPos[i][_.top];
      if (scrollTop > top) {
        indexes.push(i);
      }
    }
    if (!indexes.length) {
      if (self.stickyElement) {
        self.stickyElement.style.display = "none";
      }
      self.curStickyIndex = undefined;
      return;
    }

    var curStickyIndex = Math.max.apply(null, indexes);
    if (self.curStickyIndex != curStickyIndex || force) {
      var prevStickyIndex = self.curStickyIndex;
      self.curStickyIndex = curStickyIndex;
      self.curStickyElement = self.stickyElements[curStickyIndex];
      self.curStickyPos = stickiesPos[curStickyIndex];
      self.stickyElement = self.curStickyPos.el;
      for (var i = 0, l = stickiesPos.length; i < l; i++) {
        stickiesPos[i].el.style.display = "none";
      }
      var eventsObj = {
        stickyElement: self.stickyElement,
        curStickyIndex: self.curStickyIndex,
        prevStickyIndex: prevStickyIndex,
        curStickyPos: self.curStickyPos,
        isRender: self.curStickyPos.isRender
      };
      xscroll.trigger("beforestickychange", eventsObj);
      self._stickyRenderFunc(self);
      xscroll.trigger("stickychange", eventsObj);
    }

    var trans = 0;
    if (self.stickiesPos[self.curStickyIndex + 1]) {
      var cur = self.stickiesPos[self.curStickyIndex];
      var next = self.stickiesPos[self.curStickyIndex + 1];
      if (scrollTop + cur[_.height] > next[_.top] && scrollTop + cur[_.height] < next[_.top] + cur[_.height]) {
        trans = cur[_.height] + scrollTop - next[_.top];
      } else {
        trans = 0;
      }
    }
    self.stickyElement.style[transform] = self.isY ? "translateY(-" + (trans) + "px) translateZ(0)" : "translateX(-" + (trans) + "px) translateZ(0)";
  },
  _stickyRenderFunc: function(e) {
    var self = this;
    var _ = self._;
    var stickyRenderFunc = self.userConfig.stickyRenderFunc;
    var el = self.curStickyPos.el;
    if (!self.curStickyPos.isRender) {
      el.style[_.left] = 0;
      el.style[_.right] = 0;
      stickyRenderFunc && stickyRenderFunc.call(self, e);
    }
    el.style.display = "block";
    self.curStickyPos.isRender = true;
  },
  destroy: function() {
    var self = this;
    self.stickyElements = undefined;
    self.stickiesNum = undefined;
    self.stickiesPos = undefined;
    Util.remove(self.stickyElement);
    self.stickyElement = undefined;
  }
});

if (typeof module == 'object' && module.exports) {
  module.exports = Sticky;
}
/** ignored by jsdoc **/
else {
  return Sticky;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
var Base = __webpack_require__(165);
var transform = Util.prefixStyle("transform");

var Fixed = function(cfg) {
  Fixed.superclass.constructor.call(this, cfg);
  this.userConfig = Util.mix({
    fixedRenderTo: undefined,
    fixedElements: ".xs-fixed",
    prefix: "xs-fixed-container",
    zoomType: "y"
  }, cfg);
  this.init();
}

Util.extend(Fixed, Base, {
  fixedElements: [],
  init: function() {
    var self = this,
      userConfig = self.userConfig,
      xscroll = self.xscroll = userConfig.xscroll,
      xscrollConfig = self.xscrollConfig = xscroll.userConfig;
    self.isY = !!(userConfig.zoomType == "y");
    self._ = self.isY ? {
      top: "top",
      height: "height",
      width: "width",
      offsetTop:"offsetTop"
    } : {
      top: "left",
      height: "width",
      width: "height",
      offsetTop:"offsetLeft"
    };
    self.fixedRenderTo = Util.getNode(userConfig.fixedRenderTo);
    return self;
  },
  render: function() {
    var self = this;
    var xscroll = self.xscroll;
    self.infinite = xscroll.getPlugin("infinite");
    if (!self.fixedRenderTo) {
      self.fixedRenderTo = document.createElement('div');
      xscroll.renderTo.appendChild(self.fixedRenderTo);
    }
    Util.addClass(self.fixedRenderTo, self.userConfig.prefix);
    var originalFixedElements = self.originalFixedElements = self.getFixedElements();
    for (var i = 0, l = originalFixedElements.length; i < l; i++) {
      self.renderFixedElement(originalFixedElements[i], i,self.fixedRenderTo);
    }
    return self;
  },
  getFixedElements: function() {
    var self = this;
    var infinite = self.infinite;
    var userConfig = self.userConfig;
    if (infinite) {
      var els = [];
      for (var i in infinite.__serializedData) {
        var data = infinite.__serializedData[i];
        if (data && data.style && data.style.position == "fixed") {
          els.push(data);
        }
      }
      return els;
    } else {
      return Util.getNodes(userConfig.fixedElements, self.xscroll.content);
    }
  },
  renderFixedElement: function(el, fixedIndex,fixedRenderTo) {
    var self = this;
    var isRender = true;
    var _ = self._;
    var xscroll = self.xscroll;
    var userConfig = self.userConfig;
    var xscrollConfig = self.xscrollConfig;
    var useOriginScroll = xscrollConfig.useOriginScroll;
    var infinite = self.infinite;
    var fixedElement = self.fixedElements[fixedIndex];
    if (!self.fixedElements[fixedIndex]) {
      isRender = false;
      if (useOriginScroll && !infinite) {
        //use original position:fixed stylesheet
        el.style.position = "fixed";
        el.style.display = "block";
      } else {
        //deep clone fixed nodes and hide original nodes
        fixedElement = document.createElement("div");
        if (infinite) {
          fixedElement.setAttribute("style", Util.stringifyStyle(Util.mix(el.style, {
            display: "block",
            width: "100%"
          })));
          fixedElement.style[_.top] = (el.style[_.top] >= 0 ? el.style[_.top] : el._top) + "px";
          if (el.style[_.height]) {
            fixedElement.style[_.height] = el.style[_.height] + "px";
          }
          infinite.userConfig.renderHook.call(self, fixedElement, el);
        } else {
          fixedElement.style.display = "block";
          fixedElement.style.position = "absolute";
          fixedElement.style[_.width] = "100%";
          fixedElement.innerHTML = el.innerHTML;
          fixedElement.className = el.className;
          fixedElement.setAttribute("style", el.getAttribute("style"));
          fixedElement.style[_.top] = el[_.offsetTop] + "px";
          el.style.display = "none";
        }
        fixedRenderTo.appendChild(fixedElement);
        self.fixedElements.push(fixedElement);
      }
    }
    xscroll.trigger("fixedchange", {
      fixedIndex: fixedIndex,
      fixedElement: useOriginScroll ? el : fixedElement,
      originalFixedElement: el,
      isRender: isRender
    });
  },
  destroy: function() {
    var self = this;
    self.fixedElements = undefined;
  }
});

if (typeof module == 'object' && module.exports) {
  module.exports = Fixed;
}
/** ignored by jsdoc **/
else {
  return Fixed;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
var Animate = __webpack_require__(166);
var MAX_BOUNCE_DISTANCE = 40;
var MIN_BAR_SCROLLED_SIZE = 10;
var MIN_BAR_SIZE = 50;
var transform = Util.prefixStyle("transform");
var transformStr = Util.vendor ? ["-", Util.vendor, "-transform"].join("") : "transform";
var transition = Util.prefixStyle("transition");
var borderRadius = Util.prefixStyle("borderRadius");
var transitionDuration = Util.prefixStyle("transitionDuration");

var ScrollBar = function(cfg) {
	this.userConfig = Util.mix({
		MIN_BAR_SCROLLED_SIZE:MIN_BAR_SCROLLED_SIZE,
		MIN_BAR_SIZE:MIN_BAR_SIZE,
		MAX_BOUNCE_DISTANCE:MAX_BOUNCE_DISTANCE,
		spacing:5
	}, cfg);
	this.init(cfg.xscroll);
}

Util.mix(ScrollBar.prototype, {
	init: function(xscroll) {
		var self = this;
		self.xscroll = xscroll;
		self.type = self.userConfig.type;
		self.isY = self.type == "y" ? true : false;
		self.scrollTopOrLeft = self.isY ? "scrollTop" : "scrollLeft";
	},
	destroy: function() {
		var self = this;
		Util.remove(self.scrollbar);
		self.xscroll.off("scroll", self._scrollHandler, self);
		self.xscroll.off("scrollend", self._scrollEndHandler, self);
	},
	render: function() {
		var self = this;
		var xscroll = self.xscroll;
		var boundry = xscroll.boundry;
		var indicatorInsets = self.xscroll.userConfig.indicatorInsets;
		var translateZ = xscroll.userConfig.gpuAcceleration ? " translateZ(0) " : "";
		var transform = translateZ ? transformStr + ":" + translateZ + ";" : "";
		var commonCss = "opacity:0;position:absolute;z-index:999;overflow:hidden;-webkit-border-radius:3px;-moz-border-radius:3px;-o-border-radius:3px;" + transform;
		indicatorInsets._xright =  indicatorInsets.right + indicatorInsets.spacing;
		indicatorInsets._xbottom =  indicatorInsets.bottom + indicatorInsets.spacing;
		var css = self.isY ?
			Util.substitute("width:{width}px;bottom:{_xbottom}px;top:{top}px;right:{right}px;", indicatorInsets) + commonCss :
			Util.substitute("height:{width}px;left:{left}px;right:{_xright}px;bottom:{bottom}px;",indicatorInsets) + commonCss;
		

		if(!self.scrollbar){
			self.scrollbar = document.createElement("div");	
			self.indicate = document.createElement("div");
			xscroll.renderTo.appendChild(self.scrollbar);
			self.scrollbar.appendChild(self.indicate);
		}
		self.scrollbar.style.cssText = css;
		var size = self.isY ? "width:100%;" : "height:100%;";
		self.indicate.style.cssText = size + "position:absolute;background:rgba(0,0,0,0.3);-webkit-border-radius:3px;-moz-border-radius:3px;-o-border-radius:3px;"
		self._update();
		self.hide(0);
		self._bindEvt();
	},
	_update: function(pos, duration, easing, callback) {
		var self = this;
		var pos = undefined === pos ? (self.isY ? self.xscroll.getScrollTop() : self.xscroll.getScrollLeft()) : pos;
		var barInfo = self.computeScrollBar(pos);
		var size = self.isY ? "height" : "width";
		self.indicate.style[size] = Math.round(barInfo.size) + "px";
		if (duration && easing) {
			self.scrollTo(barInfo.pos, duration, easing, callback);
		} else {
			self.moveTo(barInfo.pos);
		}
	},
	//compute the position and size of the scrollbar
	computeScrollBar: function(pos) {
		var self = this;
		var type = self.isY ? "y" : "x";
		var spacing = self.userConfig.spacing;
		var xscroll = self.xscroll;
		var boundry = xscroll.boundry;
		var userConfig = self.userConfig;
		var pos = self.isY ? Math.round(pos) + boundry._xtop : Math.round(pos) + boundry._xleft;
		var MIN_BAR_SCROLLED_SIZE = userConfig.MIN_BAR_SCROLLED_SIZE;
		var MIN_BAR_SIZE = userConfig.MIN_BAR_SIZE;
		var MAX_BOUNCE_DISTANCE = userConfig.MAX_BOUNCE_DISTANCE;
		self.containerSize = self.isY ? xscroll.containerHeight + boundry._xtop + boundry._xbottom : self.xscroll.containerWidth + boundry._xright + boundry._xleft;
		self.size = self.isY ? boundry.cfg.height : boundry.cfg.width;
		self.indicateSize = self.isY ? boundry.cfg.height - spacing * 2 : boundry.cfg.width - spacing * 2;
		var indicateSize = self.indicateSize;
		var containerSize = self.containerSize;
		var barPos = indicateSize * pos / containerSize;
		var barSize = Math.round(indicateSize * self.size / containerSize);
		var overTop = self.isY ? xscroll.getBoundryOutTop() : xscroll.getBoundryOutLeft();
		var overBottom = self.isY ? xscroll.getBoundryOutBottom() : xscroll.getBoundryOutRight();
		var barShiftSize = MIN_BAR_SIZE - barSize > 0 ? MIN_BAR_SIZE - barSize : 0;
		barSize = barSize < MIN_BAR_SIZE ? MIN_BAR_SIZE : barSize;
		barPos = (indicateSize - barShiftSize) * pos / containerSize;
		if (overTop >= 0) {
			var pct = overTop / MAX_BOUNCE_DISTANCE;
			pct = pct > 1 ? 1 : pct;
			barPos = - pct * (barSize -  MIN_BAR_SCROLLED_SIZE)
		}
		if (overBottom >= 0) {
			var pct = overBottom / MAX_BOUNCE_DISTANCE;
			pct = pct > 1 ? 1 : pct;
			barPos = pct * (barSize - MIN_BAR_SCROLLED_SIZE) + indicateSize - barSize; 
		}
		self.barPos = Math.round(barPos);
		return {
			size: Math.round(barSize),
			pos: self.barPos
		};
	},
	scrollTo: function(pos, duration, easing, callback) {
		var self = this;
		self.show();
		var translateZ = self.xscroll.userConfig.gpuAcceleration ? " translateZ(0) " : "";
		var config = {
			css: {
				transform: self.isY ? "translateY(" + pos + "px)" + translateZ : "translateX(" + pos + "px)" + translateZ
			},
			duration: duration,
			easing: easing,
			useTransition: self.xscroll.userConfig.useTransition,
			end: callback
		};
		self.__timer = self.__timer || new Animate(self.indicate, config);
		//run
		self.__timer.stop();
		self.__timer.reset(config);
		self.__timer.run();
	},
	moveTo: function(pos) {
		var self = this;
		self.show();
		var translateZ = self.xscroll.userConfig.gpuAcceleration ? " translateZ(0) " : "";
		self.isY ? self.indicate.style[transform] = "translateY(" + pos + "px) " + translateZ : self.indicate.style[transform] = "translateX(" + pos + "px) " + translateZ
		self.indicate.style[transition] = "";
	},
	_scrollHandler: function(e) {
		var self = this;
		self._update(e[self.scrollTopOrLeft]);
		return self;
	},
	isBoundryOut: function() {
		var self = this;
		return !self.isY ? (self.xscroll.isBoundryOutLeft() || self.xscroll.isBoundryOutRight()) : (self.xscroll.isBoundryOutTop() || self.xscroll.isBoundryOutBottom());
	},
	_scrollEndHandler: function(e) {
		var self = this;
		if (!self.isBoundryOut()) {
			self._update(e[self.scrollTopOrLeft]);
			self.hide();
		}
		return self;
	},
	_bindEvt: function() {
		var self = this;
		if (self.__isEvtBind) return;
		self.__isEvtBind = true;
		self.xscroll.on("scroll", self._scrollHandler, self);
		self.xscroll.on("scrollend", self._scrollEndHandler, self);
	},
	reset: function() {
		var self = this;
		self.pos = 0;
		self._update();
	},
	hide: function(duration, easing, delay) {
		var self = this;
		var duration = duration >= 0 ? duration : 300;
		var easing = easing || "ease-out";
		var delay = delay >= 0 ? delay : 100;
		self.scrollbar.style.opacity = 0;
		self.scrollbar.style[transition] = ["opacity ", duration, "ms ", " ease-out ", delay, "ms"].join("");
	},
	show: function() {
		var self = this;
		self.scrollbar.style.opacity = 1;
		self.scrollbar.style[transition] = "";
	}
});

if (typeof module == 'object' && module.exports) {
	module.exports = ScrollBar;
}
/** ignored by jsdoc **/
else {
	return ScrollBar;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
/*
	wrapped scroll controller
*/
"use strict";
var Util = __webpack_require__(164),
	Base = __webpack_require__(165);

var Controller = function(cfg) {
	Controller.superclass.constructor.call(this, cfg);
	this.userConfig = Util.mix({}, cfg);
	this.init();
}

Util.extend(Controller, Base, {
	init: function() {
		var self = this;
		self.xscroll = self.userConfig.xscroll;
	},
	add: function(scroll, cfg) {
		var self = this;
		cfg = Util.extend({
			captureBounce: false,
			stopPropagation: true
		}, cfg)
		if (!self.__scrolls) {
			self.__scrolls = {};
		}
		if (scroll.guid && !self.__scrolls[scroll.guid]) {
			scroll.parentscroll = self.xscroll;
			self._bind(scroll);
			return self.__scrolls[scroll.guid] = scroll;
		}
		return;
	},
	remove: function(scroll) {
		var self = this;
		if (!scroll || !scroll.guid) return;
		var subscroll = self.__scrolls[scroll.guid];
		if (subscroll) {
			subscroll.parentscroll = null;
			self._unbind(scroll);
			subscroll = null;
		}
	},
	get: function(guid) {
		if (guid) {
			return this.__scrolls[guid];
		}
		return this.__scrolls;
	},

	_unbind: function(sub) {

	},

	_bind: function(sub) {
		var self = this,
			xscroll = self.xscroll;
		xscroll.renderTo.addEventListener("touchstart", function() {
			xscroll._resetLockConfig();
		});
		sub.renderTo.addEventListener("touchstart", function() {
			sub._resetLockConfig();
		});
		xscroll.on("panend", xscroll._resetLockConfig);
		sub.on("panend", sub._resetLockConfig);
		sub.on("panstart", function(e) {
			//vertical scroll enabled
			if (!sub.userConfig.lockY && !xscroll.userConfig.lockY) {
				//outside of boundry
				if (sub.isBoundryOut()) {
					xscroll.userConfig.lockY = true;
					return;
				}
				if (e.direction == 16 && sub.getBoundryOutTop() >= 0) {
					sub.userConfig.lockY = true;
				} else if (e.direction == 8 && sub.getBoundryOutTop() >= 0 && sub.getBoundryOutBottom() < 0) {
					xscroll.userConfig.lockY = true;
				}
				if (e.direction == 8 && sub.getBoundryOutBottom() >= 0) {
					sub.userConfig.lockY = true;
				} else if (e.direction == 16 && sub.getBoundryOutBottom() >= 0 && sub.getBoundryOutTop() < 0) {
					xscroll.userConfig.lockY = true;
				}
				if (sub.getBoundryOutTop() < 0 && sub.getBoundryOutBottom() < 0) {
					xscroll.userConfig.lockY = true;
				}
			}
			//horizontal scroll enabled
			if (!sub.userConfig.lockX && !xscroll.userConfig.lockX) {
				if (sub.isBoundryOut()) {
					xscroll.userConfig.lockX = true;
					return;
				}
				if (e.direction == 4 && sub.getBoundryOutLeft() >= 0) {
					sub.userConfig.lockX = true;
				} else if (e.direction == 2 && sub.getBoundryOutLeft() >= 0 && sub.getBoundryOutRight() < 0) {
					xscroll.userConfig.lockX = true;
				}
				if (e.direction == 2 && sub.getBoundryOutRight() >= 0) {
					sub.userConfig.lockX = true;
				} else if (e.direction == 4 && sub.getBoundryOutRight() >= 0 && sub.getBoundryOutLeft() < 0) {
					xscroll.userConfig.lockX = true;
				}
				if (sub.getBoundryOutLeft() < 0 && sub.getBoundryOutRight() < 0) {
					xscroll.userConfig.lockX = true;
				}
			}

			if (!sub.userConfig.lockX && xscroll.userConfig.lockX) {
				//pan x
				if (e.direction == 2 || e.direction == 4) {
					xscroll.userConfig.lockY = true;
				} else {
					sub.userConfig.lockX = true;
				}
			}

			if (!sub.userConfig.lockY && xscroll.userConfig.lockY) {
				//pan y
				if (e.direction == 8 || e.direction == 16) {
					xscroll.userConfig.lockX = true;
				} else {
					sub.userConfig.lockY = true;
				}
			}
		});
	}
});

if (typeof module == 'object' && module.exports) {
	module.exports = Controller;
}
/** ignored by jsdoc **/
else {
	return Controller;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164),
    Base = __webpack_require__(165),
    Core = __webpack_require__(172),
    Animate = __webpack_require__(166);

var transformOrigin = Util.prefixStyle("transformOrigin");
/** 
 * @constructor
 * @param {object} cfg config for scroll
 * @extends XScroll
 * @example
 * var xscroll = new OriginScroll({
 *    renderTo:"#scroll"
 * });
 * xscroll.render();
 */
function OriginScroll(cfg) {
    OriginScroll.superclass.constructor.call(this, cfg);
}

Util.extend(OriginScroll, Core, {
    init: function() {
        var self = this;
        OriginScroll.superclass.init.call(this);
        self.resetSize();
    },
    /**
     * get scroll top value
     * @memberof OriginScroll
     * @return {number} scrollTop
     */
    getScrollTop: function() {
        return this.renderTo.scrollTop;
    },
    /**
     * get scroll left value
     * @memberof OriginScroll
     * @return {number} scrollLeft
     */
    getScrollLeft: function() {
        return this.renderTo.scrollLeft;
    },
    /**
     * vertical scroll absolute to the destination
     * @memberof SimuScroll
     * @param scrollTop {number} scrollTop
     * @param duration {number} duration for animte
     * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
     **/
    scrollTop: function(y, duration, easing, callback) {
        var self = this;
        var y = Math.round(y);
        if (self.userConfig.lockY) return;
        var duration = duration || 0;
        var easing = easing || "quadratic";
        var config = {
            css: {
                scrollTop: y
            },
            duration: duration,
            easing: easing,
            run: function(e) {
                //trigger scroll event
                self.trigger("scroll", {
                    scrollTop: self.getScrollTop(),
                    scrollLeft: self.getScrollLeft()
                });
            },
            useTransition: false, //scrollTop 
            end: callback
        };
        self.__timers.y = self.__timers.y || new Animate(self.renderTo, config);
        //run
        self.__timers.y.stop();
        self.__timers.y.reset(config);
        self.__timers.y.run();
    },
    /**
     * horizontal scroll absolute to the destination
     * @memberof SimuScroll
     * @param scrollLeft {number} scrollLeft
     * @param duration {number} duration for animte
     * @param easing {string} easing functio for animate : ease-in | ease-in-out | ease | bezier(n,n,n,n)
     **/
    scrollLeft: function(x, duration, easing, callback) {
        var self = this;
        var x = Math.round(x);
        if (self.userConfig.lockX) return;
        var duration = duration || 0;
        var easing = easing || "quadratic";
        var config = {
            css: {
                scrollLeft: x
            },
            duration: duration,
            easing: easing,
            run: function(e) {
                //trigger scroll event
                self.trigger("scroll", {
                    scrollTop: self.getScrollTop(),
                    scrollLeft: self.getScrollLeft()
                });
            },
            useTransition: false, //scrollTop 
            end: callback
        };
        self.__timers.x = self.__timers.x || new Animate(self.renderTo, config);
        //run
        self.__timers.x.stop();
        self.__timers.x.reset(config);
        self.__timers.x.run();
    },
    _bindEvt: function() {
        OriginScroll.superclass._bindEvt.call(this);
        var self = this;
        if (self.__isEvtBind) return;
        self.__isEvtBind = true;
        self.renderTo.addEventListener("scroll", function(e) {
            self.trigger("scroll", {
                type: "scroll",
                scrollTop: self.getScrollTop(),
                scrollLeft: self.getScrollLeft()
            })
        }, false)
    }
});

if (typeof module == 'object' && module.exports) {
    module.exports = OriginScroll;
}
/** ignored by jsdoc **/
else {
    return OriginScroll;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
var Base = __webpack_require__(165);
var clsPrefix;
var containerCls;
var content = "Pull Down To Refresh";
var loadingContent = "Loading...";
/**
 * A pulldown to refresh plugin for xscroll.
 * @constructor
 * @param {object} cfg
 * @param {number} cfg.height
 * @param {string} cfg.content default html for pulldown
 * @param {string} cfg.downContent html for pulldown when scrollTop is smaller than cfg.height
 * @param {string} cfg.upContent html for pulldown when scrollTop is larger than cfg.height
 * @param {string} cfg.loadingContent html for pulldown when released
 * @param {string} cfg.clsPrefix  class prefix which default value is "xs-plugin-pulldown-"
 * @extends {Base}
 */
var PullDown = function(cfg) {
	PullDown.superclass.constructor.call(this, cfg);
	this.userConfig = Util.mix({
		content: content,
		height: 60,
		autoRefresh: true,
		downContent: "Pull Down To Refresh",
		upContent: "Release To Refresh",
		loadingContent: loadingContent,
		clsPrefix: "xs-plugin-pulldown-"
	}, cfg);
}
Util.extend(PullDown, Base, {
	/**
	 * a pluginId
	 * @memberOf PullDown
	 * @type {string}
	 */
	pluginId: "pulldown",
	/**
	 * plugin initializer
	 * @memberOf PullDown
	 * @override Base
	 * @return {PullDown}
	 */
	pluginInitializer: function(xscroll) {
		var self = this;
		self.xscroll = xscroll.render();
		clsPrefix = self.userConfig.clsPrefix;
		self.render();
		return self;
	},
	/**
	 * detroy the plugin
	 * @memberOf PullDown
	 * @override Base
	 * @return {PullDown}
	 */
	pluginDestructor: function() {
		var self = this;
		Util.remove(self.pulldown);
		self.xscroll.off("panstart", self._panStartHandler, self);
		self.xscroll.off("pan", self._panHandler, self);
		self.xscroll.off("panend", self._panEndHandler, self);
		self.__isRender = false;
		self._evtBinded = false;
	},
	/**
	 * render pulldown plugin
	 * @memberOf PullDown
	 * @return {PullDown}
	 */
	render: function() {
		var self = this;
		if (self.__isRender) return;
		self.__isRender = true;

		if (!self.userConfig.container) {
			var containerCls = clsPrefix + "container";
			var height = self.userConfig.height || 60;
			var pulldown = self.pulldown = document.createElement("div");
			pulldown.className = containerCls;
			pulldown.style.position = "absolute";
			pulldown.style.width = "100%";
			pulldown.style.height = height + "px";
			pulldown.style.lineHeight = height + "px";
			pulldown.style.top = -height + "px";
			pulldown.style.textAlign = "center";
			self.xscroll.container.appendChild(pulldown);
			self.status = 'up';
			Util.addClass(pulldown, clsPrefix + self.status);
			pulldown.innerHTML = self.userConfig[self.status + "Content"] || self.userConfig.content;
		} else {
			// has customed container
			self.pulldown = self.userConfig.container
		}
		
		self._bindEvt();
		return self;
	},
	_bindEvt: function() {
		var self = this;
		if (self._evtBinded) return;
		self._evtBinded = true;
		var pulldown = self.pulldown;
		var xscroll = self.xscroll;
		xscroll.on("pan", self._panHandler, self);
		xscroll.on("panstart", self._panStartHandler, self);
		xscroll.on("panend", self._panEndHandler, self);
	},
	_changeStatus: function(status) {
		var prevVal = this.status;
		this.status = status;
		if (!this.userConfig.container) {
			Util.removeClass(this.pulldown, clsPrefix + prevVal)
			Util.addClass(this.pulldown, clsPrefix + status);
			if (this.userConfig[status + "Content"]) {
				this.pulldown.innerHTML = this.userConfig[status + "Content"];
			}
		}
		if (prevVal != status) {
			this.trigger("statuschange", {
				prevVal: prevVal,
				newVal: status
			});
			if (status == "loading") {
				this.trigger("loading");
			}
		}
	},
	/**
	 * reset the pulldown plugin
	 * @memberOf PullDown
	 * @param {function} callback
	 * @return {PullDown}
	 */
	reset: function(callback) {
		this.xscroll.boundry.resetTop()
		this.xscroll.boundryCheckY(callback);
		this._expanded = false;
		return this;
	},
	_panStartHandler: function(e) {
		clearTimeout(this.loadingItv);
	},
	_panHandler: function(e) {
		var self = this;
		var scrollTop = self.xscroll.getScrollTop();
		if (scrollTop > 0) return;
		self._changeStatus(Math.abs(scrollTop) < self.userConfig.height ? "down" : "up");
	},
	_panEndHandler: function(e) {
		var self = this;
		var xscroll = self.xscroll;
		var height = self.userConfig.height || 60;
		var scrollTop = xscroll.getScrollTop();
		if (scrollTop < -height) {
			//prevent default bounce
			e.preventDefault();
			xscroll.boundry.resetTop();
			self._changeStatus("loading");
			xscroll.boundry.expandTop(height);
			xscroll.boundryCheckY(function() {
			});
			if (self.userConfig.autoRefresh) {
				clearTimeout(self.loadingItv);
				self.loadingItv = setTimeout(function() {
					xscroll.boundry.resetTop();
					xscroll.boundryCheckY(function() {
						window.location.reload();
					})
				}, 800);
			}
		}
	}
});

if (typeof module == 'object' && module.exports) {
	module.exports = PullDown;
}
/** ignored by jsdoc **/
else if (window.XScroll && window.XScroll.Plugins) {
	return XScroll.Plugins.PullDown = PullDown;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
"use strict";
var Util = __webpack_require__(164);
var Base = __webpack_require__(165);
var clsPrefix;
var containerCls;
var loadingContent = "Loading...";
var upContent = "Pull Up To Refresh";
var downContent = "Release To Refresh";
var PULL_UP_HEIGHT = 60;
var HEIGHT = 40;
/**
 * A pullup to load plugin for xscroll.
 * @constructor
 * @param {object} cfg
 * @param {number} cfg.height
 * @param {string} cfg.downContent
 * @param {string} cfg.upContent
 * @param {string} cfg.loadingContent
 * @param {string} cfg.clsPrefix  class prefix which default value is "xs-plugin-pullup-"
 * @param {number} cfg.bufferHeight preload data before scrolling to the bottom of the boundry
 * @extends {Base}
 */
var PullUp = function(cfg) {
	PullUp.superclass.constructor.call(this);
	this.userConfig = Util.mix({
		upContent: upContent,
		downContent: downContent,
		pullUpHeight: PULL_UP_HEIGHT,
		height: HEIGHT,
		loadingContent: loadingContent,
		bufferHeight: 0,
		clsPrefix: "xs-plugin-pullup-"
	}, cfg);
}
Util.extend(PullUp, Base, {
	/**
	 * a pluginId
	 * @memberOf PullUp
	 * @type {string}
	 */
	pluginId: "pullup",
	/**
	 * plugin initializer
	 * @memberOf PullUp
	 * @override Base
	 * @return {PullUp}
	 */
	pluginInitializer: function(xscroll) {
		var self = this;
		self.xscroll = xscroll.render();
		clsPrefix = self.userConfig.clsPrefix;
		self.render();
		return self;
	},
	/**
	 * detroy the plugin
	 * @memberOf PullUp
	 * @override Base
	 * @return {PullUp}
	 */
	pluginDestructor: function() {
		var self = this;
		Util.remove(self.pullup);
		self.xscroll.off("scrollend", self._scrollEndHandler, self);
		self.xscroll.off("scroll", self._scrollHandler, self);
		self.xscroll.off("pan", self._panHandler, self);
		self.xscroll.boundry.resetBottom();
		self.__isRender = false;
		self._evtBinded = false;
	},
	/**
	 * disable the plugin
	 * @memberOf PullUp
	 * @override Base
	 * @return {PullUp}
	 */
	pluginDisable: function() {
		var self = this;
		self.userConfig.container || Util.remove(self.pullup)
		self.xscroll.off("scrollend", self._scrollEndHandler, self);
		self.xscroll.off("scroll", self._scrollHandler, self);
		self.xscroll.off("pan", self._panHandler, self);
		self.xscroll.boundry.resetBottom();
		self.__isRender = false;
		self._evtBinded = false;
	},
	/**
	 * render pullup plugin
	 * @memberOf PullUp
	 * @return {PullUp}
	 */
	render: function() {
		var self = this;
		if (self.__isRender) return;
		self.__isRender = true;
		if (!self.userConfig.container) {
			var containerCls = clsPrefix + "container";
			var height = self.userConfig.height;
			var pullup = self.pullup = document.createElement("div");
			pullup.className = containerCls;
			pullup.style.position = "absolute";
			pullup.style.width = "100%";
			pullup.style.height = height + "px";
			pullup.style.bottom = -height + "px";
			pullup.style.textAlign = "center";
			self.xscroll.container.appendChild(pullup);
			Util.addClass(pullup, clsPrefix + self.status);
			pullup.innerHTML = self.userConfig[self.status + "Content"] || self.userConfig.content;
		} else {
			self.pullup = self.userConfig.container
		}
		self.xscroll.boundry.expandBottom(self.userConfig.height);
		self.status = 'up';
		self._bindEvt();
		return self;
	},
	_bindEvt: function() {
		var self = this;
		if (self._evtBinded) return;
		self._evtBinded = true;
		var pullup = self.pullup;
		var xscroll = self.xscroll;
		xscroll.on("pan", self._panHandler, self);
		//load width a buffer
		if (self.userConfig.bufferHeight > 0) {
			xscroll.on("scroll", self._scrollHandler, self);
		}
		//bounce bottom
		xscroll.on("scrollend", self._scrollEndHandler, self);
		return self;
	},
	_scrollEndHandler: function(e) {
		var self = this,
			xscroll = self.xscroll,
			scrollTop = xscroll.getScrollTop();
		if (scrollTop == xscroll.containerHeight - xscroll.height + self.userConfig.height) {
			self._changeStatus("loading");
		}
		return self;
	},
	_scrollHandler: function(e) {
		var self = this,
			xscroll = self.xscroll;
		if (!self.isLoading && Math.abs(e.scrollTop) + xscroll.height + self.userConfig.height + self.userConfig.bufferHeight >= xscroll.containerHeight + xscroll.boundry._xtop + xscroll.boundry._xbottom) {
			self._changeStatus("loading");
		}
		return self;
	},
	_panHandler: function(e) {
		var self = this;
		var xscroll = self.xscroll;
		var offsetTop = -xscroll.getScrollTop();
		if (offsetTop < xscroll.height - xscroll.containerHeight - self.userConfig.pullUpHeight) {
			self._changeStatus("down")
		} else {
			self._changeStatus("up");
		}
		return self;
	},
	_changeStatus: function(status) {
		if (status != "loading" && this.isLoading) return;
		var prevVal = this.status;
		this.status = status;
		if (!this.userConfig.container) {
			Util.removeClass(this.pullup, clsPrefix + prevVal)
			Util.addClass(this.pullup, clsPrefix + status);
			this.pullup.innerHTML = this.userConfig[status + "Content"];
		}
		if (prevVal != status) {
			this.trigger("statuschange", {
				prevVal: prevVal,
				newVal: status
			});
			if (status == "loading") {
				this.isLoading = true;
				this.trigger("loading");
			}
		}
		return this;
	},
	/**
	 * notify pullup plugin to complete state after a remote data request
	 * @memberOf PullUp
	 * @return {PullUp}
	 */
	complete: function() {
		var self = this;
		var xscroll = self.xscroll;
		self.isLoading = false;
		self._changeStatus("up");
		return self;
	},
	stop: function() {
		var xscroll = this.xscroll;
		this.isLoading = false;
		this._changeStatus("stop");
		this.pluginDisable()
		return this;
	},
	restart: function() {
		var xscroll = this.xscroll;
		this.isLoading = false;
		this._changeStatus("default");
		this.render()
		return this;
	}
});

if (typeof module == 'object' && module.exports) {
	module.exports = PullUp;
}
/** ignored by jsdoc **/
else if (window.XScroll && window.XScroll.Plugins) {
	return XScroll.Plugins.PullUp = PullUp;
}
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    style: (_vm.styles)
  }, [_c('div', {
    staticClass: "xs-container"
  }, [_vm._t("default"), _vm._v(" "), _vm._t("pulldown"), _vm._v(" "), _vm._t("pullup")], 2)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-79a3dc84", module.exports)
  }
}

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _toast = __webpack_require__(254);

var _toast2 = _interopRequireDefault(_toast);

var _plugin_helper = __webpack_require__(173);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $vm = void 0;
var watcher = void 0;

var plugin = {
  install: function install(vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var Toast = vue.extend(_toast2.default);

    if (!$vm) {
      $vm = new Toast({
        el: document.createElement('div')
      });
      document.body.appendChild($vm.$el);
    }

    var defaults = {};
    for (var i in $vm.$options.props) {
      if (i !== 'value') {
        defaults[i] = $vm.$options.props[i].default;
      }
    }

    var toast = {
      show: function show() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        // destroy watcher
        watcher && watcher();
        if (typeof options === 'string') {
          $vm.text = options;
        } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
          (0, _plugin_helper.mergeOptions)($vm, options);
        }
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options.onShow || options.onHide) {
          watcher = $vm.$watch('show', function (val) {
            val && options.onShow && options.onShow($vm);
            val === false && options.onHide && options.onHide($vm);
          });
        }
        $vm.show = true;
      },
      text: function text(_text) {
        var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

        this.show({
          type: 'text',
          width: 'auto',
          position: position,
          text: _text
        });
      },
      hide: function hide() {
        $vm.show = false;
      }
    };

    // all Vux's plugins are included in this.$vux
    if (!vue.$vux) {
      vue.$vux = {
        toast: toast
      };
    } else {
      vue.$vux.toast = toast;
    }

    vue.mixin({
      created: function created() {
        this.$vux = vue.$vux;
      }
    });
  }
};

exports.default = plugin;
var install = exports.install = plugin.install;

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(255)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(257),
  /* template */
  __webpack_require__(259),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/toast/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-278b2d33", Component.options)
  } else {
    hotAPI.reload("data-v-278b2d33", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(256);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("051de9aa", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-278b2d33\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-278b2d33\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.vux-fade-enter-active,\n.vux-fade-leave-active {\n  opacity: 1;\n  transition: opacity linear 0.2s;\n}\n.vux-fade-enter,\n.vux-fade-leave-to {\n  opacity: 0;\n}\n.vux-dialog-enter-active,\n.vux-dialog-leave-active {\n  opacity: 1;\n  transition-duration: 400ms;\n  transform: translate(-50%, -50%) scale(1) !important;\n  transition-property: transform, opacity!important;\n}\n.vux-dialog-leave-active {\n  transition-duration: 300ms;\n}\n.vux-dialog-enter {\n  opacity: 0;\n  transform: translate(-50%, -50%) scale(1.185) !important;\n}\n.vux-dialog-leave-active {\n  opacity: 0;\n  transform: translate(-50%, -50%) scale(0.85) !important;\n}\n.vux-mask-enter,\n.vux-mask-leave-active {\n  opacity: 0;\n}\n.vux-mask-leave-active,\n.vux-mask-enter-active {\n  transition: opacity 300ms;\n}\n/**\n* actionsheet\n*/\n/**\n* datetime\n*/\n/**\n* tabbar\n*/\n/**\n* tab\n*/\n/**\n* dialog\n*/\n/**\n* x-number\n*/\n/**\n* checkbox\n*/\n/**\n* check-icon\n*/\n/**\n* Cell\n*/\n/**\n* Mask\n*/\n/**\n* Range\n*/\n/**\n* Tabbar\n*/\n/**\n* Header\n*/\n/**\n* Timeline\n*/\n/**\n* Switch\n*/\n/**\n* Button\n*/\n/**\n* swipeout\n*/\n/**\n* Cell\n*/\n/**\n* Badge\n*/\n/**\n* Popover\n*/\n/**\n* Button tab\n*/\n/* alias */\n/**\n* Swiper\n*/\n/**\n* checklist\n*/\n/**\n* popup-picker\n*/\n/**\n* popup\n*/\n/**\n* popup-header\n*/\n/**\n* form-preview\n*/\n/**\n* load-more\n*/\n/**\n* sticky\n*/\n/**\n* group\n*/\n/**\n* toast\n*/\n/**\n* icon\n*/\n/**\n* calendar\n*/\n/**\n* week-calendar\n*/\n/**\n* search\n*/\n/**\n* radio\n*/\n/**\n* loadmore\n*/\n.weui-mask {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.weui-mask_transparent {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n}\n@font-face {\n  font-weight: normal;\n  font-style: normal;\n  font-family: \"weui\";\n  src: url('data:application/octet-stream;base64,AAEAAAALAIAAAwAwR1NVQrD+s+0AAAE4AAAAQk9TLzJAKEx+AAABfAAAAFZjbWFw65cFHQAAAhwAAAJQZ2x5ZvCRR/EAAASUAAAKtGhlYWQMPROtAAAA4AAAADZoaGVhCCwD+gAAALwAAAAkaG10eEJo//8AAAHUAAAASGxvY2EYqhW4AAAEbAAAACZtYXhwASEAVQAAARgAAAAgbmFtZeNcHtgAAA9IAAAB5nBvc3T6bLhLAAARMAAAAOYAAQAAA+gAAABaA+j/////A+kAAQAAAAAAAAAAAAAAAAAAABIAAQAAAAEAACbZbxtfDzz1AAsD6AAAAADUm2dvAAAAANSbZ2///wAAA+kD6gAAAAgAAgAAAAAAAAABAAAAEgBJAAUAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAAAAQOwAZAABQAIAnoCvAAAAIwCegK8AAAB4AAxAQIAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA6gHqEQPoAAAAWgPqAAAAAAABAAAAAAAAAAAAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+j//wPoAAAD6AAAAAAABQAAAAMAAAAsAAAABAAAAXQAAQAAAAAAbgADAAEAAAAsAAMACgAAAXQABABCAAAABAAEAAEAAOoR//8AAOoB//8AAAABAAQAAAABAAIAAwAEAAUABgAHAAgACQAKAAsADAANAA4ADwAQABEAAAEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAANwAAAAAAAAAEQAA6gEAAOoBAAAAAQAA6gIAAOoCAAAAAgAA6gMAAOoDAAAAAwAA6gQAAOoEAAAABAAA6gUAAOoFAAAABQAA6gYAAOoGAAAABgAA6gcAAOoHAAAABwAA6ggAAOoIAAAACAAA6gkAAOoJAAAACQAA6goAAOoKAAAACgAA6gsAAOoLAAAACwAA6gwAAOoMAAAADAAA6g0AAOoNAAAADQAA6g4AAOoOAAAADgAA6g8AAOoPAAAADwAA6hAAAOoQAAAAEAAA6hEAAOoRAAAAEQAAAAAARgCMANIBJAF4AcQCMgJgAqgC/ANIA6YD/gROBKAE9AVaAAAAAgAAAAADrwOtABQAKQAAASIHBgcGFBcWFxYyNzY3NjQnJicmAyInJicmNDc2NzYyFxYXFhQHBgcGAfV4Z2Q7PDw7ZGfwZmQ7PDw7ZGZ4bl5bNjc3Nlte215bNjc3NlteA608O2Rn8GdjOzw8O2Nn8GdkOzz8rzc1W17bXlw1Nzc1XF7bXls1NwAAAAACAAAAAAOzA7MAFwAtAAABIgcGBwYVFBcWFxYzMjc2NzY1NCcmJyYTBwYiLwEmNjsBETQ2OwEyFhURMzIWAe52Z2Q7PT07ZGd2fGpmOz4+O2ZpIXYOKA52Dg0XXQsHJgcLXRcNA7M+O2ZqfHZnZDs9PTtkZ3Z9aWY7Pv3wmhISmhIaARcICwsI/ukaAAMAAAAAA+UD5QAXACMALAAAASIHBgcGFRQXFhcWMzI3Njc2NTQnJicmAxQrASI1AzQ7ATIHJyImNDYyFhQGAe6Ecm9BRERBb3KEiXZxQkREQnF1aQIxAwgCQgMBIxIZGSQZGQPkREJxdomEcm9BRERBb3KEinVxQkT9HQICAWICAjEZIxkZIxkAAAAAAgAAAAADsQPkABkALgAAAQYHBgc2BREUFxYXFhc2NzY3NjURJBcmJyYTAQYvASY/ATYyHwEWNjclNjIfARYB9VVVQk+v/tFHPmxebGxdbT1I/tGvT0JVo/7VBASKAwMSAQUBcQEFAgESAgUBEQQD4xMYEhk3YP6sjnVlSD8cHD9IZXWOAVRgNxkSGP62/tkDA48EBBkCAVYCAQHlAQIQBAAAAAADAAAAAAOxA+QAGwAqADMAAAEGBwYHBgcGNxEUFxYXFhc2NzY3NjURJBcmJyYHMzIWFQMUBisBIicDNDYTIiY0NjIWFAYB9UFBODssO38gRz5sXmxsXW09SP7YqFBBVW80BAYMAwImBQELBh4PFhYeFRUD5A8SDhIOEikK/q2PdWRJPh0dPklkdY8BU141GRIY/AYE/sYCAwUBOgQG/kAVHxUVHxUAAAACAAAAAAPkA+QAFwAtAAABIgcGBwYVFBcWFxYzMjc2NzY1NCcmJyYTAQYiLwEmPwE2Mh8BFjI3ATYyHwEWAe6Ecm9BQ0NCbnODiXVxQkREQnF1kf6gAQUBowMDFgEFAYUCBQEBQwIFARUEA+NEQnF1iYNzbkJDQ0FvcoSJdXFCRP6j/qUBAagEBR4CAWYBAQENAgIVBAAAAAQAAAAAA68DrQAUACkAPwBDAAABIgcGBwYUFxYXFjI3Njc2NCcmJyYDIicmJyY0NzY3NjIXFhcWFAcGBwYTBQ4BLwEmBg8BBhYfARYyNwE+ASYiFzAfAQH1eGdkOzw8O2Rn8GZkOzw8O2RmeG5eWzY3NzZbXtteWzY3NzZbXmn+9gYSBmAGDwUDBQEGfQUQBgElBQELEBUBAQOtPDtkZ/BnYzs8PDtjZ/BnZDs8/K83NVte215cNTc3NVxe215bNTcCJt0FAQVJBQIGBAcRBoAGBQEhBQ8LBAEBAAABAAAAAAO7AzoAFwAAEy4BPwE+AR8BFjY3ATYWFycWFAcBBiInPQoGBwUHGgzLDCELAh0LHwsNCgr9uQoeCgGzCyEOCw0HCZMJAQoBvgkCCg0LHQv9sQsKAAAAAAIAAAAAA+UD5gAXACwAAAEiBwYHBhUUFxYXFjMyNzY3NjU0JyYnJhMHBi8BJicmNRM0NjsBMhYVExceAQHvhHJvQUNDQm5zg4l1cUJEREJxdVcQAwT6AwIEEAMCKwIDDsUCAQPlREJxdYmDc25CQ0NBb3KEiXVxQkT9VhwEAncCAgMGAXoCAwMC/q2FAgQAAAQAAAAAA68DrQADABgALQAzAAABMB8BAyIHBgcGFBcWFxYyNzY3NjQnJicmAyInJicmNDc2NzYyFxYXFhQHBgcGAyMVMzUjAuUBAfJ4Z2Q7PDw7ZGfwZmQ7PDw7ZGZ4bl5bNjc3Nlte215bNjc3NltemyT92QKDAQEBLDw7ZGfwZ2M7PDw7Y2fwZ2Q7PPyvNzVbXtteXDU3NzVcXtteWzU3AjH9JAAAAAMAAAAAA+QD5AAXACcAMAAAASIHBgcGFRQXFhcWMzI3Njc2NTQnJicmAzMyFhUDFAYrASImNQM0NhMiJjQ2MhYUBgHuhHJvQUNDQm5zg4l1cUJEREJxdZ42BAYMAwInAwMMBh8PFhYeFhYD40RCcXWJg3NuQkNDQW9yhIl1cUJE/vYGBf7AAgMDAgFABQb+NhYfFhYfFgAABAAAAAADwAPAAAgAEgAoAD0AAAEyNjQmIgYUFhcjFTMRIxUzNSMDIgcGBwYVFBYXFjMyNzY3NjU0Jy4BAyInJicmNDc2NzYyFxYXFhQHBgcGAfQYISEwISFRjzk5yTorhG5rPT99am+DdmhlPD4+PMyFbV5bNTc3NVte2l5bNTc3NVteAqAiLyIiLyI5Hf7EHBwCsT89a26Ed8w8Pj48ZWh2g29qffyjNzVbXtpeWzU3NzVbXtpeWzU3AAADAAAAAAOoA6gACwAgADUAAAEHJwcXBxc3FzcnNwMiBwYHBhQXFhcWMjc2NzY0JyYnJgMiJyYnJjQ3Njc2MhcWFxYUBwYHBgKOmpocmpocmpocmpq2dmZiOjs7OmJm7GZiOjs7OmJmdmtdWTQ2NjRZXdZdWTQ2NjRZXQKqmpocmpocmpocmpoBGTs6YmbsZmI6Ozs6YmbsZmI6O/zCNjRZXdZdWTQ2NjRZXdZdWTQ2AAMAAAAAA+kD6gAaAC8AMAAAAQYHBiMiJyYnJjQ3Njc2MhcWFxYVFAcGBwEHATI3Njc2NCcmJyYiBwYHBhQXFhcWMwKONUBCR21dWjU3NzVaXdpdWzU2GBcrASM5/eBXS0grKysrSEuuSkkqLCwqSUpXASMrFxg2NVtd2l1aNTc3NVpdbUdCQDX+3jkBGSsrSEuuSkkqLCwqSUquS0grKwAC//8AAAPoA+gAFAAwAAABIgcGBwYQFxYXFiA3Njc2ECcmJyYTFg4BIi8BBwYuATQ/AScmPgEWHwE3Nh4BBg8BAfSIdHFDRERDcXQBEHRxQ0REQ3F0SQoBFBsKoqgKGxMKqKIKARQbCqKoChsUAQqoA+hEQ3F0/vB0cUNERENxdAEQdHFDRP1jChsTCqiiCgEUGwqiqAobFAEKqKIKARQbCqIAAAIAAAAAA+QD5AAXADQAAAEiBwYHBhUUFxYXFjMyNzY3NjU0JyYnJhMUBiMFFxYUDwEGLwEuAT8BNh8BFhQPAQUyFh0BAe6Ecm9BQ0NCbnODiXVxQkREQnF1fwQC/pGDAQEVAwTsAgEC7AQEFAIBhAFwAgMD40RCcXWJg3NuQkNDQW9yhIl1cUJE/fYCAwuVAgQCFAQE0AIFAtEEBBQCBQGVCwMDJwAAAAUAAAAAA9QD0wAjACcANwBHAEgAAAERFAYjISImNREjIiY9ATQ2MyE1NDYzITIWHQEhMhYdARQGIyERIREHIgYVERQWOwEyNjURNCYjISIGFREUFjsBMjY1ETQmKwEDeyYb/XYbJkMJDQ0JAQYZEgEvExkBBgkNDQn9CQJc0QkNDQktCQ0NCf7sCQ0NCS0JDQ0JLQMi/TQbJiYbAswMCiwJDS4SGRkSLg0JLAoM/UwCtGsNCf5NCQ0NCQGzCQ0NCf5NCQ0NCQGzCQ0AAAAAEADGAAEAAAAAAAEABAAAAAEAAAAAAAIABwAEAAEAAAAAAAMABAALAAEAAAAAAAQABAAPAAEAAAAAAAUACwATAAEAAAAAAAYABAAeAAEAAAAAAAoAKwAiAAEAAAAAAAsAEwBNAAMAAQQJAAEACABgAAMAAQQJAAIADgBoAAMAAQQJAAMACAB2AAMAAQQJAAQACAB+AAMAAQQJAAUAFgCGAAMAAQQJAAYACACcAAMAAQQJAAoAVgCkAAMAAQQJAAsAJgD6d2V1aVJlZ3VsYXJ3ZXVpd2V1aVZlcnNpb24gMS4wd2V1aUdlbmVyYXRlZCBieSBzdmcydHRmIGZyb20gRm9udGVsbG8gcHJvamVjdC5odHRwOi8vZm9udGVsbG8uY29tAHcAZQB1AGkAUgBlAGcAdQBsAGEAcgB3AGUAdQBpAHcAZQB1AGkAVgBlAHIAcwBpAG8AbgAgADEALgAwAHcAZQB1AGkARwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABzAHYAZwAyAHQAdABmACAAZgByAG8AbQAgAEYAbwBuAHQAZQBsAGwAbwAgAHAAcgBvAGoAZQBjAHQALgBoAHQAdABwADoALwAvAGYAbwBuAHQAZQBsAGwAbwAuAGMAbwBtAAAAAgAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAQIBAwEEAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgETAAZjaXJjbGUIZG93bmxvYWQEaW5mbwxzYWZlX3N1Y2Nlc3MJc2FmZV93YXJuB3N1Y2Nlc3MOc3VjY2Vzcy1jaXJjbGURc3VjY2Vzcy1uby1jaXJjbGUHd2FpdGluZw53YWl0aW5nLWNpcmNsZQR3YXJuC2luZm8tY2lyY2xlBmNhbmNlbAZzZWFyY2gFY2xlYXIEYmFjawZkZWxldGUAAAAA') format('truetype');\n}\n[class^=\"weui-icon-\"],\n[class*=\" weui-icon-\"] {\n  display: inline-block;\n  vertical-align: middle;\n  font: normal normal normal 14px/1 \"weui\";\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n}\n[class^=\"weui-icon-\"]:before,\n[class*=\" weui-icon-\"]:before {\n  display: inline-block;\n  margin-left: .2em;\n  margin-right: .2em;\n}\n.weui-icon-circle:before {\n  content: \"\\EA01\";\n}\n/* '' */\n.weui-icon-download:before {\n  content: \"\\EA02\";\n}\n/* '' */\n.weui-icon-info:before {\n  content: \"\\EA03\";\n}\n/* '' */\n.weui-icon-safe-success:before {\n  content: \"\\EA04\";\n}\n/* '' */\n.weui-icon-safe-warn:before {\n  content: \"\\EA05\";\n}\n/* '' */\n.weui-icon-success:before {\n  content: \"\\EA06\";\n}\n/* '' */\n.weui-icon-success-circle:before {\n  content: \"\\EA07\";\n}\n/* '' */\n.weui-icon-success-no-circle:before {\n  content: \"\\EA08\";\n}\n/* '' */\n.weui-icon-waiting:before {\n  content: \"\\EA09\";\n}\n/* '' */\n.weui-icon-waiting-circle:before {\n  content: \"\\EA0A\";\n}\n/* '' */\n.weui-icon-warn:before {\n  content: \"\\EA0B\";\n}\n/* '' */\n.weui-icon-info-circle:before {\n  content: \"\\EA0C\";\n}\n/* '' */\n.weui-icon-cancel:before {\n  content: \"\\EA0D\";\n}\n/* '' */\n.weui-icon-search:before {\n  content: \"\\EA0E\";\n}\n/* '' */\n.weui-icon-clear:before {\n  content: \"\\EA0F\";\n}\n/* '' */\n.weui-icon-back:before {\n  content: \"\\EA10\";\n}\n/* '' */\n.weui-icon-delete:before {\n  content: \"\\EA11\";\n}\n/* '' */\n[class^=\"weui-icon_\"]:before,\n[class*=\" weui-icon_\"]:before {\n  margin: 0;\n}\n.weui-icon-success {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-waiting {\n  font-size: 23px;\n  color: #10AEFF;\n}\n.weui-icon-warn {\n  font-size: 23px;\n  color: #F43530;\n}\n.weui-icon-info {\n  font-size: 23px;\n  color: #10AEFF;\n}\n.weui-icon-success-circle {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-success-no-circle {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-waiting-circle {\n  font-size: 23px;\n  color: #10AEFF;\n}\n.weui-icon-circle {\n  font-size: 23px;\n  color: #C9C9C9;\n}\n.weui-icon-download {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-info-circle {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-safe-success {\n  color: #09BB07;\n}\n.weui-icon-safe-warn {\n  color: #FFBE00;\n}\n.weui-icon-cancel {\n  color: #F43530;\n  font-size: 22px;\n}\n.weui-icon-search {\n  color: #B2B2B2;\n  font-size: 14px;\n}\n.weui-icon-clear {\n  color: #B2B2B2;\n  font-size: 14px;\n}\n.weui-icon-delete.weui-icon_gallery-delete {\n  color: #FFFFFF;\n  font-size: 22px;\n}\n.weui-icon_msg {\n  font-size: 93px;\n}\n.weui-icon_msg.weui-icon-warn {\n  color: #F76260;\n}\n.weui-icon_msg-primary {\n  font-size: 93px;\n}\n.weui-icon_msg-primary.weui-icon-warn {\n  color: #FFBE00;\n}\n.weui-toast {\n  position: fixed;\n  z-index: 5001;\n  width: 7.6em;\n  min-height: 7.6em;\n  top: 180px;\n  left: 50%;\n  margin-left: -3.8em;\n  background: rgba(17, 17, 17, 0.7);\n  text-align: center;\n  border-radius: 5px;\n  color: #FFFFFF;\n}\n.weui-icon_toast {\n  margin: 22px 0 0;\n  display: block;\n}\n.weui-icon_toast.weui-icon-success-no-circle:before {\n  color: #FFFFFF;\n  font-size: 55px;\n}\n.weui-icon_toast.weui-loading {\n  margin: 30px 0 0;\n  width: 38px;\n  height: 38px;\n  vertical-align: baseline;\n}\n.weui-toast__content {\n  margin: 0 0 15px;\n}\n.weui-toast.vux-toast-top {\n  top: 10px;\n}\n.weui-toast.vux-toast-bottom {\n  top: auto;\n  bottom: 10px;\n  transform: translateX(-50%);\n}\n.weui-toast.vux-toast-middle {\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%);\n}\n.vux-slide-from-top-enter,\n.vux-slide-from-top-leave-active {\n  opacity: 0;\n  transform: translateX(-50%) translateY(-100%) !important;\n}\n.vux-slide-from-bottom-enter,\n.vux-slide-from-bottom-leave-active {\n  opacity: 0;\n  transform: translateX(-50%) translateY(100%) !important;\n}\n.vux-slide-from-top-enter-active,\n.vux-slide-from-top-leave-active,\n.vux-slide-from-bottom-enter-active,\n.vux-slide-from-bottom-leave-active {\n  transition: all 400ms cubic-bezier(0.36, 0.66, 0.04, 1);\n}\n.weui-toast {\n  transform: translateX(-50%);\n  margin-left: 0!important;\n}\n.weui-toast.weui-toast_forbidden {\n  color: #F76260;\n}\n.weui-toast.weui-toast_forbidden .weui-toast__content {\n  margin-top: 10px;\n}\n.weui-toast.weui-toast_text {\n  min-height: 0;\n}\n.weui-toast_text .weui-toast__content {\n  margin: 0;\n  padding-top: 10px;\n  padding-bottom: 10px;\n  border-radius: 15px;\n}\n.weui-toast__content {\n  font-size: 16px;\n}\n.weui-loading_toast .weui-toast__content {\n  margin-top: 0;\n}\n.weui-toast_success .weui-icon_toast:before {\n  content: \"\\EA08\";\n}\n.weui-toast_cancel .weui-icon_toast:before {\n  content: \"\\EA0D\";\n}\n.weui-toast_forbidden .weui-icon_toast.weui-icon-success-no-circle:before {\n  content: \"\\EA0B\";\n  color: #F76260;\n}\n", ""]);

// exports


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _safariFix = __webpack_require__(258);

var _safariFix2 = _interopRequireDefault(_safariFix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'toast',
  mixins: [_safariFix2.default],
  props: {
    value: Boolean,
    time: {
      type: Number,
      default: 2000
    },
    type: {
      type: String,
      default: 'success'
    },
    transition: String,
    width: {
      type: String,
      default: '7.6em'
    },
    isShowMask: {
      type: Boolean,
      default: false
    },
    text: String,
    position: String
  },
  data: function data() {
    return {
      show: false
    };
  },
  created: function created() {
    if (this.value) {
      this.show = true;
    }
  },

  computed: {
    currentTransition: function currentTransition() {
      if (this.transition) {
        return this.transition;
      }
      if (this.position === 'top') {
        return 'vux-slide-from-top';
      }
      if (this.position === 'bottom') {
        return 'vux-slide-from-bottom';
      }
      return 'vux-fade';
    },
    toastClass: function toastClass() {
      return {
        'weui-toast_forbidden': this.type === 'warn',
        'weui-toast_cancel': this.type === 'cancel',
        'weui-toast_success': this.type === 'success',
        'weui-toast_text': this.type === 'text',
        'vux-toast-top': this.position === 'top',
        'vux-toast-bottom': this.position === 'bottom',
        'vux-toast-middle': this.position === 'middle'
      };
    },
    style: function style() {
      if (this.type === 'text' && this.width === 'auto') {
        return { padding: '10px' };
      }
    }
  },
  watch: {
    show: function show(val) {
      var _this = this;

      if (val) {
        this.$emit('input', true);
        this.$emit('on-show');
        this.fixSafariOverflowScrolling('auto');

        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
          _this.show = false;
          _this.$emit('input', false);
          _this.$emit('on-hide');
          _this.fixSafariOverflowScrolling('touch');
        }, this.time);
      }
    },
    value: function value(val) {
      this.show = val;
    }
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  mounted: function mounted() {
    this.$overflowScrollingList = document.querySelectorAll('.vux-fix-safari-overflow-scrolling');
  },

  methods: {
    fixSafariOverflowScrolling: function fixSafariOverflowScrolling(type) {
      if (!this.$overflowScrollingList.length) return;
      // if (!/iphone/i.test(navigator.userAgent)) return
      for (var i = 0; i < this.$overflowScrollingList.length; i++) {
        this.$overflowScrollingList[i].style.webkitOverflowScrolling = type;
      }
    }
  }
};

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vux-toast"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isShowMask && _vm.show),
      expression: "isShowMask && show"
    }],
    staticClass: "weui-mask_transparent"
  }), _vm._v(" "), _c('transition', {
    attrs: {
      "name": _vm.currentTransition
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show),
      expression: "show"
    }],
    staticClass: "weui-toast",
    class: _vm.toastClass,
    style: ({
      width: _vm.width
    })
  }, [_c('i', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type !== 'text'),
      expression: "type !== 'text'"
    }],
    staticClass: "weui-icon-success-no-circle weui-icon_toast"
  }), _vm._v(" "), (_vm.text) ? _c('p', {
    staticClass: "weui-toast__content",
    style: (_vm.style),
    domProps: {
      "innerHTML": _vm._s(_vm.text)
    }
  }) : _c('p', {
    staticClass: "weui-toast__content",
    style: (_vm.style)
  }, [_vm._t("default")], 2)])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-278b2d33", module.exports)
  }
}

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _loading = __webpack_require__(261);

var _loading2 = _interopRequireDefault(_loading);

var _plugin_helper = __webpack_require__(173);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $vm = void 0;
var watcher = void 0;

var plugin = {
  install: function install(vue, options) {
    var Loading = vue.extend(_loading2.default);

    if (!$vm) {
      $vm = new Loading({
        el: document.createElement('div')
      });
      document.body.appendChild($vm.$el);
    }

    var loading = {
      show: function show() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        // destroy watcher
        watcher && watcher();
        if (typeof options === 'string') {
          $vm.text = options;
        } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
          (0, _plugin_helper.mergeOptions)($vm, options);
        }
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options.onShow || options.onHide) {
          watcher = $vm.$watch('show', function (val) {
            val && options.onShow && options.onShow($vm);
            val === false && options.onHide && options.onHide($vm);
          });
        }
        $vm.show = true;
      },
      hide: function hide() {
        $vm.show = false;
      }
    };

    // all Vux's plugins are included in this.$vux
    if (!vue.$vux) {
      vue.$vux = {
        loading: loading
      };
    } else {
      vue.$vux.loading = loading;
    }

    vue.mixin({
      created: function created() {
        this.$vux = vue.$vux;
      }
    });
  }
};

exports.default = plugin;
var install = exports.install = plugin.install;

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(262)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(264),
  /* template */
  __webpack_require__(265),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/loading/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}


/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-55080c70", Component.options)
  } else {
    hotAPI.reload("data-v-55080c70", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(263);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("6251221d", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-55080c70\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-55080c70\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "/**\n* actionsheet\n*/\n/**\n* datetime\n*/\n/**\n* tabbar\n*/\n/**\n* tab\n*/\n/**\n* dialog\n*/\n/**\n* x-number\n*/\n/**\n* checkbox\n*/\n/**\n* check-icon\n*/\n/**\n* Cell\n*/\n/**\n* Mask\n*/\n/**\n* Range\n*/\n/**\n* Tabbar\n*/\n/**\n* Header\n*/\n/**\n* Timeline\n*/\n/**\n* Switch\n*/\n/**\n* Button\n*/\n/**\n* swipeout\n*/\n/**\n* Cell\n*/\n/**\n* Badge\n*/\n/**\n* Popover\n*/\n/**\n* Button tab\n*/\n/* alias */\n/**\n* Swiper\n*/\n/**\n* checklist\n*/\n/**\n* popup-picker\n*/\n/**\n* popup\n*/\n/**\n* popup-header\n*/\n/**\n* form-preview\n*/\n/**\n* load-more\n*/\n/**\n* sticky\n*/\n/**\n* group\n*/\n/**\n* toast\n*/\n/**\n* icon\n*/\n/**\n* calendar\n*/\n/**\n* week-calendar\n*/\n/**\n* search\n*/\n/**\n* radio\n*/\n/**\n* loadmore\n*/\n.weui-mask {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.weui-mask_transparent {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n}\n.weui-toast {\n  position: fixed;\n  z-index: 5001;\n  width: 7.6em;\n  min-height: 7.6em;\n  top: 180px;\n  left: 50%;\n  margin-left: -3.8em;\n  background: rgba(17, 17, 17, 0.7);\n  text-align: center;\n  border-radius: 5px;\n  color: #FFFFFF;\n}\n.weui-icon_toast {\n  margin: 22px 0 0;\n  display: block;\n}\n.weui-icon_toast.weui-icon-success-no-circle:before {\n  color: #FFFFFF;\n  font-size: 55px;\n}\n.weui-icon_toast.weui-loading {\n  margin: 30px 0 0;\n  width: 38px;\n  height: 38px;\n  vertical-align: baseline;\n}\n.weui-toast__content {\n  margin: 0 0 15px;\n}\n.weui-loading {\n  width: 20px;\n  height: 20px;\n  display: inline-block;\n  vertical-align: middle;\n  animation: weuiLoading 1s steps(12, end) infinite;\n  background: transparent url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=\") no-repeat;\n  background-size: 100%;\n}\n.weui-loading.weui-loading_transparent {\n  background-image: url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMjAnIGhlaWdodD0nMTIwJyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgxMDB2MTAwSDB6Jy8+PHJlY3QgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjU2KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDMwIDEwNS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjQzKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjM4KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg5MCA2NSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjMyKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTguNjYgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4yOCknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0ncmdiYSgyNTUsMjU1LDI1NSwuMjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA1MCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjIpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xNyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTEyMCA0MS4zNCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjE0KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtOTAgMzUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtNjAgMjQuMDIgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4wMyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTMwIC01Ljk4IDY1KScvPjwvc3ZnPgo=\");\n}\n@-webkit-keyframes weuiLoading {\n0% {\n    transform: rotate3d(0, 0, 1, 0deg);\n}\n100% {\n    transform: rotate3d(0, 0, 1, 360deg);\n}\n}\n@keyframes weuiLoading {\n0% {\n    transform: rotate3d(0, 0, 1, 0deg);\n}\n100% {\n    transform: rotate3d(0, 0, 1, 360deg);\n}\n}\n.vux-loading .weui-toast {\n  z-index: 5001;\n}\n.weui-icon_toast.weui-loading {\n  margin: 30px 0 0;\n  width: 38px;\n  height: 38px;\n  vertical-align: baseline;\n  display: inline-block;\n}\n.vux-mask-enter,\n.vux-mask-leave-active {\n  opacity: 0;\n}\n.vux-mask-leave-active,\n.vux-mask-enter-active {\n  transition: opacity 300ms;\n}\n", ""]);

// exports


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  name: 'loading',
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: Boolean,
    text: String,
    position: String,
    transition: {
      type: String,
      default: 'vux-mask'
    }
  },
  watch: {
    show: function show(val) {
      this.$emit('update:show', val);
    }
  }
};

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "name": _vm.transition
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show),
      expression: "show"
    }],
    staticClass: "weui-loading_toast vux-loading"
  }, [_c('div', {
    staticClass: "weui-mask_transparent"
  }), _vm._v(" "), _c('div', {
    staticClass: "weui-toast",
    style: ({
      position: _vm.position
    })
  }, [_c('i', {
    staticClass: "weui-loading weui-icon_toast"
  }), _vm._v(" "), _c('p', {
    staticClass: "weui-toast__content"
  }, [_vm._v(_vm._s(_vm.text || '加载中')), _vm._t("default")], 2)])])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-55080c70", module.exports)
  }
}

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(267)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(269),
  /* template */
  __webpack_require__(270),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/x-table/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-867652f6", Component.options)
  } else {
    hotAPI.reload("data-v-867652f6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(268);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("c1bef41a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-867652f6\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-867652f6\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.vux-1px,\n.vux-1px-t,\n.vux-1px-b,\n.vux-1px-tb,\n.vux-1px-l,\n.vux-1px-r {\n  position: relative;\n}\n.vux-1px:before {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 200%;\n  height: 1px;\n  border: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  height: 200%;\n  transform-origin: left top;\n  transform: scale(0.5);\n}\n.vux-1px-t:before {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 1px;\n  border-top: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 0 0;\n  transform: scaleY(0.5);\n}\n.vux-1px-b:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  height: 1px;\n  border-bottom: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 0 100%;\n  transform: scaleY(0.5);\n}\n.vux-1px-tb:before {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 1px;\n  border-top: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 0 0;\n  transform: scaleY(0.5);\n}\n.vux-1px-tb:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  height: 1px;\n  border-bottom: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 0 100%;\n  transform: scaleY(0.5);\n}\n.vux-1px-l:before {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 1px;\n  bottom: 0;\n  border-left: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 0 0;\n  transform: scaleX(0.5);\n}\n.vux-1px-r:after {\n  content: \" \";\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 1px;\n  bottom: 0;\n  border-right: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 100% 0;\n  transform: scaleX(0.5);\n}\n.vux-table {\n  line-height: 40px;\n  position: relative;\n  width: 100%;\n  border-collapse: collapse;\n}\n.vux-table:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 1px;\n  border-top: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 0 0;\n  transform: scaleY(0.5);\n}\n.vux-table th {\n  font-weight: 500;\n}\n.vux-table.vux-table-bordered:before {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 1px;\n  bottom: 0;\n  border-left: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 0 0;\n  transform: scaleX(0.5);\n}\n.vux-table td,\n.vux-table th {\n  border-bottom: 1px solid #e0e0e0;\n  border-right: 1px solid #e0e0e0;\n  text-align: center;\n}\n.vux-table td,\n.vux-table th {\n  position: relative;\n  border-right: 0;\n  border-bottom: 0;\n}\n.vux-table td:before,\n.vux-table th:before {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  height: 1px;\n  border-bottom: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 0 100%;\n  transform: scaleY(0.5);\n}\n.vux-table.vux-table-no-content-bordered td:before {\n  border-bottom-width: 0;\n}\n.vux-table.vux-table-no-content-bordered tr:last-child td:before {\n  border-bottom-width: 1px;\n}\n.vux-table td:after,\n.vux-table th:after {\n  content: \" \";\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 1px;\n  bottom: 0;\n  border-right: 1px solid #C7C7C7;\n  color: #C7C7C7;\n  transform-origin: 100% 0;\n  transform: scaleX(0.5);\n}\n.vux-table.vux-table-no-cell-bordered td:after,\n.vux-table.vux-table-no-cell-bordered th:after {\n  border-right-width: 0;\n}\n.vux-table tr td:last-child:after,\n.vux-table tr th:last-child:after {\n  border-right-width: 0;\n}\n.vux-table.vux-table-bordered tr td:last-child:after,\n.vux-table.vux-table-bordered tr th:last-child:after {\n  border-right-width: 1px;\n}\n", ""]);

// exports


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//

exports.default = {
  name: 'x-table',
  props: {
    fullBordered: Boolean,
    cellBordered: {
      type: Boolean,
      default: true
    },
    contentBordered: {
      type: Boolean,
      default: true
    }
  }
};

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('table', {
    staticClass: "vux-table",
    class: {
      'vux-table-bordered': _vm.fullBordered, 'vux-table-no-cell-bordered': !_vm.cellBordered, 'vux-table-no-content-bordered': !_vm.contentBordered
    }
  }, [_vm._t("default")], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-867652f6", module.exports)
  }
}

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(272)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(274),
  /* template */
  __webpack_require__(278),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/x-dialog/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0e1ef0c7", Component.options)
  } else {
    hotAPI.reload("data-v-0e1ef0c7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(273);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("910be2a0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0e1ef0c7\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0e1ef0c7\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n.vux-fade-enter-active,\n.vux-fade-leave-active {\n  opacity: 1;\n  transition: opacity linear 0.2s;\n}\n.vux-fade-enter,\n.vux-fade-leave-to {\n  opacity: 0;\n}\n.vux-dialog-enter-active,\n.vux-dialog-leave-active {\n  opacity: 1;\n  transition-duration: 400ms;\n  transform: translate(-50%, -50%) scale(1) !important;\n  transition-property: transform, opacity!important;\n}\n.vux-dialog-leave-active {\n  transition-duration: 300ms;\n}\n.vux-dialog-enter {\n  opacity: 0;\n  transform: translate(-50%, -50%) scale(1.185) !important;\n}\n.vux-dialog-leave-active {\n  opacity: 0;\n  transform: translate(-50%, -50%) scale(0.85) !important;\n}\n.vux-mask-enter,\n.vux-mask-leave-active {\n  opacity: 0;\n}\n.vux-mask-leave-active,\n.vux-mask-enter-active {\n  transition: opacity 300ms;\n}\n/**\n* actionsheet\n*/\n/**\n* datetime\n*/\n/**\n* tabbar\n*/\n/**\n* tab\n*/\n/**\n* dialog\n*/\n/**\n* x-number\n*/\n/**\n* checkbox\n*/\n/**\n* check-icon\n*/\n/**\n* Cell\n*/\n/**\n* Mask\n*/\n/**\n* Range\n*/\n/**\n* Tabbar\n*/\n/**\n* Header\n*/\n/**\n* Timeline\n*/\n/**\n* Switch\n*/\n/**\n* Button\n*/\n/**\n* swipeout\n*/\n/**\n* Cell\n*/\n/**\n* Badge\n*/\n/**\n* Popover\n*/\n/**\n* Button tab\n*/\n/* alias */\n/**\n* Swiper\n*/\n/**\n* checklist\n*/\n/**\n* popup-picker\n*/\n/**\n* popup\n*/\n/**\n* popup-header\n*/\n/**\n* form-preview\n*/\n/**\n* load-more\n*/\n/**\n* sticky\n*/\n/**\n* group\n*/\n/**\n* toast\n*/\n/**\n* icon\n*/\n/**\n* calendar\n*/\n/**\n* week-calendar\n*/\n/**\n* search\n*/\n/**\n* radio\n*/\n/**\n* loadmore\n*/\n.weui-mask {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.weui-mask_transparent {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n}\n.weui-dialog {\n  position: fixed;\n  z-index: 5000;\n  width: 80%;\n  max-width: 300px;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: #FFFFFF;\n  text-align: center;\n  border-radius: 3px;\n  overflow: hidden;\n}\n.weui-dialog__hd {\n  padding: 1.3em 1.6em 0.5em;\n}\n.weui-dialog__title {\n  font-weight: 400;\n  font-size: 18px;\n}\n.weui-dialog__bd {\n  padding: 0 1.6em 0.8em;\n  min-height: 40px;\n  font-size: 15px;\n  line-height: 1.3;\n  word-wrap: break-word;\n  word-break: break-all;\n  color: #999999;\n}\n.weui-dialog__bd:first-child {\n  padding: 2.7em 20px 1.7em;\n  color: #353535;\n}\n.weui-dialog__ft {\n  position: relative;\n  line-height: 48px;\n  font-size: 18px;\n  display: flex;\n}\n.weui-dialog__ft:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 1px;\n  border-top: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  transform-origin: 0 0;\n  transform: scaleY(0.5);\n}\n.weui-dialog__btn {\n  display: block;\n  flex: 1;\n  color: #3CC51F;\n  text-decoration: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  position: relative;\n}\n.weui-dialog__btn:active {\n  background-color: #EEEEEE;\n}\n.weui-dialog__btn:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 1px;\n  bottom: 0;\n  border-left: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  transform-origin: 0 0;\n  transform: scaleX(0.5);\n}\n.weui-dialog__btn:first-child:after {\n  display: none;\n}\n.weui-dialog__btn_default {\n  color: #353535;\n}\n.weui-dialog__btn_primary {\n  color: #0BB20C;\n}\n.weui-skin_android .weui-dialog {\n  text-align: left;\n  box-shadow: 0 6px 30px 0 rgba(0, 0, 0, 0.1);\n}\n.weui-skin_android .weui-dialog__title {\n  font-size: 21px;\n}\n.weui-skin_android .weui-dialog__hd {\n  text-align: left;\n}\n.weui-skin_android .weui-dialog__bd {\n  color: #999999;\n  padding: 0.25em 1.6em 2em;\n  font-size: 17px;\n  text-align: left;\n}\n.weui-skin_android .weui-dialog__bd:first-child {\n  padding: 1.6em 1.6em 2em;\n  color: #353535;\n}\n.weui-skin_android .weui-dialog__ft {\n  display: block;\n  text-align: right;\n  line-height: 42px;\n  font-size: 16px;\n  padding: 0 1.6em 0.7em;\n}\n.weui-skin_android .weui-dialog__ft:after {\n  display: none;\n}\n.weui-skin_android .weui-dialog__btn {\n  display: inline-block;\n  vertical-align: top;\n  padding: 0 .8em;\n}\n.weui-skin_android .weui-dialog__btn:after {\n  display: none;\n}\n.weui-skin_android .weui-dialog__btn:active {\n  background-color: rgba(0, 0, 0, 0.06);\n}\n.weui-skin_android .weui-dialog__btn:visited {\n  background-color: rgba(0, 0, 0, 0.06);\n}\n.weui-skin_android .weui-dialog__btn:last-child {\n  margin-right: -0.8em;\n}\n.weui-skin_android .weui-dialog__btn_default {\n  color: #808080;\n}\n@media screen and (min-width: 1024px) {\n.weui-dialog {\n    width: 35%;\n}\n}\n", ""]);

// exports


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _preventBodyScroll = __webpack_require__(275);

var _preventBodyScroll2 = _interopRequireDefault(_preventBodyScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mixins: [_preventBodyScroll2.default],
  name: 'x-dialog',
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maskTransition: {
      type: String,
      default: 'vux-mask'
    },
    maskZIndex: [String, Number],
    dialogTransition: {
      type: String,
      default: 'vux-dialog'
    },
    dialogClass: {
      type: String,
      default: 'weui-dialog'
    },
    hideOnBlur: Boolean,
    dialogStyle: Object,
    scroll: {
      type: Boolean,
      default: true,
      validator: function validator(val) {
        if ("development" === 'development' && val === false) {
          console.warn('[VUX warn] x-dialog:scroll 已经废弃。如果你是 100% 布局，请参照文档配置 $layout 以实现阻止滚动');
        }
        return true;
      }
    }
  },
  computed: {
    maskStyle: function maskStyle() {
      if (typeof this.maskZIndex !== 'undefined') {
        return {
          zIndex: this.maskZIndex
        };
      }
    }
  },
  watch: {
    show: function show(val) {
      this.$emit('update:show', val);
      this.$emit(val ? 'on-show' : 'on-hide');
      if (val) {
        this.addModalClassName();
      } else {
        this.removeModalClassName();
      }
    }
  },
  methods: {
    hide: function hide() {
      if (this.hideOnBlur) {
        this.$emit('update:show', false);
        this.$emit('change', false);
      }
    }
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = __webpack_require__(169);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(276);

var BODY_CLASS_NAME = 'vux-modal-open';
var CONTAINER_CLASS_NAME = 'vux-modal-open-for-container';
var VUX_VIEW_BOX_ELEMENT = '#vux_view_box_body';

exports.default = {
  methods: {
    // some plugin may be imported before configPlugin, so we cannot get gloal config when component is created
    getLayout: function getLayout() {
      if (this.$vux && this.$vux.config && this.$vux.config.$layout === 'VIEW_BOX') {
        return 'VIEW_BOX';
      }
      return '';
    },
    addModalClassName: function addModalClassName() {
      if (this.getLayout() === 'VIEW_BOX') {
        _dom2.default.addClass(document.body, BODY_CLASS_NAME);
        _dom2.default.addClass(document.querySelector(VUX_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME);
      }
    },
    removeModalClassName: function removeModalClassName() {
      if (this.getLayout() === 'VIEW_BOX') {
        _dom2.default.removeClass(document.body, BODY_CLASS_NAME);
        _dom2.default.removeClass(document.querySelector(VUX_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME);
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.removeModalClassName();
  },
  deactivated: function deactivated() {
    this.removeModalClassName();
  }
};

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(277);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(33)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./prevent-body-scroll.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./prevent-body-scroll.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, ".vux-modal-open {\n  overflow: hidden;\n  position: fixed;\n  width: 100%;\n}\n.vux-modal-open-for-container {\n  overflow: hidden!important;\n}", ""]);

// exports


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vux-x-dialog"
  }, [_c('transition', {
    attrs: {
      "name": _vm.maskTransition
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show),
      expression: "show"
    }],
    staticClass: "weui-mask",
    style: (_vm.maskStyle),
    on: {
      "click": _vm.hide
    }
  })]), _vm._v(" "), _c('transition', {
    attrs: {
      "name": _vm.dialogTransition
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show),
      expression: "show"
    }],
    class: _vm.dialogClass,
    style: (_vm.dialogStyle)
  }, [_vm._t("default")], 2)])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0e1ef0c7", module.exports)
  }
}

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [_c('div', {
    staticClass: "title"
  }, [_c('div', [_c('div', {
    staticClass: "see-type"
  }, [(!_vm.type) ? _c('label', {
    on: {
      "click": function($event) {
        _vm.type = true
      }
    }
  }, [_vm._v("格式一")]) : _vm._e(), _vm._v(" "), (_vm.type) ? _c('label', {
    on: {
      "click": function($event) {
        _vm.type = false
      }
    }
  }, [_vm._v("格式二")]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "now-week-but",
    on: {
      "click": function($event) {
        _vm.setNowWeek()
      }
    }
  }, [_vm._v("\n                本周\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "weeks"
  }, [_c('scroller', {
    attrs: {
      "lock-y": "",
      "scrollbar-x": false
    }
  }, [_c('div', {
    staticClass: "box1",
    style: ({
      width: _vm.set.weeks.length * 40 + 'px'
    }),
    attrs: {
      "id": "weeks"
    }
  }, _vm._l((_vm.set.weeks), function(i) {
    return _c('div', {
      class: {
        'box1-item': true, 'test': _vm.test, 'now-week': _vm.get.nowWeek == i.id, 'sel-week': i.sel
      },
      on: {
        "click": function($event) {
          _vm.addSelWeek(i.id)
        }
      }
    }, [_c('span', [_vm._v(_vm._s(' ' + i.id + ' '))])])
  }))])], 1), _vm._v(" "), _c('div', {
    staticClass: "count",
    on: {
      "click": function($event) {
        _vm.count = true
      }
    }
  }, [_vm._v("\n                统计\n            ")])])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "transfer-dom",
      rawName: "v-transfer-dom"
    }]
  }, [_c('popup', {
    attrs: {
      "position": "right"
    },
    model: {
      value: (_vm.count),
      callback: function($$v) {
        _vm.count = $$v
      },
      expression: "count"
    }
  }, [_c('div', {
    staticStyle: {
      "width": "300px"
    }
  }, [_c('divider', [_vm._v("组别")]), _vm._v(" "), _c('checker', {
    attrs: {
      "type": "checkbox",
      "default-item-class": "group-item",
      "selected-item-class": "group-item-selected"
    },
    on: {
      "on-change": _vm.getSelStudents
    },
    model: {
      value: (_vm.set.selGroups),
      callback: function($$v) {
        _vm.set.selGroups = $$v
      },
      expression: "set.selGroups"
    }
  }, _vm._l((_vm.get.groups), function(i) {
    return _c('checker-item', {
      key: i.id,
      staticClass: "group-item",
      attrs: {
        "value": i.id
      }
    }, [_vm._v(_vm._s(i.name) + "\n                    ")])
  })), _vm._v(" "), _c('divider', [_vm._v("职务")]), _vm._v(" "), _c('checker', {
    attrs: {
      "type": "checkbox",
      "default-item-class": "group-item",
      "selected-item-class": "group-item-selected"
    },
    on: {
      "on-change": _vm.getSelStudents
    },
    model: {
      value: (_vm.set.selPositions),
      callback: function($$v) {
        _vm.set.selPositions = $$v
      },
      expression: "set.selPositions"
    }
  }, _vm._l((_vm.get.positions), function(i) {
    return _c('checker-item', {
      key: i.id,
      staticClass: "group-item",
      attrs: {
        "value": i.id
      }
    }, [_vm._v(_vm._s(i.name) + "\n                    ")])
  })), _vm._v(" "), _c('divider', [_vm._v("性别")]), _vm._v(" "), _c('checker', {
    attrs: {
      "type": "checkbox",
      "default-item-class": "group-item",
      "selected-item-class": "group-item-selected"
    },
    on: {
      "on-change": _vm.getSelStudents
    },
    model: {
      value: (_vm.set.selSexs),
      callback: function($$v) {
        _vm.set.selSexs = $$v
      },
      expression: "set.selSexs"
    }
  }, [_c('checker-item', {
    key: 0,
    staticClass: "group-item",
    attrs: {
      "value": 0
    }
  }, [_vm._v("男")]), _vm._v(" "), _c('checker-item', {
    key: 1,
    staticClass: "group-item",
    attrs: {
      "value": 1
    }
  }, [_vm._v("女")])], 1), _vm._v(" "), _c('divider', [_vm._v("年级")]), _vm._v(" "), _c('checker', {
    attrs: {
      "type": "checkbox",
      "default-item-class": "group-item",
      "selected-item-class": "group-item-selected"
    },
    on: {
      "on-change": _vm.getSelStudents
    },
    model: {
      value: (_vm.set.selGrades),
      callback: function($$v) {
        _vm.set.selGrades = $$v
      },
      expression: "set.selGrades"
    }
  }, _vm._l((_vm.get.grades), function(i) {
    return _c('checker-item', {
      key: i,
      staticClass: "group-item",
      attrs: {
        "value": i
      }
    }, [_vm._v(_vm._s(i) + "级\n                    ")])
  })), _vm._v(" "), _c('divider', [_vm._v("地点")]), _vm._v(" "), _c('checker', {
    attrs: {
      "type": "checkbox",
      "default-item-class": "group-item",
      "selected-item-class": "group-item-selected"
    },
    on: {
      "on-change": _vm.getSelStudents
    },
    model: {
      value: (_vm.set.selLocations),
      callback: function($$v) {
        _vm.set.selLocations = $$v
      },
      expression: "set.selLocations"
    }
  }, _vm._l((_vm.get.locations), function(i) {
    return _c('checker-item', {
      key: i.id,
      staticClass: "group-item",
      attrs: {
        "value": i.id
      }
    }, [_vm._v(_vm._s(i.name))])
  })), _vm._v(" "), _c('divider', [_vm._v("----")]), _vm._v(" "), _c('x-button', {
    staticStyle: {
      "background-color": "#ff4a00",
      "color": "white"
    },
    nativeOn: {
      "click": function($event) {
        _vm.selStuBut($event)
      }
    }
  }, [_vm._v("选择人员")])], 1)])], 1), _vm._v(" "), _c('carousel-3d', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type),
      expression: "type"
    }],
    attrs: {
      "display": 5,
      "perspective": 0,
      "space": "50",
      "width": "250",
      "height": "500",
      "inverseScaling": 50,
      "loop": false,
      "controlsVisible": true,
      "minSwipeDistance": 50
    }
  }, [_c('slide', {
    staticClass: "week-day",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[0]].content
    }),
    attrs: {
      "index": 0
    }
  }, [_c('div', {
    staticClass: "week-title",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[0]].title
    })
  }, [_vm._v("\n                星期一（\n                "), (_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e(), _vm._v("\n                ）\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "courseContent"
  }, _vm._l((_vm.courses[0]), function(section) {
    return _c('div', {
      staticClass: "section",
      staticStyle: {
        "width": "100%"
      }
    }, [_c('div', [_c('label', {
      style: ({
        backgroundColor: _vm.colors[_vm.colorIndex[0]].title
      })
    }, [_vm._v(_vm._s(section.id))])]), _vm._v(" "), _c('div', _vm._l((section.stus), function(stu, index) {
      return _c('label', {
        class: {
          'sel-user': stu.id == _vm.selUserId
        },
        on: {
          "click": function($event) {
            _vm.courseInfo(stu.id, stu.course_id)
          }
        }
      }, [_vm._v(_vm._s(stu.name) + ",")])
    }))])
  }))]), _vm._v(" "), _c('slide', {
    staticClass: "week-day",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[1]].content
    }),
    attrs: {
      "index": 1
    }
  }, [_c('div', {
    staticClass: "week-title",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[1]].title
    })
  }, [_vm._v("\n                星期二（\n                "), (_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e(), _vm._v("\n                ）\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "courseContent"
  }, _vm._l((_vm.courses[1]), function(section) {
    return _c('div', {
      staticClass: "section",
      staticStyle: {
        "width": "100%"
      }
    }, [_c('div', [_c('label', {
      style: ({
        backgroundColor: _vm.colors[_vm.colorIndex[1]].title
      })
    }, [_vm._v(_vm._s(section.id))])]), _vm._v(" "), _c('div', _vm._l((section.stus), function(stu, index) {
      return _c('label', {
        class: {
          'sel-user': stu.id == _vm.selUserId
        },
        on: {
          "click": function($event) {
            _vm.courseInfo(stu.id, stu.course_id)
          }
        }
      }, [_vm._v(_vm._s(stu.name) + ",")])
    }))])
  }))]), _vm._v(" "), _c('slide', {
    staticClass: "week-day",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[2]].content
    }),
    attrs: {
      "index": 2
    }
  }, [_c('div', {
    staticClass: "week-title",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[2]].title
    })
  }, [_vm._v("\n                星期三（\n                "), (_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e(), _vm._v("\n                ）\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "courseContent"
  }, _vm._l((_vm.courses[2]), function(section) {
    return _c('div', {
      staticClass: "section",
      staticStyle: {
        "width": "100%"
      }
    }, [_c('div', [_c('label', {
      style: ({
        backgroundColor: _vm.colors[_vm.colorIndex[2]].title
      })
    }, [_vm._v(_vm._s(section.id))])]), _vm._v(" "), _c('div', _vm._l((section.stus), function(stu, index) {
      return _c('label', {
        class: {
          'sel-user': stu.id == _vm.selUserId
        },
        on: {
          "click": function($event) {
            _vm.courseInfo(stu.id, stu.course_id)
          }
        }
      }, [_vm._v(_vm._s(stu.name) + ",")])
    }))])
  }))]), _vm._v(" "), _c('slide', {
    staticClass: "week-day",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[3]].content
    }),
    attrs: {
      "index": 3
    }
  }, [_c('div', {
    staticClass: "week-title",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[3]].title
    })
  }, [_vm._v("\n                星期四（\n                "), (_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e(), _vm._v("\n                ）\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "courseContent"
  }, _vm._l((_vm.courses[3]), function(section) {
    return _c('div', {
      staticClass: "section",
      staticStyle: {
        "width": "100%"
      }
    }, [_c('div', [_c('label', {
      style: ({
        backgroundColor: _vm.colors[_vm.colorIndex[3]].title
      })
    }, [_vm._v(_vm._s(section.id))])]), _vm._v(" "), _c('div', _vm._l((section.stus), function(stu, index) {
      return _c('label', {
        class: {
          'sel-user': stu.id == _vm.selUserId
        },
        on: {
          "click": function($event) {
            _vm.courseInfo(stu.id, stu.course_id)
          }
        }
      }, [_vm._v(_vm._s(stu.name) + ",")])
    }))])
  }))]), _vm._v(" "), _c('slide', {
    staticClass: "week-day",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[4]].content
    }),
    attrs: {
      "index": 4
    }
  }, [_c('div', {
    staticClass: "week-title",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[4]].title
    })
  }, [_vm._v("\n                星期五（\n                "), (_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e(), _vm._v("\n                ）\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "courseContent"
  }, _vm._l((_vm.courses[4]), function(section) {
    return _c('div', {
      staticClass: "section",
      staticStyle: {
        "width": "100%"
      }
    }, [_c('div', [_c('label', {
      style: ({
        backgroundColor: _vm.colors[_vm.colorIndex[4]].title
      })
    }, [_vm._v(_vm._s(section.id))])]), _vm._v(" "), _c('div', _vm._l((section.stus), function(stu, index) {
      return _c('label', {
        class: {
          'sel-user': stu.id == _vm.selUserId
        },
        on: {
          "click": function($event) {
            _vm.courseInfo(stu.id, stu.course_id)
          }
        }
      }, [_vm._v(_vm._s(stu.name) + ",")])
    }))])
  }))]), _vm._v(" "), _c('slide', {
    staticClass: "week-day",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[5]].content
    }),
    attrs: {
      "index": 5
    }
  }, [_c('div', {
    staticClass: "week-title",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[5]].title
    })
  }, [_vm._v("\n                星期六（\n                "), (_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e(), _vm._v("\n                ）\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "courseContent"
  }, _vm._l((_vm.courses[5]), function(section) {
    return _c('div', {
      staticClass: "section",
      staticStyle: {
        "width": "100%"
      }
    }, [_c('div', [_c('label', {
      style: ({
        backgroundColor: _vm.colors[_vm.colorIndex[5]].title
      })
    }, [_vm._v(_vm._s(section.id))])]), _vm._v(" "), _c('div', _vm._l((section.stus), function(stu, index) {
      return _c('label', {
        class: {
          'sel-user': stu.id == _vm.selUserId
        },
        on: {
          "click": function($event) {
            _vm.courseInfo(stu.id, stu.course_id)
          }
        }
      }, [_vm._v(_vm._s(stu.name) + ",")])
    }))])
  }))]), _vm._v(" "), _c('slide', {
    staticClass: "week-day",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[6]].content
    }),
    attrs: {
      "index": 6
    }
  }, [_c('div', {
    staticClass: "week-title",
    style: ({
      backgroundColor: _vm.colors[_vm.colorIndex[6]].title
    })
  }, [_vm._v("\n                星期日（\n                "), (_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e(), _vm._v("\n                ）\n            ")]), _vm._v(" "), _c('div', {
    staticClass: "courseContent"
  }, _vm._l((_vm.courses[6]), function(section) {
    return _c('div', {
      staticClass: "section",
      staticStyle: {
        "width": "100%"
      }
    }, [_c('div', [_c('label', {
      style: ({
        backgroundColor: _vm.colors[_vm.colorIndex[6]].title
      })
    }, [_vm._v(_vm._s(section.id))])]), _vm._v(" "), _c('div', _vm._l((section.stus), function(stu, index) {
      return _c('label', {
        class: {
          'sel-user': stu.id == _vm.selUserId
        },
        on: {
          "click": function($event) {
            _vm.courseInfo(stu.id, stu.course_id)
          }
        }
      }, [_vm._v(_vm._s(stu.name) + ",")])
    }))])
  }))])], 1), _vm._v(" "), (!_vm.type) ? _c('div', {
    staticStyle: {
      "padding": "15px"
    }
  }, [_c('x-table', {
    staticStyle: {
      "background-color": "#fff"
    },
    attrs: {
      "full-bordered": ""
    }
  }, [_c('thead', [_c('tr', [_c('th', [(_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e()]), _vm._v(" "), _c('th', [_vm._v("周一")]), _vm._v(" "), _c('th', [_vm._v("周二")]), _vm._v(" "), _c('th', [_vm._v("周三")]), _vm._v(" "), _c('th', [_vm._v("周四")]), _vm._v(" "), _c('th', [_vm._v("周五")]), _vm._v(" "), _c('th', [_vm._v("周六")]), _vm._v(" "), _c('th', [_vm._v("周日")])])]), _vm._v(" "), _c('tbody', _vm._l((7), function(i) {
    return _c('tr', [_c('td', [_vm._v(_vm._s(_vm.courses[i - 1].length > 0 ? _vm.courses[0][i - 1].id : 0) + "节")]), _vm._v(" "), _vm._l((7), function(j) {
      return _c('td', {
        on: {
          "click": function($event) {
            _vm.selTd(j - 1, i - 1)
          }
        }
      }, [_vm._v("\n                    " + _vm._s(_vm.courses[j - 1].length > 0 ? _vm.courses[j - 1][i - 1].stus.length : 0) + "\n                ")])
    })], 2)
  }))]), _vm._v(" "), _c('div', {
    directives: [{
      name: "transfer-dom",
      rawName: "v-transfer-dom"
    }]
  }, [_c('x-dialog', {
    staticClass: "dialog-demo",
    attrs: {
      "hide-on-blur": ""
    },
    model: {
      value: (_vm.type2Data.showHideOnBlur),
      callback: function($$v) {
        _vm.type2Data.showHideOnBlur = $$v
      },
      expression: "type2Data.showHideOnBlur"
    }
  }, [_c('div', {
    staticClass: "img-box"
  }, [_c('div', {
    staticStyle: {
      "margin": "10px auto",
      "height": "330px",
      "text-align": "center",
      "position": "relative"
    }
  }, [_c('div', {
    staticStyle: {
      "width": "100%",
      "height": "40px",
      "line-height": "40px",
      "position": "absolute",
      "top": "0",
      "background-color": "white"
    }
  }, [_c('p', [_vm._v("\n                                " + _vm._s(_vm.type2Data.title) + "节\n                                (\n                                "), (_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(false)
      }
    }
  }, [_vm._v("有课")]) : _vm._e(), _vm._v(" "), (!_vm.haveNoCourse) ? _c('span', {
    on: {
      "click": function($event) {
        _vm.setHasNoCourse(true)
      }
    }
  }, [_vm._v("无课")]) : _vm._e(), _vm._v("\n                                )\n                            ")])]), _vm._v(" "), _c('div', {
    staticClass: "label-stu"
  }, _vm._l((_vm.courses[_vm.type2Data.x].length > 0 ? _vm.courses[_vm.type2Data.x][_vm.type2Data.y].stus : []), function(stu, index) {
    return _c('label', {
      class: {
        'sel-user': stu.id == _vm.selUserId
      },
      on: {
        "click": function($event) {
          _vm.courseInfo(stu.id, stu.course_id)
        }
      }
    }, [_vm._v(_vm._s(stu.name) + ",")])
  }))])]), _vm._v(" "), _c('div', {
    on: {
      "click": function($event) {
        _vm.type2Data.showHideOnBlur = false
      }
    }
  }, [_c('span', {
    staticClass: "vux-close"
  })])])], 1)], 1) : _vm._e(), _vm._v(" "), _c('div', {
    directives: [{
      name: "transfer-dom",
      rawName: "v-transfer-dom"
    }]
  }, [_c('x-dialog', {
    staticClass: "dialog-demo",
    attrs: {
      "hide-on-blur": ""
    },
    model: {
      value: (_vm.selStu.showHideOnBlur),
      callback: function($$v) {
        _vm.selStu.showHideOnBlur = $$v
      },
      expression: "selStu.showHideOnBlur"
    }
  }, [_c('div', {
    staticClass: "img-box"
  }, [_c('div', {
    staticStyle: {
      "margin": "10px auto",
      "height": "330px",
      "text-align": "center",
      "position": "relative"
    }
  }, [_c('div', {
    staticStyle: {
      "width": "100%",
      "height": "40px",
      "line-height": "40px",
      "top": "0",
      "position": "absolute",
      "background-color": "white"
    }
  }, [_c('p', [_vm._v("\n                            人员选择"), _c('check-icon', {
    attrs: {
      "value": _vm.selStu.allType
    },
    on: {
      "update:value": function($event) {
        _vm.selStu.allType = $event
      }
    },
    nativeOn: {
      "click": function($event) {
        _vm.selAllStu($event)
      }
    }
  }, [_vm._v("全选")])], 1)]), _vm._v(" "), _c('div', {
    staticStyle: {
      "padding-top": "40px",
      "overflow": "scroll",
      "height": "300px"
    }
  }, [_c('checker', {
    attrs: {
      "type": 'checkbox',
      "default-item-class": 'group-item',
      "selected-item-class": 'group-item-selected'
    },
    model: {
      value: (_vm.selStu.students),
      callback: function($$v) {
        _vm.selStu.students = $$v
      },
      expression: "selStu.students"
    }
  }, _vm._l((_vm.get.students), function(i) {
    return _c('checker-item', {
      key: 's' + i.id,
      staticClass: "group-item",
      attrs: {
        "value": 's' + i.id
      },
      nativeOn: {
        "click": function($event) {
          _vm.selStuFun($event)
        }
      }
    }, [_vm._v(_vm._s(i.name))])
  }))], 1)])]), _vm._v(" "), _c('div', {
    on: {
      "click": function($event) {
        _vm.selStu.showHideOnBlur = false
      }
    }
  }, [_c('span', {
    staticClass: "vux-close"
  })])])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-43186183", module.exports)
  }
}

/***/ }),
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(287)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(289),
  /* template */
  __webpack_require__(291),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/x-button/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-69d9839e", Component.options)
  } else {
    hotAPI.reload("data-v-69d9839e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(288);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("3332a8f0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-69d9839e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-69d9839e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "/**\n* actionsheet\n*/\n/**\n* datetime\n*/\n/**\n* tabbar\n*/\n/**\n* tab\n*/\n/**\n* dialog\n*/\n/**\n* x-number\n*/\n/**\n* checkbox\n*/\n/**\n* check-icon\n*/\n/**\n* Cell\n*/\n/**\n* Mask\n*/\n/**\n* Range\n*/\n/**\n* Tabbar\n*/\n/**\n* Header\n*/\n/**\n* Timeline\n*/\n/**\n* Switch\n*/\n/**\n* Button\n*/\n/**\n* swipeout\n*/\n/**\n* Cell\n*/\n/**\n* Badge\n*/\n/**\n* Popover\n*/\n/**\n* Button tab\n*/\n/* alias */\n/**\n* Swiper\n*/\n/**\n* checklist\n*/\n/**\n* popup-picker\n*/\n/**\n* popup\n*/\n/**\n* popup-header\n*/\n/**\n* form-preview\n*/\n/**\n* load-more\n*/\n/**\n* sticky\n*/\n/**\n* group\n*/\n/**\n* toast\n*/\n/**\n* icon\n*/\n/**\n* calendar\n*/\n/**\n* week-calendar\n*/\n/**\n* search\n*/\n/**\n* radio\n*/\n/**\n* loadmore\n*/\n.weui-btn {\n  position: relative;\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 14px;\n  padding-right: 14px;\n  box-sizing: border-box;\n  font-size: 18px;\n  text-align: center;\n  text-decoration: none;\n  color: #FFFFFF;\n  line-height: 2.33333333;\n  border-radius: 5px;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  overflow: hidden;\n}\n.weui-btn:after {\n  content: \" \";\n  width: 200%;\n  height: 200%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  transform: scale(0.5);\n  transform-origin: 0 0;\n  box-sizing: border-box;\n  border-radius: 10px;\n}\n.weui-btn_inline {\n  display: inline-block;\n}\n.weui-btn_default {\n  color: #000000;\n  background-color: #F8F8F8;\n}\n.weui-btn_default:not(.weui-btn_disabled):visited {\n  color: #000000;\n}\n.weui-btn_default:not(.weui-btn_disabled):active {\n  color: rgba(0, 0, 0, 0.6);\n  background-color: #DEDEDE;\n}\n.weui-btn_primary {\n  background-color: #1AAD19;\n}\n.weui-btn_primary:not(.weui-btn_disabled):visited {\n  color: #FFFFFF;\n}\n.weui-btn_primary:not(.weui-btn_disabled):active {\n  color: rgba(255, 255, 255, 0.6);\n  background-color: #179B16;\n}\n.weui-btn_warn {\n  background-color: #E64340;\n}\n.weui-btn_warn:not(.weui-btn_disabled):visited {\n  color: #FFFFFF;\n}\n.weui-btn_warn:not(.weui-btn_disabled):active {\n  color: rgba(255, 255, 255, 0.6);\n  background-color: #CE3C39;\n}\n.weui-btn_disabled {\n  color: rgba(255, 255, 255, 0.6);\n}\n.weui-btn_disabled.weui-btn_default {\n  color: rgba(0, 0, 0, 0.3);\n  background-color: #F7F7F7;\n}\n.weui-btn_disabled.weui-btn_primary {\n  background-color: #9ED99D;\n}\n.weui-btn_disabled.weui-btn_warn {\n  background-color: #EC8B89;\n}\n.weui-btn_loading .weui-loading {\n  margin: -0.2em 0.34em 0 0;\n}\n.weui-btn_loading.weui-btn_primary,\n.weui-btn_loading.weui-btn_warn {\n  color: rgba(255, 255, 255, 0.6);\n}\n.weui-btn_loading.weui-btn_primary .weui-loading,\n.weui-btn_loading.weui-btn_warn .weui-loading {\n  background-image: url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMjAnIGhlaWdodD0nMTIwJyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgxMDB2MTAwSDB6Jy8+PHJlY3QgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjU2KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDMwIDEwNS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjQzKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjM4KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg5MCA2NSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjMyKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTguNjYgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4yOCknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0ncmdiYSgyNTUsMjU1LDI1NSwuMjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA1MCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjIpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xNyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTEyMCA0MS4zNCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjE0KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtOTAgMzUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtNjAgMjQuMDIgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4wMyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTMwIC01Ljk4IDY1KScvPjwvc3ZnPg==\");\n}\n.weui-btn_loading.weui-btn_primary {\n  background-color: #179B16;\n}\n.weui-btn_loading.weui-btn_warn {\n  background-color: #CE3C39;\n}\n.weui-btn_plain-primary {\n  color: #1aad19;\n  border: 1px solid #1aad19;\n}\n.weui-btn_plain-primary:not(.weui-btn_plain-disabled):active {\n  color: rgba(26, 173, 25, 0.6);\n  border-color: rgba(26, 173, 25, 0.6);\n  background-color: transparent;\n}\n.weui-btn_plain-primary:after {\n  border-width: 0;\n}\n.weui-btn_plain-default {\n  color: #353535;\n  border: 1px solid #353535;\n}\n.weui-btn_plain-default:not(.weui-btn_plain-disabled):active {\n  color: rgba(53, 53, 53, 0.6);\n  border-color: rgba(53, 53, 53, 0.6);\n}\n.weui-btn_plain-default:after {\n  border-width: 0;\n}\n.weui-btn_plain-disabled {\n  color: rgba(0, 0, 0, 0.2);\n  border-color: rgba(0, 0, 0, 0.2);\n}\nbutton.weui-btn,\ninput.weui-btn {\n  width: 100%;\n  border-width: 0;\n  outline: 0;\n  -webkit-appearance: none;\n}\nbutton.weui-btn:focus,\ninput.weui-btn:focus {\n  outline: 0;\n}\nbutton.weui-btn_inline,\ninput.weui-btn_inline,\nbutton.weui-btn_mini,\ninput.weui-btn_mini {\n  width: auto;\n}\nbutton.weui-btn_plain-primary,\ninput.weui-btn_plain-primary,\nbutton.weui-btn_plain-default,\ninput.weui-btn_plain-default {\n  border-width: 1px;\n  background-color: transparent;\n}\n.weui-btn_mini {\n  display: inline-block;\n  padding: 0 1.32em;\n  line-height: 2.3;\n  font-size: 13px;\n}\n/*gap between btn*/\n.weui-btn + .weui-btn {\n  margin-top: 15px;\n}\n.weui-btn.weui-btn_inline + .weui-btn.weui-btn_inline {\n  margin-top: auto;\n  margin-left: 15px;\n}\n.weui-btn-area {\n  margin: 1.17647059em 15px 0.3em;\n}\n.weui-btn-area_inline {\n  display: flex;\n}\n.weui-btn-area_inline .weui-btn {\n  margin-top: auto;\n  margin-right: 15px;\n  width: 100%;\n  flex: 1;\n}\n.weui-btn-area_inline .weui-btn:last-child {\n  margin-right: 0;\n}\n.weui-loading {\n  width: 20px;\n  height: 20px;\n  display: inline-block;\n  vertical-align: middle;\n  animation: weuiLoading 1s steps(12, end) infinite;\n  background: transparent url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=\") no-repeat;\n  background-size: 100%;\n}\n.weui-loading.weui-loading_transparent {\n  background-image: url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMjAnIGhlaWdodD0nMTIwJyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgxMDB2MTAwSDB6Jy8+PHJlY3QgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjU2KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDMwIDEwNS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjQzKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjM4KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg5MCA2NSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjMyKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTguNjYgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4yOCknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0ncmdiYSgyNTUsMjU1LDI1NSwuMjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA1MCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjIpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xNyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTEyMCA0MS4zNCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjE0KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtOTAgMzUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtNjAgMjQuMDIgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4wMyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTMwIC01Ljk4IDY1KScvPjwvc3ZnPgo=\");\n}\n@-webkit-keyframes weuiLoading {\n0% {\n    transform: rotate3d(0, 0, 1, 0deg);\n}\n100% {\n    transform: rotate3d(0, 0, 1, 360deg);\n}\n}\n@keyframes weuiLoading {\n0% {\n    transform: rotate3d(0, 0, 1, 0deg);\n}\n100% {\n    transform: rotate3d(0, 0, 1, 360deg);\n}\n}\n", ""]);

// exports


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _router = __webpack_require__(290);

exports.default = {
  name: 'x-button',
  props: {
    type: {
      default: 'default'
    },
    disabled: Boolean,
    mini: Boolean,
    plain: Boolean,
    text: String,
    actionType: String,
    showLoading: Boolean,
    link: String
  },
  methods: {
    onClick: function onClick() {
      !this.disabled && (0, _router.go)(this.link, this.$router);
    }
  },
  computed: {
    classes: function classes() {
      return [{
        'weui-btn_disabled': this.disabled,
        'weui-btn_mini': this.mini
      }, 'weui-btn_' + this.type, this.plain ? 'weui-btn_plain-' + this.type : '', this.showLoading ? 'weui-btn_loading' : ''];
    }
  }
}; //
//
//
//
//
//
//

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.go = go;
exports.getUrl = getUrl;
function go(url, $router) {
  if (/^javas/.test(url) || !url) return;
  var useRouter = (typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object' || $router && typeof url === 'string' && !/http/.test(url);
  if (useRouter) {
    if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object' && url.replace === true) {
      $router.replace(url);
    } else {
      url === 'BACK' ? $router.go(-1) : $router.push(url);
    }
  } else {
    window.location.href = url;
  }
}

function getUrl(url, $router) {
  // Make sure the href is right in hash mode
  if ($router && !$router._history && typeof url === 'string' && !/http/.test(url)) {
    return '#!' + url;
  }
  return url && (typeof url === 'undefined' ? 'undefined' : _typeof(url)) !== 'object' ? url : 'javascript:void(0);';
}

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('button', {
    staticClass: "weui-btn",
    class: _vm.classes,
    attrs: {
      "disabled": _vm.disabled,
      "type": _vm.actionType
    },
    on: {
      "click": _vm.onClick
    }
  }, [(_vm.showLoading) ? _c('i', {
    staticClass: "weui-loading"
  }) : _vm._e(), _vm._v(" "), _vm._t("default", [_vm._v(_vm._s(_vm.text))])], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-69d9839e", module.exports)
  }
}

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(293)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(295),
  /* template */
  __webpack_require__(301),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/check-icon/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-751809a8", Component.options)
  } else {
    hotAPI.reload("data-v-751809a8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(294);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("cb01e524", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-751809a8\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-751809a8\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "/**\n* actionsheet\n*/\n/**\n* datetime\n*/\n/**\n* tabbar\n*/\n/**\n* tab\n*/\n/**\n* dialog\n*/\n/**\n* x-number\n*/\n/**\n* checkbox\n*/\n/**\n* check-icon\n*/\n/**\n* Cell\n*/\n/**\n* Mask\n*/\n/**\n* Range\n*/\n/**\n* Tabbar\n*/\n/**\n* Header\n*/\n/**\n* Timeline\n*/\n/**\n* Switch\n*/\n/**\n* Button\n*/\n/**\n* swipeout\n*/\n/**\n* Cell\n*/\n/**\n* Badge\n*/\n/**\n* Popover\n*/\n/**\n* Button tab\n*/\n/* alias */\n/**\n* Swiper\n*/\n/**\n* checklist\n*/\n/**\n* popup-picker\n*/\n/**\n* popup\n*/\n/**\n* popup-header\n*/\n/**\n* form-preview\n*/\n/**\n* load-more\n*/\n/**\n* sticky\n*/\n/**\n* group\n*/\n/**\n* toast\n*/\n/**\n* icon\n*/\n/**\n* calendar\n*/\n/**\n* week-calendar\n*/\n/**\n* search\n*/\n/**\n* radio\n*/\n/**\n* loadmore\n*/\n.vux-check-icon {\n  display: inline-block;\n}\n.vux-check-icon > span {\n  line-height: 23px;\n  color: #222;\n  vertical-align: middle;\n}\n.vux-check-icon > .weui-icon-success:before,\n.vux-check-icon > .weui-icon-success-circle:before {\n  color: #09BB07;\n}\n", ""]);

// exports


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _icon = __webpack_require__(296);

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'check-icon',
  components: {
    Icon: _icon2.default
  },
  methods: {
    updateValue: function updateValue() {
      this.$emit('update:value', !this.value);
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    }
  }
}; //
//
//
//
//
//
//
//
//

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(297)
}
var Component = __webpack_require__(9)(
  /* script */
  __webpack_require__(299),
  /* template */
  __webpack_require__(300),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "/Applications/MAMP/htdocs/signsystem2.1/node_modules/vux/src/components/icon/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d7345cfa", Component.options)
  } else {
    hotAPI.reload("data-v-d7345cfa", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(298);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(17)("70b89ab4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d7345cfa\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d7345cfa\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../vux-loader/src/after-less-loader.js!../../../../less-loader/dist/cjs.js!../../../../vux-loader/src/style-loader.js!../../../../vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)();
// imports


// module
exports.push([module.i, "\n@font-face {\n  font-weight: normal;\n  font-style: normal;\n  font-family: \"weui\";\n  src: url('data:application/octet-stream;base64,AAEAAAALAIAAAwAwR1NVQrD+s+0AAAE4AAAAQk9TLzJAKEx+AAABfAAAAFZjbWFw65cFHQAAAhwAAAJQZ2x5ZvCRR/EAAASUAAAKtGhlYWQMPROtAAAA4AAAADZoaGVhCCwD+gAAALwAAAAkaG10eEJo//8AAAHUAAAASGxvY2EYqhW4AAAEbAAAACZtYXhwASEAVQAAARgAAAAgbmFtZeNcHtgAAA9IAAAB5nBvc3T6bLhLAAARMAAAAOYAAQAAA+gAAABaA+j/////A+kAAQAAAAAAAAAAAAAAAAAAABIAAQAAAAEAACbZbxtfDzz1AAsD6AAAAADUm2dvAAAAANSbZ2///wAAA+kD6gAAAAgAAgAAAAAAAAABAAAAEgBJAAUAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAAAAQOwAZAABQAIAnoCvAAAAIwCegK8AAAB4AAxAQIAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA6gHqEQPoAAAAWgPqAAAAAAABAAAAAAAAAAAAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+j//wPoAAAD6AAAAAAABQAAAAMAAAAsAAAABAAAAXQAAQAAAAAAbgADAAEAAAAsAAMACgAAAXQABABCAAAABAAEAAEAAOoR//8AAOoB//8AAAABAAQAAAABAAIAAwAEAAUABgAHAAgACQAKAAsADAANAA4ADwAQABEAAAEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAANwAAAAAAAAAEQAA6gEAAOoBAAAAAQAA6gIAAOoCAAAAAgAA6gMAAOoDAAAAAwAA6gQAAOoEAAAABAAA6gUAAOoFAAAABQAA6gYAAOoGAAAABgAA6gcAAOoHAAAABwAA6ggAAOoIAAAACAAA6gkAAOoJAAAACQAA6goAAOoKAAAACgAA6gsAAOoLAAAACwAA6gwAAOoMAAAADAAA6g0AAOoNAAAADQAA6g4AAOoOAAAADgAA6g8AAOoPAAAADwAA6hAAAOoQAAAAEAAA6hEAAOoRAAAAEQAAAAAARgCMANIBJAF4AcQCMgJgAqgC/ANIA6YD/gROBKAE9AVaAAAAAgAAAAADrwOtABQAKQAAASIHBgcGFBcWFxYyNzY3NjQnJicmAyInJicmNDc2NzYyFxYXFhQHBgcGAfV4Z2Q7PDw7ZGfwZmQ7PDw7ZGZ4bl5bNjc3Nlte215bNjc3NlteA608O2Rn8GdjOzw8O2Nn8GdkOzz8rzc1W17bXlw1Nzc1XF7bXls1NwAAAAACAAAAAAOzA7MAFwAtAAABIgcGBwYVFBcWFxYzMjc2NzY1NCcmJyYTBwYiLwEmNjsBETQ2OwEyFhURMzIWAe52Z2Q7PT07ZGd2fGpmOz4+O2ZpIXYOKA52Dg0XXQsHJgcLXRcNA7M+O2ZqfHZnZDs9PTtkZ3Z9aWY7Pv3wmhISmhIaARcICwsI/ukaAAMAAAAAA+UD5QAXACMALAAAASIHBgcGFRQXFhcWMzI3Njc2NTQnJicmAxQrASI1AzQ7ATIHJyImNDYyFhQGAe6Ecm9BRERBb3KEiXZxQkREQnF1aQIxAwgCQgMBIxIZGSQZGQPkREJxdomEcm9BRERBb3KEinVxQkT9HQICAWICAjEZIxkZIxkAAAAAAgAAAAADsQPkABkALgAAAQYHBgc2BREUFxYXFhc2NzY3NjURJBcmJyYTAQYvASY/ATYyHwEWNjclNjIfARYB9VVVQk+v/tFHPmxebGxdbT1I/tGvT0JVo/7VBASKAwMSAQUBcQEFAgESAgUBEQQD4xMYEhk3YP6sjnVlSD8cHD9IZXWOAVRgNxkSGP62/tkDA48EBBkCAVYCAQHlAQIQBAAAAAADAAAAAAOxA+QAGwAqADMAAAEGBwYHBgcGNxEUFxYXFhc2NzY3NjURJBcmJyYHMzIWFQMUBisBIicDNDYTIiY0NjIWFAYB9UFBODssO38gRz5sXmxsXW09SP7YqFBBVW80BAYMAwImBQELBh4PFhYeFRUD5A8SDhIOEikK/q2PdWRJPh0dPklkdY8BU141GRIY/AYE/sYCAwUBOgQG/kAVHxUVHxUAAAACAAAAAAPkA+QAFwAtAAABIgcGBwYVFBcWFxYzMjc2NzY1NCcmJyYTAQYiLwEmPwE2Mh8BFjI3ATYyHwEWAe6Ecm9BQ0NCbnODiXVxQkREQnF1kf6gAQUBowMDFgEFAYUCBQEBQwIFARUEA+NEQnF1iYNzbkJDQ0FvcoSJdXFCRP6j/qUBAagEBR4CAWYBAQENAgIVBAAAAAQAAAAAA68DrQAUACkAPwBDAAABIgcGBwYUFxYXFjI3Njc2NCcmJyYDIicmJyY0NzY3NjIXFhcWFAcGBwYTBQ4BLwEmBg8BBhYfARYyNwE+ASYiFzAfAQH1eGdkOzw8O2Rn8GZkOzw8O2RmeG5eWzY3NzZbXtteWzY3NzZbXmn+9gYSBmAGDwUDBQEGfQUQBgElBQELEBUBAQOtPDtkZ/BnYzs8PDtjZ/BnZDs8/K83NVte215cNTc3NVxe215bNTcCJt0FAQVJBQIGBAcRBoAGBQEhBQ8LBAEBAAABAAAAAAO7AzoAFwAAEy4BPwE+AR8BFjY3ATYWFycWFAcBBiInPQoGBwUHGgzLDCELAh0LHwsNCgr9uQoeCgGzCyEOCw0HCZMJAQoBvgkCCg0LHQv9sQsKAAAAAAIAAAAAA+UD5gAXACwAAAEiBwYHBhUUFxYXFjMyNzY3NjU0JyYnJhMHBi8BJicmNRM0NjsBMhYVExceAQHvhHJvQUNDQm5zg4l1cUJEREJxdVcQAwT6AwIEEAMCKwIDDsUCAQPlREJxdYmDc25CQ0NBb3KEiXVxQkT9VhwEAncCAgMGAXoCAwMC/q2FAgQAAAQAAAAAA68DrQADABgALQAzAAABMB8BAyIHBgcGFBcWFxYyNzY3NjQnJicmAyInJicmNDc2NzYyFxYXFhQHBgcGAyMVMzUjAuUBAfJ4Z2Q7PDw7ZGfwZmQ7PDw7ZGZ4bl5bNjc3Nlte215bNjc3NltemyT92QKDAQEBLDw7ZGfwZ2M7PDw7Y2fwZ2Q7PPyvNzVbXtteXDU3NzVcXtteWzU3AjH9JAAAAAMAAAAAA+QD5AAXACcAMAAAASIHBgcGFRQXFhcWMzI3Njc2NTQnJicmAzMyFhUDFAYrASImNQM0NhMiJjQ2MhYUBgHuhHJvQUNDQm5zg4l1cUJEREJxdZ42BAYMAwInAwMMBh8PFhYeFhYD40RCcXWJg3NuQkNDQW9yhIl1cUJE/vYGBf7AAgMDAgFABQb+NhYfFhYfFgAABAAAAAADwAPAAAgAEgAoAD0AAAEyNjQmIgYUFhcjFTMRIxUzNSMDIgcGBwYVFBYXFjMyNzY3NjU0Jy4BAyInJicmNDc2NzYyFxYXFhQHBgcGAfQYISEwISFRjzk5yTorhG5rPT99am+DdmhlPD4+PMyFbV5bNTc3NVte2l5bNTc3NVteAqAiLyIiLyI5Hf7EHBwCsT89a26Ed8w8Pj48ZWh2g29qffyjNzVbXtpeWzU3NzVbXtpeWzU3AAADAAAAAAOoA6gACwAgADUAAAEHJwcXBxc3FzcnNwMiBwYHBhQXFhcWMjc2NzY0JyYnJgMiJyYnJjQ3Njc2MhcWFxYUBwYHBgKOmpocmpocmpocmpq2dmZiOjs7OmJm7GZiOjs7OmJmdmtdWTQ2NjRZXdZdWTQ2NjRZXQKqmpocmpocmpocmpoBGTs6YmbsZmI6Ozs6YmbsZmI6O/zCNjRZXdZdWTQ2NjRZXdZdWTQ2AAMAAAAAA+kD6gAaAC8AMAAAAQYHBiMiJyYnJjQ3Njc2MhcWFxYVFAcGBwEHATI3Njc2NCcmJyYiBwYHBhQXFhcWMwKONUBCR21dWjU3NzVaXdpdWzU2GBcrASM5/eBXS0grKysrSEuuSkkqLCwqSUpXASMrFxg2NVtd2l1aNTc3NVpdbUdCQDX+3jkBGSsrSEuuSkkqLCwqSUquS0grKwAC//8AAAPoA+gAFAAwAAABIgcGBwYQFxYXFiA3Njc2ECcmJyYTFg4BIi8BBwYuATQ/AScmPgEWHwE3Nh4BBg8BAfSIdHFDRERDcXQBEHRxQ0REQ3F0SQoBFBsKoqgKGxMKqKIKARQbCqKoChsUAQqoA+hEQ3F0/vB0cUNERENxdAEQdHFDRP1jChsTCqiiCgEUGwqiqAobFAEKqKIKARQbCqIAAAIAAAAAA+QD5AAXADQAAAEiBwYHBhUUFxYXFjMyNzY3NjU0JyYnJhMUBiMFFxYUDwEGLwEuAT8BNh8BFhQPAQUyFh0BAe6Ecm9BQ0NCbnODiXVxQkREQnF1fwQC/pGDAQEVAwTsAgEC7AQEFAIBhAFwAgMD40RCcXWJg3NuQkNDQW9yhIl1cUJE/fYCAwuVAgQCFAQE0AIFAtEEBBQCBQGVCwMDJwAAAAUAAAAAA9QD0wAjACcANwBHAEgAAAERFAYjISImNREjIiY9ATQ2MyE1NDYzITIWHQEhMhYdARQGIyERIREHIgYVERQWOwEyNjURNCYjISIGFREUFjsBMjY1ETQmKwEDeyYb/XYbJkMJDQ0JAQYZEgEvExkBBgkNDQn9CQJc0QkNDQktCQ0NCf7sCQ0NCS0JDQ0JLQMi/TQbJiYbAswMCiwJDS4SGRkSLg0JLAoM/UwCtGsNCf5NCQ0NCQGzCQ0NCf5NCQ0NCQGzCQ0AAAAAEADGAAEAAAAAAAEABAAAAAEAAAAAAAIABwAEAAEAAAAAAAMABAALAAEAAAAAAAQABAAPAAEAAAAAAAUACwATAAEAAAAAAAYABAAeAAEAAAAAAAoAKwAiAAEAAAAAAAsAEwBNAAMAAQQJAAEACABgAAMAAQQJAAIADgBoAAMAAQQJAAMACAB2AAMAAQQJAAQACAB+AAMAAQQJAAUAFgCGAAMAAQQJAAYACACcAAMAAQQJAAoAVgCkAAMAAQQJAAsAJgD6d2V1aVJlZ3VsYXJ3ZXVpd2V1aVZlcnNpb24gMS4wd2V1aUdlbmVyYXRlZCBieSBzdmcydHRmIGZyb20gRm9udGVsbG8gcHJvamVjdC5odHRwOi8vZm9udGVsbG8uY29tAHcAZQB1AGkAUgBlAGcAdQBsAGEAcgB3AGUAdQBpAHcAZQB1AGkAVgBlAHIAcwBpAG8AbgAgADEALgAwAHcAZQB1AGkARwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABzAHYAZwAyAHQAdABmACAAZgByAG8AbQAgAEYAbwBuAHQAZQBsAGwAbwAgAHAAcgBvAGoAZQBjAHQALgBoAHQAdABwADoALwAvAGYAbwBuAHQAZQBsAGwAbwAuAGMAbwBtAAAAAgAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAQIBAwEEAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgETAAZjaXJjbGUIZG93bmxvYWQEaW5mbwxzYWZlX3N1Y2Nlc3MJc2FmZV93YXJuB3N1Y2Nlc3MOc3VjY2Vzcy1jaXJjbGURc3VjY2Vzcy1uby1jaXJjbGUHd2FpdGluZw53YWl0aW5nLWNpcmNsZQR3YXJuC2luZm8tY2lyY2xlBmNhbmNlbAZzZWFyY2gFY2xlYXIEYmFjawZkZWxldGUAAAAA') format('truetype');\n}\n[class^=\"weui-icon-\"],\n[class*=\" weui-icon-\"] {\n  display: inline-block;\n  vertical-align: middle;\n  font: normal normal normal 14px/1 \"weui\";\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n}\n[class^=\"weui-icon-\"]:before,\n[class*=\" weui-icon-\"]:before {\n  display: inline-block;\n  margin-left: .2em;\n  margin-right: .2em;\n}\n.weui-icon-circle:before {\n  content: \"\\EA01\";\n}\n/* '' */\n.weui-icon-download:before {\n  content: \"\\EA02\";\n}\n/* '' */\n.weui-icon-info:before {\n  content: \"\\EA03\";\n}\n/* '' */\n.weui-icon-safe-success:before {\n  content: \"\\EA04\";\n}\n/* '' */\n.weui-icon-safe-warn:before {\n  content: \"\\EA05\";\n}\n/* '' */\n.weui-icon-success:before {\n  content: \"\\EA06\";\n}\n/* '' */\n.weui-icon-success-circle:before {\n  content: \"\\EA07\";\n}\n/* '' */\n.weui-icon-success-no-circle:before {\n  content: \"\\EA08\";\n}\n/* '' */\n.weui-icon-waiting:before {\n  content: \"\\EA09\";\n}\n/* '' */\n.weui-icon-waiting-circle:before {\n  content: \"\\EA0A\";\n}\n/* '' */\n.weui-icon-warn:before {\n  content: \"\\EA0B\";\n}\n/* '' */\n.weui-icon-info-circle:before {\n  content: \"\\EA0C\";\n}\n/* '' */\n.weui-icon-cancel:before {\n  content: \"\\EA0D\";\n}\n/* '' */\n.weui-icon-search:before {\n  content: \"\\EA0E\";\n}\n/* '' */\n.weui-icon-clear:before {\n  content: \"\\EA0F\";\n}\n/* '' */\n.weui-icon-back:before {\n  content: \"\\EA10\";\n}\n/* '' */\n.weui-icon-delete:before {\n  content: \"\\EA11\";\n}\n/* '' */\n/**\n* actionsheet\n*/\n/**\n* datetime\n*/\n/**\n* tabbar\n*/\n/**\n* tab\n*/\n/**\n* dialog\n*/\n/**\n* x-number\n*/\n/**\n* checkbox\n*/\n/**\n* check-icon\n*/\n/**\n* Cell\n*/\n/**\n* Mask\n*/\n/**\n* Range\n*/\n/**\n* Tabbar\n*/\n/**\n* Header\n*/\n/**\n* Timeline\n*/\n/**\n* Switch\n*/\n/**\n* Button\n*/\n/**\n* swipeout\n*/\n/**\n* Cell\n*/\n/**\n* Badge\n*/\n/**\n* Popover\n*/\n/**\n* Button tab\n*/\n/* alias */\n/**\n* Swiper\n*/\n/**\n* checklist\n*/\n/**\n* popup-picker\n*/\n/**\n* popup\n*/\n/**\n* popup-header\n*/\n/**\n* form-preview\n*/\n/**\n* load-more\n*/\n/**\n* sticky\n*/\n/**\n* group\n*/\n/**\n* toast\n*/\n/**\n* icon\n*/\n/**\n* calendar\n*/\n/**\n* week-calendar\n*/\n/**\n* search\n*/\n/**\n* radio\n*/\n/**\n* loadmore\n*/\n[class^=\"weui-icon_\"]:before,\n[class*=\" weui-icon_\"]:before {\n  margin: 0;\n}\n.weui-icon-success {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-waiting {\n  font-size: 23px;\n  color: #10AEFF;\n}\n.weui-icon-warn {\n  font-size: 23px;\n  color: #F43530;\n}\n.weui-icon-info {\n  font-size: 23px;\n  color: #10AEFF;\n}\n.weui-icon-success-circle {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-success-no-circle {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-waiting-circle {\n  font-size: 23px;\n  color: #10AEFF;\n}\n.weui-icon-circle {\n  font-size: 23px;\n  color: #C9C9C9;\n}\n.weui-icon-download {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-info-circle {\n  font-size: 23px;\n  color: #09BB07;\n}\n.weui-icon-safe-success {\n  color: #09BB07;\n}\n.weui-icon-safe-warn {\n  color: #FFBE00;\n}\n.weui-icon-cancel {\n  color: #F43530;\n  font-size: 22px;\n}\n.weui-icon-search {\n  color: #B2B2B2;\n  font-size: 14px;\n}\n.weui-icon-clear {\n  color: #B2B2B2;\n  font-size: 14px;\n}\n.weui-icon-delete.weui-icon_gallery-delete {\n  color: #FFFFFF;\n  font-size: 22px;\n}\n.weui-icon_msg {\n  font-size: 93px;\n}\n.weui-icon_msg.weui-icon-warn {\n  color: #F76260;\n}\n.weui-icon_msg-primary {\n  font-size: 93px;\n}\n.weui-icon_msg-primary.weui-icon-warn {\n  color: #FFBE00;\n}\n/**\nfollowing styles will be removed after v3.0.0\n*/\n.icon-big:before {\n  font-size: 93px;\n}\n", ""]);

// exports


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//

exports.default = {
  name: 'icon',
  props: {
    type: String,
    isMsg: Boolean
  },
  computed: {
    className: function className() {
      // compatible with old type param
      return 'weui-icon weui_icon_' + this.type + ' weui-icon-' + this.type.replace(/_/g, '-');
    }
  }
};

/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('i', {
    class: [_vm.className, _vm.isMsg ? 'weui-icon_msg' : '']
  })
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d7345cfa", module.exports)
  }
}

/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vux-check-icon",
    on: {
      "click": _vm.updateValue
    }
  }, [_c('icon', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type === 'default' && _vm.value),
      expression: "type === 'default' && value"
    }],
    attrs: {
      "type": "success"
    }
  }), _vm._v(" "), _c('icon', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type === 'plain' && _vm.value),
      expression: "type === 'plain' && value"
    }],
    attrs: {
      "type": "success_circle"
    }
  }), _vm._v(" "), _c('icon', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.value),
      expression: "!value"
    }],
    attrs: {
      "type": "circle"
    }
  }), _vm._v(" "), _c('span', [_vm._t("default")], 2)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-751809a8", module.exports)
  }
}

/***/ })
]);