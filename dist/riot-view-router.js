(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _router = __webpack_require__(1);

var Router = function Router(options, states) {
  return {
    $router: new _router.Router(options, states)
  };
};

exports.Router = Router;
module.exports = Router;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _package = __webpack_require__(2);

var _constants = __webpack_require__(3);

var _utils = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents the riot-view-router mixin.
 * @constructor
 * @param (object) options - Router options.
 * @param (array) states - States for router to read from.
 */
var Router = exports.Router = function () {
  function Router(options, states) {
    _classCallCheck(this, Router);

    var self = this;

    self.version = _package.version;
    self.$constants = _constants.Constants;
    self.$utils = new _utils.Utils(self);

    Object.defineProperty(self, 'location', {
      get: function get() {
        return window.location.hash;
      },
      set: function set(location) {
        window.location.hash = location;
      }
    });

    self.running = false;

    var requiredOptions = ['defaultState'];
    var optionalDefaultOptions = ['debugging', 'fallbackState', 'onBeforeStateChange', 'onStateChange'];
    var acceptedOptions = requiredOptions.concat(optionalDefaultOptions);
    for (var option in options) {
      if (acceptedOptions.indexOf(option) == -1) {
        throw Error('Unknown option "' + option + '" is not supported');
      }
    } // # validate router optionsu

    self = Object.assign(self, options);
    self.debugging = self.debugging || false;

    var stateProperties = ['name', 'route', 'tag'];
    states = !Array.isArray(states) ? [Object.create(state)] : states.map(function (state) {
      return Object.create(state);
    });
    states.forEach(function (state) {
      if (!state.name.match(self.$constants.regex.stateName)) {
        throw Error('Invalid state name "' + state.name + '",        state names must be a valid alphanumeric string.');
      }
    });
    stateProperties.forEach(function (prop) {
      states.forEach(function (state) {
        if (!state[prop]) {
          throw ReferenceError('Required state option "' + prop + '" not specified');
        }
      });
    }); // # validate state options
    states.forEach(function (item) {
      item.route = self.$utils.splitRoute(item.route);
    }); // # get route pattern
    self.states = states;

    if (!self.defaultState) {
      throw ReferenceError('Default state must be specified');
    } else {
      if (self.defaultState.indexOf(':') > -1) {
        throw Error('Default state route cannot take variable parameters');
      }
      if (!self.$utils.stateByName(self.defaultState)) {
        throw Error('State "' + self.defaultState + '" not found in specified states');
      }
    }

    if (self.fallbackState) {
      if (!self.$utils.stateByName(self.fallbackState)) {
        throw Error('Fallback state "' + self.fallbackState + '" not found in specified states');
      }
    } else {
      if (self.debugging) {
        console.warn('Fallback state not specified, defaulting to "' + self.defaultState + '"');
      }
      self.fallbackState = self.defaultState;
    }

    if (self.marker) {
      if (!self.marker.match(self.$constants.regex.marker)) {
        if (debugging) {
          console.warn('Marker "' + self.marker + '" contains unsupported characters');
          console.warn('Defaulting to "' + self.$constants.defaults.marker + '"');
        }
        self.marker = self.$constants.defaults.marker;
      }
    } else {
      self.marker = self.$constants.defaults.marker;
    }
    self.marker = self.marker || self.$constants.defaults.marker;
  }

  /**
   * Used to navigate with hash pattern.
   * @param (string) route - Route to relocate to.
   */


  _createClass(Router, [{
    key: 'navigate',
    value: function navigate(route) {
      this.location = self.$constants.hash + route;
    }

    /**
     * Used to change states.
     * @param (string) name - Name of state to transition to.
     */

  }, {
    key: 'pushState',
    value: function pushState(name) {
      var self = this;

      var state = self.$utils.stateByName(name);
      var location = self.location.split(self.$constants.hash)[1];

      if (location !== state.route.route) {
        if (!state.route.variables.length) {
          self.navigate(state.route.route);
          return; // # assume function will be retriggered
        } else {
          if (self.debugging) {
            console.warn('State "' + name + '" does not match current route.');
            console.warn('Could not re-route due to route variables.');
          }
        }
      }

      if (self.onBeforeStateChange) {
        self.onBeforeStateChange(state);
      }
      if (self.$state && self.$state.onLeave) {
        self.$state.onLeave(state);
      } // # call onLeave, pass old state
      self.transition(state);
      if (self.onStateChange) {
        self.onStateChange(state);
      }
      if (state.onEnter) {
        state.onEnter(state);
      } // # call onEnter, pass new state
      self.$state = state;
    }

    /**
     * Used to mount state.
     * @param (object) state - State object for mounting.
     */

  }, {
    key: 'transition',
    value: function transition(state) {
      var self = this;

      var variables = self.$utils.extractRouteVars(state);
      if (self.$state) {
        var tag = riot.util.vdom.find(function (tag) {
          return tag.root.localName == self.$state.tag;
        });
        if (!tag) throw Error('Could not find a matching tag to unmount');
        tag.unmount();
      }
      var node = document.createElement(state.tag);
      var opts = {};
      variables.forEach(function (variable) {
        opts[variable.name] = variable.value;
      }); // # add props
      self.context.appendChild(node);
      riot.mount(state.tag, opts);
      if (state.title) {
        var title = state.title;
        variables.forEach(function (variable) {
          return title = title.replace('<' + variable.name + '>', variable.value);
        });
        document.title = title;
      }
    }

    /** Used to initialize the router and listeners. */

  }, {
    key: 'start',
    value: function start() {
      var self = this;

      if (!self.running) {
        if (!self.location) {
          window.location.hash = '' + self.$constants.hash + self.$utils.stateByName(self.defaultState).route.route;
        } // # route to default state
        self.context_id = '$' + new Date().getTime().toString();
        window[self.context_id] = window.setInterval(function () {
          var context = document.querySelector(self.marker) || document.querySelector('[' + self.marker + ']');
          if (context) {
            self.context = context;
            self.pushState(self.$utils.stateByRoute().name); // # route to initial state
            window.onhashchange = function () {
              self.pushState(self.$utils.stateByRoute().name); // # update state
            }; // # create listener for route changes
            window.clearInterval(window[self.context_id]);
          }
        }, 250); // # search for view context
      } else {
        if (self.debugging) {
          console.warn('Router was already running');
        }
      }
    }

    /** Used to stop the router and listeners. */

  }, {
    key: 'stop',
    value: function stop() {
      var self = this;

      if (self.running) {
        self.running = false;
        delete window.onhashchange;
      } else {
        if (self.debugging) {
          console.warn('Router was not running');
        }
      }
    }
  }]);

  return Router;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {"name":"riot-view-router","version":"0.0.1","description":"Lightweight, extensive riot.js router for tag views.","main":"dist/riot-view-router.js","scripts":{"build":"node_modules/.bin/cross-env NODE_ENV=production node_modules/.bin/webpack --config build/webpack.conf.js","build:dev":"node_modules/.bin/webpack --config build/webpack.conf.js","lint":"node_modules/.bin/eslint src/**.js","test:unit":"node_modules/.bin/jasmine --config=test/jasmine.unit.json","test":"npm run lint && npm run test:unit"},"repository":{"type":"git","url":"git+https://github.com/neetjn/riot-view-router.git"},"keywords":["riot","riot.js","javascript","route","tag"],"author":"John Nolette","license":"MIT","bugs":{"url":"https://github.com/neetjn/riot-view-router/issues"},"homepage":"https://github.com/neetjn/riot-view-router#readme","devDependencies":{"babel-core":"^6.26.0","babel-eslint":"^7.2.3","babel-loader":"^7.1.2","babel-preset-env":"^1.6.1","cross-env":"^5.1.0","eslint":"^4.9.0","eslint-plugin-riot":"^0.1.7","jasmine":"^2.8.0","random-js":"1.0.8","riot":"^3.7.3","webpack":"^3.8.1"},"dependencies":{}}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Constants = exports.Constants = {
  defaults: {
    hash: '#!',
    marker: 'r-view',
    anchorMarker: 'r-sref'
  },
  regex: {
    marker: /[a-zA-Z\-]*/g,
    stateName: /[a-zA-Z0-9]/g,
    routeFormat: /^\/(?::?[a-zA-Z0-9]+\/?)*$/g,
    routeVariable: /(:[a-zA-Z]*)/g
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = exports.Utils = function () {

  /**
   * Utilities for the riot-view-router mixin.
   * @param (Router) router - Router for utilities to reference
   */
  function Utils(router) {
    _classCallCheck(this, Utils);

    this.$router = router;
  }

  /**
   * Used to search for states by their name.
   * @param (string) name - Name of state to search for.
   */


  _createClass(Utils, [{
    key: 'stateByName',
    value: function stateByName(name) {
      var self = this.$router;
      return self.states.find(function (state) {
        return name == state.name;
      });
    }

    /**
     * Used for extracting route patterns.
     * @param (string) route - Route from state.
     */

  }, {
    key: 'splitRoute',
    value: function splitRoute(route) {
      var self = this.$router;

      if (!route.match(self.$constants.regex.routeFormat)) {
        throw Error('Route "' + route + '" did not match expected route format');
      }
      var pattern = route.split('/').slice(1);
      var variables = pattern.filter(function (item) {
        return item.match(self.$constants.regex.routeVariable);
      }).map(function (item) {
        return {
          name: item.split('').slice(1).join(''),
          position: pattern.indexOf(item)
        };
      });
      variables.forEach(function (item) {
        if (variables.filter(function (_item) {
          return item;
        }).length > 1) {
          throw Error('Found duplicate route variable pattern\n\t "' + route + '"');
        }
      });
      return {
        route: route,
        pattern: pattern,
        variables: variables
      };
    }

    /** Used to search for a state by your current route. */

  }, {
    key: 'stateByRoute',
    value: function stateByRoute() {
      var self = this.$router;

      var stubs = self.location.split(self.$constants.hash);
      if (stubs.length > 1) {
        stubs = stubs[1].split('/').slice(1);
      } else {
        stubs = ["/"];
      }
      var state = self.states.find(function (state) {
        var route = state.route;
        if (stubs.length == route.pattern.length) {
          var _loop = function _loop(stub) {
            if (stubs[stub] !== route.pattern[stub] && route.pattern[stub] !== '*') {
              if (!route.variables.find(function (variable) {
                return variable.position == stub;
              })) {
                return {
                  v: false
                };
              }
            }
          };

          for (var stub in stubs) {
            var _ret = _loop(stub);

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
          return true;
        }
      });

      if (!state) {
        if (self.debugging) {
          console.warn('Route was not matched, defaulting to fallback state');
        }

        return this.stateByName(self.fallbackState);
      }

      return state;
    }

    /**
     * Used to extract route variables.
     * @param (object) state - State object for variable matching.
     */

  }, {
    key: 'extractRouteVars',
    value: function extractRouteVars(state) {
      var self = this.$router;

      var stubs = self.location.split(self.$constants.hash);
      if (stubs.length > 1) {
        stubs = stubs[1].split('/').slice(1);
      }
      var variables = state.route.variables;
      variables.forEach(function (variable) {
        variable.value = stubs[variable.position];
      });
      return variables;
    }
  }]);

  return Utils;
}();

/***/ })
/******/ ]);
});