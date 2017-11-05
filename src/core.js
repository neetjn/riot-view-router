import { version } from '../package.json'
import { Constants } from './constants'
import { Utils } from './utils'
import { Tools } from './tools'

export class Router {

  /**
   * Represents the riot-view-router mixin.
   * @constructor
   * @param {object} options - Router options.
   * @param {array} states - States for router to read from.
   * @returns {Router}
   */
  constructor(options, states) {
    var self = this

    self.version = version
    self.$constants = Constants
    self.$tools = new Tools(self)
    self.$utils = new Utils(self)

    Object.defineProperty(self, 'location', {
      get: function() {
        return window.location.href
      },
      set: function(location) {
        window.location.href = location
      }
    })

    self.running = false

    let requiredOptions = ['defaultState']
    let optionalDefaultOptions = ['debugging', 'href', 'fallbackState', 'onBeforeStateChange', 'onStateChange']
    let acceptedOptions = requiredOptions.concat(optionalDefaultOptions)
    for (let option in options) {
      if (acceptedOptions.indexOf(option) == -1)
        throw Error(`Unknown option "${option}" is not supported`)
    } // # validate router optionsu

    self = Object.assign(self, options)
    self.debugging = self.debugging || false
    self.href = self.href || self.location
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
      if (self.debugging)
        console.warn(`Fallback state not specified, defaulting to "${self.defaultState}"`)

      self.fallbackState = self.defaultState
    }

    if (self.marker) {
      if (!self.marker.match(self.$constants.regex.marker)) {
        if (debugging) {
          console.warn(`Marker "${self.marker}" contains unsupported characters`)
          console.warn(`Defaulting to "${self.$constants.defaults.marker}"`)
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
   * @returns {Promise}
   */
  navigate (route) {
    var self = this

    return new Promise((resolve, reject) => {
      self.location = self.href + self.$constants.defaults.hash + route
      var route_check = setInterval(() => {
        if (self.location == self.href + self.$constants.defaults.hash + route) {
          window.clearInterval(route_check)
          resolve()
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
      let state = self.$utils.stateByName(name)
      let location = self.location.split(self.$constants.defaults.hash)[1]

      if (location !== state.route.route) {
        if (!state.route.variables.length) {
          self.navigate(state.route.route)
          resolve() // # assume function will be retriggered
        }
        else {
          if (self.debugging) {
            console.warn(`State "${name}" does not match current route.`)
            console.warn('Could not re-route due to route variables.')
          }
        }
      }

      if (self.onBeforeStateChange)
        self.onBeforeStateChange(state)

      if (self.$state && self.$state.onLeave)
        self.$state.onLeave(state) // # call onLeave, pass old state

      self.$tools.transition(state, opts)

      if (self.onStateChange)
        self.onStateChange(state)

      if (state.onEnter)
        state.onEnter(state) // # call onEnter, pass new state

      self.$state = state
      resolve()
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
              self.push(self.$utils.stateByRoute().name) // # route to initial state
              window.onhashchange = function() {
                let state = self.$utils.stateByRoute()
                let opts = self.$utils.extractRouteVars(state)
                self.push(state.name, opts) // # update state
              } // # create listener for route changes
              window.clearInterval(view_check)
              resolve()
            }
          }, self.$constants.intervals.start) // # search for view context
          setTimeout(reject, self.$constants.defaults.timeout)
        }

        if (self.location.split(self.$constants.hash).length !== 2) {
          self.navigate(self.$utils.stateByName(self.defaultState).route.route).then(_start)
        }
        else
          _start()
      }
      else {
        if (self.debugging)
          console.warn('Router was already running')
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
        resolve()
      }
      else {
        if (self.debugging)
          console.warn('Router was not running')
        reject()
      }
    })
  }

}
