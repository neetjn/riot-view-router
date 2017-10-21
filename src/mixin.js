import { Constants } from './constants'
import { Core } from './core'
import { Utils } from './utils'

/**
 * Represents the riot-view-router mixin.
 * @constructor
 * @param (object) options - Router options.
 * @param (array) states - States for router to read from.
 */
export class Router {

  constructor(options, states) {

    let self = this.$router = {  }

    self.$constants = Constants
    self = Object.assign(self, Core)
    self.$utils = Utils

    Object.defineProperty(self, 'location', {
      get: function() {
        return window.location.hash
      },
      set: function(location) {
        window.location.hash = location
      }
    })

    let requiredOptions = ['defaultState']
    let optionalDefaultOptions = ['debugging', 'fallbackState', 'onBeforeStateChange', 'onStateChange']
    let acceptedOptions = requiredOptions.concat(optionalDefaultOptions)

    for (let option in options) {
      if (acceptedOptions.indexOf(option) == -1) {
        throw Error(`Unknown option "${option} is not supported`)
      }
    } // # validate router optionsu

    self = Object.assign(self, options)
    self.debugging = self.debugging || false

    let stateProperties = ['name', 'route', 'tag']
    states = !Array.isArray(states) ? [states] : states
    states.forEach((state) => {
      if (!state.name.match(self.$constants.regex.stateName)) {
        throw Error(`Invalid state name "${state.name}",\
        state names must be a valid alphanumeric string.`)
      }
    })
    stateProperties.forEach((prop) => {
      states.forEach((state) => {
        if (!state[prop]) {
          throw Error(`Required state option "${prop}" not specified`)
        }
      })
    }) // # validate state options
    states.forEach(function(item) {
      item.route = self.$utils.splitRoute(self, item.route)
    }) // # get route pattern
    self.states = states

    if (!self.defaultState) {
      throw Error('Default state must be specified')
    } else {
      if (self.defaultState.indexOf(':') > -1) {
        throw Error(`Default state route cannot take variable parameters`)
      }
      if (!self.$utils.stateByName(self, self.defaultState)) {
        throw Error(`State "${self.defaultState}" not found in specified states`)
      }
    }

    if (self.fallbackState) {
      if (!self.$utils.stateByName(self, self.fallbackState)) {
        throw Error(`Fallback state "${self.fallbackState}" not found in specified states`)
      }
    }
    else {
      if (self.debugging) {
        console.warn(`Fallback state not specified, dfaulting to "${self.defaultState}"`)
      }
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
    self.start()
  }

}
