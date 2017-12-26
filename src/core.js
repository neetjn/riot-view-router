import { version } from '../package.json'
import { Constants } from './constants'
import { Logger } from './logger'
import { Tools } from './tools'
import { Utils } from './utils'

export default class {

  /**
   * Represents the riot-view-router mixin.
   * @constructor
   * @param {riot} instance - Riot instance to target.
   * @param {object} settings - Router options.
   * @param {array} states - States for router to read from.
   * @returns {Router}
   */
  constructor (instance, settings) {
    var self = this

    self.constants = Constants
    self.version = version
    self.settings = {}
    self.states = []

    self.$riot = instance
    self.$riot.observable(self)
    self.$riot.mixin({ router: self })

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

    const acceptedSettings = self.constants.options.settings.required.concat(
      self.constants.options.settings.optional)
    for (const setting in settings) {
      if (acceptedSettings.indexOf(setting) === -1)
        throw Error(`Unknown setting "${setting}" is not supported`)
    } // # check for unaccepted settings
    self.constants.options.settings.required.forEach(setting => {
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
    self.settings.fragments = self.settings.fragments || true
    self.settings.marker = self.settings.marker || self.constants.defaults.marker

    if (self.settings.href)
      if (self.location.href.indexOf(self.settings.href) == -1)
        throw Error('Defined href not found within location context')

    self.settings.href = self.settings.href || self.location.href.split(self.constants.defaults.hash)[0]
    if (!self.settings.href.endsWith('/'))
      self.settings.href = `${self.settings.href}/`

    if (!self.settings.fallback) {
      self.$logger.warn(`Fallback state not specified, defaulting to "${self.settings.default}"`)
      self.settings.fallback = self.settings.default
    }
  }

/**
 * Used to add new states.
 * @param {object} state - State to consume.
 * @returns {Promise}
 */
  add (state) {
    const self = this

    return new Promise((resolve, reject) => {
      state = Object.assign({}, state)
      self.constants.options.states.required.forEach((prop) => {
        if (!state[prop]) {
          self.$logger.error(`Required state option "${prop}" not specified`)
          reject()
        }
      }) // # validate state properties
      for (const property in state) {
        const validator = self.constants.regex.state[property]
        if (validator && !state[property].match(validator)) {
          self.$logger.error(`State "${state.name}" property "${property}" has an invalid value of "${state[property]}"`)
          reject()
        }
      } // # validate state property values
      state.route = self.$utils.splitRoute(state.route)
      self.states.push(state)
      resolve()
    })
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
          self.trigger('navigation', { route })
          if (!skipPush)
            self.push().then(() => resolve())
          else
            resolve()
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
      self.trigger('push')
      resolve()
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

        if (!self.$utils.stateByName(self.settings.fallback))
          throw Error(`Fallback state "${self.settings.fallback}" not found in specified states`)

        function _start() {
          var view_check = window.setInterval(() => {
            const context = document.querySelector(self.settings.marker) || document.querySelector(`[${self.settings.marker}]`)
            if (context) {
              self.running = true
              self.context = context
              self.push() // # route to initial state
              window.onhashchange = () => self.push()
              window.clearInterval(view_check)
              self.trigger('start')
              resolve()
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
      self.trigger('stop')
      resolve()
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
        self.trigger('reload')
        resolve()
      })
    })
  }

}
