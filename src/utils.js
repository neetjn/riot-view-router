export class Utils {

  /**
   * Utilities for the riot-view-router mixin.
   * @param {Router} router - Router for utilities to reference
   */
  constructor(router) {
    this.$router = router
  }

  /**
   * Used to search for states by their name.
   * @param {string} name - Name of state to search for.
   */
  stateByName (name) {
    const self = this.$router
    return self.states.find((state) => name == state.name)
  }

  /**
   * Used for extracting route patterns.
   * @param {string} route - Route from state.
   */
  splitRoute(route) {
    const self = this.$router

    if (!route.match(self.$constants.regex.routeFormat))
      throw Error(`Route "${route}" did not match expected route format`)

    const pattern = route.split('/').slice(1)
    const variables = pattern.filter((item) => {
      return item.match(self.$constants.regex.routeVariable)
    }).map((item) => {
      return {
        name: item.split('').slice(1).join(''),
        position: pattern.indexOf(item)
      }
    })
    variables.forEach((item) => {
      if (variables.filter((_item) => _item == item).length > 1)
        throw Error(`Found duplicate route variable pattern\n\t "${route}"`)
    })
    return {
      route,
      pattern,
      variables
    }
  }

  /**
   * Used to search for a state by your current route.
   */
  stateByRoute() {
    const self = this.$router

    let stubs = self.location.hash.split(self.$constants.defaults.hash)
    if (stubs.length == 2)
      stubs = stubs.join('').split('?')[0].split('/').slice(1)
    else
      stubs = ['/']

    const state = self.states.find((state) => {
      const route = state.route
      if (stubs.length == route.pattern.length) {
        for (const stub in stubs) {
          if (stubs[stub] !== route.pattern[stub] && route.pattern[stub] !== '*') {
            if (!route.variables.find((variable) => variable.position == stub)) {
              return false
            }
          }
        }
        return true
      }
    })

    if (!state) {
      self.$logger.warn('Route was not matched, defaulting to fallback state')
      return this.stateByName(self.fallbackState)
    }

    return state
  }

  /**
   * Used to extract route variables.
   * @param {object} state - State object for variable matching.
   */
  extractRouteVars(state) {
    const self = this.$router

    const variables = state.route.variables.map(v => Object.assign({}, v))
    // # make a deep copy of state variables as to not pollute state
    let stubs = self.location.hash.split(self.$constants.defaults.hash)
    if (stubs.length == 2) {
      stubs = stubs.join('').split('?')[0].split('/').slice(1)
      // # remove query string from url
      variables.forEach((variable) => {
        variable.value = stubs[variable.position]
      })
      const query = self.location.hash.split('?')
      if (query.length == 2) {
        variables._query = {}
        query[1].split('&').forEach((fragment) => {
          fragment = fragment.split('=')
          variables._query[fragment[0]] = fragment[1]
        })
      }
      return variables
    }

    return []
  }

}
