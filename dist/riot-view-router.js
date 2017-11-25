(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Router", [], factory);
	else if(typeof exports === 'object')
		exports["Router"] = factory();
	else
		root["Router"] = factory();
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


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = __webpack_require__(1);

exports.default = {
  install: function install(_riot, options, states) {
    var router = new _core.Router(_riot, options, states);
    _riot.mixin({ router: router });
    return router;
  }
};
module.exports = exports['default'];

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

var _logger = __webpack_require__(4);

var _tools = __webpack_require__(5);

var _utils = __webpack_require__(6);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = exports.Router = function () {

  /**
   * Represents the riot-view-router mixin.
   * @constructor
   * @param {riot} _riot - Riot instance to target.
   * @param {object} options - Router options.
   * @param {array} states - States for router to read from.
   * @returns {Router}
   */
  function Router(_riot, options, states) {
    _classCallCheck(this, Router);

    var self = this;

    self.version = _package.version;
    self.$constants = _constants.Constants;
    self.$riot = _riot;
    self.$logger = new _logger.Logger(self);
    self.$tools = new _tools.Tools(self);
    self.$utils = new _utils.Utils(self);
    self.$events = {};

    Object.defineProperty(self, 'location', {
      get: function get() {
        return {
          hash: window.location.hash,
          href: window.location.href
        };
      },
      set: function set(location) {
        window.history.pushState(null, null, location);
      }
    });

    self.running = false;

    var requiredOptions = ['defaultState'];
    var optionalOptions = ['debugging', 'href', 'fallbackState', 'titleRoot'];
    var acceptedOptions = requiredOptions.concat(optionalOptions);
    for (var option in options) {
      if (acceptedOptions.indexOf(option) == -1) throw Error('Unknown option "' + option + '" is not supported');
    } // # validate router optionsu

    self = Object.assign(self, options);
    self.debugging = self.debugging || false;

    if (self.href) if (self.location.href.indexOf(self.href) == -1) throw Error('Defined href not found within location context');

    self.href = self.href || self.location.href;
    if (!self.href.endsWith('/')) self.href = self.href + '/';

    var stateProperties = ['name', 'route', 'tag'];
    states = !Array.isArray(states) ? [Object.assign({}, state)] : states.map(function (state) {
      return Object.assign({}, state);
    });
    states.forEach(function (state) {
      if (!state.name.match(self.$constants.regex.stateName)) {
        throw Error('Invalid state name "' + state.name + '",        state names must be a valid alphanumeric string.');
      }
    });
    stateProperties.forEach(function (prop) {
      states.forEach(function (state) {
        if (!state[prop]) throw ReferenceError('Required state option "' + prop + '" not specified');
      });
    }); // # validate state options
    states.forEach(function (item) {
      item.route = self.$utils.splitRoute(item.route);
    }); // # get route pattern
    self.states = states;

    if (!self.defaultState) throw ReferenceError('Default state must be specified');else {
      if (self.defaultState.indexOf(':') > -1) throw Error('Default state route cannot take variable parameters');

      if (!self.$utils.stateByName(self.defaultState)) throw Error('State "' + self.defaultState + '" not found in specified states');
    }

    if (self.fallbackState) {
      if (!self.$utils.stateByName(self.fallbackState)) throw Error('Fallback state "' + self.fallbackState + '" not found in specified states');
    } else {
      self.$logger.warn('Fallback state not specified, defaulting to "' + self.defaultState + '"');
      self.fallbackState = self.defaultState;
    }

    if (self.marker) {
      if (!self.marker.match(self.$constants.regex.marker)) {
        self.$logger.warn('Marker "' + self.marker + '" contains unsupported characters');
        self.$logger.warn('Defaulting to "' + self.$constants.defaults.marker + '"');
        self.marker = self.$constants.defaults.marker;
      }
    } else {
      self.marker = self.$constants.defaults.marker;
    }
    self.marker = self.marker || self.$constants.defaults.marker;
  }

  /**
   * Used to navigate with hash pattern.
   * @param {string} route - Route to relocate to.
   * @param {boolean} push - Push state after navigation.
   * @returns {Promise}
   */


  _createClass(Router, [{
    key: 'navigate',
    value: function navigate(route, skipPush) {
      var self = this;

      return new Promise(function (resolve, reject) {
        if (!self.running) {
          self.$logger.warn('(navigate) Router has not yet been started');
          return reject();
        }

        self.location = self.href + self.$constants.defaults.hash + route;
        var route_check = setInterval(function () {
          if (self.location.hash == self.$constants.defaults.hash + route) {
            window.clearInterval(route_check);
            if (!skipPush) self.push().then(function () {
              return self._dispatch('navigation', { route: route }).then(resolve).catch(resolve);
            });else self._dispatch('navigation', { route: route }).then(resolve).catch(resolve);
          }
        }, self.$constants.intervals.navigate);
        setTimeout(reject, self.$constants.defaults.timeout);
      });
    }

    /**
     * Used to change states.
     * @param {string} name - Name of state to transition to.
     * @param {object} opts - Arguments to pass to mounted tag.
     * @returns {Promise}
     */

  }, {
    key: 'push',
    value: function push(name, opts) {
      var self = this;

      return new Promise(function (resolve) {
        if (!self.running) {
          self.$logger.error('(push) Router has not yet been started');
          return reject();
        }

        if (!name) {
          var state = self.$utils.stateByRoute();
          opts = self.$utils.extractRouteVars(state);
        } else var state = self.$utils.stateByName(name);

        var location = self.location.hash.split(self.$constants.defaults.hash)[1];

        if (location !== state.route.route) {
          if (!state.route.variables.length) {
            self.navigate(state.route.route);
            return resolve(); // # assume function will be retriggered
          } else {
            self.$logger.warn('(push) State does not match current route.');
            self.$logger.warn('(push) Could not re-route due to route variables.');
          }
        }

        if (self.$state && self.$state.onLeave) self.$state.onLeave(state); // # call onLeave, pass old state

        self.$tools.transition(state, opts);

        if (state.onEnter) state.onEnter(state); // # call onEnter, pass new state

        self.$state = state;
        self._dispatch('push').then(resolve).catch(resolve);
      });
    }

    /**
     * Used to initialize the router and listeners.
     * @returns {Promise}
     */

  }, {
    key: 'start',
    value: function start() {
      var self = this;

      return new Promise(function (resolve, reject) {
        if (!self.running) {
          var _start = function _start() {
            var view_check = window.setInterval(function () {
              var context = document.querySelector(self.marker) || document.querySelector('[' + self.marker + ']');
              if (context) {
                self.context = context;
                self.push(); // # route to initial state
                window.onhashchange = function () {
                  return self.push();
                };
                window.clearInterval(view_check);
                self._dispatch('start').then(resolve).catch(resolve);
              }
            }, self.$constants.intervals.start); // # search for view context
            setTimeout(reject, self.$constants.defaults.timeout);
          };

          self.running = true;

          if (self.location.hash.split(self.$constants.defaults.hash).length !== 2) {
            self.navigate(self.$utils.stateByName(self.defaultState).route.route, true).then(_start);
          } else _start();
        } else {
          self.$logger.error('(start) Router already running');
          reject();
        }
      });
    }

    /**
     * Used to stop the router and listeners.
     * @returns {Promise}
     */

  }, {
    key: 'stop',
    value: function stop() {
      var self = this;

      return new Promise(function (resolve, reject) {
        if (self.running) {
          self.running = false;
          delete window.onhashchange;
          self._dispatch('stop').then(resolve).catch(resolve);
        } else {
          self.$logger.error('(stop) Router was not running');
          reject();
        }
      });
    }

    /**
     * Used to register router specific events.
     * @param {string} event - Name of event to register.
     * @param {function} handler - Function to execute on listener.
     * @returns {Promise}
     */

  }, {
    key: 'on',
    value: function on(event, handler) {
      var self = this;

      return new Promise(function (resolve, reject) {
        if (!event || self.$constants.events.supported.indexOf(event) < -1) {
          self.$logger.error('(on) "' + event + '" is not a supported event');
          reject();
        } else {
          self.$events[event] = handler;
          resolve();
        }
      });
    }

    /**
     * Used to dispatch router specific events.
     * @param {string} event - Event to dispatch.
     * @param {object} params - Parameters to pass to event handler.
     * @returns {Promise}
     */

  }, {
    key: '_dispatch',
    value: function _dispatch(event, params) {
      var self = this;

      return new Promise(function (resolve) {
        if (!event || self.$constants.events.supported.indexOf(event) < -1) {
          self.$logger.error('(dispatch) "' + event + '" is not a supported event');
          reject();
        }
        if (typeof self.$events[event] == 'function') resolve(self.$events[event](params));else reject();
      });
    }
  }]);

  return Router;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {"name":"riot-view-router","version":"0.0.4","description":"Lightweight, extensive riot.js router for tag views.","main":"dist/riot-view-router.js","scripts":{"build:prod":"node_modules/.bin/cross-env NODE_ENV=production node_modules/.bin/webpack --config build/webpack.conf.js","build:dev":"node_modules/.bin/webpack --config build/webpack.conf.js","build":"npm run build:dev && npm run build:prod","lint":"node_modules/.bin/eslint src/**.js","test:unit":"node_modules/.bin/jasmine test/unit/spec.*.js","test:e2e":"node_modules/.bin/karma start test/karma.conf.js","test":"npm run lint && npm run test:unit && npm run test:e2e"},"repository":{"type":"git","url":"git+https://github.com/neetjn/riot-view-router.git"},"keywords":["riot","riot.js","javascript","route","tag"],"author":"John Nolette","license":"MIT","bugs":{"url":"https://github.com/neetjn/riot-view-router/issues"},"homepage":"https://github.com/neetjn/riot-view-router#readme","devDependencies":{"babel-core":"^6.26.0","babel-eslint":"^7.2.3","babel-loader":"^7.1.2","babel-plugin-add-module-exports":"^0.2.1","babel-preset-env":"^1.6.1","cross-env":"^5.1.0","electron":"^1.7.9","eslint":"^4.9.0","eslint-plugin-riot":"^0.1.7","jasmine":"2.5.2","karma":"^1.7.1","karma-electron":"^5.2.1","karma-jasmine":"^1.1.0","karma-riot":"^2.0.0","random-js":"1.0.8","riot":"^3.7.3","webpack":"^3.8.1"},"dependencies":{}}

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
    anchorMarker: 'r-sref',
    timeout: 5000
  },
  regex: {
    marker: /[a-zA-Z\-]*/g,
    stateName: /[a-zA-Z0-9]/g,
    routeFormat: /^\/(?::?[a-zA-Z0-9]+\/?)*$/g,
    routeVariable: /(:(?!qargs)[a-z]*)/g
  },
  intervals: {
    start: 10,
    navigate: 50
  },
  events: {
    supported: ['start', 'stop', 'navigation', 'push', 'transition'],
    delay: 0
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = exports.Logger = function () {

  /**
   * Logging interface for the riot-view-router mixin.
   * @param {Router} router - Router for utilities to reference
   */
  function Logger(router) {
    _classCallCheck(this, Logger);

    this.$router = router;
    this.logs = [];

    Object.defineProperty(this, 'time', {
      get: function get() {
        return new Date().getTime();
      }
    });
  }

  /**
   * Format log for logstore
   * @param {string} message - message to log.
   * @param {int} timestamp - timestamp for log.
   */


  _createClass(Logger, [{
    key: '_format',
    value: function _format(message, timestamp) {
      return '[' + new Date(timestamp).toString() + ']: (riot-view-router) "' + message + '"';
    }

    /**
     * Fetch logs, allows for filtering by type.
     * @param {string} type - Log type to filter by.
     * @returns {Array}
     */

  }, {
    key: '$get',
    value: function $get(type) {
      return this.logs.filter(function (log) {
        return type ? log.type == type : true;
      });
    }

    /**
     * Pushes provided message to log store.
     * @param {string} message - Message to log.
     */

  }, {
    key: 'log',
    value: function log(message) {
      var timestamp = this.time;
      if (this.$router.debugging) console.log(this._format(message, timestamp));
      this.logs.push({ type: 'general', message: message, timestamp: timestamp });
    }

    /**
     * Pushes provided message to log store.
     * @param {string} message - Message to log.
     */

  }, {
    key: 'warn',
    value: function warn(message) {
      var timestamp = this.time;
      if (this.$router.debugging) console.warn(this._format(message, timestamp));
      this.logs.push({ type: 'warning', message: message, timestamp: timestamp });
    }

    /**
     * Pushes provided message to log store.
     * @param {string} message - Message to log.
     */

  }, {
    key: 'error',
    value: function error(message) {
      var timestamp = this.time;
      if (this.$router.debugging) console.error(this._format(message, timestamp));
      this.logs.push({ type: 'critical', message: message, timestamp: timestamp });
    }
  }]);

  return Logger;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tools = exports.Tools = function () {

  /**
   * Tools for the riot-view-router mixin.
   * @param {Router} router - Router for utilities to reference
   */
  function Tools(router) {
    _classCallCheck(this, Tools);

    this.$router = router;
  }

  /**
   * Used to mount state.
   * @param {object} state - State object for mounting.
   * @param {array}
   */


  _createClass(Tools, [{
    key: 'transition',
    value: function transition(state, opts) {
      var self = this.$router;

      return new Promise(function (resolve) {
        if (self.$state) {
          var removable = riot.util.vdom.find(function (tag) {
            return tag.root.localName == self.$state.tag;
          });
          if (!removable) {
            self.$logger.error('(transition) Could not find a matching tag to unmount');
            reject();
          }
          removable.unmount();
        }
        var node = document.createElement(state.tag);
        self.context.appendChild(node);
        if (opts) {
          var parsed_opts = {};
          opts.forEach(function (opt) {
            parsed_opts[opt.name] = opt.value;
          }); // # add props
          parsed_opts.qargs = opts._query;
          var tag = self.$riot.mount(state.tag, parsed_opts);
          if (state.title) {
            var title = self.titleRoot ? self.titleRoot + ' - ' + state.title : state.title;
            opts.forEach(function (opt) {
              return title = title.replace('<' + opt.name + '>', opt.value);
            });
            document.title = title;
          }
        } else var tag = self.$riot.mount(state.tag);

        tag[0].on('updated', function () {
          if (self.running) {
            document.querySelectorAll('[' + self.$constants.defaults.anchorMarker + ']').forEach(function (el) {
              el.onclick = function () {
                self.navigate(el.getAttribute(self.$constants.defaults.anchorMarker));
              };
            });
          }
        }); // # observable for binding sref occurrences

        tag[0].update(); // # trigger sref binding

        self._dispatch('transition', { state: state }).then(resolve).catch(resolve);
      });
    }
  }]);

  return Tools;
}();

/***/ }),
/* 6 */
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
   * @param {Router} router - Router for utilities to reference
   */
  function Utils(router) {
    _classCallCheck(this, Utils);

    this.$router = router;
  }

  /**
   * Used to search for states by their name.
   * @param {string} name - Name of state to search for.
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
     * @param {string} route - Route from state.
     */

  }, {
    key: 'splitRoute',
    value: function splitRoute(route) {
      var self = this.$router;

      if (!route.match(self.$constants.regex.routeFormat)) throw Error('Route "' + route + '" did not match expected route format');

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
          return _item == item;
        }).length > 1) throw Error('Found duplicate route variable pattern\n\t "' + route + '"');
      });
      return {
        route: route,
        pattern: pattern,
        variables: variables
      };
    }

    /**
     * Used to search for a state by your current route.
     */

  }, {
    key: 'stateByRoute',
    value: function stateByRoute() {
      var self = this.$router;

      var stubs = self.location.hash.split(self.$constants.defaults.hash);
      if (stubs.length == 2) stubs = stubs.join('').split('?')[0].split('/').slice(1);else stubs = ['/'];

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
        self.$logger.warn('Route was not matched, defaulting to fallback state');
        return this.stateByName(self.fallbackState);
      }

      return state;
    }

    /**
     * Used to extract route variables.
     * @param {object} state - State object for variable matching.
     */

  }, {
    key: 'extractRouteVars',
    value: function extractRouteVars(state) {
      var self = this.$router;

      var variables = state.route.variables.map(function (v) {
        return Object.assign({}, v);
      });
      // # make a deep copy of state variables as to not pollute state
      var stubs = self.location.hash.split(self.$constants.defaults.hash);
      if (stubs.length == 2) {
        stubs = stubs.join('').split('?')[0].split('/').slice(1);
        // # remove query string from url
        variables.forEach(function (variable) {
          variable.value = stubs[variable.position];
        });
        var query = self.location.hash.split('?');
        if (query.length == 2) {
          variables._query = {};
          query[1].split('&').forEach(function (fragment) {
            fragment = fragment.split('=');
            variables._query[fragment[0]] = fragment[1];
          });
        }
        return variables;
      }

      return [];
    }
  }]);

  return Utils;
}();

/***/ })
/******/ ]);
});