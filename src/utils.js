export const Utils = {

  /**
   * Used to search for states by their name.
   * @param (object) self - Mixin instance.
   * @param (string) name - Name of state to search for.
   */
  stateByName(self, name) {
    return self.states.find((state) => name == state.name)
  },

  /**
   * Used for extracting route patterns.
   * @param (object) self - Mixin instance.
   * @param (string) route - Route from state.
   */
  splitRoute(self, route) {
    if (!route.match(self.$constants.regex.routeFormat)) {
      throw Error(`Route "${route}" did not match expected route format`)
    }
    let pattern = route.split('/').slice(1)
    let variables = pattern.filter((item) => {
      return item.match(self.$constants.regex.routeVariable)
    }).map((item) => {
      return {
        name: item.split('').slice(1).join(''),
        position: pattern.indexOf(item)
      }
    })
    variables.forEach((item) => {
      if (variables.filter((_item) => item).length > 1) {
        throw Error(`Found duplicate route variable pattern\n\t "${route}"`)
      }
    })
    return {
      route,
      pattern,
      variables
    }
  },

  /**
   * Used to search for a state by your current route.
   * @param (object) self - Mixin instance.
   */
  stateByRoute(self) {
    let stubs = self.location.split('#!')
    if (stubs.length > 1) {
      stubs = stubs[1].split('/').slice(1)
    }
    else {
      stubs = ["/"]
    }
    let state = self.states.find((state) => {
      let route = state.route
      if (stubs.length == route.pattern.length) {
        for (let stub in stubs) {
          if (stubs[stub] !== route.pattern[stub] && route.pattern[stub] !== '*') {
            if (!route.variables.find((variable) => variable.position == stub)) {
              return false
            }
          }
        }
        return true
      }
    })

    if (state) {
      return state
    }

    if (self.debugging) {
      console.warn('Route was not matched, defaulting to fallback state')
    }

    return self.$utils.stateByName(self.fallbackState)
  },

  /**
   * Used to extract route variables.
   * @param (object) self - Mixin instance.
   * @param (object) state - State object for variable matching.
   */
  extractRouteVars(self, state) {
    let stubs = self.location.split('#!')
    if (stubs.length > 1) {
      stubs = stubs[1].split('/').slice(1)
    }
    let variables = state.route.variables
    variables.forEach((variable) => {
      variable.value = stubs[variable.position]
    })
    return variables
  }

}
