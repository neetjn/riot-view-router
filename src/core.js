import { version } from '../package.json'
import { Constants } from './constants'
import { Logger } from './logger'
import { Tools } from './tools'
import { Utils } from './utils'

export class Router {

  /**
   * Represents the riot-view-router mixin.
   * @constructor
   * @param {riot} instance - Riot instance to target.
   * @param {object} settings - Router options.
   * @param {array} states - States for router to read from.
   * @returns {Router}
   */
  constructor (instance, settings, states) {
    var self = this

    self.constants = Constants
    self.version = version
    self.settings = {}
    self.events = {}

    self.$riot = instance
    self.$logger = new Logger(self)
    self.$tools = new Tools(self)
    self.$utils = new Utils(self)

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

    const requiredSettings = ['default']
    const optionalSettings = ['debugging', 'fallback', 'href', 'fragments', 'marker', 'titleRoot']
    const acceptedSettings = requiredSettings.concat(optionalSettings)
    for (const setting in settings) {
      if (acceptedSettings.indexOf(setting) === -1)
        throw Error(`Unknown setting "${setting}" is not supported`)
    } // # check for unaccepted settings
    requiredSettings.forEach(setting => {
      if (typeof settings[setting] === 'undefined')
        throw ReferenceError(`Required setting "${setting}" not specified`)
    }) // # check for required settings

    if (settings.default.indexOf(':') > -1)
      throw Error('Default state route cannot take variable parameters')

    for (const setting in self.settings) {
      const validator = self.constants.regex.settings[setting]
      if (validator && !setting.match(validator))
        throw Error(`Setting "${setting}" has an invalid value of "${settings[setting]}"`)
    }

    self.settings = Object.assign({}, settings)
    self.settings.debugging = self.settings.debugging || false
    self.settings.useFragments = self.settings.useFragments || true
    self.settings.marker = self.settings.marker || self.constants.defaults.marker

    if (self.settings.href)
      if (self.location.href.indexOf(self.settings.href) == -1)
        throw Error('Defined href not found within location context')

    self.settings.href = self.settings.href || self.location.href.split(self.constants.defaults.hash)[0]
    if (!self.settings.href.endsWith('/'))
      self.settings.href = `${self.settings.href}/`

    const stateProperties = ['name', 'route', 'tag']
    states = !Array.isArray(states) ? [Object.assign({}, state)] : states.map(state => Object.assign({}, state))
    stateProperties.forEach((prop) => {
      states.forEach((state) => {
        if (!state[prop])
          throw ReferenceError(`Required state option "${prop}" not specified`)
      })
    }) // # validate state properties
    states.forEach((state) => {
      for (const property in state) {
        const validator = self.constants.regex.state[property]
        if (validator && !state[property].match(validator))
          throw Error(`State "${state.name}" property "${property}" has an invalid value of "${state[property]}"`)
      }
    }) // # validate state property values
    states.forEach(function(item) {
      item.route = self.$utils.splitRoute(item.route)
    }) // # get route pattern
    self.states = states

    if (!self.$utils.stateByName(self.settings.default))
      throw Error(`State "${self.settings.default}" not found in specified states`)

    if (self.settings.fallback) {
      if (!self.$utils.stateByName(self.settings.fallback))
        throw Error(`Fallback state "${self.settings.fallback}" not found in specified states`)
    }
    else {
      self.$logger.warn(`Fallback state not specified, defaulting to "${self.settings.default}"`)
      self.settings.fallback = self.settings.default
    }
  }

  /**
   * Used to navigate with hash pattern.
   * @param {string} route - Route to relocate to.
   * @param {boolean} push - Push state after navigation.
   * @returns {Promise}
   */
  navigate (route, skipPush) {
    const self = this

    return new Promise((resolve, reject) => {
      if (!self.running) {
        self.$logger.warn('(navigate) Router has not yet been started')
        return reject()
      }

      self.location = self.settings.href + self.constants.defaults.hash + route
      var route_check = setInterval(() => {
        if (self.location.hash == self.constants.defaults.hash + route) {
          window.clearInterval(route_check)
          if (!skipPush)
            self.push().then(() => self._dispatch('navigation', { route }).then(resolve).catch(resolve))
          else
            self._dispatch('navigation', { route }).then(resolve).catch(resolve)
        }
      }, self.constants.intervals.navigate)
      setTimeout(reject, self.constants.defaults.timeout)
    })
  }

  /**
   * Used to change states.
   * @param {string} name - Name of state to transition to.
   * @param {object} opts - Arguments to pass to mounted tag.
   * @returns {Promise}
   */
  push (name, opts) {
    const self = this

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

      const location = self.location.hash.split(self.constants.defaults.hash)[1]

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
    const self = this

    return new Promise((resolve, reject) => {
      if (!self.running) {
        self.running = true

        function _start() {
          var view_check = window.setInterval(() => {
            const context = document.querySelector(self.settings.marker) || document.querySelector(`[${self.settings.marker}]`)
            if (context) {
              self.context = context
              self.push() // # route to initial state
              window.onhashchange = () => self.push()
              window.clearInterval(view_check)
              self._dispatch('start').then(resolve).catch(resolve)
            }
          }, self.constants.intervals.start) // # search for view context
          setTimeout(reject, self.constants.defaults.timeout)
        }

        if (self.location.hash.split(self.constants.defaults.hash).length !== 2) {
          self.navigate(
            self.$utils.stateByName(
              self.settings.default
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
    const self = this

    return new Promise((resolve, reject) => {
      if (!self.running) {
        self.$logger.error('(stop) Router was not running')
        reject()
      }

      self.running = false
      delete window.onhashchange
      self._dispatch('stop').then(resolve).catch(resolve)
    })
  }

  /**
   * Used to refresh the current route.
   */
  reload () {
    const self = this

    return new Promise((resolve, reject) => {
      if (!self.running) {
        self.$logger.error('(reload) Router has not yet been started')
        return reject()
      }

      self.push().then(() => {
        self._dispatch('reload').then(resolve).catch(resolve)
      })
    })
  }

  /**
   * Used to register router specific events.
   * @param {string} event - Name of event to register.
   * @param {function} handler - Function to execute on listener.
   * @returns {Promise}
   */
  on (event, handler) {
    const self = this

    return new Promise((resolve, reject) => {
      if (!event || self.constants.events.supported.indexOf(event) < -1) {
        self.$logger.error(`(on) "${event}" is not a supported event`)
        reject()
      }
      else {
        self.events[event] = handler
        resolve()
      }
    })
  }

  /**
   * Used to dispatch router specific events.
   * @param {string} event - Event to dispatch.
   * @param {object} params - Parameters to pass to event handler.
   * @returns {Promise}
   */
  _dispatch (event, params) {
    const self = this

    return new Promise((resolve) => {
      if (!event || self.constants.events.supported.indexOf(event) < -1) {
        self.$logger.error(`(dispatch) "${event}" is not a supported event`)
        reject()
      }
      if (typeof self.events[event] == 'function')
        resolve(self.events[event](params))
      else
        reject()
    })
  }

}
