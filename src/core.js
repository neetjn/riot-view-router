import { version } from '../package.json'
import { Constants } from './constants'
import { Logger } from './logger'
import { Tools } from './tools'
import { Utils } from './utils'

export class Router {

  /**
   * Represents the riot-view-router mixin.
   * @constructor
   * @param {object} options - Router options.
   * @param {array} states - States for router to read from.
   * @returns {Router}
   */
  constructor (options, states) {
    var self = this

    self.version = version
    self.$constants = Constants
    self.$logger = new Logger(self)
    self.$tools = new Tools(self)
    self.$utils = new Utils(self)
    self.$events = {}

    Object.defineProperty(self, 'location', {
      get: function() {
        return {
          hash: window.location.hash,
          href: window.location.href
        }
      },
      set: function(location) {
        window.history.pushState(null, null, location)
      }
    })

    self.running = false

    let requiredOptions = ['defaultState']
    let optionalDefaultOptions = ['debugging', 'href', 'fallbackState']
    let acceptedOptions = requiredOptions.concat(optionalDefaultOptions)
    for (let option in options) {
      if (acceptedOptions.indexOf(option) == -1)
        throw Error(`Unknown option "${option}" is not supported`)
    } // # validate router optionsu

    self = Object.assign(self, options)
    self.debugging = self.debugging || false

    if (self.href)
      if (self.location.href.indexOf(self.href) == -1)
        throw Error('Defined href not found within location context')

    self.href = self.href || self.location.href
    if (!self.href.endsWith('/'))
      self.href = self.href + '/'

    let stateProperties = ['name', 'route', 'tag']
    states = !Array.isArray(states) ? [Object.assign({}, state)] : states.map((state)=>Object.assign({}, state))
    states.forEach((state) => {
      if (!state.name.match(self.$constants.regex.stateName)) {
        throw Error(`Invalid state name "${state.name}",\
        state names must be a valid alphanumeric string.`)
      }
    })
    stateProperties.forEach((prop) => {
      states.forEach((state) => {
        if (!state[prop])
          throw ReferenceError(`Required state option "${prop}" not specified`)
      })
    }) // # validate state options
    states.forEach(function(item) {
      item.route = self.$utils.splitRoute(item.route)
    }) // # get route pattern
    self.states = states

    if (!self.defaultState)
      throw ReferenceError('Default state must be specified')
    else {
      if (self.defaultState.indexOf(':') > -1)
        throw Error('Default state route cannot take variable parameters')

      if (!self.$utils.stateByName(self.defaultState))
        throw Error(`State "${self.defaultState}" not found in specified states`)
    }

    if (self.fallbackState) {
      if (!self.$utils.stateByName(self.fallbackState))
        throw Error(`Fallback state "${self.fallbackState}" not found in specified states`)
    }
    else {
      self.$logger.warn(`Fallback state not specified, defaulting to "${self.defaultState}"`)
      self.fallbackState = self.defaultState
    }

    if (self.marker) {
      if (!self.marker.match(self.$constants.regex.marker)) {
        if (debugging) {
          self.$logger.warn(`Marker "${self.marker}" contains unsupported characters`)
          self.$logger.warn(`Defaulting to "${self.$constants.defaults.marker}"`)
        }
        self.marker = self.$constants.defaults.marker
      }
    }
    else {
      self.marker = self.$constants.defaults.marker
    }
    self.marker = self.marker || self.$constants.defaults.marker
  }

  /**
   * Used to navigate with hash pattern.
   * @param {string} route - Route to relocate to.
   * @param {boolean} push - Push state after navigation.
   * @returns {Promise}
   */
  navigate (route, skipPush) {
    var self = this

    return new Promise((resolve, reject) => {
      if (!self.running) {
        self.$logger.warn('(navigate) Router has not yet been started')
        return reject()
      }

      self.location = self.href + self.$constants.defaults.hash + route
      var route_check = setInterval(() => {
        if (self.location.hash == self.$constants.defaults.hash + route) {
          window.clearInterval(route_check)
          if (!skipPush)
            self.push().then(() => self._dispatch('navigation', { route }).then(resolve).catch(resolve))
          else
            self._dispatch('navigation', { route }).then(resolve).catch(resolve)
        }
      }, self.$constants.intervals.navigate)
      setTimeout(reject, self.$constants.defaults.timeout)
    })
  }

  /**
   * Used to change states.
   * @param {string} name - Name of state to transition to.
   * @param {object} opts - Arguments to pass to mounted tag.
   * @returns {Promise}
   */
  push (name, opts) {
    var self = this

    return new Promise((resolve) => {
      if (!self.running) {
        self.$logger.error('(push) Router has not yet been started')
        return reject()
      }

      if (!name) {
        var state = self.$utils.stateByRoute()
        opts = self.$utils.extractRouteVars(state)
      }
      else
        var state = self.$utils.stateByName(name)

      let location = self.location.hash.split(self.$constants.defaults.hash)[1]

      if (location !== state.route.route) {
        if (!state.route.variables.length) {
          self.navigate(state.route.route)
          return resolve() // # assume function will be retriggered
        }
        else {
          self.$logger.warn('(push) State does not match current route.')
          self.$logger.warn('(push) Could not re-route due to route variables.')
        }
      }

      if (self.$state && self.$state.onLeave)
        self.$state.onLeave(state) // # call onLeave, pass old state

      self.$tools.transition(state, opts)

      if (state.onEnter)
        state.onEnter(state) // # call onEnter, pass new state

      self.$state = state
      self._dispatch('push').then(resolve).catch(resolve)
    })
  }

  /**
   * Used to initialize the router and listeners.
   * @returns {Promise}
   */
  start () {
    var self = this

    return new Promise((resolve, reject) => {
      if (!self.running) {
        self.running = true

        function _start() {
          var view_check = window.setInterval(() => {
            let context = document.querySelector(self.marker) || document.querySelector(`[${self.marker}]`)
            if (context) {
              self.context = context
              self.push() // # route to initial state
              window.onhashchange = () => self.push()
              window.clearInterval(view_check)
              self._dispatch('start').then(resolve).catch(resolve)
            }
          }, self.$constants.intervals.start) // # search for view context
          setTimeout(reject, self.$constants.defaults.timeout)
        }

        if (self.location.hash.split(self.$constants.hash).length !== 2) {
          self.navigate(
            self.$utils.stateByName(
              self.defaultState
            ).route.route, true).then(_start)
        }
        else
          _start()
      }
      else {
        self.$logger.error('(start) Router already running')
        reject()
      }
    })
  }

  /**
   * Used to stop the router and listeners.
   * @returns {Promise}
   */
  stop () {
    var self = this

    return new Promise((resolve, reject) => {
      if (self.running) {
        self.running = false
        delete window.onhashchange
        self._dispatch('stop').then(resolve).catch(resolve)
      }
      else {
        self.$logger.error('(stop) Router was not running')
        reject()
      }
    })
  }

  /**
   * Used to register router specific events.
   * @param {string} event - Name of event to register.
   * @param {function} handler - Function to execute on listener.
   * @returns {Promise}
   */
  on (event, handler) {
    var self = this

    return new Promise((resolve, reject) => {
      if (!event || self.$constants.events.supported.indexOf(event) < -1) {
        self.$logger.error(`(on) "${event}" is not a supported event`)
        reject()
      }
      else
        self.$events[event] = handler
    })
  }

  /**
   * Used to dispatch router specific events.
   * @param {string} event - Event to dispatch.
   * @param {object} params - Parameters to pass to event handler.
   * @returns {Promise}
   */
  _dispatch (event, params) {
    var self = this

    return new Promise((resolve) => {
      if (!event || self.$constants.events.supported.indexOf(event) < -1) {
        self.$logger.error(`(dispatch) "${event}" is not a supported event`)
        reject()
      }
      if (typeof self.$events[event] == 'function')
        resolve(self.$events[event](params))
      else
        reject()
    })
  }

}
